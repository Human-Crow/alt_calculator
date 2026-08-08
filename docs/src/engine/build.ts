import { make_item_key } from '../utils/item_keys.js';
import { walk_tree } from './walk_tree.js';
import { ALT_ITEMS } from '../data/nameLists.js';
import { V } from '../data/enums.js';
import { ItemKey, SplitMap, RecipeNode, ItemMap } from '../data/types.js';
import { MaterialMap } from '../data/types.js';





export function build_list(tree: RecipeNode[]): SplitMap {
    const split_map: SplitMap = new Map();
    for (const {item_amount, item_name, variant} of walk_tree(tree)) {
        const item_key = make_item_key(item_name, variant);
        split_map.set(item_key, (split_map.get(item_key) ?? 0) + item_amount);
    }

    for (const name of ALT_ITEMS) {
        const key = make_item_key(name, V.SPLIT);
        if (split_map.has(key)) {
            const std = split_map.get(make_item_key(name, V.STD)) ?? 0;
            const alt = split_map.get(make_item_key(name, V.ALT)) ?? 0;
            split_map.set(key, std + alt);
        }
    }

    return split_map;
}


function get_material(map: MaterialMap, key: ItemKey): [number, SplitMap] {
    let entry = map.get(key);
    if (!entry) {
        entry = [0, new Map()];
        map.set(key, entry);
    }
    return entry;
}


export function build_materials(tree: RecipeNode[], alt_ratios: ItemMap): MaterialMap {
    let map: Map<ItemKey, [number, Map<ItemKey, number>]> = new Map();

    for (const {item_amount, item_name, variant, children} of walk_tree(tree)) {
        if (variant == V.SPLIT) {continue;}

        const parent_key = make_item_key(item_name, variant);
        const parent = get_material(map, parent_key);
        parent[0] += item_amount;

        for (const {item_amount, item_name, variant} of children) {
            const ratio = alt_ratios.get(item_name) ?? 0;
            const split = (ratio > 0 && ratio < 1);
            const child_key = make_item_key(item_name, split? V.SPLIT : variant);
            const prev = parent[1].get(child_key) ?? 0;
            parent[1].set(child_key, prev + item_amount);
        }
    }
    return map;
}


export function build_dependents(tree: RecipeNode[], alt_ratios: ItemMap): MaterialMap {
    let map: Map<ItemKey, [number, Map<ItemKey, number>]> = new Map();

    for (const {item_name, variant, children} of walk_tree(tree)) {
        const parent_key = make_item_key(item_name, variant);

        for (const {item_amount, item_name, variant} of children) {
            const ratio = alt_ratios.get(item_name) ?? 0;
            const split = (ratio > 0 && ratio < 1);
            const child_key = make_item_key(item_name, split? V.SPLIT : variant);
            
            const child = get_material(map, child_key);
            child[0] += item_amount;

            const prev = child[1].get(parent_key) ?? 0;
            child[1].set(parent_key, prev + item_amount);
        }
    }
    return map;
}