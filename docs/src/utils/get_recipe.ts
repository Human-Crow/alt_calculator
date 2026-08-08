import { VariantId, ItemId } from '../data/types.js';
import { Recipe, RecipeMap } from '../data/models.js';
import { RECIPES } from '../data/recipes.js';



export function get_recipes(item_name: ItemId): RecipeMap {
    const recipes = RECIPES.get(item_name);
    if (!recipes) {
        throw new Error(`'${item_name}' is not in recipes!`);
    }
    return recipes;
}


export function get_recipe(recipes: RecipeMap, variant: VariantId): Recipe {
    const recipe = recipes.get(variant);
    if (!recipe) {
        throw new Error(`'${variant}' is not in recipe!`);
    }
    return recipe;
}