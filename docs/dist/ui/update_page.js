import { html_ids } from "./bulk.js";
import { output_el } from "./dom.js";
export function update_page(el, eventInitDict) {
    output_el.innerHTML = "";
    if (el instanceof HTMLInputElement || el instanceof HTMLSelectElement) {
        el.dispatchEvent(new Event("change", eventInitDict));
    }
    else if (el instanceof HTMLButtonElement) {
        el.dispatchEvent(new Event("click", eventInitDict));
    }
}
export function init_update_page() {
    for (const html_id of html_ids) {
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