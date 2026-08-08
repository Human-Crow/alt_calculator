import { ItemId, Settings, NumberRec } from '../data/types.js';
import { V, I } from '../data/enums.js';
import { is_item_id } from '../utils/validation.js';
import {
    tier_inputs,
    alt_inputs,
    cpp_in,
    coal_inputs,
    npp_in,
    nuclear_inputs,
    item_sel,
    goal_in,
    extractor_inputs,
    gen2_box,
    rounded_box,
    alt_box,
    c_boost_box,
    n_boost_box
} from './dom.js'

import { 
    resource_solver, 
    get_alt_ratios, 
    get_resource_boosts, 
    goal_solver
} from '../engine/solver.js';

import { is_mode_goal } from './solver_mode.js';



function get_value(el: HTMLInputElement): number | undefined {
    const value = el.value;
    if (value === "") return undefined;

    const num = Number(value);
    if (Number.isNaN(num)) return undefined;
    
    return num;
}


function get_number_map<K>(
    inputs: Map<K, HTMLInputElement>,
    disabled: boolean = false
): Map<K, number> {
    const map = new Map<K, number>();

    for (const [id, el] of inputs) {
        if (disabled) {
            map.set(id, 0);
        } else {
            const value = get_value(el);
            if (typeof value === "number") {
                map.set(id, value);
            }
        }
    }
    return map;
}


function get_selected_item(select_elem: HTMLSelectElement): ItemId {
    const item = select_elem.value;
    if (!is_item_id(item)) {
        throw new Error(`'${item}' is an invalid item!`);
    }
    return item;
}


export function get_settings(): Settings {
    const is_goal = is_mode_goal();
    const disable_coal = !c_boost_box.checked || is_goal;
    const disable_nuclear = !n_boost_box.checked || is_goal;

    const settings: Settings = {
        tiers        : get_number_map(tier_inputs),
        alt_ratios   : get_number_map(alt_inputs, !alt_box.checked),
        coal_pp      : get_value(cpp_in),
        coal_fracs   : get_number_map(coal_inputs, disable_coal),
        nuclear_pp   : get_value(npp_in),
        nuclear_fracs: get_number_map(nuclear_inputs, disable_nuclear),
        is_goal      : is_goal,
        selected_item: get_selected_item(item_sel),
        goal_amount  : get_value(goal_in) || 0,
        extractors   : get_number_map(extractor_inputs, is_goal),
        gen          : gen2_box.checked ? V.GEN2 : V.GEN1,
        is_rounded   : rounded_box.checked
    };
    return settings;
}


export async function update_settings(settings: Settings): Promise<Settings> {
    const {is_goal, selected_item} = settings;

    let solution: NumberRec;
    const new_settings = { ...settings };

    if (is_goal) {
        solution = await goal_solver(settings);
        
    } else {
        solution = await resource_solver(settings);
        const new_fracs = get_resource_boosts(solution);
        new_settings.coal_fracs = new_fracs.coal_fracs;
        new_settings.nuclear_fracs = new_fracs.nuclear_fracs;
        new_settings.goal_amount = solution[selected_item] ?? 0;
    }

    new_settings.alt_ratios = get_alt_ratios(solution);
    new_settings.coal_pp = solution[I.Coal_Power_Plant] ?? 0;
    new_settings.nuclear_pp = solution[I.Nuclear_Power_Plant] ?? 0;

    return new_settings;
}
