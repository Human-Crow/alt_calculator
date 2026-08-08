import { VARIANTS, BUILDINGS, ITEMS } from "./nameLists.js";



function createEnum<T extends string>(arr: readonly T[]) {
  return Object.fromEntries(arr.map(v => [v, v])) as {
    [K in T]: K;
  };
}



export const V = createEnum(VARIANTS);
export const B = createEnum(BUILDINGS);
export const I = createEnum(ITEMS);