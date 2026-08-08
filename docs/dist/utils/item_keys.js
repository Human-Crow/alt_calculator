export function make_item_key(item, variant) {
    return `${item}::${variant}`;
}
export function split_item_key(key) {
    const [item, variant] = key.split("::");
    return [item, variant];
}
//# sourceMappingURL=item_keys.js.map