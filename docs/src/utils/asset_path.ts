import { VariantId, ItemId, BuildMap } from '../data/types.js';
import { get_recipe, get_recipes } from './get_recipe.js';
import { ITEMS, BUILDINGS, TIER_BUILDINGS } from '../data/name_lists.js';



const assets = new Set<string>(["Fraction", "Unknown"]);

for (const item of ITEMS) {
    assets.add(item);
}
for (const building of BUILDINGS) {
    if (TIER_BUILDINGS.has(building)) {
        const maxTier = building === "Extractor" ? 5 : 4;
        for (let tier = 1; tier <= maxTier; tier++) {
            assets.add(`${building}_${tier}`);
        }
    } else {
        assets.add(building);
    }
}

export function get_asset(name: string): string {
    return assets.has(name)
        ? `assets/${name}.png`
        : "assets/Unknown.png";
}

export function get_tier_asset(
    tiers: BuildMap,
    item_name: ItemId, 
    variant: VariantId
): string {
    const recipe = get_recipe(get_recipes(item_name), variant);
    let name = recipe.building;
    if (assets.has(name)) return get_asset(name);

    const tier = tiers.get(name) ?? 1;
    return get_asset(`${name}_${tier}`);
}