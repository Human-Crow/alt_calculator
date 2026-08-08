import { extractor_inputs, goal_in, item_sel, alt_box, c_boost_box, n_boost_box, gen2_box, mode_btn, bulk_in, import_btn } from "./dom.js";
import { default_values, get_btn_value } from "./defaults.js";
const url_map = {
    Wood_Log: "wd",
    Stone: "st",
    Iron_Ore: "ir",
    Copper_Ore: "cp",
    Coal: "cl",
    Wolframite: "wr",
    Uranium_Ore: "ur"
};
const id_map = {
    mode: "mode_btn",
    alt: "alt_box",
    cbst: "c_boost_box",
    nbst: "n_boost_box",
    gen2: "gen2_box",
    item: "item_select",
    goal: "goal_in",
    wd: "Wood_Log_EX",
    st: "Stone_EX",
    ir: "Iron_Ore_EX",
    cp: "Copper_Ore_EX",
    cl: "Coal_EX",
    wr: "Wolframite_EX",
    ur: "Uranium_Ore_EX"
};
const order = Object.keys(id_map);
function get_url_param(target_key) {
    const url_vars = window.location.search.substring(1).split('&');
    for (const url_var of url_vars) {
        const [key, value] = url_var.split('=');
        if (key === target_key) {
            return value || "";
        }
    }
    return "";
}
function update_url_param(param, value) {
    const url = new URL(window.location.href);
    const params = url.searchParams;
    if (params.get(param) === value) {
        return;
    }
    const id = id_map[param];
    if (id === undefined) {
        throw new Error("URL param not in map!");
    }
    const default_val = default_values.get(id);
    if (default_val === undefined) {
        throw new Error("ID not in defaults!");
    }
    const isDefault = value === default_val ||
        (default_val === "" && value === "0");
    if (isDefault) {
        params.delete(param);
    }
    else {
        params.set(param, value);
    }
    const ordered_params = new URLSearchParams();
    for (let key of order) {
        const param_key = params.get(key);
        if (param_key) {
            ordered_params.set(key, param_key);
        }
    }
    window.history.replaceState({}, '', `${url.origin}${url.pathname}?${ordered_params.toString()}`);
}
function clear_url() {
    const url = new URL(window.location.href);
    window.history.replaceState({}, '', `${url.origin}${url.pathname}`);
}
function add_listeners() {
    for (const [name, elem] of extractor_inputs) {
        elem.addEventListener("change", () => {
            const url_id = url_map[name];
            if (!url_id) {
                throw new Error("Could not find url id!");
            }
            update_url_param(url_id, elem.value);
        });
    }
    goal_in.addEventListener("change", () => {
        update_url_param("goal", goal_in.value);
    });
    item_sel.addEventListener("change", () => {
        update_url_param("item", item_sel.value);
    });
    alt_box.addEventListener("change", () => {
        update_url_param("alt", alt_box.checked ? "1" : "0");
    });
    c_boost_box.addEventListener("change", () => {
        update_url_param("cbst", c_boost_box.checked ? "1" : "0");
    });
    n_boost_box.addEventListener("change", () => {
        update_url_param("nbst", n_boost_box.checked ? "1" : "0");
    });
    gen2_box.addEventListener("change", () => {
        update_url_param("gen2", gen2_box.checked ? "1" : "0");
    });
    mode_btn.addEventListener("click", () => {
        update_url_param("mode", get_btn_value(mode_btn));
    });
}
function proper(str, separator = '') {
    if (!str) {
        return str;
    }
    str = str.toLowerCase();
    if (separator) {
        let words = [];
        for (let word of str.split(separator)) {
            words.push(word.charAt(0).toUpperCase() + word.slice(1));
        }
        return words.join(separator);
    }
    else {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}
function show_warning(message) {
    const warning = document.createElement("div");
    warning.textContent = message;
    warning.style.cssText = `
        color: white; 
        font-weight: bold; 
        position: fixed; 
        text-align: center;
        top: 10px; 
        left: 50%; 
        transform: translateX(-50%); 
        background:rgb(180, 0, 0); 
        padding: 10px; 
        border: 1px solid white;
        border-radius: 12px;
        box-shadow: 0px 0px 10px rgb(0, 0, 0);
    `;
    // Find the last warning element
    const warnings = document.querySelectorAll(".warning-message");
    if (warnings.length > 0) {
        const lastWarning = warnings[warnings.length - 1]; // Get last warning
        if (lastWarning) {
            const lastWarningRect = lastWarning.getBoundingClientRect(); // Get position
            warning.style.top = `${lastWarningRect.bottom / 1.5 - 14.28454342 + 5}px`; // Adjust position
        }
    }
    // Add class for identification
    warning.classList.add("warning-message");
    document.body.appendChild(warning);
    // Remove warning when user clicks anywhere on the page
    document.addEventListener("click", () => warning.remove(), { once: true });
}
function set_from_url() {
    const bulk_val = get_url_param("bulk");
    if (bulk_val) {
        bulk_in.value = bulk_val;
        clear_url();
        import_btn.click();
        bulk_in.value = "";
        return;
    }
    goal_in.value = get_url_param("goal");
    for (const [name, elem] of extractor_inputs) {
        const url_id = url_map[name];
        if (!url_id) {
            throw new Error("Could not find url id!");
        }
        elem.value = get_url_param(url_id);
    }
    const mode_val = proper(get_url_param("mode"));
    if (mode_val) {
        if (["Goal", "Resource"].includes(mode_val)) {
            const default_mode = default_values.get("mode_btn");
            if (default_mode === undefined) {
                throw new Error("ID not in defaults!");
            }
            if (mode_val != default_mode) {
                mode_btn.click();
            }
        }
        else {
            show_warning(`"${mode_val}" is not a valid mode!`);
        }
    }
    const url_item = proper(get_url_param("item"), '_');
    if (url_item) {
        if ([...item_sel.options].some(option => option.value === url_item)) {
            item_sel.value = url_item;
            item_sel.dispatchEvent(new Event("change"));
        }
        else {
            show_warning(`"${url_item}" is not a valid item!`);
        }
    }
    for (const box of ["alt", "cbst", "nbst", "gen2"]) {
        const url_param = get_url_param(box);
        if (url_param) {
            if (["0", "1"].includes(url_param)) {
                const checkbox = document.getElementById(`${box}_box`);
                if (checkbox instanceof HTMLInputElement) {
                    checkbox.checked = (url_param == "1") ? true : false;
                    checkbox.dispatchEvent(new Event("change"));
                }
            }
            else {
                show_warning(`${box} should be 0 or 1!`);
            }
        }
    }
}
export function init_url() {
    add_listeners();
    set_from_url();
}
//# sourceMappingURL=url.js.map