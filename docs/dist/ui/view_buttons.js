import { build_list, build_dependents, build_materials } from '../engine/build.js';
import { sort_list, sort_mat_dep, convert_mat_dep, convert_list, add_tree_info } from '../engine/convert.js';
import { render_dep_child, render_list, render_main, render_mat_child, render_tree_child, render_boosts, render_ratios } from './render.js';
import { output_el, tree_btn, list_btn, mat_btn, dep_btn, ratios_btn, boosts_btn } from './dom.js';
import { get_cached } from './cache.js';
async function run_view(render) {
    output_el.innerHTML = "Loading...";
    try {
        const { settings, tree } = await get_cached();
        const body = render(settings, tree);
        output_el.replaceChildren(body);
    }
    catch (err) {
        console.log(err);
        const message = err instanceof Error ? err.message : String(err);
        output_el.innerHTML = `Error:<br>${message}`;
    }
}
async function run_tree() {
    await run_view((settings, tree) => {
        const info_tree = add_tree_info(settings, tree, false);
        return render_main(settings, info_tree, render_tree_child);
    });
}
async function run_list() {
    await run_view((settings, tree) => {
        const split_map = build_list(tree);
        const conv_tree = convert_list(split_map);
        const info_tree = sort_list(add_tree_info(settings, conv_tree, true), settings.selected_item);
        return render_list(settings, info_tree);
    });
}
async function run_materials() {
    await run_view((settings, tree) => {
        const map = build_materials(tree, settings.alt_ratios);
        const conv_tree = convert_mat_dep(map);
        const info_tree = sort_mat_dep(add_tree_info(settings, conv_tree, true), settings.selected_item);
        return render_main(settings, info_tree, render_mat_child);
    });
}
async function run_dependents() {
    await run_view((settings, tree) => {
        const map = build_dependents(tree, settings.alt_ratios);
        const conv_tree = convert_mat_dep(map);
        const info_tree = sort_mat_dep(add_tree_info(settings, conv_tree, true), settings.selected_item);
        return render_main(settings, info_tree, render_dep_child);
    });
}
async function run_ratios() {
    await run_view((settings) => {
        return render_ratios(settings);
    });
}
async function run_boosts() {
    await run_view((settings) => {
        return render_boosts(settings);
    });
}
export function init_view_btns() {
    tree_btn.addEventListener("click", run_tree);
    list_btn.addEventListener("click", run_list);
    mat_btn.addEventListener("click", run_materials);
    dep_btn.addEventListener("click", run_dependents);
    ratios_btn.addEventListener("click", run_ratios);
    boosts_btn.addEventListener("click", run_boosts);
}
//# sourceMappingURL=view_buttons.js.map