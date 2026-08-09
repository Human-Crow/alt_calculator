import { 
    VARIANTS, 
    BUILDINGS, 
    ITEMS, 
    ALT_ITEMS, 
    RAW_ITEMS
} from "./name_lists.js";


export type VariantId   = typeof VARIANTS [number];
export type BuildingId  = typeof BUILDINGS[number];
export type ItemId      = typeof ITEMS    [number];
export type AltItemId   = typeof ALT_ITEMS[number];
export type RawItemId   = typeof RAW_ITEMS[number];

export type ItemKey     = `${ItemId}::${VariantId}`;
export type Pair = [number, number];
export type NumberRec = Record<string, number>;

export type VariantMap  = Map<VariantId, number>;
export type ItemMap     = Map<ItemId   , number>;
export type SplitMap    = Map<ItemKey, number>;
export type MaterialMap = Map<ItemKey, [number, SplitMap]>;
export type BuildMap    = Map<BuildingId, number>;
export type AltMap      = Map<AltItemId, HTMLInputElement>;
export type RawMap      = Map<RawItemId, HTMLInputElement>;
export type TierMap     = Map<BuildingId, HTMLInputElement>;

export type RecipeNode = {
    item_name: ItemId;
    variant: VariantId;
    item_amount: number;
    children: RecipeNode[];

    build_amounts?: number[];
    belt_amount?: number;
    fraction?: number;
};


export type Settings = {
    selected_item: ItemId;
    goal_amount  : number;
    gen          : VariantId;

    tiers        : BuildMap;
    extractors   : ItemMap;
    alt_ratios   : ItemMap;
    coal_fracs   : ItemMap;
    nuclear_fracs: ItemMap;

    coal_pp      : number | undefined;
    nuclear_pp   : number | undefined;
    
    is_goal      : boolean;
    is_rounded   : boolean;
};

export type RunContext = {
    amount: number;
    item: ItemId;
    alt_ratios: ItemMap;
    gen: VariantId;
    cpp: number;
    npp: number;
};