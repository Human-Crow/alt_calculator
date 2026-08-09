import { get_recipe, get_recipes } from './get_recipe.js';
import { ITEMS, BUILDINGS, TIER_BUILDINGS } from '../data/name_lists.js';
const assets = new Set(["Fraction", "Unknown"]);
for (const item of ITEMS) {
    assets.add(item);
}
for (const building of BUILDINGS) {
    if (TIER_BUILDINGS.has(building)) {
        const maxTier = building === "Extractor" ? 5 : 4;
        for (let tier = 1; tier <= maxTier; tier++) {
            assets.add(`${building}_${tier}`);
        }
    }
    else {
        assets.add(building);
    }
}
export function get_asset(name) {
    return assets.has(name)
        ? `assets/${name}.png`
        : "assets/Unknown.png";
}
export function get_tier_asset(tiers, item_name, variant) {
    const recipe = get_recipe(get_recipes(item_name), variant);
    let name = recipe.building;
    const tier = tiers.get(name);
    if (tier) {
        name += `_${tier}`;
    }
    return get_asset(name);
}
//# sourceMappingURL=asset_path.js.map