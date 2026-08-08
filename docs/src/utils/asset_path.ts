import { VariantId, ItemId, BuildMap } from '../data/types.js';
import { get_recipe, get_recipes } from './get_recipe.js';



export function get_asset(name: string): string {
    return `assets/${name}.png`;
}


export function get_tier_asset(
    tiers: BuildMap,
    item_name: ItemId, 
    variant: VariantId
): string {
    const recipe = get_recipe(get_recipes(item_name), variant);
    let name = recipe.building;
    const tier = tiers.get(name);
    if (tier) {
        name += `_${tier}`;
    }
    return get_asset(name);
}