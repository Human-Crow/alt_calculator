import { rounded_box } from "./dom.js";
export function create_num_el(is_rounded, amount, f_formatter, r_formatter, wrapper_tag, color) {
    const el = document.createElement("span");
    el.className = "number" + (color ? " " + color : "");
    el.dataset.full = f_formatter(amount);
    el.dataset.rounded = String(r_formatter(amount));
    el.textContent = is_rounded ? el.dataset.rounded : el.dataset.full;
    el.dataset.showingFull = is_rounded ? "0" : "1";
    if (wrapper_tag) {
        const wrapper = document.createElement(wrapper_tag);
        wrapper.appendChild(el);
        return wrapper;
    }
    return el;
}
function toggle_number_view() {
    const mode = rounded_box.checked ? "rounded" : "full";
    const els = document.querySelectorAll(".number");
    els.forEach(el => {
        el.textContent =
            mode === "full"
                ? (el.dataset.full ?? "")
                : (el.dataset.rounded ?? "");
    });
}
function get_number_el(target) {
    if (!target)
        return null;
    if (!(target instanceof Element))
        return null;
    return target.closest(".number") || null;
}
export function click_number(event) {
    const el = get_number_el(event.target);
    if (!el)
        return;
    event.preventDefault();
    event.stopPropagation();
    const full = el.dataset.full;
    if (!full)
        return;
    if (el.dataset.showingFull === "1") {
        el.textContent = el.dataset.rounded ?? "";
        el.dataset.showingFull = "0";
    }
    else {
        el.textContent = full;
        el.dataset.showingFull = "1";
    }
}
export function init_number() {
    rounded_box.addEventListener("change", toggle_number_view);
}
//# sourceMappingURL=numbers.js.map