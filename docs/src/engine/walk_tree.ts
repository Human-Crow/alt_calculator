import { RecipeNode } from '../data/types.js';



function* walk_nodes(node: RecipeNode): Generator<RecipeNode> {
    yield node;

    const {children} = node;
    for (const child of children) {
        yield* walk_nodes(child);
    }
}


export function* walk_tree(tree: RecipeNode[]): Generator<RecipeNode> {
    for (const nodes of tree) {
        yield* walk_nodes(nodes);
    }
}