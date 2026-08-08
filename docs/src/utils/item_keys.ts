import { VariantId, ItemId, ItemKey } from '../data/types.js';



export function make_item_key(item: ItemId, variant: VariantId): ItemKey {
    return `${item}::${variant}`;
}


export function split_item_key(key: ItemKey): [ItemId, VariantId] {
    const [item, variant] = key.split("::") as [ItemId, VariantId];
    return [item, variant];
}