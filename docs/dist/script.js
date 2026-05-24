// cd alt_calculator; if ($?) { npx tsc --watch }
import { resource_solver, goal_solver, get_resource_boosts, get_alt_ratios, RAW_RESOURCES } from './solver.js';
//#region Constants
const clear_button1 = document.getElementById("clear_button1");
const clear_button2 = document.getElementById("clear_button2");
const score_button = document.getElementById("score_button");
const alt_recipe_button = document.getElementById("alt_recipe_button");
const res_boosts_button = document.getElementById("res_boosts_button");
const bulk_button = document.getElementById("bulk_button");
const mode_btn = document.getElementById("mode_btn");
const target_box = document.getElementById("target_box");
const split_box = document.getElementById("split_box");
const alt_box = document.getElementById("alt_box");
const boost_box = document.getElementById("boost_box");
const gen2_box = document.getElementById("gen2_box");
const boost_note = document.getElementById("boost_note");
const zero_box = document.getElementById("zero_box");
const ratio_box = document.getElementById("ratio_box");
const fake_target_box = document.getElementById("fake_target_box");
const boost_container = document.getElementById("boost_container");
const resource_fields = document.getElementById("resource_fields");
const goal_fields = document.getElementById("goal_fields");
const goal = document.getElementById("goal");
const extractor_inputs = {};
document.querySelectorAll("#resource_fields input")
    .forEach(input => { extractor_inputs[input.id] = input; });
