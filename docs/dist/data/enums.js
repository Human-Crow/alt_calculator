import { VARIANTS, BUILDINGS, ITEMS } from "./name_lists.js";
function createEnum(arr) {
    return Object.fromEntries(arr.map(v => [v, v]));
}
export const V = createEnum(VARIANTS);
export const B = createEnum(BUILDINGS);
export const I = createEnum(ITEMS);
//# sourceMappingURL=enums.js.map