import { RecipeNode, Settings } from '../data/types.js';
import { V, B } from '../data/enums.js';
import { get_asset, get_tier_asset } from '../utils/asset_path.js';
import { is_raw_item } from '../utils/validation.js'
import { 
    get_item_display, 
    populate_amount_cell, 
    populate_belt_cell, 
    populate_build_cell, 
    populate_frac_cell 
} from './table_cells.js';

import { RAW_ITEMS } from '../data/nameLists.js';


function create_item_row(
    settings: Settings,
    node: RecipeNode,
    td_class: string
): HTMLTableRowElement {
    const {is_rounded, tiers} = settings;
    const {item_amount, item_name, variant, build_amounts, belt_amount} = node;
    const {name, is_split} = get_item_display(item_name, variant);
    const build_img = get_tier_asset(tiers, item_name, 
        is_split? V.STD : variant
    );
    
    const tr = document.createElement("tr");
    tr.innerHTML = `
        <td class="${td_class}"><img src="${get_asset(item_name)}" class="tree-img"></td>
        <td class="tree-indent2">${name}</td>
        <td class="tree-indent2 number-cell"></td>
        <td class="tree-indent2"><img src="${build_img}" class="tree-img"></td>
        <td class="tree-indent2 build-cell"></td>
        <td class="tree-indent2"><img src="${get_asset(B.Belt)}" class="tree-img"></td>
        <td class="tree-indent2 belt-cell"></td>
    `;
    populate_amount_cell(is_rounded, tr, item_amount);
    if (build_amounts && belt_amount) {
        populate_build_cell(is_rounded, tr, build_amounts);
        populate_belt_cell(is_rounded, tr, belt_amount);
    }
    return tr;
}


function createSpacerRow(colSpan: number): HTMLTableRowElement {
    const tr = document.createElement("tr");
    tr.className = "spacer";

    const td = document.createElement("td");
    td.colSpan = colSpan;
    td.innerHTML = "&nbsp;";

    tr.appendChild(td);
    return tr;
}


export function render_node(
    settings: Settings,
    node: RecipeNode, 
    render_child: ChildRenderer
): HTMLDetailsElement {
    
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
    const {children} = node;

    if (children.length > 0) {
        body.appendChild(tbody);
        for (const child of children) {
            tbody.appendChild(render_child(settings, child));
        }
    }

    const details = document.createElement("details");
    details.className = "tree-details";
    details.open = true;
    details.append(summary, body);

    return details;
}


export function render_main(
    settings: Settings,
    tree: RecipeNode[], 
    container: HTMLElement, 
    render_child: ChildRenderer
) {
    container.innerHTML = "";
    for (const node of tree) {
        container.appendChild(render_node(settings, node, render_child));
    }
}


export function render_list(
    settings: Settings,
    tree: RecipeNode[], 
    container: HTMLElement
) {
    container.innerHTML = "";
    const body = document.createElement("table");
    body.className = "tree-table";
    for (const node of tree) {
        body.appendChild(render_mat_child(settings, node, "tree-indent2"));
    }

    const last_raw = tree.findLastIndex(({item_name}) =>
        is_raw_item(item_name)
    );
    body.insertBefore(createSpacerRow(7), body.rows[1] ?? null);
    if (last_raw) {
        body.insertBefore(createSpacerRow(7), body.rows[last_raw + 2] ?? null);
    }
    container.appendChild(body);
}


type ChildRenderer = (
    settings: Settings,
    node: RecipeNode
) => HTMLElement;


export function render_mat_child(
    settings: Settings,
    node: RecipeNode, 
    td_class: string = "tree-indent1"
): HTMLElement {
    return create_item_row(settings, node, td_class);
}


