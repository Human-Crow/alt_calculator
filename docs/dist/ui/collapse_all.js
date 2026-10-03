import { output_el, collapse_btn } from './dom.js';
function get_details() {
    return [...output_el.querySelectorAll("details")];
}
/** Match the button label (and visibility) to the current view. */
export function update_collapse_btn() {
    const details = get_details();
    // Only useful for views that can collapse (tree, materials, ...)
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
    update_collapse_btn();
}
export function init_collapse_all() {
    collapse_btn.addEventListener("click", toggle_all);
    // Keep the label right when single items are opened / closed by hand
    output_el.addEventListener("toggle", update_collapse_btn, true);
    // ...and when the view changes or the output is cleared
    new MutationObserver(update_collapse_btn).observe(output_el, { childList: true });
    update_collapse_btn();
}
//# sourceMappingURL=collapse_all.js.map