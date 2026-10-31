import { V, B } from '../data/enums.js';
import { get_asset, get_build_name } from '../utils/asset_path.js';
import { is_raw_item } from '../utils/validation.js';
import { get_item_display, populate_amount_cell, populate_belt_cell, populate_build_cell, populate_frac_cell } from './table_cells.js';
import { RAW_ITEMS } from '../data/name_lists.js';
import { add_connectors, icon_of } from './connectors.js';
import { build_sub_tree } from '../engine/tree.js';
import { add_tree_info } from '../engine/convert.js';
import { rounded_box } from './dom.js';
import { was_drag } from './click_drag.js';
import { keep_in_place } from './keep_scroll.js';
function create_row(is_rounded, td_class, item_name, display_name, item_amount, build_img, belt_img, build_amounts, belt_amount) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
        <td class="${td_class}"><img src="${get_asset(item_name)}" class="tree-img"></td>
        <td class="tree-indent2">${display_name}</td>
        <td class="tree-indent2 number-cell"></td>
        <td class="tree-indent2"><img src="${get_asset(build_img)}" class="tree-img"></td>
        <td class="tree-indent2 build-cell"></td>
        <td class="tree-indent2"><img src="${get_asset(belt_img)}" class="tree-img"></td>
        <td class="tree-indent2 belt-cell"></td>
    `;
    populate_amount_cell(is_rounded, tr, item_amount);
    if (build_amounts && belt_amount) {
        populate_build_cell(is_rounded, tr, build_amounts);
        populate_belt_cell(is_rounded, tr, belt_amount);
    }
    return tr;
}
function create_item_row(settings, node, td_class) {
    const { is_rounded, tiers } = settings;
    const { item_amount, item_name, variant, build_amounts, belt_amount } = node;
    const { name, is_split } = get_item_display(item_name, variant);
    const build_img = get_build_name(tiers, item_name, is_split ? V.STD : variant);
    return create_row(is_rounded, td_class, item_name, name, item_amount, build_img, B.Belt, build_amounts, belt_amount);
}
function create_sum_row(settings, tree, td_class) {
    const { is_rounded } = settings;
    const name = "Sum";
    let item_amount = 0;
    let build_amounts = [0];
    let belt_amount = 0;
    for (const node of tree) {
        if (!is_raw_item(node.item_name))
            continue;
        item_amount += node.item_amount;
        build_amounts[0] += node.build_amounts?.[0] ?? 0;
        belt_amount += node.belt_amount ?? 0;
    }
    return create_row(is_rounded, td_class, name, name, item_amount, name, name, build_amounts, belt_amount);
}
function createSpacerRow(colSpan) {
    const tr = document.createElement("tr");
    tr.className = "spacer";
    const td = document.createElement("td");
    td.colSpan = colSpan;
    td.innerHTML = "&nbsp;";
    tr.appendChild(td);
    return tr;
}
export function render_node(settings, node, render_child, kind) {
    const summary = document.createElement("summary");
    summary.className = "tree-summary";
    const summary_table = document.createElement("table");
    summary_table.className = "tree-table";
    const summary_tbody = document.createElement("tbody");
    summary_table.appendChild(summary_tbody);
    const row = create_item_row(settings, node, "tree-indent2");
    summary_tbody.appendChild(row);
    summary.appendChild(summary_table);
    const body = document.createElement("table");
    body.className = "tree-table tree-node";
    const tbody = document.createElement("tbody");
    const { children } = node;
    const child_els = [];
    if (children.length > 0) {
        body.appendChild(tbody);
        for (const child of children) {
            const el = render_child(settings, child);
            child_els.push(el);
            // A child can bring its own <tbody> (materials view: row + its tree)
            if (el instanceof HTMLTableSectionElement) {
                body.appendChild(el);
            }
            else {
                tbody.appendChild(el);
            }
        }
    }
    const details = document.createElement("details");
    details.className = "tree-details";
    details.open = true;
    details.append(summary, body);
    add_connectors(details, kind, icon_of(row), child_els.map(icon_of));
    return details;
}
export function render_main(settings, tree, render_child, kind) {
    const body = document.createElement("div");
    body.className = "tree";
    body.dataset.kind = kind;
    for (const node of tree) {
        body.appendChild(render_node(settings, node, render_child, kind));
    }
    return body;
}
export function render_list(settings, tree) {
    const body = document.createElement("table");
    body.className = "tree-table";
    for (const node of tree) {
        body.appendChild(render_mat_child(settings, node, "tree-indent2"));
    }
    const first_raw = tree.findIndex(({ item_name }) => is_raw_item(item_name));
    const last_raw = tree.findLastIndex(({ item_name }) => is_raw_item(item_name));
    if (first_raw !== -1) {
        body.insertBefore(createSpacerRow(7), body.rows[first_raw] ?? null);
    }
    if (last_raw !== -1) {
        const sum_row = create_sum_row(settings, tree, "tree-indent2");
        body.insertBefore(sum_row, body.rows[last_raw + 2] ?? null);
        body.insertBefore(createSpacerRow(7), body.rows[last_raw + 3] ?? null);
    }
    return body;
}
export function render_mat_child(settings, node, td_class = "tree-indent1") {
    return create_item_row(settings, node, td_class);
}
/** Materials view, inside an ingredient's recipe tree: like the tree view, but with material arrows */
function render_sub_tree_child(settings, node) {
    return render_node(settings, node, render_sub_tree_child, "mat");
}
/** Make a row open / close something on click or Enter / Space
 *  (number taps and drags excluded, like the <summary> rows). */
function make_toggle_row(row, toggle) {
    row.tabIndex = 0;
    row.setAttribute("role", "button");
    row.addEventListener("click", (event) => {
        // Tapping a number switches it between full / rounded; drags scroll
        const target = event.target;
        if (was_drag() || target?.closest(".number"))
            return;
        keep_in_place(row, toggle);
    });
    row.addEventListener("keydown", (event) => {
        if (event.key !== "Enter" && event.key !== " ")
            return;
        event.preventDefault();
        keep_in_place(row, toggle);
    });
}
/**
 * Materials / combi view: an ingredient row that opens its full recipe
 * tree. The tree is only built the first time it's opened.
 * Raw resources and split items stop at their row (nothing to open).
 * Returns a <tbody> so the row stays in the same table as the other
 * ingredients and the columns keep lining up.
 *
 * The tree opens below the row, like the tree view.
 */
export function render_mat_tree_child(settings, node) {
    const section = document.createElement("tbody");
    const row = render_mat_child(settings, node);
    row.classList.add("mat-row");
    section.appendChild(row);
    const { item_name, variant, item_amount } = node;
    if (is_raw_item(item_name) || variant === V.SPLIT) {
        return section;
    }
    row.classList.add("mat-expand");
    row.setAttribute("aria-expanded", "false");
    row.title = "Show how to make this";
    const sub_row = document.createElement("tr");
    sub_row.className = "sub-tree-row hidden";
    const cell = document.createElement("td");
    cell.colSpan = 7;
    cell.className = "sub-tree-cell";
    sub_row.appendChild(cell);
    section.appendChild(sub_row);
    let built = false;
    const build = () => {
        // The numbers follow the "rounded" box as it is now, not as it was
        // when the view was made (the view itself is cached)
        const now = { ...settings, is_rounded: rounded_box.checked };
        const sub = build_sub_tree(item_amount, item_name, settings.alt_ratios, settings.gen);
        const [info] = add_tree_info(now, [sub], false, false);
        if (!info)
            return;
        const table = document.createElement("table");
        table.className = "tree-table tree-node";
        const tbody = document.createElement("tbody");
        const child_els = info.children.map(child => render_sub_tree_child(now, child));
        tbody.append(...child_els);
        table.appendChild(tbody);
        const wrap = document.createElement("div");
        wrap.className = "sub-tree";
        wrap.appendChild(table);
        add_connectors(sub_row, "mat", icon_of(row), child_els.map(icon_of));
        cell.appendChild(wrap);
        built = true;
    };
    make_toggle_row(row, () => {
        if (!built)
            build();
        const open = sub_row.classList.toggle("hidden") === false;
        row.classList.toggle("open", open);
        row.setAttribute("aria-expanded", String(open));
    });
    return section;
}
export function render_dep_child(settings, node) {
    const { is_rounded } = settings;
    const { item_amount, item_name, variant, belt_amount, fraction } = node;
    const { name } = get_item_display(item_name, variant);
    const tr = document.createElement("tr");
    tr.innerHTML = `
        <td class="tree-indent1"><img src="${get_asset(item_name)}" class="tree-img"></td>
        <td class="tree-indent2">${name}</td>
        <td class="tree-indent2 number-cell"></td>
        <td class="tree-indent2"><img src="${get_asset(B.Belt)}" class="tree-img"></td>
        <td class="tree-indent2 belt-cell"></td>
        <td class="tree-indent2"><img src="${get_asset("Fraction")}" class="tree-img"></td>
        <td class="tree-indent2 frac-cell"></td>
    `;
    populate_amount_cell(is_rounded, tr, item_amount);
    if (belt_amount && fraction) {
        populate_belt_cell(is_rounded, tr, belt_amount);
        populate_frac_cell(is_rounded, tr, fraction);
    }
    return tr;
}
export function render_tree_child(settings, node) {
    return render_node(settings, node, render_tree_child, "tree");
}
function create_item_image(item) {
    const img = document.createElement("img");
    img.className = "item-img";
    img.src = get_asset(item);
    img.loading = "lazy";
    img.onerror = () => { img.src = get_asset("Unknown"); };
    return img;
}
function td(text = "", className = "") {
    const cell = document.createElement("td");
    if (className) {
        cell.className = className;
    }
    if (text) {
        cell.textContent = text;
    }
    return cell;
}
export function render_boosts(settings) {
    const title = document.createElement("p");
    title.textContent = "Resource Boosts:";
    let body = document.createElement("div");
    body.appendChild(title);
    const table = document.createElement("table");
    table.className = "item-boosts";
    // Small header for the two columns
    const thead = document.createElement("thead");
    const headRow = document.createElement("tr");
    headRow.innerHTML = `<th></th><th class="num">Normal</th><th class="num boost-coal">Coal</th><th class="num boost-nuc">Nuclear</th>`;
    thead.appendChild(headRow);
    table.appendChild(thead);
    const tbody = document.createElement("tbody");
    let empty = true;
    for (const key of RAW_ITEMS) {
        const extractors = settings.extractors.get(key) ?? 0;
        const coal_frac = settings.coal_fracs.get(key) ?? 0;
        const nuc_frac = settings.nuclear_fracs.get(key) ?? 0;
        if (empty && (coal_frac > 0 || nuc_frac > 0)) {
            empty = false;
        }
        const norm_frac = 1 - coal_frac - nuc_frac;
        const coal_ex = coal_frac * extractors;
        const nuc_ex = nuc_frac * extractors;
        const norm_ex = extractors - coal_ex - nuc_ex;
        const name = key.replaceAll("_", " ");
        // Row 1: icon + name (spans all columns)
        const r1 = document.createElement("tr");
        const tdTitle = td();
        tdTitle.colSpan = 4;
        const wrap = document.createElement("div");
        wrap.className = "res-head";
        const span = document.createElement("span");
        span.textContent = name;
        // Small bar: normal share faint, coal yellow, nuclear green
        const bar = document.createElement("div");
        bar.className = "boost-bar";
        for (const [frac, cls] of [[coal_frac, "boost-seg-coal"], [nuc_frac, "boost-seg-nuc"]]) {
            if (frac <= 0)
                continue;
            const seg = document.createElement("div");
            seg.className = cls;
            seg.style.width = `${Math.min(1, frac) * 100}%`;
            bar.appendChild(seg);
        }
        wrap.append(create_item_image(key), span, bar);
        tdTitle.appendChild(wrap);
        r1.appendChild(tdTitle);
        // Row 2: percentages
        const r2 = document.createElement("tr");
        // Row labels as icons (fraction pie, extractor), like the other views
        const tdLabelPct = td("", "sub-label");
        tdLabelPct.appendChild(create_item_image("Fraction"));
        const tdNormPct = td("", "num frac-cell1");
        const tdCoalPct = td("", "num frac-cell2 boost-coal");
        const tdNucPct = td("", "num frac-cell3 boost-nuc");
        r2.append(tdLabelPct, tdNormPct, tdCoalPct, tdNucPct);
        populate_frac_cell(settings.is_rounded, r2, norm_frac, "1");
        populate_frac_cell(settings.is_rounded, r2, coal_frac, "2");
        populate_frac_cell(settings.is_rounded, r2, nuc_frac, "3");
        // Row 3: extractors
        const r3 = document.createElement("tr");
        const tdLabelEx = td("", "sub-label");
        tdLabelEx.appendChild(create_item_image(get_build_name(settings.tiers, key, settings.gen)));
        const tdNormEx = td("", "num number-cell1");
        const tdCoalEx = td("", "num number-cell2 boost-coal");
        const tdNucEx = td("", "num number-cell3 boost-nuc");
        r3.append(tdLabelEx, tdNormEx, tdCoalEx, tdNucEx);
        populate_amount_cell(settings.is_rounded, r3, norm_ex, "1", false);
        populate_amount_cell(settings.is_rounded, r3, coal_ex, "2", false);
        populate_amount_cell(settings.is_rounded, r3, nuc_ex, "3", false);
        // Spacer row between resources
        const spacer = document.createElement("tr");
        spacer.className = "res-gap";
        const spacerTd = document.createElement("td");
        spacerTd.colSpan = 4;
        spacer.appendChild(spacerTd);
        tbody.append(r1, r2, r3, spacer);
    }
    table.appendChild(tbody);
    body.appendChild(table);
    if (empty) {
        body = document.createElement("div");
    }
    return body;
}
export function render_ratios(settings) {
    const title = document.createElement("p");
    title.textContent = 'Used Alt recipes:';
    let body = document.createElement("div");
    body.appendChild(title);
    const table = document.createElement("table");
    table.className = "tree-table ratio-table";
    let empty = true;
    for (const [key, ratio] of settings.alt_ratios) {
        if (empty && ratio > 0) {
            empty = false;
        }
        const name = key.replaceAll("_", " ");
        const tr = document.createElement("tr");
        const tdImg = td("", "tree-indent2");
        tdImg.appendChild(create_item_image(key));
        const tdName = td(name, "tree-indent2");
        // Small bar: standard share white, alt share purple
        const tdBar = td("", "tree-indent2");
        const bar = document.createElement("div");
        bar.className = "ratio-bar";
        const alt = document.createElement("div");
        alt.className = "ratio-bar-alt";
        alt.style.width = `${Math.max(0, Math.min(1, ratio)) * 100}%`;
        bar.appendChild(alt);
        tdBar.appendChild(bar);
        const tdValue = td("", "tree-indent2 frac-cell");
        tr.append(tdImg, tdName, tdBar, tdValue);
        table.appendChild(tr);
        populate_frac_cell(settings.is_rounded, tr, ratio);
    }
    body.appendChild(table);
    if (empty) {
        body = document.createElement("div");
    }
    return body;
}
function create_child_table(rows, class_name) {
    const table = document.createElement("table");
    table.className = `tree-table tree-node ${class_name}`;
    const tbody = document.createElement("tbody");
    tbody.append(...rows);
    table.appendChild(tbody);
    return table;
}
export function render_combi_node(settings, entry) {
    const { node, materials, dependents } = entry;
    const wrap = document.createElement("div");
    wrap.className = "combi-node";
    // Dependents going out (above the item): read up toward the end product
    const dep_rows = dependents.map(child => render_dep_child(settings, child));
    if (dep_rows.length > 0) {
        wrap.appendChild(create_child_table(dep_rows, "combi-dep"));
    }
    // The item itself, as a <details> so clicking it collapses
    // the same way as in the other views (number taps & drags excluded)
    const summary = document.createElement("summary");
    summary.className = "tree-summary";
    const summary_table = document.createElement("table");
    summary_table.className = "tree-table";
    const summary_tbody = document.createElement("tbody");
    const item_row = create_item_row(settings, node, "tree-indent2");
    summary_tbody.appendChild(item_row);
    summary_table.appendChild(summary_tbody);
    summary.appendChild(summary_table);
    const details = document.createElement("details");
    details.className = "tree-details";
    details.open = true;
    details.appendChild(summary);
    // Materials going in (below the item), each can open its recipe tree
    // below it, like in the materials view. Every row comes in its own
    // <tbody>, so they share one table (columns line up)
    const mat_rows = materials.map(child => render_mat_tree_child(settings, child));
    if (mat_rows.length > 0) {
        const mat_table = document.createElement("table");
        mat_table.className = "tree-table tree-node combi-mat";
        mat_table.append(...mat_rows);
        details.appendChild(mat_table);
    }
    // Materials flow into the item, the item flows into its dependents
    const item_icon = icon_of(item_row);
    add_connectors(wrap, "dep-above", item_icon, dep_rows.map(icon_of));
    add_connectors(details, "mat", item_icon, mat_rows.map(icon_of));
    // The dependents collapse together with the materials: done in CSS
    // (.combi-node:has(...)), so it happens at once and not a moment later
    // in a "toggle" event, which would make the page jump
    wrap.appendChild(details);
    return wrap;
}
export function render_combi(settings, entries) {
    const body = document.createElement("div");
    body.className = "tree";
    for (const entry of entries) {
        body.appendChild(render_combi_node(settings, entry));
    }
    return body;
}
//# sourceMappingURL=render.js.map