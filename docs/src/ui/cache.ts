import { build_full_tree } from '../engine/tree.js';
import { get_settings, update_settings } from './settings.js';
import { get_bulk_key } from './bulk.js';
import {
    Settings, RecipeNode
} from '../data/types.js';



type CacheEntry<T> = {
    bulk_key: string;
    value: T;
};


let settings_cache: CacheEntry<Settings> | undefined;
let tree_cache: CacheEntry<RecipeNode[]> | undefined;

const view_cache = new Map<string, CacheEntry<HTMLElement>>();



export async function get_cached_settings(): Promise<Settings> {
    const settings = get_settings();
    const bulk_key = get_bulk_key();
    if (
        settings_cache === undefined ||
        settings_cache.bulk_key !== bulk_key
    ) {
        settings_cache = {
            bulk_key,
            value: await update_settings(settings),
        };
    }
    settings_cache.value.is_rounded = settings.is_rounded;
    return settings_cache.value;
}


async function get_cached_tree(): Promise<RecipeNode[]> {
    const bulk_key = get_bulk_key();
    if (
        tree_cache === undefined ||
        tree_cache.bulk_key !== bulk_key
    ) {
        const settings = await get_cached_settings();
        tree_cache = {
            bulk_key,
            value: build_full_tree(settings),
        };
    }
    return tree_cache.value;
}



export async function get_cached_view(
    key: string,
    render: (settings: Settings, tree: RecipeNode[]) => HTMLElement
): Promise<HTMLElement> {

    const bulk_key = get_bulk_key();
    const cached = view_cache.get(key);
    if (cached?.bulk_key === bulk_key) {
        return cached.value;
    }

    const settings = await get_cached_settings();
    const tree = await get_cached_tree();
    const value = render(settings, tree);
    view_cache.set(key, {bulk_key, value});
    console.log("created new",key)

    return value;
}