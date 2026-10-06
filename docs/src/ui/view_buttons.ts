import {
    build_list, 
    build_dependents, 
    build_materials
} from '../engine/build.js'


import { 
    sort_list,
    sort_mat_dep,
    combi_var_priority,
    convert_mat_dep,
    convert_list,
    add_tree_info
} from '../engine/convert.js'

import {
    render_dep_child,
    render_list,
    render_main,
    render_mat_child,
    render_tree_child,
    render_boosts,
    render_ratios,
    render_combi,
    CombiEntry
} from './render.js'

import { make_item_key } from '../utils/item_keys.js';

import { Settings, RecipeNode } from '../data/types.js';

import { 
    output_el,
    tree_btn,
    list_btn,
    mat_btn,
    dep_btn,
    combi_btn,
    ratios_btn,
    boosts_btn
} from './dom.js';

import { get_cached_view, get_cached_settings } from './cache.js';
import { draw_connectors, init_connectors } from './connectors.js';



async function run_view(
    key: string,
    render: (settings: Settings, tree?: RecipeNode[]) => HTMLElement,
    needs_tree = true
) {
    output_el.innerHTML = "Loading...";
    try {
        const body = await get_cached_view(key, render, needs_tree);
        output_el.replaceChildren(body);
        const warning = (await get_cached_settings()).warning;
        if (warning) {                 // above the results, where it is seen (the console is not)
            const note = document.createElement("p");
            note.className = "note solver-warning";
            note.style.marginBottom = "8px";
            note.textContent = warning;
            output_el.prepend(note);
        }
        const isEmpty = [...output_el.children].every(el =>
            el.children.length === 0 && !el.textContent.trim()
        );
        if (isEmpty) {
            output_el.innerHTML = "None";
        }
        draw_connectors(output_el);
    } catch (err) {
        console.log(err);
        const message = err instanceof Error ? err.message : String(err);
        output_el.innerHTML = `Error:<br>${message}`;
    }
}

async function run_tree() {
    await run_view("tree", (settings, tree) => {
        const info_tree = add_tree_info(settings, tree!, false);
        return render_main(settings, info_tree, render_tree_child, "tree");
    });
}

async function run_list() {
    await run_view("list", (settings, tree) => {
        const split_map = build_list(tree!);
        const conv_tree = convert_list(split_map);
        const info_tree = sort_list(
            add_tree_info(settings, conv_tree, true), settings.selected_item
        );
        return render_list(settings, info_tree);
    });
}


async function run_materials() {
    await run_view("materials", (settings, tree) => {
        const map = build_materials(tree!, settings.alt_ratios);
        const conv_tree = convert_mat_dep(map);
        const info_tree = sort_mat_dep(
            add_tree_info(settings, conv_tree, true), settings.selected_item
        );
        return render_main(settings, info_tree, render_mat_child, "mat");
    });
}


async function run_dependents() {
    await run_view("dependents", (settings, tree) => {
        const map = build_dependents(tree!, settings.alt_ratios);
        const conv_tree = convert_mat_dep(map);
        const info_tree = sort_mat_dep(
            add_tree_info(settings, conv_tree, true), settings.selected_item
        );
        return render_main(settings, info_tree, render_dep_child, "dep");
    });
}

async function run_combi() {
    await run_view("combi", (settings, tree) => {
        const mat_tree = add_tree_info(
            settings, convert_mat_dep(build_materials(tree!, settings.alt_ratios)), true
        );
        const dep_tree = add_tree_info(
            settings, convert_mat_dep(build_dependents(tree!, settings.alt_ratios)), true
        );

        const key_of = (n: RecipeNode) => make_item_key(n.item_name, n.variant);
        const mat_map = new Map(mat_tree.map(n => [key_of(n), n]));
        const dep_map = new Map(dep_tree.map(n => [key_of(n), n]));

        // One node per item: prefer the materials node (amount produced),
        // fall back to the dependents node (e.g. split items)
        const nodes: RecipeNode[] = [];
        for (const n of mat_tree) nodes.push(n);
        for (const n of dep_tree) {
            if (!mat_map.has(key_of(n))) nodes.push(n);
        }
        sort_mat_dep(nodes, settings.selected_item, combi_var_priority);

        const entries: CombiEntry[] = nodes.map(node => {
            const key = key_of(node);
            const materials = mat_map.get(key)?.children ?? [];
            const dependents = dep_map.get(key)?.children ?? [];
            sort_mat_dep(materials);
            sort_mat_dep(dependents);
            return { node, materials, dependents };
        });
        return render_combi(settings, entries);
    });
}

async function run_ratios() {
    await run_view("ratios", (settings) => {
        return render_ratios(settings);
    }, false);
}

async function run_boosts() {
    await run_view("boosts", (settings) => {
        return render_boosts(settings);
    }, false);
}


export function init_view_btns() {
    init_connectors(output_el);
    tree_btn.addEventListener("click", run_tree);
    list_btn.addEventListener("click", run_list);
    mat_btn.addEventListener("click", run_materials);
    dep_btn.addEventListener("click", run_dependents);
    combi_btn.addEventListener("click", run_combi);
    ratios_btn.addEventListener("click", run_ratios);
    boosts_btn.addEventListener("click", run_boosts);
}