const output = document.getElementById("output");
const url_map = {
    wood: "wd",
    stone: "st",
    iron: "ir",
    copper: "cp",
    coal: "cl",
    wolframite: "wr",
    uranium: "ur"
};
const resource_map = {
    wood: "Wood_Log",
    stone: "Stone",
    iron: "Iron_Ore",
    copper: "Copper_Ore",
    coal: "Coal",
    wolframite: "Wolframite",
    uranium: "Uranium_Ore"
};
//#endregion
//#region Element functions
makeFakeSelect(target_box, fake_target_box, true);
for (const elem of Object.values(extractor_inputs)) {
    elem.onchange = function () {
        output.replaceChildren();
        const url_id = url_map[elem.id];
        if (!url_id) {
            throw new Error("Could not find url id!");
        }
        update_url_param(url_id, elem.value);
        if (goal.value != "") {
            goal.value = "";
            update_url_param("goal", "");
        }
    };
}
goal.onchange = function () {
    output.replaceChildren();
    update_url_param("goal", goal.value);
    for (const elem of Object.values(extractor_inputs)) {
        if (elem.value != "") {
            elem.value = "";
            const url_id = url_map[elem.id];
            if (!url_id) {
                throw new Error("Could not find url id!");
            }
            update_url_param(url_id, "");
        }
    }
};
function toggle_boost_elems() {
    res_boosts_button.classList.toggle("hidden", !boost_box.checked || is_mode_goal);
    boost_note.textContent = (boost_box.checked && !is_mode_goal)
        ? "The calculations are\nbased on an approximation"
        : "";
}
let is_mode_goal = false;
mode_btn.onclick = function () {
    is_mode_goal = !is_mode_goal;
    mode_btn.textContent = `${is_mode_goal ? "Goal" : "Resource"} Limited`;
    output.replaceChildren();
    resource_fields.classList.toggle("hidden", is_mode_goal);
    goal_fields.classList.toggle("hidden", !is_mode_goal);
    boost_container.classList.toggle("visible", is_mode_goal);
    toggle_boost_elems();
};
target_box.onchange = function () {
    output.replaceChildren();
    update_url_param("item", target_box.value === "Earth_Token" ? "" : target_box.value);
};
alt_box.onchange = function () {
    output.replaceChildren();
    alt_recipe_button.classList.toggle("hidden", !alt_box.checked);
    update_url_param("alt", alt_box.checked ? "1" : "0");
};
boost_box.onchange = function () {
    output.replaceChildren();
    toggle_boost_elems();
    update_url_param("boost", boost_box.checked ? "1" : "0");
};
gen2_box.onchange = function () {
    output.replaceChildren();
    update_url_param("gen2", gen2_box.checked ? "1" : "0");
};
alt_recipe_button.onclick = function () { show_recipe_ratios(); };
res_boosts_button.onclick = function () { show_resource_boosts(); };
async function get_solution() {
    let solution;
    if (is_mode_goal) {
        solution = await goal_solver(target_box.value, Number(goal.value), alt_box.checked);
    }
    else {
        solution = await resource_solver(target_box.value, extractor_values(), alt_box.checked, boost_box.checked, gen2_box.checked);
    }
    return solution;
}
score_button.onclick = async function () {
    const solution = await get_solution();
    show_result(solution, ratio_box.checked, zero_box.checked);
};
let clear_state = false;
document.onclick = function (event) {
    let clear_button = (is_mode_goal) ? clear_button2 : clear_button1;
    clear_button.innerText = "Clear Fields";
    if (event.target === clear_button) {
        if (clear_state) {
            for (const elem of Object.values(extractor_inputs)) {
                elem.value = "";
                elem.dispatchEvent(new Event("change"));
            }
            goal.value = "";
            goal.dispatchEvent(new Event("change"));
        }
        else {
            clear_button.innerText = "Tap again";
        }
        clear_state = !clear_state;
    }
    else {
        clear_state = false;
    }
};
async function get_bulk() {
    split_box.checked = true;
    const id_map = {
        mode: "mode_btn",
        item: "target_box",
        goal: "goal",
        gen2: "gen2_box",
        e_wd: "wood",
        e_st: "stone",
        e_ir: "iron",
        e_cp: "copper",
        e_cl: "coal",
        e_wr: "wolframite",
        e_ur: "uranium"
    };
    const alt_map = {
        a_cw: "Copper_Wire",
        a_ig: "Iron_Gear",
        a_st: "Steel",
        a_cc: "Concrete",
        a_el: "Electromagnet",
        a_lc: "Logic_Circuit",
        a_em: "Electric_Motor",
        a_if: "Industrial_Frame",
        a_tu: "Turbocharger",
        a_sc: "Super_Computer",
        a_tc: "Tungsten_Carbide",
        a_ro: "Rotor"
    };
    const boost_map = {
        Coal: ["c_cl", "n_cl"],
        Copper_Ore: ["c_cp", "n_cp"],
        Iron_Ore: ["c_ir", "n_ir"],
        Stone: ["c_st", "n_st"],
        Uranium_Ore: ["c_ur", "n_ur"],
        Wolframite: ["c_wr", "n_wr"],
        Wood_Log: ["c_wd", "n_wd"]
    };
    const result = [
        "t_ws:4",
        "t_fn:4",
        "t_ms:4",
        "t_fg:4",
        "t_if:4",
        "t_mf:4",
        "t_ex:5",
        "t_bs:480"
    ];
    for (const [short_id, html_id] of Object.entries(id_map)) {
        const el = document.getElementById(html_id);
        if (!el)
            continue;
        let value;
        if (el instanceof HTMLInputElement && el.type === "checkbox") {
            value = el.checked ? 1 : 0;
        }
        else if (el instanceof HTMLInputElement) {
            value = el.value;
        }
        else if (el instanceof HTMLSelectElement) {
            value = el.value;
        }
        else if (el instanceof HTMLButtonElement) {
            value = el.textContent.split(" ")[0];
        }
        else {
            continue;
        }
        if (value === "" || value === "0" || value === 0)
            continue;
        result.push(`${short_id}:${value}`);
    }
    const all_items = await get_solution();
    const split = split_box.checked && boost_box.checked;
    const alt_ratios = get_alt_ratios(all_items, split);
    for (const [short_id, alt_id] of Object.entries(alt_map)) {
        const value = alt_ratios[alt_id] || 0;
        if (value > 0) {
            result.push(`${short_id}:${value}`);
        }
    }
    const cpp = all_items["Coal_Power_Plant"] || 0;
    if (cpp) {
        result.push(`c_pp:${cpp}`);
    }
    const npp = all_items["Nuclear_Power_Plant"] || 0;
    if (npp) {
        result.push(`n_pp:${npp}`);
    }
    const res_boosts = get_resource_boosts(all_items);
    for (const [key, [coal_per, nuc_per]] of Object.entries(res_boosts)) {
        const keys = boost_map[key];
        if (!keys) {
            continue;
        }
        if (coal_per) {
            result.push(`${keys[0]}:${coal_per}`);
        }
        if (nuc_per) {
            result.push(`${keys[1]}:${nuc_per}`);
        }
    }
    return result.join(",");
}
bulk_button.onclick = async function copy_bulk() {
    const bulk = await get_bulk();
    navigator.clipboard.writeText(bulk).then(() => {
        const btn = document.querySelector("button[onclick='copy_bulk()']");
        if (!btn)
            return;
        const old = btn.textContent;
        btn.textContent = "Copied!";
        setTimeout(() => {
            btn.textContent = old;
        }, 1000);
    });
};
//#endregion
//#region Show functions
function show_nuc_ratios() {
    const title = document.createElement("p");
    title.textContent = "For Nuclear Fuel Cells:";
    title.style.margin = "24px 0 6px 0";
    output.appendChild(title);
    const table = document.createElement("table");
    table.className = "items ratios";
    for (const key of ["Steel", "Tungsten_Carbide"]) {
        const percent = 1;
        const tr = document.createElement("tr");
        // icon cell
        const tdImg = document.createElement("td");
        const img = document.createElement("img");
        img.src = get_item_src(key);
        img.alt = key.replaceAll("_", " ");
        img.loading = "lazy";
        img.onerror = () => { img.src = get_item_src("unknown"); };
        tdImg.appendChild(img);
        // name cell
        const tdName = document.createElement("td");
        tdName.textContent = key.replaceAll("_", " ");
        // percent cell
        const tdValue = document.createElement("td");
        tdValue.className = "pct-value";
        tdValue.textContent = round_sig(percent * 100, 6);
        // percent sign cell
        const tdSymbol = document.createElement("td");
        tdSymbol.className = "pct-symbol";
        tdSymbol.textContent = "%";
        tr.append(tdImg, tdName, tdValue, tdSymbol);
        table.appendChild(tr);
    }
    output.appendChild(table);
}
async function show_recipe_ratios() {
    const all_items = await get_solution();
    const split = split_box.checked && boost_box.checked;
    output.replaceChildren();
    const title = document.createElement("p");
    title.textContent = `Used ${split ? "" : "Total "}Alt recipes:`;
    title.style.margin = "0 0 6px 0";
    output.appendChild(title);
    if (split) {
        show_nuc_ratios();
        const title = document.createElement("p");
        title.textContent = `For ${target_box.value.replaceAll("_", " ")}s:`;
        title.style.margin = "24px 0 6px 0";
        output.appendChild(title);
    }
    const table = document.createElement("table");
    table.className = "items ratios";
    const alt_ratios = get_alt_ratios(all_items, split);
    for (const [key, percent] of Object.entries(alt_ratios)) {
        const tr = document.createElement("tr");
        // icon cell
        const tdImg = document.createElement("td");
        const img = document.createElement("img");
        img.src = get_item_src(key);
        img.alt = key.replaceAll("_", " ");
        img.loading = "lazy";
        img.onerror = () => { img.src = get_item_src("unknown"); };
        tdImg.appendChild(img);
        // name cell
        const tdName = document.createElement("td");
        tdName.textContent = key.replaceAll("_", " ");
        // percent cell
        const tdValue = document.createElement("td");
        tdValue.className = "pct-value";
        tdValue.textContent = round_sig(percent * 100, 6);
        // percent sign cell
        const tdSymbol = document.createElement("td");
        tdSymbol.className = "pct-symbol";
        tdSymbol.textContent = "%";
        tr.append(tdImg, tdName, tdValue, tdSymbol);
        table.appendChild(tr);
    }
    output.appendChild(table);
}
async function show_resource_boosts() {
    const all_items = await get_solution();
    output.replaceChildren();
    const title = document.createElement("p");
    title.textContent = "Resource Boosts:";
    title.style.margin = "0 0 6px 0";
    output.appendChild(title);
    const table = document.createElement("table");
    table.className = "items boosts3";
    // Optional: small header for the two columns
    const thead = document.createElement("thead");
    const headRow = document.createElement("tr");
    headRow.innerHTML = `<th></th><th class="num">Coal</th><th class="num">Nuclear</th>`;
    thead.appendChild(headRow);
    table.appendChild(thead);
    const tbody = document.createElement("tbody");
    const res_boosts = get_resource_boosts(all_items);
    for (const [key, [coal_per, nuc_per, coal_ex, nuc_ex]] of Object.entries(res_boosts)) {
        const name = key.replaceAll("_", " ");
        // Row 1: icon + name (spans all columns)
        const r1 = document.createElement("tr");
        r1.className = "res-title";
        const tdTitle = document.createElement("td");
        tdTitle.colSpan = 3;
        const wrap = document.createElement("div");
        wrap.className = "res-head";
        const img = document.createElement("img");
        img.src = get_item_src(key);
        img.alt = name;
        img.loading = "lazy";
        img.onerror = () => { img.src = get_item_src("unknown"); };
        const span = document.createElement("span");
        span.textContent = name;
        wrap.append(img, span);
        tdTitle.appendChild(wrap);
        r1.appendChild(tdTitle);
        // Row 2: percentages
        const r2 = document.createElement("tr");
        r2.className = "res-sub";
        const tdLabelPct = document.createElement("td");
        tdLabelPct.className = "sub-label";
        tdLabelPct.textContent = "percent";
        const tdCoalPct = document.createElement("td");
        tdCoalPct.className = "num";
        tdCoalPct.textContent = round_sig((coal_per || 0) * 100, 6);
        const tdNucPct = document.createElement("td");
        tdNucPct.className = "num";
        tdNucPct.textContent = round_sig((nuc_per || 0) * 100, 6);
        r2.append(tdLabelPct, tdCoalPct, tdNucPct);
        // Row 3: extractors
        const r3 = document.createElement("tr");
        r3.className = "res-sub";
        const tdLabelEx = document.createElement("td");
        tdLabelEx.className = "sub-label";
        tdLabelEx.textContent = "extractors";
        const tdCoalEx = document.createElement("td");
        tdCoalEx.className = "num";
        tdCoalEx.textContent = round_sig(coal_ex || 0, 6);
        const tdNucEx = document.createElement("td");
        tdNucEx.className = "num";
        tdNucEx.textContent = round_sig(nuc_ex || 0, 6);
        r3.append(tdLabelEx, tdCoalEx, tdNucEx);
        // Optional spacer row between resources
        const spacer = document.createElement("tr");
        spacer.className = "res-gap";
        const spacerTd = document.createElement("td");
        spacerTd.colSpan = 3;
        spacer.appendChild(spacerTd);
        tbody.append(r1, r2, r3, spacer);
    }
    table.appendChild(tbody);
    output.appendChild(table);
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
function adjust_item_dict(item_dict, divide, show_zero) {
    let keys = Object.keys(item_dict);
    const target_name = target_box.value;
    const first_keys = [target_name];
    for (const res of RAW_RESOURCES) {
        first_keys.push(res);
    }
    let last_keys = keys.filter(item => !first_keys.includes(item) && !item.endsWith('_Ex') && item != "Coal_RAW" && item != "Resource_Sum");
    if (!alt_box.checked) {
        last_keys = last_keys.filter(item => !item.endsWith('_ALT') && !item.endsWith('_STD'));
    }
    last_keys.sort();
    keys = first_keys.concat(last_keys);
    let new_dict = {};
    for (const [index, key] of keys.entries()) {
        const amount = item_dict[key] || 0;
        const target_amount = item_dict[target_name];
        if (target_amount === undefined) {
            throw new Error("Target not found!");
        }
        const value = divide ? amount / target_amount : amount;
        if (!show_zero && index > 7 && value <= 0) {
            continue;
        }
        new_dict[key] = value;
    }
    return new_dict;
}
function show_result(raw_item_dict, divide, show_zero) {
    const item_dict = adjust_item_dict(raw_item_dict, divide, show_zero);
    output.replaceChildren();
    const table = document.createElement("table");
    table.className = "items";
    for (const [name, amount] of Object.entries(item_dict)) {
        const tr = document.createElement("tr");
        const tdImg = document.createElement("td");
        const img = document.createElement("img");
        img.className = "item-img";
        img.src = get_item_src(name.replace(/_(ALT|STD)$/, ""));
        img.alt = name;
        img.loading = "lazy";
        img.onerror = () => { img.src = get_item_src("unknown"); };
        tdImg.appendChild(img);
        const tdName = document.createElement("td");
        tdName.textContent = name.replaceAll("_", ' ');
        const tdAmount = document.createElement("td");
        tdAmount.textContent = round_sig(amount, 6);
        tr.append(tdImg, tdName, tdAmount);
        table.appendChild(tr);
    }
    table.insertBefore(createSpacerRow(3), table.rows[1] || null);
    table.insertBefore(createSpacerRow(3), table.rows[9] || null);
    output.appendChild(table);
}
//#endregion
//#region Other functions
function get_item_src(value) {
    return "assets/" + value + ".png";
}
function show_warning(message) {
    const warning = document.createElement("div");
    warning.textContent = message;
    warning.style.cssText = `
        color: white; 
        font-weight: bold; 
        position: fixed; 
        text-align: center;
        top: 10px; 
        left: 50%; 
        transform: translateX(-50%); 
        background:rgb(180, 0, 0); 
        padding: 10px; 
        border: 1px solid white;
        border-radius: 12px;
        box-shadow: 0px 0px 10px rgb(0, 0, 0);
    `;
    // Find the last warning element
    const warnings = document.querySelectorAll(".warning-message");
    if (warnings.length > 0) {
        const lastWarning = warnings[warnings.length - 1]; // Get last warning
        if (lastWarning) {
            const lastWarningRect = lastWarning.getBoundingClientRect(); // Get position
            warning.style.top = `${lastWarningRect.bottom / 1.5 - 14.28454342 + 5}px`; // Adjust position
        }
    }
    // Add class for identification
    warning.classList.add("warning-message");
    document.body.appendChild(warning);
    // Remove warning when user clicks anywhere on the page
    document.addEventListener("click", () => warning.remove(), { once: true });
}
function proper(str, separator = '') {
    if (!str) {
        return str;
    }
    str = str.toLowerCase();
    if (separator) {
        let words = [];
        for (let word of str.split(separator)) {
            words.push(word.charAt(0).toUpperCase() + word.slice(1));
        }
        return words.join(separator);
    }
    else {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}
function extractor_values() {
    const result = {};
    for (const [elem_id, name] of Object.entries(resource_map)) {
        const elem = extractor_inputs[elem_id];
        result[name] = Number(elem?.value || 0);
    }
    return result;
}
function roundN(value, decimals) {
    return Math.round(value * 10 ** decimals) / (10 ** decimals);
}
function round_sig(num, sig, preRound = 6) {
    num = roundN(num, preRound);
    const abs = Math.abs(num);
    // Always return a string (formatter function)
    if (abs === 0)
        return "0";
    if (Number.isInteger(num))
        return String(num);
    const intDigits = Math.floor(Math.log10(abs)) + 1;
    let decimals = sig - intDigits;
    if (decimals < 1)
        decimals = 1;
    let s = num.toFixed(decimals);
    // Trim trailing zeros but keep at least one digit after the dot
    s = s.replace(/(\.\d*?[1-9])0+$/, "$1"); // 12.3400 -> 12.34
    s = s.replace(/\.(0+)$/, ".0"); // 12.000 -> 12.0
    return s;
}
function get_url_param(target_key) {
    const url_vars = window.location.search.substring(1).split('&');
    for (const url_var of url_vars) {
        const [key, value] = url_var.split('=');
        if (key === target_key) {
            return value || "";
        }
    }
    return "";
}
function update_url_param(param, value) {
    const url = new URL(window.location.href);
    const params = url.searchParams;
    if (params.get(param) === value) {
        return;
    }
    const order = ["alt", "boost", "gen2", "item", "goal", "wd", "st", "ir", "cp", "cl", "wr", "ur"];
    if (value && value !== "0") {
        params.set(param, value);
    }
    else {
        params.delete(param);
    }
    const ordered_params = new URLSearchParams();
    for (let key of order) {
        const param_key = params.get(key);
        if (param_key) {
            ordered_params.set(key, param_key);
        }
    }
    window.history.replaceState({}, '', `${url.origin}${url.pathname}?${ordered_params.toString()}`);
}
function makeFakeSelect(realSelect, fakeSelect, withImages = false) {
    const selectedBtn = fakeSelect.querySelector(".selected");
    const optionsDiv = fakeSelect.querySelector(".options");
    function renderSelected(option) {
        if (!(selectedBtn)) {
            return;
        }
        if (withImages) {
            selectedBtn.innerHTML = `
                <img src="${get_item_src(option.value)}" alt="">
                <span>${option.textContent}</span>
            `;
        }
        else {
            selectedBtn.textContent = option.textContent;
        }
    }
    if (!(selectedBtn) || !(optionsDiv)) {
        return;
    }
    optionsDiv.replaceChildren();
    for (const option of realSelect.options) {
        const div = document.createElement("div");
        div.className = "option";
        if (withImages) {
            div.innerHTML = `
                <img src="${get_item_src(option.value)}" alt="">
                <span>${option.textContent}</span>
            `;
        }
        else {
            div.textContent = option.textContent;
        }
        div.addEventListener("click", () => {
            realSelect.value = option.value;
            renderSelected(option);
            fakeSelect.classList.remove("open");
            // forward native change event
            realSelect.dispatchEvent(new Event("change"));
        });
        optionsDiv.appendChild(div);
        if (option.selected) {
            renderSelected(option);
        }
    }
    // toggle dropdown
    selectedBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        fakeSelect.classList.toggle("open");
    });
    // close when clicking outside
    document.addEventListener("click", e => {
        if (!(e.target instanceof Node))
            return;
        if (!fakeSelect.contains(e.target)) {
            fakeSelect.classList.remove("open");
        }
    });
    realSelect.addEventListener("change", () => {
        const option = realSelect.selectedOptions[0];
        if (!option)
            return;
        renderSelected(option);
    });
}
//#endregion
//#region Run when loaded
goal.value = get_url_param("goal");
if (goal.value === "") {
    for (const elem of Object.values(extractor_inputs)) {
        const url_id = url_map[elem.id];
        if (!url_id) {
            throw new Error("Could not find url id!");
        }
        elem.value = get_url_param(url_id);
    }
}
else {
    mode_btn.dispatchEvent(new Event("click"));
    for (const elem of Object.values(extractor_inputs)) {
        const url_id = url_map[elem.id];
        if (!url_id) {
            throw new Error("Could not find url id!");
        }
        update_url_param(url_id, "");
    }
}
let url_item = proper(get_url_param("item"), '_');
if (url_item) {
    if ([...target_box.options].some(option => option.value === url_item)) {
        target_box.value = url_item;
        target_box.dispatchEvent(new Event("change"));
    }
    else {
        show_warning(`"${url_item}" is not a valid item!`);
    }
}
for (let setting of ["alt", "boost", "gen2"]) {
    let url_param = get_url_param(setting);
    if (url_param !== "0" && url_param !== "") {
        if (url_param === "1") {
            let checkbox = document.getElementById(`${setting}_box`);
            if (checkbox instanceof HTMLInputElement) {
                checkbox.checked = true;
                checkbox.dispatchEvent(new Event("change"));
            }
        }
        else {
            show_warning(`${setting} should be 0 or 1!`);
        }
    }
}
if (Object.values(extractor_inputs).every(elem => Number(elem.value) > 0) || Number(goal.value) > 0) {
    show_result(await get_solution(), ratio_box.checked, zero_box.checked);
}
//#endregion
//# sourceMappingURL=script.js.map