import { split_item_key } from '../utils/item_keys.js';
import { get_build_amount, get_belt_amount } from '../engine/production.js';
import { I, V } from '../data/enums.js';
import {
    ItemId,
    VariantMap,
    ItemMap,
    SplitMap,
    MaterialMap,
    RecipeNode,
    Settings
} from '../data/types.js';



// #region Sort

const var_priority: VariantMap = new Map([
    [V.SPLIT, 1],
    [V.STD, 2],
    [V.ALT, 3],
    [V.GEN1, 4],
    [V.GEN2, 5]
]);


export function sort_list(list: RecipeNode[], first_name?: ItemId): RecipeNode[] {
    const raw_priority: ItemMap = new Map([
        [I.Wood_Log, 1],
        [I.Stone, 2],
        [I.Iron_Ore, 3],
        [I.Copper_Ore, 4],
        [I.Coal, 5],
        [I.Wolframite, 6],
        [I.Uranium_Ore, 7]
    ]);
    if (first_name) {
        raw_priority.set(first_name, 0);
    }

    const sorted = list.sort((a, b) => {

        const nameA = a.item_name;
        const nameB = b.item_name;
        const rankA = raw_priority.get(nameA) ?? 999;
        const rankB = raw_priority.get(nameB) ?? 999;
        if (rankA !== rankB) {
            return rankA - rankB;
        }
        if (nameA !== nameB) {
            return nameA.localeCompare(nameB);
        }

        const varA = a.variant;
        const varB = b.variant;
        const varRankA = var_priority.get(varA) ?? 999;
        const varRankB = var_priority.get(varB) ?? 999;
        if (varRankA !== varRankB) {
            return varRankA - varRankB;
        }
        return varA.localeCompare(varB);
    });

    return sorted;
}


export function sort_mat_dep(list: RecipeNode[], first_name?: ItemId): RecipeNode[] {
    const raw_priority: ItemMap = new Map();
    if (first_name) {
        raw_priority.set(first_name, 0);
    }

    const sorted = list.sort((a, b) => {

        const nameA = a.item_name;
        const nameB = b.item_name;
        const rankA = raw_priority.get(nameA) ?? 999;
        const rankB = raw_priority.get(nameB) ?? 999;
        if (rankA !== rankB) {
            return rankA - rankB;
        }
        if (nameA !== nameB) {
            return nameA.localeCompare(nameB);
        }

        const varA = a.variant;
        const varB = b.variant;
        const varRankA = var_priority.get(varA) ?? 999;
        const varRankB = var_priority.get(varB) ?? 999;
        if (varRankA !== varRankB) {
            return varRankA - varRankB;
        }
        return varA.localeCompare(varB);
    })
    .map(node => {
        const children = node.children;
        if (children?.length) {
            sort_mat_dep(children);
        }
        return node;
    });

    return sorted;
}

// #endregion



// #region Convert

export function convert_list(split_map: SplitMap): RecipeNode[] {
    const result: RecipeNode[] = [];
    for (const [key, amount] of split_map) {
        const [item_name, variant] = split_item_key(key);
        result.push({
            item_amount: amount, 
            item_name: item_name, 
            variant: variant, 
            children: []
        })
    }
    return result;
}


export function convert_mat_dep(material_map: MaterialMap): RecipeNode[] {
    const result: RecipeNode[] = [];
    for (const [key, [amount, children_map]] of material_map) {
        const [item_name, variant] = split_item_key(key);
        result.push({
            item_amount: amount, 
            item_name: item_name, 
            variant: variant, 
            children: convert_list(children_map)
        })
    }
    return result;
}

// #endregion



// #region Add info

function add_node_info(
    settings: Settings, 
    node: RecipeNode,
    is_total: boolean,
    parent_amount?: number
): RecipeNode {

    const {item_name, variant, item_amount, children} = node;
    const fraction = (parent_amount === undefined)
        ? 1
        : item_amount / parent_amount;

    return {
        item_name: item_name,
        variant: variant,
        item_amount: item_amount,

        build_amounts: get_build_amount(
            settings, item_name, variant, item_amount,
            is_total
        ),
        belt_amount: get_belt_amount(settings.tiers, item_amount),
        fraction,

        children: children.map(child =>
            add_node_info(settings, child, false, item_amount)
        )
    };
}


export function add_tree_info(
    settings: Settings, 
    tree: RecipeNode[],
    is_total: boolean
): RecipeNode[] {
    const info_tree: RecipeNode[] = [];
    for (const node of tree) {
        info_tree.push(add_node_info(settings, node, is_total));
    }
    return info_tree;
}

// #endregion