export function render_dep_child(
    settings: Settings,
    node: RecipeNode, 
): HTMLElement {
    const {is_rounded} = settings;
    const {item_amount, item_name, variant, belt_amount, fraction} = node;
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


export function render_tree_child(
    settings: Settings,
    node: RecipeNode
): HTMLDetailsElement {
    return render_node(settings, node, render_tree_child);
}



function create_item_image(item: string) {
    const img = document.createElement("img");
    img.className = "item-img";
    img.src = get_asset(item);
    img.loading = "lazy";
    img.onerror = () => {img.src = get_asset("Unknown");};
    return img;
}

function td(text = "", className = "") {
    const cell = document.createElement("td");
    if (className) {cell.className = className;}
    if (text) {cell.textContent = text;}
    return cell;
}


export function render_boosts(settings: Settings, container: HTMLElement) {
    container.innerHTML = "";

    const title = document.createElement("p");
    title.textContent = "Resource Boosts:";
    const div = document.createElement("div");
    div.appendChild(title);

    const table = document.createElement("table");
    table.className = "item-boosts";

    // Small header for the two columns
    const thead = document.createElement("thead");
    const headRow = document.createElement("tr");
    headRow.innerHTML = `<th></th><th class="num">Coal</th><th class="num">Nuclear</th>`;
    thead.appendChild(headRow);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");

    for (const key of RAW_ITEMS) {
        const extractors = settings.extractors.get(key) ?? 0;
        const coal_frac = settings.coal_fracs.get(key) ?? 0;
        const nuc_frac = settings.nuclear_fracs.get(key) ?? 0;
        const coal_ex = coal_frac * extractors;
        const nuc_ex = nuc_frac * extractors;

        const name = key.replaceAll("_", " ");

        // Row 1: icon + name (spans all columns)
        const r1 = document.createElement("tr");

        const tdTitle = td();
        tdTitle.colSpan = 3;

        const wrap = document.createElement("div");
        wrap.className = "res-head";

        const span = document.createElement("span");
        span.textContent = name;

        wrap.append(create_item_image(key), span);
        tdTitle.appendChild(wrap);
        r1.appendChild(tdTitle);

        // Row 2: percentages
        const r2 = document.createElement("tr");

        const tdLabelPct = td("fraction", "sub-label");
        const tdCoalPct = td("", "num frac-cell1");
        const tdNucPct = td("", "num frac-cell2");
        r2.append(tdLabelPct, tdCoalPct, tdNucPct);
        populate_frac_cell(settings.is_rounded, r2, coal_frac, "1");
        populate_frac_cell(settings.is_rounded, r2, nuc_frac, "2");

        // Row 3: extractors
        const r3 = document.createElement("tr");

        const tdLabelEx = td("extractors", "sub-label");
        const tdCoalEx = td("", "num number-cell1");
        const tdNucEx = td("", "num number-cell2");
        r3.append(tdLabelEx, tdCoalEx, tdNucEx);
        populate_amount_cell(settings.is_rounded, r3, coal_ex, "1", false);
        populate_amount_cell(settings.is_rounded, r3, nuc_ex, "2", false);

        // Spacer row between resources
        const spacer = document.createElement("tr");
        spacer.className = "res-gap";
        const spacerTd = document.createElement("td");
        spacerTd.colSpan = 3;
        spacer.appendChild(spacerTd);

        tbody.append(r1, r2, r3, spacer);
    }

    table.appendChild(tbody);
    div.appendChild(table);
    container.appendChild(div);
}



export function render_ratios(settings: Settings, container: HTMLElement) {
    container.innerHTML = "";

    const title = document.createElement("p");
    title.textContent ='Used Alt recipes:';
    const div = document.createElement("div");
    div.appendChild(title);

    const table = document.createElement("table");
    table.className = "tree-table";
    
    for (const [key, ratio] of settings.alt_ratios) {
        const name = key.replaceAll("_", " ");
        const tr = document.createElement("tr");

        const tdImg = td("", "tree-indent2");
        tdImg.appendChild(create_item_image(key));
        const tdName = td(name, "tree-indent2");
        const tdValue = td("", "tree-indent2 frac-cell");

        tr.append(tdImg, tdName, tdValue);
        table.appendChild(tr);
        populate_frac_cell(settings.is_rounded, tr, ratio);
    }
    div.appendChild(table);
    container.appendChild(div);
}