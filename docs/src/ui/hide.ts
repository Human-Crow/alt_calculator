import { 
    alt_box,
    c_boost_box,
    n_boost_box,
    boosts_btn,
    ratios_btn,
    boost_note,
    alt_div,
    alt_note,
    coal_div,
    coal_note,
    nuclear_div,
    nuclear_note,
    goal_collap,
    ex_collap,
    c_boost_label,
    n_boost_label,
    able_all_btn,
    able_alt_btn,
    able_coal_btn,
    able_nuc_btn
} from "./dom.js";

import { is_mode_goal } from "./solver_mode.js";



function check_enabled(button: HTMLButtonElement) {
    if (button.textContent.toLowerCase().includes("enable")) {
        return true;
    }
    return false;
}

function coal_toggle(hide: boolean) {
    coal_div.classList.toggle("hidden", !hide);
    coal_note.classList.toggle("hidden", hide);
}

function nuclear_toggle(hide: boolean) {
    nuclear_div.classList.toggle("hidden", !hide);
    nuclear_note.classList.toggle("hidden", hide);
}

function boost_toggle(hide: boolean) {
    boosts_btn.classList.toggle("hidden", !hide);
    boost_note.classList.toggle("hidden", !hide);
}



function alt_toggle(hide: boolean) {
    ratios_btn.classList.toggle("hidden", !hide);
    alt_div.classList.toggle("hidden", !hide);
    alt_note.classList.toggle("hidden", hide);
}


function toggle_able_btn(button: HTMLButtonElement, is_enabled: boolean) {
    button.textContent = is_enabled ? "Disable" : "Enable";
}

function toggle_all_able_btn() {
    const enabled = [check_enabled(able_alt_btn)];
    if (!is_mode_goal()) {
        enabled.push(check_enabled(able_coal_btn));
        enabled.push(check_enabled(able_nuc_btn));
    }
    const majority_true =
        enabled.filter(Boolean).length > enabled.length / 2;
    toggle_able_btn(able_all_btn, !majority_true);
}



export function toggle_hide_mode(is_mode_goal: boolean) {
    goal_collap.classList.toggle("hidden", !is_mode_goal);
    ex_collap.classList.toggle("hidden", is_mode_goal);
    c_boost_label.classList.toggle("hidden", is_mode_goal);
    n_boost_label.classList.toggle("hidden", is_mode_goal);
    able_coal_btn.classList.toggle("visible", is_mode_goal);
    able_nuc_btn.classList.toggle("visible", is_mode_goal);
    coal_toggle(!is_mode_goal && c_boost_box.checked);
    nuclear_toggle(!is_mode_goal && n_boost_box.checked);
    boost_toggle(!is_mode_goal && (c_boost_box.checked || n_boost_box.checked));
    toggle_all_able_btn();
}



export function init_hide() {
    alt_box.addEventListener("change", () => {
        toggle_able_btn(able_alt_btn, alt_box.checked);
        alt_toggle(alt_box.checked);
        toggle_all_able_btn();
    });

    c_boost_box.addEventListener("change", () => {
        toggle_able_btn(able_coal_btn, c_boost_box.checked);
        coal_toggle(c_boost_box.checked);
        boost_toggle(c_boost_box.checked || n_boost_box.checked);
        toggle_all_able_btn();
    });

    n_boost_box.addEventListener("change", () => {
        toggle_able_btn(able_nuc_btn, n_boost_box.checked);
        nuclear_toggle(n_boost_box.checked);
        boost_toggle(c_boost_box.checked || n_boost_box.checked);
        toggle_all_able_btn();
    });

    able_alt_btn.addEventListener("click", () => {
        alt_box.checked = !alt_box.checked
        alt_box.dispatchEvent(new Event("change"));
    });

    able_coal_btn.addEventListener("click", () => {
        c_boost_box.checked = !c_boost_box.checked
        c_boost_box.dispatchEvent(new Event("change"));
    });

    able_nuc_btn.addEventListener("click", () => {
        n_boost_box.checked = !n_boost_box.checked
        n_boost_box.dispatchEvent(new Event("change"));
    });

    able_all_btn.addEventListener("click", () => {
        const self_enabled = check_enabled(able_all_btn);
        const alt_enabled = check_enabled(able_alt_btn);
        const coal_enabled = check_enabled(able_coal_btn);
        const nuc_enabled = check_enabled(able_nuc_btn);
        const is_goal = is_mode_goal();
        if (self_enabled) { // disable all
            if (alt_enabled) able_alt_btn.click();
            if (!is_goal) {
                if (coal_enabled) able_coal_btn.click();
                if (nuc_enabled) able_nuc_btn.click();
            }
        } else { // enable all
            if (!alt_enabled) able_alt_btn.click();
            if (!is_goal) {
                if (!coal_enabled) able_coal_btn.click();
                if (!nuc_enabled) able_nuc_btn.click();
            }
        }
    });
}