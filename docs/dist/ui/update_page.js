import { html_ids } from "./bulk.js";
import { output_el } from "./dom.js";
import { is_approximate, is_coal_approx, is_nuclear_approx } from "./hide.js";
import { boost_note, c_boost_note, n_boost_note } from "./dom.js";
export function update_page(el, eventInitDict) {
    output_el.innerHTML = "";
    if (el instanceof HTMLInputElement || el instanceof HTMLSelectElement) {
        el.dispatchEvent(new Event("change", eventInitDict));
    }
    else if (el instanceof HTMLButtonElement) {
        el.dispatchEvent(new Event("click", eventInitDict));
    }
    c_boost_note.classList.toggle("hidden", !is_coal_approx());
    n_boost_note.classList.toggle("hidden", !is_nuclear_approx());
    boost_note.classList.toggle("hidden", !is_approximate());
}
export function init_update_page() {
    for (const html_id of html_ids) {
        if (html_id === "rounded_box")
            continue;
        const el = document.getElementById(html_id);
        if (!el)
            continue;
        const action = el instanceof HTMLButtonElement ? "click" : "change";
        el.addEventListener(action, () => {
            update_page();
        });
    }
}
//# sourceMappingURL=update_page.js.map