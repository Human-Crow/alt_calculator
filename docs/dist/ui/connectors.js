// Draws curved connector lines (optionally with arrow heads) between an
// item's icon and the icons of its children, as an SVG overlay on #output.
const SVG_NS = "http://www.w3.org/2000/svg";
const groups = new WeakMap();
const RADIUS = 9; // corner curve radius
const GAP = 3; // space between a line end and an icon
const ARROW = 8; // arrow head length; the line stops where the head starts
/** Register connectors from `src` to each of `dsts`, stored on `owner`. */
export function add_connectors(owner, kind, src, dsts) {
    const valid = dsts.filter((d) => d !== null);
    if (!src || valid.length === 0)
        return;
    // One element can own several groups (combi: materials + dependents)
    let el = owner;
    if (groups.has(owner)) {
        el = document.createElement("span");
        el.className = "hidden";
        owner.appendChild(el);
    }
    el.classList.add("conn-group");
    groups.set(el, { kind, src, dsts: valid });
}
/** Icon of a rendered row / node (first image inside it). */
export function icon_of(el) {
    return el.querySelector(".tree-img, .item-img");
}
function is_shown(el, root) {
    if (el.getClientRects().length === 0)
        return false;
    // A closed <details> may keep layout boxes for its content
    // (content-visibility: hidden), so check the ancestors explicitly.
    // Only the <summary> of a closed <details> is visible.
    let child = el;
    let parent = el.parentElement;
    while (parent && parent !== root) {
        if (parent instanceof HTMLDetailsElement &&
            !parent.open &&
            !(child instanceof HTMLElement && child.tagName === "SUMMARY")) {
            return false;
        }
        child = parent;
        parent = parent.parentElement;
    }
    return true;
}
function make_path(d, arrow) {
    const path = document.createElementNS(SVG_NS, "path");
    path.setAttribute("d", d);
    path.setAttribute("class", "conn-line");
    if (arrow)
        path.setAttribute("marker-end", "url(#conn-arrow)");
    return path;
}
function draw_group(root, svg, group, ox, oy) {
    const { kind, src, dsts } = group;
    if (!is_shown(src, root))
        return;
    const s = src.getBoundingClientRect();
    const x = s.left + s.width / 2 - ox; // vertical rail under/over the item icon
    const s_top = s.top - oy;
    const s_bot = s.bottom - oy;
    for (const dst of dsts) {
        if (!is_shown(dst, root))
            continue;
        const d = dst.getBoundingClientRect();
        const end_x = d.left - ox - GAP; // just left of the child icon
        const y = d.top + d.height / 2 - oy; // child icon centre line
        if (kind === "mat-above") {
            // Child above the item: from the child, left, curve down into the item
            const y_end = s_top - GAP - ARROW;
            const r = Math.max(0, Math.min(RADIUS, end_x - x, y_end - y));
            svg.appendChild(make_path(`M ${end_x} ${y} H ${x + r} Q ${x} ${y} ${x} ${y + r} V ${Math.max(y_end, y + r)}`, true));
            continue;
        }
        // Child below the item
        const y_start = s_bot + GAP;
        if (kind === "mat") {
            // From the child, left, curve up into the item
            const y_end = y_start + ARROW;
            const r = Math.max(0, Math.min(RADIUS, end_x - x, y - y_end));
            svg.appendChild(make_path(`M ${end_x} ${y} H ${x + r} Q ${x} ${y} ${x} ${y - r} V ${Math.min(y_end, y - r)}`, true));
        }
        else {
            // From the item, down, curve right into the child
            const arrow = kind === "dep";
            const x_end = arrow ? end_x - ARROW : end_x;
            const r = Math.max(0, Math.min(RADIUS, x_end - x, y - y_start));
            svg.appendChild(make_path(`M ${x} ${y_start} V ${y - r} Q ${x} ${y} ${x + r} ${y} H ${Math.max(x_end, x + r)}`, arrow));
        }
    }
}
function make_svg() {
    const svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("class", "conn-svg");
    svg.setAttribute("aria-hidden", "true");
    svg.innerHTML = `
        <defs>
            <marker id="conn-arrow" viewBox="0 0 10 10" refX="0" refY="5"
                markerWidth="${ARROW}" markerHeight="${ARROW}" markerUnits="userSpaceOnUse"
                orient="auto">
                <path d="M 0 0 L 10 5 L 0 10 z" class="conn-head"/>
            </marker>
        </defs>`;
    return svg;
}
/** (Re)draw all connectors inside `root`. */
export function draw_connectors(root) {
    let svg = root.querySelector(":scope > svg.conn-svg");
    const owners = root.querySelectorAll(".conn-group");
    if (owners.length === 0) {
        svg?.remove();
        return;
    }
    if (!svg) {
        svg = make_svg();
    }
    // Keep it as the last child so it never counts as "content"
    if (svg.parentNode !== root || svg !== root.lastElementChild) {
        root.appendChild(svg);
    }
    for (const old of svg.querySelectorAll("path.conn-line"))
        old.remove();
    // Shrink first, so the old overlay size doesn't keep the
    // output from getting smaller after a collapse
    svg.setAttribute("width", "0");
    svg.setAttribute("height", "0");
    const o = root.getBoundingClientRect();
    svg.setAttribute("width", String(root.scrollWidth));
    svg.setAttribute("height", String(root.scrollHeight));
    for (const owner of owners) {
        const group = groups.get(owner);
        if (group)
            draw_group(root, svg, group, o.left, o.top);
    }
}
/** Keep connectors in sync with layout changes (collapse, resize, fonts). */
export function init_connectors(root) {
    let queued = false;
    const redraw = () => {
        if (queued)
            return;
        queued = true;
        requestAnimationFrame(() => {
            queued = false;
            draw_connectors(root);
        });
    };
    new ResizeObserver(redraw).observe(root);
    // Any item opened / closed, or materials hidden (combi)
    new MutationObserver(redraw).observe(root, {
        subtree: true,
        attributes: true,
        attributeFilter: ["open", "class"]
    });
    root.addEventListener("toggle", redraw, true); // <details> open/close
    window.addEventListener("resize", redraw);
    document.fonts?.ready.then(redraw);
}
//# sourceMappingURL=connectors.js.map