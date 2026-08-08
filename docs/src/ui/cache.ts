import { build_full_tree } from '../engine/tree.js';
import { get_settings, update_settings } from './settings.js';
import { bulk_key } from './bulk.js';
import {
    Settings, RecipeNode
} from '../data/types.js';


let cached_key: string = "";
let cached_settings: Settings | undefined = undefined;
let cached_tree: RecipeNode[] | undefined = undefined;


export async function get_cached() {
    const settings = get_settings();
    const key = bulk_key();
    if (key != cached_key) {
        cached_key = key;
        cached_settings = await update_settings(settings);
        cached_tree = build_full_tree(cached_settings);
    }
    if (cached_settings === undefined || cached_tree  === undefined) {
        throw new Error("Nothing is cached!");
    }
    cached_settings.is_rounded = settings.is_rounded;
    return {settings: cached_settings, tree: cached_tree};
}