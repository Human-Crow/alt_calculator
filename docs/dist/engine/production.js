import { is_raw_item } from '../utils/validation.js';
import { get_recipe, get_recipes } from '../utils/get_recipe.js';
import { V, B } from '../data/enums.js';
import { C_BOOST, N_BOOST } from '../data/constants.js';
// #region Tier Factor
function factorMap(value, gen2) {
    return new Map([
        [V.STD, value], [V.ALT, value], [V.GEN1, value], [V.GEN2, gen2]
    ]);
}
const tier_factors = new Map([
    [1, factorMap(1, 1)],
    [2, factorMap(1.5, 2)],
    [3, factorMap(2, 4)],
    [4, factorMap(3, 8)],
    [5, factorMap(4, 10)]
]);
function get_tier_factor(tiers, building, variant = V.STD) {
    const tier = tiers.get(building) ?? 0;
    return (tier == 0) ? 1 : (tier_factors.get(tier)?.get(variant) ?? tier);
}
// #endregion
// #region Speed
function get_efficiency(seconds, tier_factor = 1, boost = 1, freezing = 0) {
    const ticks = seconds / (tier_factor * boost) * 60;
    return ticks / (Math.ceil(ticks) + freezing);
}
export function get_speed(tiers, item_name, variant, boost) {
    if (typeof boost !== "number") {
        boost = boost?.get(variant) ?? 1;
    }
    const recipe = get_recipe(get_recipes(item_name), variant);
    const factor = get_tier_factor(tiers, recipe.building, variant);
    const efficiency = get_efficiency(recipe.seconds, factor, boost);
    const speed = 60 / recipe.seconds * factor * recipe.output * boost * efficiency;
    return speed;
}
// #endregion
// #region Belt & Building Amount
export function get_belt_amount(tiers, items) {
    const speed = tiers.get(B.Belt) ?? 0;
    return items / speed;
}
export function get_build_amount(settings, item_name, variant, amount, is_total = false) {
    const { alt_ratios, coal_fracs, nuclear_fracs, tiers } = settings;
    const amounts = [];
    if (is_raw_item(item_name)) {
        const coal_frac = coal_fracs.get(item_name) ?? 0;
        const nuc_frac = nuclear_fracs.get(item_name) ?? 0;
        const norm_frac = 1 - coal_frac - nuc_frac;
        const norm_speed = get_speed(tiers, item_name, variant);
        const coal_speed = get_speed(tiers, item_name, variant, C_BOOST);
        const nuc_speed = get_speed(tiers, item_name, variant, N_BOOST);
        if (is_total) {
            amounts.push(amount / (norm_speed * norm_frac +
                coal_speed * coal_frac +
                nuc_speed * nuc_frac));
        }
        else {
            amounts.push(norm_frac > 0 ? amount / norm_speed : 0);
            amounts.push(coal_frac > 0 ? amount / coal_speed : 0);
            amounts.push(nuc_frac > 0 ? amount / nuc_speed : 0);
        }
    }
    else if (variant == V.SPLIT || variant == V.ALT) {
        const alt_ratio = alt_ratios.get(item_name) ?? 0;
        const std_ratio = 1 - alt_ratio;
        const std_am = amount / get_speed(tiers, item_name, V.STD);
        const alt_am = amount / get_speed(tiers, item_name, V.ALT);
        if (is_total) {
            amounts.push(std_ratio > 0 ? std_am * std_ratio : 0);
            amounts.push(alt_ratio > 0 ? alt_am * alt_ratio : 0);
        }
        else {
            amounts.push(std_ratio > 0 ? std_am : 0);
            amounts.push(alt_ratio > 0 ? alt_am : 0);
        }
    }
    else {
        amounts.push(amount / get_speed(tiers, item_name, variant));
    }
    return amounts;
}
// #endregion
//# sourceMappingURL=production.js.map