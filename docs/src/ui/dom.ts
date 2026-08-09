import { RAW_ITEMS, ALT_ITEMS, BUILDINGS } from '../data/name_lists.js';
import { AltItemId, BuildingId, RawItemId } from '../data/types.js';


export const gen2_box      = document.getElementById("gen2_box"        ) as HTMLInputElement;
export const rounded_box   = document.getElementById("rounded_box"     ) as HTMLInputElement;
export const alt_box       = document.getElementById("alt_box"         ) as HTMLInputElement;
export const c_boost_box     = document.getElementById("c_boost_box"       ) as HTMLInputElement;
export const n_boost_box     = document.getElementById("n_boost_box"       ) as HTMLInputElement;

export const mode_btn   = document.getElementById("mode_btn"        ) as HTMLButtonElement;
export const item_sel   = document.getElementById("item_select"     ) as HTMLSelectElement;
export const fake_sel   = document.getElementById("fake_item_select") as HTMLDivElement;

export const bulk_in    = document.getElementById("bulk_in"         ) as HTMLInputElement;
export const goal_in  = document.getElementById("goal_in"         ) as HTMLInputElement;
export const cpp_in     = document.getElementById("coal_pp_in"      ) as HTMLInputElement;
export const npp_in     = document.getElementById("nuclear_pp_in"   ) as HTMLInputElement;

export const import_btn = document.getElementById("import_btn"      ) as HTMLButtonElement;
export const export_btn = document.getElementById("export_btn"      ) as HTMLButtonElement;
export const copy_txt_btn = document.getElementById("copy_txt_btn") as HTMLButtonElement;
export const copy_url_btn = document.getElementById("copy_url_btn") as HTMLButtonElement;
export const max_btn    = document.getElementById("max_tier_btn"    ) as HTMLButtonElement;
export const min_btn    = document.getElementById("min_tier_btn"    ) as HTMLButtonElement;
export const list_btn   = document.getElementById("list_view_btn"   ) as HTMLButtonElement;
export const mat_btn    = document.getElementById("mat_view_btn"    ) as HTMLButtonElement;
export const dep_btn    = document.getElementById("dep_view_btn"    ) as HTMLButtonElement;
export const tree_btn   = document.getElementById("tree_view_btn"   ) as HTMLButtonElement;
export const ratios_btn = document.getElementById("alt_ratios_btn"  ) as HTMLButtonElement;
export const boosts_btn = document.getElementById("res_boosts_btn"  ) as HTMLButtonElement;

export const alt_div = document.getElementById("alt_div") as HTMLDivElement;
export const alt_note = document.getElementById("alt_note") as HTMLParagraphElement;
export const coal_div = document.getElementById("coal_div") as HTMLDivElement;
export const coal_note = document.getElementById("coal_note") as HTMLParagraphElement;
export const nuclear_div = document.getElementById("nuclear_div") as HTMLDivElement;
export const nuclear_note = document.getElementById("nuclear_note") as HTMLParagraphElement;
export const goal_collap = document.getElementById("goal_collap") as HTMLDetailsElement;
export const ex_collap = document.getElementById("ex_collap") as HTMLDetailsElement;
export const c_boost_label = document.getElementById("c_boost_label") as HTMLLabelElement;
export const n_boost_label = document.getElementById("n_boost_label") as HTMLLabelElement;


export const boost_note = document.getElementById("boost_note") as HTMLParagraphElement;
export const output_el     = document.getElementById("output"          ) as HTMLElement;


export const clear_all_btn = document.getElementById("clear_all_btn") as HTMLButtonElement;
export const able_all_btn = document.getElementById("able_all_btn") as HTMLButtonElement;
export const optimal_btn = document.getElementById("optimal_btn") as HTMLButtonElement;
export const clear_alt_btn = document.getElementById("clear_alt_btn") as HTMLButtonElement;
export const able_alt_btn = document.getElementById("able_alt_btn") as HTMLButtonElement;
export const clear_coal_btn = document.getElementById("clear_coal_btn") as HTMLButtonElement;
export const able_coal_btn = document.getElementById("able_coal_btn") as HTMLButtonElement;
export const clear_nuc_btn = document.getElementById("clear_nuclear_btn") as HTMLButtonElement;
export const able_nuc_btn = document.getElementById("able_nuclear_btn") as HTMLButtonElement;
export const clear_ext_btn = document.getElementById("clear_ex_btn") as HTMLButtonElement;
export const clear_goal_btn = document.getElementById("clear_goal_btn") as HTMLButtonElement;


function buildElemMap<K extends string, T extends HTMLElement>(
    ids: readonly K[], 
    suffix: string = ""
): Map<K, T> {
    const map = new Map<K, T>();
    for (const id of ids) {
        const el = document.getElementById(`${id}${suffix}`);
        if (el instanceof HTMLElement) {
            map.set(id, el as T);
        }
    }
    return map;
}


export const alt_inputs = buildElemMap<AltItemId, HTMLInputElement>(
    ALT_ITEMS, "_AR"
);

export const tier_inputs = buildElemMap<BuildingId, HTMLInputElement>(
    BUILDINGS, "_BD"
);

export const tier_images = buildElemMap<BuildingId, HTMLImageElement>(
    BUILDINGS, "_IMG"
);

export const extractor_inputs = buildElemMap<RawItemId, HTMLInputElement>(
    RAW_ITEMS, "_EX"
);

export const coal_inputs = buildElemMap<RawItemId, HTMLInputElement>(
    RAW_ITEMS, "_CB"
);

export const nuclear_inputs = buildElemMap<RawItemId, HTMLInputElement>(
    RAW_ITEMS, "_NB"
);