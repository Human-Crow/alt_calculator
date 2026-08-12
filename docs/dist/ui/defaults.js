import { html_ids } from "./bulk.js";
const default_values = new Map();
export function get_default(html_id) {
    const default_val = default_values.get(html_id);
    if (default_val === undefined) {
        throw new Error("ID not in defaults!");
    }
    return default_val;
}
export function get_elem_value(el) {
    if (typeof el === "string") {
        const real_el = document.getElementById(el);
        if (!real_el)
            throw new Error(`Element '${el}' does not exist!`);
        el = real_el;
    }
    if (el instanceof HTMLInputElement && el.type === "checkbox") {
        return el.checked ? "1" : "0";
    }
    else if (el instanceof HTMLInputElement || el instanceof HTMLSelectElement) {
        return el.value;
    }
    else if (el instanceof HTMLButtonElement) {
        const text = el.textContent ?? "";
        return text.split(" ")[0] ?? text;
    }
    throw new Error("Unsupported HTMLElement!");
}
function capture_defaults() {
    for (const html_id of html_ids) {
        default_values.set(html_id, get_elem_value(html_id));
    }
}
export function init_defaults() {
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", capture_defaults);
    }
    else {
        capture_defaults();
    }
}
//# sourceMappingURL=defaults.js.map