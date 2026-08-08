function* walk_nodes(node) {
    yield node;
    const { children } = node;
    for (const child of children) {
        yield* walk_nodes(child);
    }
}
export function* walk_tree(tree) {
    for (const nodes of tree) {
        yield* walk_nodes(nodes);
    }
}
//# sourceMappingURL=walk_tree.js.map