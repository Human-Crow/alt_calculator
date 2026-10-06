import { ALT_ITEMS, RAW_ITEMS } from '../data/name_lists.js';
import { BuildingId } from '../data/types.js';
import { get_asset } from '../utils/asset_path.js';
import { get_cached_settings } from './cache.js';
import { clear_url } from './url.js';
import { is_approximate, is_coal_approx, is_nuclear_approx } from "./hide.js";
import { boost_note, c_boost_note, n_boost_note } from "./dom.js";

import { 
    cpp_in, 
    npp_in, 
    bulk_in,
    alt_inputs, 
    coal_inputs, 
    nuclear_inputs, 
    extractor_inputs, 
    tier_inputs,
    tier_images,

    max_btn,
    min_btn,

    clear_all_btn,
    optimal_btn,
    clear_alt_btn,
    clear_coal_btn,
    clear_nuc_btn,
    clear_ext_btn,
    clear_goal_btn,
    reset_btn,
    goal_in
} from './dom.js'

import { update_page } from './update_page.js';


function set_max_tiers() {
    for (const input of tier_inputs.values()) {
        input.value = input.max;
        update_page(input);
    }
}

function set_min_tiers() {
    for (const input of tier_inputs.values()) {
        input.value = input.min;
        update_page(input);
    }
}


function do_clear_alt() {
    for (const input of alt_inputs.values()) {
        input.value = "";
    }
}

function do_clear_coal() {
    cpp_in.value = "";
    for (const input of coal_inputs.values()) {
        input.value = "";
    }
    c_boost_note.classList.toggle("hidden", !is_coal_approx());
    boost_note.classList.toggle("hidden", !is_approximate());
}

function do_clear_nuclear() {
    npp_in.value = "";
    for (const input of nuclear_inputs.values()) {
        input.value = "";
    }
    n_boost_note.classList.toggle("hidden", !is_nuclear_approx());
    boost_note.classList.toggle("hidden", !is_approximate());
}

function do_clear_all() {
    do_clear_alt();
    do_clear_coal();
    do_clear_nuclear();
}



function do_clear_extractors() {
    for (const input of extractor_inputs.values()) {
        input.value = "";
        update_page(input);
    }
}

function do_clear_goal() {
    goal_in.value = "";
    update_page(goal_in);
}

function do_clear_website() {
    clear_url();
    location.reload();
}



/** a value written into an input at full precision (the exact number the solver used: rounding it would change the
    next result slightly); tiny rounding noise around 0 is written as 0 */
function exact(v: number): string {
    return Math.abs(v) < 1e-12 ? "0" : String(v);
}

async function do_optimal() {
    const s = await get_cached_settings();
    cpp_in.value = exact(s.coal_pp ?? 0);
    npp_in.value = exact(s.nuclear_pp ?? 0);
    for (const name of ALT_ITEMS) {
        const input = alt_inputs.get(name);
        const value = s.alt_ratios.get(name);
        if (input instanceof HTMLInputElement && typeof value === "number") {
            input.value = exact(value);
        }
    }
    for (const name of RAW_ITEMS) {
        const c_input = coal_inputs.get(name);
        const n_input = nuclear_inputs.get(name);
        const c_value = s.coal_fracs.get(name);
        const n_value = s.nuclear_fracs.get(name);
        if (c_input instanceof HTMLInputElement && typeof c_value === "number") {
            c_input.value = exact(c_value);
        }
        if (n_input instanceof HTMLInputElement && typeof n_value === "number") {
            n_input.value = exact(n_value);
        }
    }
}

const button_actions = new Map<HTMLButtonElement, () => void>([
    [clear_all_btn, do_clear_all],
    [clear_alt_btn, do_clear_alt],
    [clear_coal_btn, do_clear_coal],
    [clear_nuc_btn, do_clear_nuclear],
    [clear_goal_btn, do_clear_goal],
    [clear_ext_btn, do_clear_extractors],
    [reset_btn, do_clear_website],
]);


let active_clear_button: HTMLButtonElement | null = null;
let active_clear_button_text = "";

function clear_btn_action(event: PointerEvent) {
    const clear_button = event.currentTarget;

    if (!(clear_button instanceof HTMLButtonElement)) return;

    if (active_clear_button === clear_button) {
        // Second click on the same button
        const action = button_actions.get(clear_button);
        action?.();

        clear_button.innerText = active_clear_button_text;
        active_clear_button = null;
    } else {
        // First click, or switching to another clear button
        if (active_clear_button !== null) {
            active_clear_button.innerText = active_clear_button_text;
        }

        active_clear_button = clear_button;
        active_clear_button_text = clear_button.innerText;

        clear_button.innerText = "Confirm";
    }
}

function update_tier_img(name: BuildingId, el_in: HTMLInputElement) {
    const el_img = tier_images.get(name);
    if (!el_img) throw new Error("No IMG element found!");
    const value = el_in.value || "1";
    el_img.src = get_asset(`${name}_${value}`);
}


export function init_field_btns() {
    max_btn.addEventListener("click", set_max_tiers);
    min_btn.addEventListener("click", set_min_tiers);
    optimal_btn.addEventListener("click", do_optimal);

    for (const button of button_actions.keys()) {
        button.addEventListener("click", clear_btn_action);
    }

    document.addEventListener("click", event => {
        if (!(event.target instanceof Element)) return;

        if (!event.target.closest(".clear-button")) {
            if (active_clear_button !== null) {
                active_clear_button.innerText = "Clear";
                active_clear_button = null;
            }
        }
    });

    for (const [name, el] of tier_inputs) {
        if (name === "Belt") continue;
        el.addEventListener("change", () => {
            update_tier_img(name, el);
        });
    }
}