import { output_el } from './dom.js?v=1.0.19';
// Opening / closing a tree changes the page above or below the item that
// was clicked: a combi tree opens above its row, and closing a big tree
// near the bottom makes the page shorter (the browser then scrolls up).
// These keep the clicked item at the same spot on the screen.
let extra = 0; // px of empty room added below the output (see restore)
function set_extra(px) {
    extra = Math.max(0, Math.ceil(px));
    output_el.style.paddingBottom = extra > 0 ? `${extra}px` : "";
}
/** Scroll so `el` is back at `before` (its top on the screen before the change). */
function restore(el, before) {
    if (!el.isConnected)
        return;
    const delta = el.getBoundingClientRect().top - before;
    if (Math.abs(delta) < 0.5)
        return;
    const target = window.scrollY + delta;
    // A tree below was closed and the page is now too short to stay here:
    // add empty room at the bottom (removed again when you scroll back up)
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (target > max)
        set_extra(extra + target - max);
    window.scrollTo(window.scrollX, target);
}
/** Run `change` (opens / closes something) without moving `el` on the screen. */
export function keep_in_place(el, change) {
    const before = el.getBoundingClientRect().top;
    change();
    restore(el, before);
}
/** Drop the added room once it's out of sight; only what's still needed stays. */
function shrink_extra() {
    if (extra === 0)
        return;
    const base = document.documentElement.scrollHeight - extra;
    const needed = window.scrollY + window.innerHeight - base;
    if (needed < extra)
        set_extra(needed);
}
/** New view: no added room. */
export function reset_scroll_room() {
    set_extra(0);
}
export function init_keep_scroll() {
    // <summary> rows: the browser opens / closes the <details> right after
    // the click, so measure now and put the item back before the next paint.
    // (Number taps and drags don't toggle: then nothing moved, nothing happens.)
    output_el.addEventListener("click", (event) => {
        const target = event.target;
        const summary = target?.closest("summary");
        if (!summary || !output_el.contains(summary))
            return;
        const before = summary.getBoundingClientRect().top;
        requestAnimationFrame(() => restore(summary, before));
    }, true);
    window.addEventListener("scroll", shrink_extra, { passive: true });
}
//# sourceMappingURL=keep_scroll.js.map