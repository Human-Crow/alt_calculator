import { ITEMS, ALT_ITEMS, RAW_ITEMS } from '../data/nameLists.js';
const ITEM_SET = new Set(ITEMS);
const RAW_ITEM_SET = new Set(RAW_ITEMS);
const ALT_ITEM_SET = new Set(ALT_ITEMS);
export function is_item_id(value, throw_error = false) {
    const result = ITEM_SET.has(value);
    if (!result && throw_error) {
        throw new Error(`'${value}' is not an item!`);
    }
    return result;
}
export function is_raw_item(value, throw_error = false) {
    const result = RAW_ITEM_SET.has(value);
    if (!result && throw_error) {
        throw new Error(`'${value}' is not a raw item!`);
    }
    return result;
}
export function is_alt_item(value, throw_error = false) {
    const result = ALT_ITEM_SET.has(value);
    if (!result && throw_error) {
        throw new Error(`'${value}' is not an Alt item!`);
    }
    return result;
}
//# sourceMappingURL=validation.js.map