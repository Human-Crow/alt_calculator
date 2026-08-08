import { import_btn, export_btn, copy_txt_btn, copy_url_btn, bulk_in } from "./dom.js";
import { default_values, get_btn_value } from "./defaults.js";
const bulk_map = new Map([
    ["t_ws", "Workshop_BD"],
    ["t_fn", "Furnace_BD"],
    ["t_ms", "Machine_Shop_BD"],
    ["t_fg", "Forge_BD"],
    ["t_if", "Industrial_Factory_BD"],
    ["t_mf", "Manufacturer_BD"],
    ["t_ex", "Extractor_BD"],
    ["t_bs", "Belt_BD"],
    ["a_cw", "Copper_Wire_AR"],
    ["a_ig", "Iron_Gear_AR"],
    ["a_st", "Steel_AR"],
    ["a_cc", "Concrete_AR"],
    ["a_el", "Electromagnet_AR"],
    ["a_lc", "Logic_Circuit_AR"],
    ["a_em", "Electric_Motor_AR"],
    ["a_if", "Industrial_Frame_AR"],
    ["a_tu", "Turbocharger_AR"],
    ["a_sc", "Super_Computer_AR"],
    ["a_tc", "Tungsten_Carbide_AR"],
    ["a_ro", "Rotor_AR"],
    ["c_pp", "coal_pp_in"],
    ["c_wd", "Wood_Log_CB"],
    ["c_st", "Stone_CB"],
    ["c_ir", "Iron_Ore_CB"],
    ["c_cp", "Copper_Ore_CB"],
    ["c_cl", "Coal_CB"],
    ["c_wr", "Wolframite_CB"],
    ["c_ur", "Uranium_Ore_CB"],
    ["n_pp", "nuclear_pp_in"],
    ["n_wd", "Wood_Log_NB"],
    ["n_st", "Stone_NB"],
    ["n_ir", "Iron_Ore_NB"],
    ["n_cp", "Copper_Ore_NB"],
    ["n_cl", "Coal_NB"],
    ["n_wr", "Wolframite_NB"],
    ["n_ur", "Uranium_Ore_NB"],
    ["mode", "mode_btn"],
    ["item", "item_select"],
    ["goal", "goal_in"],
    ["e_wd", "Wood_Log_EX"],
    ["e_st", "Stone_EX"],
    ["e_ir", "Iron_Ore_EX"],
    ["e_cp", "Copper_Ore_EX"],
    ["e_cl", "Coal_EX"],
    ["e_wr", "Wolframite_EX"],
    ["e_ur", "Uranium_Ore_EX"],
    ["alt", "alt_box"],
    ["c_bst", "c_boost_box"],
    ["n_bst", "n_boost_box"],
    ["gen2", "gen2_box"]
]);
export const html_ids = Array.from(bulk_map.values());
function normalize_select_value(str) {
    return str
        .trim()
        .toLowerCase()
        .split(/[\s_-]+/) // split on space, underscore, or dash
        .filter(Boolean)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join("_");
}
function apply_value(el, value) {
    if (el instanceof HTMLInputElement) {
        if (el.type === "checkbox") {
            el.checked = value === "1" || value === "true" || value === "yes";
            el.dispatchEvent(new Event("change"));
            return;
        }
        el.value = value;
        el.dispatchEvent(new Event("change"));
    }
    else if (el instanceof HTMLSelectElement) {
        el.value = normalize_select_value(value);
        el.dispatchEvent(new Event("change"));
    }
    else if (el instanceof HTMLButtonElement) {
        if (get_btn_value(el) != value) {
            el.click();
        }
    }
}
function parse_input(value) {
    value = value.trim();
    const pairs = value.split(",");
    const pairs_rgx = /^[^:,\s]+:[^:,\s]+$/;
    if (pairs.every(pair => pairs_rgx.test(pair.trim()))) {
        const values = {};
        for (const pair of pairs) {
            const [key, value] = pair.trim().split(":");
            values[key] = value;
        }
        return values;
    }
    const numberStrings = value.match(/-?(?:\d+(?:\.\d*)?|\.\d+)/g);
    if (numberStrings) {
        const values = numberStrings.map(String);
        return values;
    }
    return undefined;
}
function get_bulk_input(value) {
    value = value.trim();
    try {
        const url = new URL(value);
        const bulk = url.searchParams.get("bulk");
        if (bulk !== null) {
            return bulk;
        }
    }
    catch { }
    return value;
}
function import_bulk() {
    const input = get_bulk_input(bulk_in.value);
    const parsed = parse_input(input);
    if (parsed === undefined)
        return;
    const bulk_ids = ["e_wd", "e_st", "e_ir", "e_cp", "e_cl", "e_wr", "e_ur"];
    const entries = Array.isArray(parsed)
        ? parsed.map((value, i) => [bulk_ids[i], value])
        : Object.entries(parsed);
    for (const [id, value] of entries) {
        if (!id)
            continue;
        const htmlId = bulk_map.get(id);
        if (!htmlId)
            continue;
        const el = document.getElementById(htmlId);
        if (!el)
            continue;
        apply_value(el, value);
    }
}
function copy_bulk(button, text) {
    navigator.clipboard.writeText(text ?? "").then(() => {
        const old = button.textContent;
        button.textContent = "Copied!";
        setTimeout(() => {
            button.textContent = old;
        }, 1000);
    });
}
function export_bulk() {
    const result = [];
    for (const [short_id, html_id] of bulk_map) {
        const el = document.getElementById(html_id);
        if (!el)
            continue;
        let value;
        let is_default = false;
        const default_val = default_values.get(html_id);
        if (el instanceof HTMLInputElement && el.type === "checkbox") {
            value = el.checked ? "1" : "0";
            is_default = value === default_val;
        }
        else if (el instanceof HTMLInputElement) {
            value = el.value;
            is_default = value === default_val;
        }
        else if (el instanceof HTMLSelectElement) {
            value = el.value;
            is_default = value === default_val;
        }
        else if (el instanceof HTMLButtonElement) {
            value = get_btn_value(el);
            is_default = value === default_val;
        }
        else {
            continue;
        }
        if (is_default)
            continue;
        if (value === "")
            continue;
        result.push(`${short_id}:${value}`);
    }
    return result.join(",");
}
export function bulk_key() {
    const result = [];
    for (const html_id of html_ids) {
        const el = document.getElementById(html_id);
        if (!el)
            continue;
        let value = "";
        if (el instanceof HTMLInputElement && el.type === "checkbox") {
            value = el.checked ? "1" : "0";
        }
        else if (el instanceof HTMLInputElement) {
            value = el.value;
        }
        else if (el instanceof HTMLSelectElement) {
            value = el.value;
        }
        else if (el instanceof HTMLButtonElement) {
            value = get_btn_value(el);
        }
        if (value == "")
            value = "-";
        result.push(value);
    }
    return result.join(".");
}
export function init_bulk() {
    import_btn.addEventListener("click", import_bulk);
    export_btn.addEventListener("click", () => {
        bulk_in.value = export_bulk();
    });
    copy_txt_btn.addEventListener("click", () => {
        copy_bulk(copy_txt_btn, export_bulk());
    });
    copy_url_btn.addEventListener("click", () => {
        const bulk = export_bulk();
        let text = "";
        if (bulk) {
            const url = new URL(window.location.href);
            text = `${url.origin}${url.pathname}?bulk=${bulk}`;
        }
        copy_bulk(copy_url_btn, text);
    });
}
//# sourceMappingURL=bulk.js.map