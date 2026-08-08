import { BuildingId, ItemId, VariantId } from './types.js';


export class Item {
    constructor(
        public amount: number,
        public name: ItemId
    ) {}
}


export class Recipe {
    constructor(
        public output: number, 
        public seconds: number, 
        public building: BuildingId, 
        public materials: Item[]
    ) {}
}

export type RecipeMap   = Map<VariantId, Recipe>;