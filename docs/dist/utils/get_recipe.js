import { RECIPES } from '../data/recipes.js';
export function get_recipes(item_name) {
    const recipes = RECIPES.get(item_name);
    if (!recipes) {
        throw new Error(`'${item_name}' is not in recipes!`);
    }
    return recipes;
}
export function get_recipe(recipes, variant) {
    const recipe = recipes.get(variant);
    if (!recipe) {
        throw new Error(`'${variant}' is not in recipe!`);
    }
    return recipe;
}
//# sourceMappingURL=get_recipe.js.map