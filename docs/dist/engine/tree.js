import { get_recipe, get_recipes } from '../utils/get_recipe.js';
import { is_raw_item } from '../utils/validation.js';
import { make_item_key, split_item_key } from '../utils/item_keys.js';
import { V, I } from '../data/enums.js';
import { roundN } from '../utils/math.js';
function build_tree(amount, item_name, alt_ratios, gen, split_nodes) {
    if (is_raw_item(item_name)) {
        return {
            item_amount: amount,
            item_name: item_name,
            variant: gen,
            children: []
        };
    }
    const recipes = get_recipes(item_name);
    const alt_ratio = alt_ratios.get(item_name) ?? 0;
    if (alt_ratio > 0 && alt_ratio < 1) {
        const entries = [
            [1 - alt_ratio, V.STD], [alt_ratio, V.ALT]
        ];
        for (const [ratio, variant] of entries) {
            const item_key = make_item_key(item_name, variant);
            split_nodes.set(item_key, (split_nodes.get(item_key) ?? 0) + amount * ratio);
            const recipe = get_recipe(recipes, variant);
            for (const item of recipe.materials) {
                const specific_amount = amount * ratio * item.amount / recipe.output;
                //if (roundN(specific_amount) <= 0) continue;
                build_tree(specific_amount, item.name, alt_ratios, gen, split_nodes);
            }
        }
        return {
            item_amount: amount,
            item_name: item_name,
            variant: V.SPLIT,
            children: []
        };
    }
    const variant = alt_ratio === 1 ? V.ALT : V.STD;
    const recipe = get_recipe(recipes, variant);
    const nodes = recipe.materials.flatMap((item) => {
        const specific_amount = amount * item.amount / recipe.output;
        //if (roundN(specific_amount) <= 0) return [];
        return [
            build_tree(specific_amount, item.name, alt_ratios, gen, split_nodes)
        ];
    });
    return {
        item_amount: amount,
        item_name: item_name,
        variant: variant,
        children: nodes
    };
}
function build_split_branches(alt_ratios, gen, split_nodes) {
    const branches = [];
    for (const [item_key, amount] of split_nodes) {
        if (roundN(amount) <= 0)
            continue;
        const [item_name, variant] = split_item_key(item_key);
        const recipe = get_recipe(get_recipes(item_name), variant);
        const nodes = recipe.materials.flatMap((item) => {
            const specific_amount = amount * item.amount / recipe.output;
            //if (roundN(specific_amount) <= 0) return [];
            return [
                build_tree(specific_amount, item.name, alt_ratios, gen, new Map())
            ];
        });
        branches.push({
            item_amount: amount,
            item_name: item_name,
            variant: variant,
            children: nodes
        });
    }
    return branches;
}
export function build_full_tree(settings) {
    const { selected_item, goal_amount, coal_pp, nuclear_pp, alt_ratios, gen } = settings;
    const split_nodes = new Map();
    const mainTree = build_tree(goal_amount, selected_item, alt_ratios, gen, split_nodes);
    const result = [mainTree];
    if (coal_pp) {
        const cpp_tree = build_tree(coal_pp, I.Coal_Power_Plant, alt_ratios, gen, split_nodes);
        result.push(cpp_tree);
    }
    if (nuclear_pp) {
        const npp_tree = build_tree(nuclear_pp, I.Nuclear_Power_Plant, alt_ratios, gen, split_nodes);
        result.push(npp_tree);
    }
    const split_branches = build_split_branches(alt_ratios, gen, split_nodes);
    return [...result, ...split_branches];
}
//# sourceMappingURL=tree.js.map