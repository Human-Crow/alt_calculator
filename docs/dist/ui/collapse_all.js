import { output_el, collapse_btn, level_bar } from './dom.js';
function get_details() {
    return [...output_el.querySelectorAll("details")];
}
function is_tree_view() {
    return output_el.querySelector('.tree[data-kind="tree"]') !== null;
}
// #region Levels (tree view)
/** Level of an item: 1 for the top items, 2 for their children, ... */
function get_level(details) {
    let level = 1;
    let el = details.parentElement;
    while (el && el !== output_el) {
        if (el instanceof HTMLDetailsElement)
            level++;
        el = el.parentElement;
    }
    return level;
}
function get_levels() {
    return new Map(get_details().map(d => [d, get_level(d)]));
}
/** Show the tree up to `level`: items above it open, the rest closed. */
function show_level(level) {
    for (const [details, l] of get_levels()) {
        details.open = l < level;
    }
    update_controls();
}
/** The level currently shown, or 0 when items were opened / closed by hand. */
function current_level(levels, max) {
    for (let level = 1; level <= max; level++) {
        let match = true;
        for (const [details, l] of levels) {
            // Items on the deepest level have no children, so their state doesn't matter
            if (l === max)
                continue;
            if (details.open !== (l < level)) {
                match = false;
                break;
            }
        }
        if (match)
            return level;
    }
    return 0;
}
function update_level_bar() {
    const levels = get_levels();
    const max = Math.max(0, ...levels.values());
    // Rebuild the buttons when the number of levels changed
    if (level_bar.childElementCount !== max) {
        level_bar.replaceChildren();
        for (let level = 1; level <= max; level++) {
            const btn = document.createElement("button");
            btn.className = "level-btn";
            btn.textContent = String(level);
            btn.title = `Show ${level} level${level > 1 ? "s" : ""}`;
            btn.addEventListener("click", () => show_level(level));
            level_bar.appendChild(btn);
        }
        level_bar.classList.toggle("many", max > 9);
    }
    const active = current_level(levels, max);
    [...level_bar.children].forEach((btn, i) => {
        btn.classList.toggle("active", i + 1 === active);
    });
}
// #endregion
/** Show the level bar (tree view) or the collapse button (other views). */
function update_controls() {
    const tree = is_tree_view();
    level_bar.classList.toggle("hidden", !tree);
    collapse_btn.classList.toggle("hidden", tree);
    if (tree) {
        update_level_bar();
        return;
    }
    // Only useful for views that can collapse (materials, dependents, combi)
    const details = get_details();
    collapse_btn.style.visibility = details.length > 0 ? "visible" : "hidden";
    const any_open = details.some(d => d.open);
    collapse_btn.textContent = any_open ? "Collapse All" : "Expand All";
}
function toggle_all() {
    const details = get_details();
    const open = !details.some(d => d.open);
    for (const d of details) {
        d.open = open;
    }
    update_controls();
}
export function init_collapse_all() {
    collapse_btn.addEventListener("click", toggle_all);
    // Batch updates: closing a whole tree fires one toggle event per item
    let queued = false;
    const queue_update = () => {
        if (queued)
            return;
        queued = true;
        requestAnimationFrame(() => {
            queued = false;
            update_controls();
        });
    };
    // Keep the controls right when single items are opened / closed by hand
    output_el.addEventListener("toggle", queue_update, true);
    // ...and when the view changes or the output is cleared
    new MutationObserver(queue_update).observe(output_el, { childList: true });
    update_controls();
}
//# sourceMappingURL=collapse_all.js.map