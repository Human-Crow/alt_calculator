import { html_ids } from "./bulk.js";

export const default_values = new Map<string, string>();

export function get_btn_value(el: HTMLButtonElement) {
    const text = el.textContent ?? "";
    return text.split(" ")[0] ?? text;
}

function capture_defaults() {
    for (const html_id of html_ids) {
        const el = document.getElementById(html_id);
        if (!el) {continue;}

        if (el instanceof HTMLInputElement && el.type === "checkbox") {
            default_values.set(html_id, el.checked ? "1" : "0");
        } else if (el instanceof HTMLInputElement || el instanceof HTMLSelectElement) {
            default_values.set(html_id, el.value);
        } else if (el instanceof HTMLButtonElement) {
            default_values.set(html_id, get_btn_value(el));
        }
    }
}

export function init_defaults() {
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", capture_defaults);
    } else {
        capture_defaults();
    }
}
