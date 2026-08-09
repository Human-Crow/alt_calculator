import { RAW_ITEMS, ALT_ITEMS, BUILDINGS } from '../data/name_lists.js';
export const gen2_box = document.getElementById("gen2_box");
export const rounded_box = document.getElementById("rounded_box");
export const alt_box = document.getElementById("alt_box");
export const c_boost_box = document.getElementById("c_boost_box");
export const n_boost_box = document.getElementById("n_boost_box");
export const mode_btn = document.getElementById("mode_btn");
export const item_sel = document.getElementById("item_select");
export const fake_sel = document.getElementById("fake_item_select");
export const bulk_in = document.getElementById("bulk_in");
export const goal_in = document.getElementById("goal_in");
export const cpp_in = document.getElementById("coal_pp_in");
export const npp_in = document.getElementById("nuclear_pp_in");
export const import_btn = document.getElementById("import_btn");
export const export_btn = document.getElementById("export_btn");
export const copy_txt_btn = document.getElementById("copy_txt_btn");
export const copy_url_btn = document.getElementById("copy_url_btn");
export const max_btn = document.getElementById("max_tier_btn");
export const min_btn = document.getElementById("min_tier_btn");
export const list_btn = document.getElementById("list_view_btn");
export const mat_btn = document.getElementById("mat_view_btn");
export const dep_btn = document.getElementById("dep_view_btn");
export const tree_btn = document.getElementById("tree_view_btn");
export const ratios_btn = document.getElementById("alt_ratios_btn");
export const boosts_btn = document.getElementById("res_boosts_btn");
export const alt_div = document.getElementById("alt_div");
export const alt_note = document.getElementById("alt_note");
export const coal_div = document.getElementById("coal_div");
export const coal_note = document.getElementById("coal_note");
export const nuclear_div = document.getElementById("nuclear_div");
export const nuclear_note = document.getElementById("nuclear_note");
export const goal_collap = document.getElementById("goal_collap");
export const ex_collap = document.getElementById("ex_collap");
export const c_boost_label = document.getElementById("c_boost_label");
export const n_boost_label = document.getElementById("n_boost_label");
export const boost_note = document.getElementById("boost_note");
export const output_el = document.getElementById("output");
export const clear_all_btn = document.getElementById("clear_all_btn");
export const able_all_btn = document.getElementById("able_all_btn");
export const optimal_btn = document.getElementById("optimal_btn");
export const clear_alt_btn = document.getElementById("clear_alt_btn");
export const able_alt_btn = document.getElementById("able_alt_btn");
export const clear_coal_btn = document.getElementById("clear_coal_btn");
export const able_coal_btn = document.getElementById("able_coal_btn");
export const clear_nuc_btn = document.getElementById("clear_nuclear_btn");
export const able_nuc_btn = document.getElementById("able_nuclear_btn");
export const clear_ext_btn = document.getElementById("clear_ex_btn");
export const clear_goal_btn = document.getElementById("clear_goal_btn");
function buildElemMap(ids, suffix = "") {
    const map = new Map();
    for (const id of ids) {
        const el = document.getElementById(`${id}${suffix}`);
        if (el instanceof HTMLElement) {
            map.set(id, el);
        }
    }
    return map;
}
export const alt_inputs = buildElemMap(ALT_ITEMS, "_AR");
export const tier_inputs = buildElemMap(BUILDINGS, "_BD");
export const tier_images = buildElemMap(BUILDINGS, "_IMG");
export const extractor_inputs = buildElemMap(RAW_ITEMS, "_EX");
export const coal_inputs = buildElemMap(RAW_ITEMS, "_CB");
export const nuclear_inputs = buildElemMap(RAW_ITEMS, "_NB");
//# sourceMappingURL=dom.js.map