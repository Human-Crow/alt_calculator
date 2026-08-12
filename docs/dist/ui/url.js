import { extractor_inputs, goal_in, item_sel, alt_box, c_boost_box, n_boost_box, gen2_box, mode_btn } from "./dom.js";
import { get_default, get_elem_value } from "./defaults.js";
import { is_mode_goal } from "./solver_mode.js";
import { import_bulk, importing_bulk } from "./bulk.js";
import { update_page } from "./update_page.js";
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
    // General
    mode: "mode_btn",
    item: "item_select",
    alt: "alt_box",
    gen2: "gen2_box",
    // Goal Mode only
    goal: "goal_in",
    // Resource Mode only
    cbst: "c_boost_box",
    nbst: "n_boost_box",
    wd: "Wood_Log_EX",
    st: "Stone_EX",
    ir: "Iron_Ore_EX",
    cp: "Copper_Ore_EX",
    cl: "Coal_EX",
    wr: "Wolframite_EX",
    ur: "Uranium_Ore_EX"
};
const goal_order = [
    "mode", "item", "alt", "gen2",
    "goal"
];
const resource_order = [
    "mode", "item", "alt", "gen2",
    "cbst", "nbst",
    "wd", "st", "ir", "cp", "cl", "wr", "ur"
];
function get_html_id(url_id) {
    const html_id = id_map[url_id];
    if (html_id === undefined) {
        throw new Error("URL id not in map!");
    }
    return html_id;
}
function url_has_param(url_id) {
    const params = new URLSearchParams(window.location.search);
    return params.has(url_id);
}
function get_url_param(url_id) {
    const params = new URLSearchParams(window.location.search);
    const value = params.get(url_id);
    return value || "";
}
function refresh_url() {
    const url = new URL(window.location.href);
    const ordered_params = new URLSearchParams();
    const order = is_mode_goal() ? goal_order : resource_order;
    for (const url_id of order) {
        const html_id = get_html_id(url_id);
        const value = get_elem_value(html_id);
        const default_val = get_default(html_id);
        const isDefault = value === default_val ||
            (default_val === "" && value === "0");
        if (!isDefault) {
            ordered_params.set(url_id, value);
        }
    }
    window.history.replaceState({}, '', `${url.origin}${url.pathname}?${ordered_params.toString()}`);
}
function clear_url() {
    const url = new URL(window.location.href);
    window.history.replaceState({}, '', `${url.origin}${url.pathname}`);
}
function update_url_param(url_id) {
    if (importing_bulk)
        return;
    const url = new URL(window.location.href);
    const params = url.searchParams;
    const html_id = get_html_id(url_id);
    const el_value = get_elem_value(html_id);
    if (params.get(url_id) === el_value) {
        return;
    }
    refresh_url();
}
function add_listeners() {
    for (const [name, elem] of extractor_inputs) {
        elem.addEventListener("change", () => {
            const url_id = url_map[name];
            if (!url_id) {
                throw new Error("Could not find url id!");
            }
            update_url_param(url_id);
        });
    }
    goal_in.addEventListener("change", () => {
        update_url_param("goal");
    });
    item_sel.addEventListener("change", () => {
        update_url_param("item");
    });
    alt_box.addEventListener("change", () => {
        update_url_param("alt");
    });
    c_boost_box.addEventListener("change", () => {
        update_url_param("cbst");
    });
    n_boost_box.addEventListener("change", () => {
        update_url_param("nbst");
    });
    gen2_box.addEventListener("change", () => {
        update_url_param("gen2");
    });
    mode_btn.addEventListener("click", () => {
        update_url_param("mode");
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
    const bulk_str = get_url_param("bulk");
    if (bulk_str) {
        import_bulk(bulk_str);
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
            const default_mode = get_elem_value("mode_btn");
            if (default_mode === undefined) {
                throw new Error("ID not in defaults!");
            }
            if (mode_val != default_mode) {
                update_page(mode_btn);
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
            update_page(item_sel);
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
                    update_page(checkbox);
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