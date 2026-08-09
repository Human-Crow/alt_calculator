import { ItemId, RawItemId, AltItemId } from '../data/types.js';
import { ITEMS, ALT_ITEMS, RAW_ITEMS } from '../data/name_lists.js';




const ITEM_SET     = new Set(ITEMS    );
const RAW_ITEM_SET = new Set(RAW_ITEMS);
const ALT_ITEM_SET = new Set(ALT_ITEMS);


export function is_item_id(value: string, throw_error: boolean = false): value is ItemId {
    const result = ITEM_SET.has(value as ItemId);
    if (!result && throw_error) {
        throw new Error(`'${value}' is not an item!`);
    }
    return result;
}


export function is_raw_item(value: string, throw_error: boolean = false): value is RawItemId {
    const result = RAW_ITEM_SET.has(value as RawItemId);
    if (!result && throw_error) {
        throw new Error(`'${value}' is not a raw item!`);
    }
    return result;
}


export function is_alt_item(value: string, throw_error: boolean = false): value is AltItemId {
    const result = ALT_ITEM_SET.has(value as AltItemId);
    if (!result && throw_error) {
        throw new Error(`'${value}' is not an Alt item!`);
    }
    return result;
}