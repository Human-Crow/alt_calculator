// cd alt_calculator; if ($?) { npx tsc --watch }
import GLPK from './glpk.js';
//#region Constants
const glpk = await GLPK();
const clear_button1 = document.getElementById("clear_button1");
const clear_button2 = document.getElementById("clear_button2");
const score_button = document.getElementById("score_button");
const alt_recipe_button = document.getElementById("alt_recipe_button");
const res_boosts_button = document.getElementById("res_boosts_button");
const bulk_button = document.getElementById("bulk_button");
const limit_box = document.getElementById("limit_box");
const target_box = document.getElementById("target_box");
const split_box = document.getElementById("split_box");
const alt_box = document.getElementById("alt_box");
const boost_box = document.getElementById("boost_box");
const gen2_box = document.getElementById("gen2_box");
const boost_note = document.getElementById("boost_note");
const zero_box = document.getElementById("zero_box");
const ratio_box = document.getElementById("ratio_box");
const resource_fields = document.getElementById("resource_fields");
const goal_fields = document.getElementById("goal_fields");
const boost_field = document.getElementById("boost_field");
const gen2_field = document.getElementById("gen2_field");
const goal = document.getElementById("goal");
const wood = document.getElementById("wood");
const stone = document.getElementById("stone");
const iron = document.getElementById("iron");
const copper = document.getElementById("copper");
const coal = document.getElementById("coal");
const wolframite = document.getElementById("wolframite");
const uranium = document.getElementById("uranium");
const output = document.getElementById("output");
const RESOURCES = [
    { key: "Wood_Log", i: 0, field: wood, url: "wd" },
    { key: "Stone", i: 1, field: stone, url: "st" },
    { key: "Iron_Ore", i: 2, field: iron, url: "ir" },
    { key: "Copper_Ore", i: 3, field: copper, url: "cp" },
    { key: "Coal", i: 4, field: coal, url: "cl" },
    { key: "Wolframite", i: 5, field: wolframite, url: "wr" },
    { key: "Uranium_Ore", i: 6, field: uranium, url: "ur" }
];
const ALT_RECIPES = [
    "Concrete", "Copper_Wire", "Electric_Motor", "Electromagnet",
    "Industrial_Frame", "Iron_Gear", "Logic_Circuit", "Rotor", "Steel",
    "Super_Computer", "Tungsten_Carbide", "Turbocharger"
];
//#endregion
//#region Element functions
makeFakeSelect({
    realSelect: target_box,
    fakeSelect: document.getElementById("fake_target_box"),
    withImages: true
});
makeFakeSelect({
    realSelect: limit_box,
    fakeSelect: document.getElementById("fake_limit_box"),
    withImages: false
});
for (const res of RESOURCES) {
    res.field.onchange = function () {
        output.replaceChildren();
        update_url_param(res.url, res.field.value);
        if (goal.value != "") {
            goal.value = "";
            update_url_param("goal", "");
        }
    };
}
wood.onpaste = function (ev) { wood.blur(); paste_insert(ev); };
goal.onchange = function () {
    output.replaceChildren();
    update_url_param("goal", goal.value);
    for (const res of RESOURCES) {
        if (res.field.value != "") {
            res.field.value = "";
            update_url_param(res.url, "");
        }
    }
};
function hide_boost_elems() {
    const isGoal = (limit_box.value === "Goal");
    res_boosts_button.classList.toggle("hidden", !boost_box.checked || isGoal);
    boost_note.textContent = (boost_box.checked && limit_box.value === "Resource")
        ? "The calculations are\nbased on an approximation"
        : "";
}
limit_box.onchange = function () {
    output.replaceChildren();
    const isGoal = (limit_box.value === "Goal");
    // Show one section, hide the other
    resource_fields.classList.toggle("hidden", isGoal);
    goal_fields.classList.toggle("hidden", !isGoal);
    if (isGoal) {
        hide_boost_elems();
    }
};
target_box.onchange = function () {
    output.replaceChildren();
    update_url_param("item", target_box.value === "Earth_Token" ? "" : target_box.value);
};
alt_box.onchange = function () {
    output.replaceChildren();
    alt_recipe_button.classList.toggle("hidden", !alt_box.checked);
    update_url_param("alt", alt_box.checked ? 1 : 0);
};
boost_box.onchange = function () {
    output.replaceChildren();
    hide_boost_elems();
    update_url_param("boost", boost_box.checked ? 1 : 0);
};
gen2_box.onchange = function () {
    output.replaceChildren();
    update_url_param("gen2", gen2_box.checked ? 1 : 0);
};
alt_recipe_button.onclick = function () { show_recipe_ratios(); };
res_boosts_button.onclick = function () { show_resource_boosts(); };
score_button.onclick = async function () {
    let limit = (limit_box.value === "Goal") ? Number(goal.value) : extractor_values();
    show_result(await SeedSolver.solve(limit, alt_box.checked, boost_box.checked, gen2_box.checked), ratio_box.checked, zero_box.checked);
};
let clear_state = false;
document.onclick = function (event) {
    let clear_button = (limit_box.value === "Goal") ? clear_button2 : clear_button1;
    clear_button.innerText = "Clear Fields";
    if (event.target === clear_button) {
        if (clear_state) {
            for (const res of RESOURCES) {
                res.field.value = "";
                res.field.dispatchEvent(new Event("change"));
            }
            goal.value = "";
            goal.dispatchEvent(new Event("change"));
        }
        else {
            clear_button.innerText = "Tap again";
        }
        clear_state = !clear_state;
    }
    else {
        clear_state = false;
    }
};
async function get_bulk() {
    split_box.checked = true;
    const id_map = {
        mode: "limit_box",
        item: "target_box",
        goal: "goal",
        gen2: "gen2_box",
        e_wd: "wood",
        e_st: "stone",
        e_ir: "iron",
        e_cp: "copper",
        e_cl: "coal",
        e_wr: "wolframite",
        e_ur: "uranium"
    };
    const alt_map = {
        a_cw: "Copper_Wire",
        a_ig: "Iron_Gear",
        a_st: "Steel",
        a_cc: "Concrete",
        a_el: "Electromagnet",
        a_lc: "Logic_Circuit",
        a_em: "Electric_Motor",
        a_if: "Industrial_Frame",
        a_tu: "Turbocharger",
        a_sc: "Super_Computer",
        a_tc: "Tungsten_Carbide",
        a_ro: "Rotor"
    };
    const boost_map = {
        Coal: ["c_cl", "n_cl"],
        Copper_Ore: ["c_cp", "n_cp"],
        Iron_Ore: ["c_ir", "n_ir"],
        Stone: ["c_st", "n_st"],
        Uranium_Ore: ["c_ur", "n_ur"],
        Wolframite: ["c_wr", "n_wr"],
        Wood_Log: ["c_wd", "n_wd"]
    };
    const result = [
        "t_ws:4",
        "t_fn:4",
        "t_ms:4",
        "t_fg:4",
        "t_if:4",
        "t_mf:4",
        "t_ex:5",
        "t_bs:480"
    ];
    for (const [short_id, html_id] of Object.entries(id_map)) {
        const el = document.getElementById(html_id);
        if (!el)
            continue;
        let value;
        if (el instanceof HTMLInputElement && el.type === "checkbox") {
            value = el.checked ? 1 : 0;
        }
        else if (el instanceof HTMLInputElement) {
            value = el.value;
        }
        else if (el instanceof HTMLSelectElement) {
            value = el.value;
        }
        else {
            continue;
        }
        if (value === "" || value === "0" || value === 0)
            continue;
        result.push(`${short_id}:${value}`);
    }
    const resources = extractor_values();
    const limit = (limit_box.value === "Goal") ? Number(goal.value) : resources;
    const all_items = await SeedSolver.solve(limit, alt_box.checked, boost_box.checked, gen2_box.checked);
    const alt_ratios = get_alt_ratios(all_items);
    for (const [short_id, alt_id] of Object.entries(alt_map)) {
        const value = alt_ratios[alt_id] || 0;
        if (value > 0) {
            result.push(`${short_id}:${value}`);
        }
    }
    const cpp = all_items["Coal_Power_Plant"] || 0;
    if (cpp) {
        result.push(`c_pp:${cpp}`);
    }
    const npp = (all_items["Nuclear_Fuel_Cell"] || 0) / SeedSolver.NPP_RATE;
    if (npp) {
        result.push(`n_pp:${npp}`);
    }
    const res_boosts = get_resource_boosts(all_items, resources);
    for (const [key, [coalPer, nucPer, total]] of Object.entries(res_boosts)) {
        const [c_key, n_key] = boost_map[key];
        if (coalPer) {
            result.push(`${c_key}:${coalPer}`);
        }
        if (nucPer) {
            result.push(`${n_key}:${nucPer}`);
        }
    }
    return result.join(",");
}
bulk_button.onclick = async function copy_bulk() {
    const bulk = await get_bulk();
    navigator.clipboard.writeText(bulk).then(() => {
        const btn = document.querySelector("button[onclick='copy_bulk()']");
        if (!btn)
            return;
        const old = btn.textContent;
        btn.textContent = "Copied!";
        setTimeout(() => {
            btn.textContent = old;
        }, 1000);
    });
};
//#endregion
//#region Solver function
const SeedSolver = {
    EX_RATE: [30, 150],
    EX_RATE_UR: [10, 50],
    NPP_RATE: 0.5,
    CPP_RATE: 10,
    NUC_BOOST: [1.4 * (3600 / 3612), 1.6],
    COAL_BOOST: 1.2,
    EX_NPP: [44, 15.7],
    EX_CPP: [11, 4],
    EX_NPP_UR: [8.5, 3.9],
    EX_CPP_UR: [6.5, 3.0],
    solve: async function (limit, alt, boost, gen_2) {
        let mode;
        if (typeof limit === "number") {
            mode = "goal";
        }
        else if (Array.isArray(limit)) {
            mode = "max";
        }
        else {
            throw new TypeError("Invalid type for 'limit'");
        }
        let Wood_Extractors, Stone_Extractors, Iron_Extractors, Copper_Extractors;
        let Coal_Extractors, Wolframite_Extractors, Uranium_Extractors;
        if (mode === "max") {
            Wood_Extractors = limit[0];
            Stone_Extractors = limit[1];
            Iron_Extractors = limit[2];
            Copper_Extractors = limit[3];
            Coal_Extractors = limit[4];
            Wolframite_Extractors = limit[5];
            Uranium_Extractors = limit[6];
        }
        let max_frac = gen_2 ? 1.00 : 0.95;
        const boost_cons_gen_1 = [
            {
                vars: [
                    { name: 'Wood_Nuc_Ex', coef: 1.0 },
                ],
                bnds: { type: glpk.GLP_UP, ub: Wood_Extractors * 0.9, lb: 0.0 },
            },
            {
                vars: [
                    { name: 'Stone_Nuc_Ex', coef: 1.0 },
                ],
                bnds: { type: glpk.GLP_UP, ub: Stone_Extractors * 0.9, lb: 0.0 },
            },
            {
                vars: [
                    { name: 'Iron_Nuc_Ex', coef: 1.0 },
                ],
                bnds: { type: glpk.GLP_UP, ub: Iron_Extractors * 0.9, lb: 0.0 },
            },
            {
                vars: [
                    { name: 'Copper_Nuc_Ex', coef: 1.0 },
                ],
                bnds: { type: glpk.GLP_UP, ub: Copper_Extractors * 0.9, lb: 0.0 },
            },
            {
                vars: [
                    { name: 'Coal_Nuc_Ex', coef: 1.0 },
                ],
                bnds: { type: glpk.GLP_UP, ub: Coal_Extractors * 0.9, lb: 0.0 },
            },
            {
                vars: [
                    { name: 'Wolframite_Nuc_Ex', coef: 1.0 },
                ],
                bnds: { type: glpk.GLP_UP, ub: Wolframite_Extractors * 0.9, lb: 0.0 },
            },
            {
                vars: [
                    { name: 'Uranium_Nuc_Ex', coef: 1.0 },
                ],
                bnds: { type: glpk.GLP_UP, ub: Uranium_Extractors * 0.2, lb: 0.0 },
            },
        ];
        let boost_cons = [
            {
                vars: [
                    { name: 'Wood_Coal_Ex', coef: 1.0 },
                    { name: 'Wood_Nuc_Ex', coef: 1.0 },
                ],
                bnds: { type: glpk.GLP_UP, ub: Wood_Extractors * max_frac, lb: 0.0 },
            },
            {
                vars: [
                    { name: 'Stone_Coal_Ex', coef: 1.0 },
                    { name: 'Stone_Nuc_Ex', coef: 1.0 },
                ],
                bnds: { type: glpk.GLP_UP, ub: Stone_Extractors * max_frac, lb: 0.0 },
            },
            {
                vars: [
                    { name: 'Iron_Coal_Ex', coef: 1.0 },
                    { name: 'Iron_Nuc_Ex', coef: 1.0 },
                ],
                bnds: { type: glpk.GLP_UP, ub: Iron_Extractors * max_frac, lb: 0.0 },
            },
            {
                vars: [
                    { name: 'Copper_Coal_Ex', coef: 1.0 },
                    { name: 'Copper_Nuc_Ex', coef: 1.0 },
                ],
                bnds: { type: glpk.GLP_UP, ub: Copper_Extractors * max_frac, lb: 0.0 },
            },
            {
                vars: [
                    { name: 'Coal_Coal_Ex', coef: 1.0 },
                    { name: 'Coal_Nuc_Ex', coef: 1.0 },
                ],
                bnds: { type: glpk.GLP_UP, ub: Coal_Extractors * max_frac, lb: 0.0 },
            },
            {
                vars: [
                    { name: 'Wolframite_Coal_Ex', coef: 1.0 },
                    { name: 'Wolframite_Nuc_Ex', coef: 1.0 },
                ],
                bnds: { type: glpk.GLP_UP, ub: Wolframite_Extractors * max_frac, lb: 0.0 },
            },
            {
                vars: [
                    { name: 'Uranium_Coal_Ex', coef: 1.0 },
                    { name: 'Uranium_Nuc_Ex', coef: 1.0 },
                ],
                bnds: { type: glpk.GLP_UP, ub: Uranium_Extractors * max_frac, lb: 0.0 },
            },
            {
                vars: [
                    { name: 'Coal_Power_Plant', coef: 1.0 },
                    { name: 'Wood_Coal_Ex', coef: -1.0 / this.EX_CPP[+gen_2] },
                    { name: 'Stone_Coal_Ex', coef: -1.0 / this.EX_CPP[+gen_2] },
                    { name: 'Iron_Coal_Ex', coef: -1.0 / this.EX_CPP[+gen_2] },
                    { name: 'Copper_Coal_Ex', coef: -1.0 / this.EX_CPP[+gen_2] },
                    { name: 'Coal_Coal_Ex', coef: -1.0 / this.EX_CPP[+gen_2] },
                    { name: 'Wolframite_Coal_Ex', coef: -1.0 / this.EX_CPP[+gen_2] },
                    { name: 'Uranium_Coal_Ex', coef: -1.0 / this.EX_CPP_UR[+gen_2] },
                ],
                bnds: { type: glpk.GLP_FX, ub: 0.0, lb: 0.0 },
            },
            {
                vars: [
                    { name: 'Nuclear_Fuel_Cell', coef: 1.0 },
                    { name: 'Wood_Nuc_Ex', coef: -this.NPP_RATE / this.EX_NPP[+gen_2] },
                    { name: 'Stone_Nuc_Ex', coef: -this.NPP_RATE / this.EX_NPP[+gen_2] },
                    { name: 'Iron_Nuc_Ex', coef: -this.NPP_RATE / this.EX_NPP[+gen_2] },
                    { name: 'Copper_Nuc_Ex', coef: -this.NPP_RATE / this.EX_NPP[+gen_2] },
                    { name: 'Coal_Nuc_Ex', coef: -this.NPP_RATE / this.EX_NPP[+gen_2] },
                    { name: 'Wolframite_Nuc_Ex', coef: -this.NPP_RATE / this.EX_NPP[+gen_2] },
                    { name: 'Uranium_Nuc_Ex', coef: -this.NPP_RATE / this.EX_NPP_UR[+gen_2] },
                ],
                bnds: { type: glpk.GLP_FX, ub: 0.0, lb: 0.0 },
            },
            {
                vars: [
                    { name: 'Wood_Log', coef: 1.0 },
                    { name: 'Wood_Coal_Ex', coef: (1 - this.COAL_BOOST) * this.EX_RATE[+gen_2] },
                    { name: 'Wood_Nuc_Ex', coef: (1 - this.NUC_BOOST[+gen_2]) * this.EX_RATE[+gen_2] },
                ],
                bnds: { type: glpk.GLP_UP, ub: Wood_Extractors * this.EX_RATE[+gen_2], lb: 0.0 },
            },
            {
                vars: [
                    { name: 'Stone', coef: 1.0 },
                    { name: 'Stone_Coal_Ex', coef: (1 - this.COAL_BOOST) * this.EX_RATE[+gen_2] },
                    { name: 'Stone_Nuc_Ex', coef: (1 - this.NUC_BOOST[+gen_2]) * this.EX_RATE[+gen_2] },
                ],
                bnds: { type: glpk.GLP_UP, ub: Stone_Extractors * this.EX_RATE[+gen_2], lb: 0.0 },
            },
            {
                vars: [
                    { name: 'Iron_Ore', coef: 1.0 },
                    { name: 'Iron_Coal_Ex', coef: (1 - this.COAL_BOOST) * this.EX_RATE[+gen_2] },
                    { name: 'Iron_Nuc_Ex', coef: (1 - this.NUC_BOOST[+gen_2]) * this.EX_RATE[+gen_2] },
                ],
                bnds: { type: glpk.GLP_UP, ub: Iron_Extractors * this.EX_RATE[+gen_2], lb: 0.0 },
            },
            {
                vars: [
                    { name: 'Copper_Ore', coef: 1.0 },
                    { name: 'Copper_Coal_Ex', coef: (1 - this.COAL_BOOST) * this.EX_RATE[+gen_2] },
                    { name: 'Copper_Nuc_Ex', coef: (1 - this.NUC_BOOST[+gen_2]) * this.EX_RATE[+gen_2] },
                ],
                bnds: { type: glpk.GLP_UP, ub: Copper_Extractors * this.EX_RATE[+gen_2], lb: 0.0 },
            },
            {
                vars: [
                    { name: 'Coal', coef: 1.0 },
                    { name: 'Coal_RAW', coef: -1.0 },
                    { name: 'Coal_Power_Plant', coef: -1.0 * this.CPP_RATE },
                ],
                bnds: { type: glpk.GLP_FX, ub: 0.0, lb: 0.0 },
            },
            {
                vars: [
                    { name: 'Coal', coef: 1.0 },
                    { name: 'Coal_Coal_Ex', coef: (1 - this.COAL_BOOST) * this.EX_RATE[+gen_2] },
                    { name: 'Coal_Nuc_Ex', coef: (1 - this.NUC_BOOST[+gen_2]) * this.EX_RATE[+gen_2] },
                ],
                bnds: { type: glpk.GLP_UP, ub: Coal_Extractors * this.EX_RATE[+gen_2], lb: 0.0 },
            },
            {
                vars: [
                    { name: 'Wolframite', coef: 1.0 },
                    { name: 'Wolframite_Coal_Ex', coef: (1 - this.COAL_BOOST) * this.EX_RATE[+gen_2] },
                    { name: 'Wolframite_Nuc_Ex', coef: (1 - this.NUC_BOOST[+gen_2]) * this.EX_RATE[+gen_2] },
                ],
                bnds: { type: glpk.GLP_UP, ub: Wolframite_Extractors * this.EX_RATE[+gen_2], lb: 0.0 },
            },
            {
                vars: [
                    { name: 'Uranium_Ore', coef: 1.0 },
                    { name: 'Uranium_Coal_Ex', coef: (1 - this.COAL_BOOST) * this.EX_RATE_UR[+gen_2] },
                    { name: 'Uranium_Nuc_Ex', coef: (1 - this.NUC_BOOST[+gen_2]) * this.EX_RATE_UR[+gen_2] },
                ],
                bnds: { type: glpk.GLP_UP, ub: Uranium_Extractors * this.EX_RATE_UR[+gen_2], lb: 0.0 },
            }
        ];
        if (!gen_2) {
            boost_cons = boost_cons.concat(boost_cons_gen_1);
        }
        const non_boost_cons = [
            {
                vars: [
                    { name: 'Wood_Log', coef: 1.0 },
                ],
                bnds: { type: glpk.GLP_UP, ub: Wood_Extractors * this.EX_RATE[+gen_2], lb: 0.0 },
            },
            {
                vars: [
                    { name: 'Stone', coef: 1.0 },
                ],
                bnds: { type: glpk.GLP_UP, ub: Stone_Extractors * this.EX_RATE[+gen_2], lb: 0.0 },
            },
            {
                vars: [
                    { name: 'Iron_Ore', coef: 1.0 },
                ],
                bnds: { type: glpk.GLP_UP, ub: Iron_Extractors * this.EX_RATE[+gen_2], lb: 0.0 },
            },
            {
                vars: [
                    { name: 'Copper_Ore', coef: 1.0 },
                ],
                bnds: { type: glpk.GLP_UP, ub: Copper_Extractors * this.EX_RATE[+gen_2], lb: 0.0 },
            },
            {
                vars: [
                    { name: 'Coal', coef: 1.0 },
                ],
                bnds: { type: glpk.GLP_UP, ub: Coal_Extractors * this.EX_RATE[+gen_2], lb: 0.0 },
            },
            {
                vars: [
                    { name: 'Coal', coef: 1.0 },
                    { name: 'Coal_RAW', coef: -1.0 },
                ],
                bnds: { type: glpk.GLP_FX, ub: 0.0, lb: 0.0 },
            },
            {
                vars: [
                    { name: 'Wolframite', coef: 1.0 },
                ],
                bnds: { type: glpk.GLP_UP, ub: Wolframite_Extractors * this.EX_RATE[+gen_2], lb: 0.0 },
            },
            {
                vars: [
                    { name: 'Uranium_Ore', coef: 1.0 },
                ],
                bnds: { type: glpk.GLP_UP, ub: Uranium_Extractors * this.EX_RATE_UR[+gen_2], lb: 0.0 },
            }
        ];
        const non_alt_cons = [
            {
                vars: [
                    { name: 'Copper_Wire_ALT', coef: 1.0 },
                ],
                bnds: { type: glpk.GLP_FX, ub: 0.0, lb: 0.0 },
            },
            {
                vars: [
                    { name: 'Super_Computer_ALT', coef: 1.0 },
                ],
                bnds: { type: glpk.GLP_FX, ub: 0.0, lb: 0.0 },
            },
            {
                vars: [
                    { name: 'Turbocharger_ALT', coef: 1.0 },
                ],
                bnds: { type: glpk.GLP_FX, ub: 0.0, lb: 0.0 },
            },
            {
                vars: [
                    { name: 'Logic_Circuit_ALT', coef: 1.0 },
                ],
                bnds: { type: glpk.GLP_FX, ub: 0.0, lb: 0.0 },
            },
            {
                vars: [
                    { name: 'Iron_Gear_ALT', coef: 1.0 },
                ],
                bnds: { type: glpk.GLP_FX, ub: 0.0, lb: 0.0 },
            },
            {
                vars: [
                    { name: 'Steel_ALT', coef: 1.0 },
                ],
                bnds: { type: glpk.GLP_FX, ub: 0.0, lb: 0.0 },
            },
            {
                vars: [
                    { name: 'Industrial_Frame_ALT', coef: 1.0 },
                ],
                bnds: { type: glpk.GLP_FX, ub: 0.0, lb: 0.0 },
            },
            {
                vars: [
                    { name: 'Concrete_ALT', coef: 1.0 },
                ],
                bnds: { type: glpk.GLP_FX, ub: 0.0, lb: 0.0 },
            },
            {
                vars: [
                    { name: 'Electromagnet_ALT', coef: 1.0 },
                ],
                bnds: { type: glpk.GLP_FX, ub: 0.0, lb: 0.0 },
            },
            {
                vars: [
                    { name: 'Electric_Motor_ALT', coef: 1.0 },
                ],
                bnds: { type: glpk.GLP_FX, ub: 0.0, lb: 0.0 },
            },
            {
                vars: [
                    { name: 'Rotor_ALT', coef: 1.0 },
                ],
                bnds: { type: glpk.GLP_FX, ub: 0.0, lb: 0.0 },
            },
            {
                vars: [
                    { name: 'Tungsten_Carbide_ALT', coef: 1.0 },
                ],
                bnds: { type: glpk.GLP_FX, ub: 0.0, lb: 0.0 },
            }
        ];
        const general_cons = [
            {
                vars: [
                    { name: 'Coal', coef: 1.0 },
                    { name: 'Coal_RAW', coef: -1.0 },
                ],
                bnds: { type: glpk.GLP_LO, lb: 0.0 },
            },
            {
                vars: [
                    { name: 'Resource_Sum', coef: 1.0 },
                    { name: 'Wood_Log', coef: -1.0 },
                    { name: 'Stone', coef: -1.0 },
                    { name: 'Iron_Ore', coef: -1.0 },
                    { name: 'Copper_Ore', coef: -1.0 },
                    { name: 'Coal', coef: -1.0 },
                    { name: 'Wolframite', coef: -1.0 },
                    { name: 'Uranium_Ore', coef: -1.0 },
                ],
                bnds: { type: glpk.GLP_FX, ub: 0.0, lb: 0.0 },
            },
            {
                vars: [
                    { name: 'Wood_Log', coef: 1.0 },
                    { name: 'Wood_Plank', coef: -1.0 },
                    { name: 'Graphite', coef: -3.0 },
                ],
                bnds: { type: glpk.GLP_LO, lb: 0.0 },
            },
            {
                vars: [
                    { name: 'Stone', coef: 1.0 },
                    { name: 'Sand', coef: -1.0 },
                    { name: 'Concrete_ALT', coef: -20.0 },
                ],
                bnds: { type: glpk.GLP_LO, lb: 0.0 },
            },
            {
                vars: [
                    { name: 'Iron_Ore', coef: 1.0 },
                    { name: 'Iron_Ingot', coef: -1.0 },
                    { name: 'Steel_STD', coef: -6.0 },
                    { name: 'Steel_ALT', coef: -4.0 },
                ],
                bnds: { type: glpk.GLP_LO, lb: 0.0 },
            },
            {
                vars: [
                    { name: 'Copper_Ore', coef: 1.0 },
                    { name: 'Copper_Ingot', coef: -1.0 },
                ],
                bnds: { type: glpk.GLP_LO, lb: 0.0 },
            },
            {
                vars: [
                    { name: 'Coal_RAW', coef: 1.0 },
                    { name: 'Graphite', coef: -3.0 },
                    { name: 'Steel_ALT', coef: -4.0 },
                ],
                bnds: { type: glpk.GLP_LO, lb: 0.0 },
            },
            {
                vars: [
                    { name: 'Wolframite', coef: 1.0 },
                    { name: 'Tungsten_Ore', coef: -5.0 },
                ],
                bnds: { type: glpk.GLP_LO, lb: 0.0 },
            },
            {
                vars: [
                    { name: 'Uranium_Ore', coef: 1.0 },
                    { name: 'Enriched_Uranium', coef: -30.0 },
                ],
                bnds: { type: glpk.GLP_LO, lb: 0.0 },
            },
            {
                vars: [
                    { name: 'Atomic_Locator', coef: 1.0 },
                    { name: 'Matter_Duplicator', coef: -4.0 },
                ],
                bnds: { type: glpk.GLP_LO, lb: 0.0 },
            },
            {
                vars: [
                    { name: 'Battery', coef: 1.0 },
                    { name: 'Energy_Cube', coef: -2.0 },
                    { name: 'Electric_Motor_STD', coef: -1.0 },
                ],
                bnds: { type: glpk.GLP_LO, lb: 0.0 },
            },
            {
                vars: [
                    { name: 'Carbon_Fiber', coef: 1.0 },
                    { name: 'Nano_Wire', coef: -2.0 },
                    { name: 'Copper_Wire_ALT', coef: -0.125 },
                    { name: 'Industrial_Frame_ALT', coef: -4.0 },
                ],
                bnds: { type: glpk.GLP_LO, lb: 0.0 },
            },
            {
                vars: [
                    { name: 'Computer', coef: 1.0 },
                    { name: 'Stabilizer', coef: -1.0 },
                    { name: 'Super_Computer_STD', coef: -2.0 },
                    { name: 'Super_Computer_ALT', coef: -1.0 },
                    { name: 'Turbocharger_ALT', coef: -1.0 },
                ],
                bnds: { type: glpk.GLP_LO, lb: 0.0 },
            },
            {
                vars: [
                    { name: 'Concrete', coef: 1.0 },
                    { name: 'Concrete_STD', coef: -1.0 },
                    { name: 'Concrete_ALT', coef: -1.0 },
                ],
                bnds: { type: glpk.GLP_FX, ub: 0.0, lb: 0.0 },
            },
            {
                vars: [
                    { name: 'Concrete', coef: 1.0 },
                    { name: 'Industrial_Frame_STD', coef: -6.0 },
                    { name: 'Tank', coef: -4.0 },
                    { name: 'Atomic_Locator', coef: -24.0 },
                ],
                bnds: { type: glpk.GLP_LO, lb: 0.0 },
            },
            {
                vars: [
                    { name: 'Condenser_Lens', coef: 1.0 },
                    { name: 'Electron_Microscope', coef: -4.0 },
                ],
                bnds: { type: glpk.GLP_LO, lb: 0.0 },
            },
            {
                vars: [
                    { name: 'Copper_Ingot', coef: 1.0 },
                    { name: 'Copper_Wire_STD', coef: -1.5 },
                    { name: 'Heat_Sink', coef: -5.0 },
                    { name: 'Rotor_ALT', coef: -18.0 },
                ],
                bnds: { type: glpk.GLP_LO, lb: 0.0 },
            },
            {
                vars: [
                    { name: 'Copper_Wire', coef: 1.0 },
                    { name: 'Copper_Wire_STD', coef: -1.0 },
                    { name: 'Copper_Wire_ALT', coef: -1.0 },
                ],
                bnds: { type: glpk.GLP_FX, ub: 0.0, lb: 0.0 },
            },
            {
                vars: [
                    { name: 'Copper_Wire', coef: 1.0 },
                    { name: 'Electromagnet_STD', coef: -6.0 },
                    { name: 'Logic_Circuit_STD', coef: -3.0 },
                    { name: 'Gyroscope', coef: -12.0 },
                    { name: 'Atomic_Locator', coef: -50.0 },
                ],
                bnds: { type: glpk.GLP_LO, lb: 0.0 },
            },
            {
                vars: [
                    { name: 'Coupler', coef: 1.0 },
                    { name: 'Turbocharger_STD', coef: -4.0 },
                    { name: 'Super_Computer_STD', coef: -8.0 },
                ],
                bnds: { type: glpk.GLP_LO, lb: 0.0 },
            },
            {
                vars: [
                    { name: 'Electric_Motor', coef: 1.0 },
                    { name: 'Electric_Motor_STD', coef: -1.0 },
                    { name: 'Electric_Motor_ALT', coef: -1.0 },
                ],
                bnds: { type: glpk.GLP_FX, ub: 0.0, lb: 0.0 },
            },
            {
                vars: [
                    { name: 'Electric_Motor', coef: 1.0 },
                    { name: 'Stabilizer', coef: -1.0 },
                    { name: 'Matter_Compressor', coef: -2.0 },
                ],
                bnds: { type: glpk.GLP_LO, lb: 0.0 },
            },
            {
                vars: [
                    { name: 'Electromagnet', coef: 1.0 },
                    { name: 'Electromagnet_STD', coef: -1.0 },
                    { name: 'Electromagnet_ALT', coef: -1.0 },
                ],
                bnds: { type: glpk.GLP_FX, ub: 0.0, lb: 0.0 },
            },
            {
                vars: [
                    { name: 'Electromagnet', coef: 1.0 },
                    { name: 'Battery', coef: -8.0 },
                    { name: 'Electron_Microscope', coef: -8.0 },
                    { name: 'Magnetic_Field_Generator', coef: -10.0 },
                    { name: 'Electric_Motor_ALT', coef: -6.0 },
                ],
                bnds: { type: glpk.GLP_LO, lb: 0.0 },
            },
            {
                vars: [
                    { name: 'Electron_Microscope', coef: 1.0 },
                    { name: 'Atomic_Locator', coef: -2.0 },
                ],
                bnds: { type: glpk.GLP_LO, lb: 0.0 },
            },
            {
                vars: [
                    { name: 'Empty_Fuel_Cell', coef: 1.0 },
                    { name: 'Nuclear_Fuel_Cell', coef: -1.0 },
                    { name: 'Electric_Motor_ALT', coef: -1.0 },
                ],
                bnds: { type: glpk.GLP_LO, lb: 0.0 },
            },
            {
                vars: [
                    { name: 'Energy_Cube', coef: 1.0 },
                    { name: 'Matter_Duplicator', coef: -5.0 },
                ],
                bnds: { type: glpk.GLP_LO, lb: 0.0 },
            },
            {
                vars: [
                    { name: 'Enriched_Uranium', coef: 1.0 },
                    { name: 'Nuclear_Fuel_Cell', coef: -1.0 },
                ],
                bnds: { type: glpk.GLP_LO, lb: 0.0 },
            },
            {
                vars: [
                    { name: 'Glass', coef: 1.0 },
                    { name: 'Condenser_Lens', coef: -3.0 },
                    { name: 'Nano_Wire', coef: -4.0 },
                    { name: 'Empty_Fuel_Cell', coef: -5.0 },
                    { name: 'Tank', coef: -2.0 },
                ],
                bnds: { type: glpk.GLP_LO, lb: 0.0 },
            },
            {
                vars: [
                    { name: 'Graphite', coef: 1.0 },
                    { name: 'Carbon_Fiber', coef: -4.0 },
                    { name: 'Battery', coef: -8.0 },
                    { name: 'Steel_STD', coef: -1.0 },
                    { name: 'Tungsten_Carbide_STD', coef: -1.0 },
                ],
                bnds: { type: glpk.GLP_LO, lb: 0.0 },
            },
            {
                vars: [
                    { name: 'Gyroscope', coef: 1.0 },
                    { name: 'Stabilizer', coef: -2.0 },
                    { name: 'Super_Computer_ALT', coef: -1.0 },
                    { name: 'Turbocharger_ALT', coef: -1.0 },
                ],
                bnds: { type: glpk.GLP_LO, lb: 0.0 },
            },
            {
                vars: [
                    { name: 'Heat_Sink', coef: 1.0 },
                    { name: 'Computer', coef: -3.0 },
                    { name: 'Super_Computer_STD', coef: -8.0 },
                    { name: 'Logic_Circuit_ALT', coef: -1.0 },
                    { name: 'Turbocharger_ALT', coef: -4.0 },
                ],
                bnds: { type: glpk.GLP_LO, lb: 0.0 },
            },
            {
                vars: [
                    { name: 'Industrial_Frame', coef: 1.0 },
                    { name: 'Industrial_Frame_STD', coef: -1.0 },
                    { name: 'Industrial_Frame_ALT', coef: -1.0 },
                ],
                bnds: { type: glpk.GLP_FX, ub: 0.0, lb: 0.0 },
            },
            {
                vars: [
                    { name: 'Industrial_Frame', coef: 1.0 },
                    { name: 'Energy_Cube', coef: -1.0 },
                    { name: 'Matter_Compressor', coef: -1.0 },
                    { name: 'Magnetic_Field_Generator', coef: -1.0 },
                    { name: 'Super_Computer_ALT', coef: -0.5 },
                ],
                bnds: { type: glpk.GLP_LO, lb: 0.0 },
            },
            {
                vars: [
                    { name: 'Iron_Gear', coef: 1.0 },
                    { name: 'Iron_Gear_STD', coef: -1.0 },
                    { name: 'Iron_Gear_ALT', coef: -1.0 },
                ],
                bnds: { type: glpk.GLP_FX, ub: 0.0, lb: 0.0 },
            },
            {
                vars: [
                    { name: 'Iron_Gear', coef: 1.0 },
                    { name: 'Electric_Motor_STD', coef: -4.0 },
                    { name: 'Turbocharger_STD', coef: -8.0 },
                ],
                bnds: { type: glpk.GLP_LO, lb: 0.0 },
            },
            {
                vars: [
                    { name: 'Iron_Ingot', coef: 1.0 },
                    { name: 'Iron_Gear_STD', coef: -2.0 },
                    { name: 'Iron_Plating', coef: -2.0 },
                    { name: 'Electromagnet_STD', coef: -2.0 },
                ],
                bnds: { type: glpk.GLP_LO, lb: 0.0 },
            },
            {
                vars: [
                    { name: 'Iron_Plating', coef: 1.0 },
                    { name: 'Metal_Frame', coef: -4.0 },
                    { name: 'Rotor_STD', coef: -2.0 },
                    { name: 'Rotor_ALT', coef: -18.0 },
                    { name: 'Industrial_Frame_ALT', coef: -10.0 },
                    { name: 'Logic_Circuit_ALT', coef: -1.0 },
                ],
                bnds: { type: glpk.GLP_LO, lb: 0.0 },
            },
            {
                vars: [
                    { name: 'Logic_Circuit', coef: 1.0 },
                    { name: 'Logic_Circuit_STD', coef: -1.0 },
                    { name: 'Logic_Circuit_ALT', coef: -1.0 },
                ],
                bnds: { type: glpk.GLP_FX, ub: 0.0, lb: 0.0 },
            },
            {
                vars: [
                    { name: 'Logic_Circuit', coef: 1.0 },
                    { name: 'Computer', coef: -3.0 },
                    { name: 'Turbocharger_STD', coef: -4.0 },
                ],
                bnds: { type: glpk.GLP_LO, lb: 0.0 },
            },
            {
                vars: [
                    { name: 'Magnetic_Field_Generator', coef: 1.0 },
                    { name: 'Quantum_Entangler', coef: -1.0 },
                ],
                bnds: { type: glpk.GLP_LO, lb: 0.0 },
            },
            {
                vars: [
                    { name: 'Matter_Compressor', coef: 1.0 },
                    { name: 'Particle_Glue', coef: -0.1 },
                ],
                bnds: { type: glpk.GLP_LO, lb: 0.0 },
            },
            {
                vars: [
                    { name: 'Matter_Duplicator', coef: 1.0 },
                    { name: 'Earth_Token', coef: -1.0 },
                ],
                bnds: { type: glpk.GLP_LO, lb: 0.0 },
            },
            {
                vars: [
                    { name: 'Metal_Frame', coef: 1.0 },
                    { name: 'Computer', coef: -1.0 },
                    { name: 'Industrial_Frame_STD', coef: -2.0 },
                    { name: 'Electron_Microscope', coef: -2.0 },
                ],
                bnds: { type: glpk.GLP_LO, lb: 0.0 },
            },
            {
                vars: [
                    { name: 'Nano_Wire', coef: 1.0 },
                    { name: 'Electron_Microscope', coef: -2.0 },
                    { name: 'Turbocharger_STD', coef: -2.0 },
                    { name: 'Magnetic_Field_Generator', coef: -10.0 },
                    { name: 'Electromagnet_ALT', coef: -1.0 / 12.0 },
                ],
                bnds: { type: glpk.GLP_LO, lb: 0.0 },
            },
            {
                vars: [
                    { name: 'Particle_Glue', coef: 1.0 },
                    { name: 'Matter_Duplicator', coef: -100.0 },
                ],
                bnds: { type: glpk.GLP_LO, lb: 0.0 },
            },
            {
                vars: [
                    { name: 'Quantum_Entangler', coef: 1.0 },
                    { name: 'Matter_Duplicator', coef: -2.0 },
                ],
                bnds: { type: glpk.GLP_LO, lb: 0.0 },
            },
            {
                vars: [
                    { name: 'Rotor', coef: 1.0 },
                    { name: 'Rotor_STD', coef: -1.0 },
                    { name: 'Rotor_ALT', coef: -1.0 },
                ],
                bnds: { type: glpk.GLP_FX, ub: 0.0, lb: 0.0 },
            },
            {
                vars: [
                    { name: 'Rotor', coef: 1.0 },
                    { name: 'Gyroscope', coef: -2.0 },
                    { name: 'Electric_Motor_STD', coef: -2.0 },
                ],
                bnds: { type: glpk.GLP_LO, lb: 0.0 },
            },
            {
                vars: [
                    { name: 'Sand', coef: 1.0 },
                    { name: 'Silicon', coef: -2.0 },
                    { name: 'Glass', coef: -4.0 },
                    { name: 'Concrete_STD', coef: -10.0 },
                ],
                bnds: { type: glpk.GLP_LO, lb: 0.0 },
            },
            {
                vars: [
                    { name: 'Silicon', coef: 1.0 },
                    { name: 'Logic_Circuit_STD', coef: -2.0 },
                    { name: 'Super_Computer_ALT', coef: -20.0 },
                ],
                bnds: { type: glpk.GLP_LO, lb: 0.0 },
            },
            {
                vars: [
                    { name: 'Stabilizer', coef: 1.0 },
                    { name: 'Quantum_Entangler', coef: -2.0 },
                    { name: 'Magnetic_Field_Generator', coef: -1.0 },
                ],
                bnds: { type: glpk.GLP_LO, lb: 0.0 },
            },
            {
                vars: [
                    { name: 'Steel', coef: 1.0 },
                    { name: 'Steel_STD', coef: -1.0 },
                    { name: 'Steel_ALT', coef: -1.0 },
                ],
                bnds: { type: glpk.GLP_FX, ub: 0.0, lb: 0.0 },
            },
            {
                vars: [
                    { name: 'Steel', coef: 1.0 },
                    { name: 'Steel_Rod', coef: -3.0 },
                    { name: 'Iron_Gear_ALT', coef: -0.125 },
                    { name: 'Electric_Motor_ALT', coef: -6.0 },
                    { name: 'Tungsten_Carbide_ALT', coef: -0.5 },
                    { name: 'Industrial_Frame_ALT', coef: -18.0 },
                ],
                bnds: { type: glpk.GLP_LO, lb: 0.0 },
            },
            {
                vars: [
                    { name: 'Steel_Rod', coef: 1.0 },
                    { name: 'Rotor_STD', coef: -1.0 },
                    { name: 'Concrete_STD', coef: -1.0 },
                    { name: 'Nuclear_Fuel_Cell', coef: -1.0 },
                    { name: 'Electromagnet_ALT', coef: -1.0 / 12.0 },
                ],
                bnds: { type: glpk.GLP_LO, lb: 0.0 },
            },
            {
                vars: [
                    { name: 'Super_Computer', coef: 1.0 },
                    { name: 'Super_Computer_STD', coef: -1.0 },
                    { name: 'Super_Computer_ALT', coef: -1.0 },
                ],
                bnds: { type: glpk.GLP_FX, ub: 0.0, lb: 0.0 },
            },
            {
                vars: [
                    { name: 'Super_Computer', coef: 1.0 },
                    { name: 'Atomic_Locator', coef: -2.0 },
                ],
                bnds: { type: glpk.GLP_LO, lb: 0.0 },
            },
            {
                vars: [
                    { name: 'Tank', coef: 1.0 },
                    { name: 'Matter_Compressor', coef: -1.0 },
                ],
                bnds: { type: glpk.GLP_LO, lb: 0.0 },
            },
            {
                vars: [
                    { name: 'Tungsten_Carbide', coef: 1.0 },
                    { name: 'Tungsten_Carbide_STD', coef: -1.0 },
                    { name: 'Tungsten_Carbide_ALT', coef: -1.0 },
                ],
                bnds: { type: glpk.GLP_FX, ub: 0.0, lb: 0.0 },
            },
            {
                vars: [
                    { name: 'Tungsten_Carbide', coef: 1.0 },
                    { name: 'Coupler', coef: -1.0 },
                    { name: 'Empty_Fuel_Cell', coef: -3.0 },
                    { name: 'Industrial_Frame_STD', coef: -8.0 },
                    { name: 'Tank', coef: -4.0 },
                    { name: 'Turbocharger_ALT', coef: -1.0 },
                ],
                bnds: { type: glpk.GLP_LO, lb: 0.0 },
            },
            {
                vars: [
                    { name: 'Tungsten_Ore', coef: 1.0 },
                    { name: 'Tungsten_Carbide_STD', coef: -2.0 },
                    { name: 'Tungsten_Carbide_ALT', coef: -0.5 },
                ],
                bnds: { type: glpk.GLP_LO, lb: 0.0 },
            },
            {
                vars: [
                    { name: 'Turbocharger', coef: 1.0 },
                    { name: 'Turbocharger_STD', coef: -1.0 },
                    { name: 'Turbocharger_ALT', coef: -1.0 },
                ],
                bnds: { type: glpk.GLP_FX, ub: 0.0, lb: 0.0 },
            },
            {
                vars: [
                    { name: 'Turbocharger', coef: 1.0 },
                    { name: 'Super_Computer_STD', coef: -1.0 },
                    { name: 'Matter_Compressor', coef: -2.0 },
                ],
                bnds: { type: glpk.GLP_LO, lb: 0.0 },
            },
            {
                vars: [
                    { name: 'Wood_Frame', coef: 1.0 },
                    { name: 'Metal_Frame', coef: -1.0 },
                    { name: 'Concrete_ALT', coef: -4.0 },
                ],
                bnds: { type: glpk.GLP_LO, lb: 0.0 },
            },
            {
                vars: [
                    { name: 'Wood_Plank', coef: 1.0 },
                    { name: 'Wood_Frame', coef: -4.0 },
                ],
                bnds: { type: glpk.GLP_LO, lb: 0.0 },
            },
        ];
        let all_constraints;
        if (mode === "max") {
            if (alt && boost) {
                all_constraints = general_cons.concat(boost_cons);
            }
            else if (alt) {
                all_constraints = general_cons.concat(non_boost_cons);
            }
            else if (boost) {
                all_constraints = general_cons.concat(boost_cons).concat(non_alt_cons);
            }
            else {
                all_constraints = general_cons.concat(non_boost_cons).concat(non_alt_cons);
            }
        }
        else {
            all_constraints = (alt) ? general_cons : general_cons.concat(non_alt_cons);
        }
        // Solve target
        let lp_res;
        const opt = {
            msglev: glpk.GLP_MSG_OFF
        };
        if (mode === "max") {
            let lp_max = {
                name: 'LP',
                objective: {
                    direction: glpk.GLP_MAX,
                    vars: [
                        { name: target_box.value, coef: 1.0 },
                    ],
                },
                subjectTo: all_constraints,
            };
            lp_res = await glpk.solve(lp_max, opt);
        }
        // Minimize Resources
        let bound = (mode === "max") ? lp_res.result.z : limit;
        all_constraints.push({
            vars: [
                { name: target_box.value, coef: 1.0 },
            ],
            bnds: { type: glpk.GLP_FX, ub: bound, lb: bound },
        });
        let lp_min = {
            name: 'LP',
            objective: {
                direction: glpk.GLP_MIN,
                vars: [
                    { name: "Resource_Sum", coef: 1.0 },
                ],
            },
            subjectTo: all_constraints,
        };
        lp_res = await glpk.solve(lp_min, opt);
        console.log("Solver finished successfully!");
        return lp_res.result.vars;
    }
};
//#endregion
//#region Show functions
function show_nuc_ratios() {
    const title = document.createElement("p");
    title.textContent = "For Nuclear Fuel Cells:";
    title.style.margin = "24px 0 6px 0";
    output.appendChild(title);
    const table = document.createElement("table");
    table.className = "items ratios";
    for (const key of ["Steel", "Tungsten_Carbide"]) {
        const percent = 1;
        const tr = document.createElement("tr");
        // icon cell
        const tdImg = document.createElement("td");
        const img = document.createElement("img");
        img.src = itemToImg(key);
        img.alt = key.replace(/_/g, " ");
        img.loading = "lazy";
        img.onerror = () => { img.src = itemToImg("unknown"); };
        tdImg.appendChild(img);
        // name cell
        const tdName = document.createElement("td");
        tdName.textContent = key.replace(/_/g, " ");
        // percent cell
        const tdValue = document.createElement("td");
        tdValue.className = "pct-value";
        tdValue.textContent = round_sig(percent * 100, 6);
        // percent sign cell
        const tdSymbol = document.createElement("td");
        tdSymbol.className = "pct-symbol";
        tdSymbol.textContent = "%";
        tr.append(tdImg, tdName, tdValue, tdSymbol);
        table.appendChild(tr);
    }
    output.appendChild(table);
}
function get_alt_ratios(all_items) {
    const npp_items = {
        Steel: 2.25,
        Tungsten_Carbide: 1.5
    };
    const npps = (all_items["Nuclear_Fuel_Cell"] || 0) / SeedSolver.NPP_RATE;
    const split = split_box.checked && boost_box.checked;
    const result = {};
    for (const key of ALT_RECIPES) {
        let alt = all_items[key + "_ALT"] ?? 0;
        if (split) {
            alt -= npps * (npp_items[key] ?? 0);
        }
        const std = all_items[key + "_STD"] ?? 0;
        const total = alt + std;
        const value = (total <= 0) ? 0 : (alt / total);
        const percent = Math.max(0, Math.min(1, value));
        result[key] = percent;
    }
    return result;
}
async function show_recipe_ratios() {
    const limit = (limit_box.value === "Goal") ? Number(goal.value) : extractor_values();
    const all_items = await SeedSolver.solve(limit, alt_box.checked, boost_box.checked, gen2_box.checked);
    const split = split_box.checked && boost_box.checked;
    output.replaceChildren();
    const title = document.createElement("p");
    title.textContent = `Used ${split ? "" : "Total "}Alt recipes:`;
    title.style.margin = "0 0 6px 0";
    output.appendChild(title);
    if (split) {
        show_nuc_ratios();
        const title = document.createElement("p");
        title.textContent = `For ${target_box.value.replaceAll("_", " ")}s:`;
        title.style.margin = "24px 0 6px 0";
        output.appendChild(title);
    }
    const table = document.createElement("table");
    table.className = "items ratios";
    const alt_ratios = get_alt_ratios(all_items);
    for (const [key, percent] of Object.entries(alt_ratios)) {
        const tr = document.createElement("tr");
        // icon cell
        const tdImg = document.createElement("td");
        const img = document.createElement("img");
        img.src = itemToImg(key);
        img.alt = key.replace(/_/g, " ");
        img.loading = "lazy";
        img.onerror = () => { img.src = itemToImg("unknown"); };
        tdImg.appendChild(img);
        // name cell
        const tdName = document.createElement("td");
        tdName.textContent = key.replace(/_/g, " ");
        // percent cell
        const tdValue = document.createElement("td");
        tdValue.className = "pct-value";
        tdValue.textContent = round_sig(percent * 100, 6);
        // percent sign cell
        const tdSymbol = document.createElement("td");
        tdSymbol.className = "pct-symbol";
        tdSymbol.textContent = "%";
        tr.append(tdImg, tdName, tdValue, tdSymbol);
        table.appendChild(tr);
    }
    output.appendChild(table);
}
function get_resource_boosts(all_items, resources) {
    const result = {};
    for (const res of RESOURCES) {
        const key = res.key; // e.g. "Wood_Log" etc.
        const name = key.replace(/_/g, " ");
        const base = key.split("_")[0]; // keep your original mapping
        const total = resources[res.i] ?? 0;
        const coalExt = all_items[base + "_Coal_Ex"] ?? 0;
        const nucExt = all_items[base + "_Nuc_Ex"] ?? 0;
        const coalPer = (total <= 0) ? 0 : Math.max(0, Math.min(1, coalExt / total));
        const nucPer = (total <= 0) ? 0 : Math.max(0, Math.min(1, nucExt / total));
        result[key] = [coalPer, nucPer, total];
    }
    return result;
}
async function show_resource_boosts() {
    const resources = extractor_values();
    const all_items = await SeedSolver.solve(resources, alt_box.checked, boost_box.checked, gen2_box.checked);
    output.replaceChildren();
    const title = document.createElement("p");
    title.textContent = "Resource Boosts:";
    title.style.margin = "0 0 6px 0";
    output.appendChild(title);
    const table = document.createElement("table");
    table.className = "items boosts3";
    // Optional: small header for the two columns
    const thead = document.createElement("thead");
    const headRow = document.createElement("tr");
    headRow.innerHTML = `<th></th><th class="num">Coal</th><th class="num">Nuclear</th>`;
    thead.appendChild(headRow);
    table.appendChild(thead);
    const tbody = document.createElement("tbody");
    const res_boosts = get_resource_boosts(all_items, resources);
    for (const [key, [coalPer, nucPer, total]] of Object.entries(res_boosts)) {
        const coalExt = total * coalPer;
        const nucExt = total * nucPer;
        const name = key.replace(/_/g, " ");
        // Row 1: icon + name (spans all columns)
        const r1 = document.createElement("tr");
        r1.className = "res-title";
        const tdTitle = document.createElement("td");
        tdTitle.colSpan = 3;
        const wrap = document.createElement("div");
        wrap.className = "res-head";
        const img = document.createElement("img");
        img.src = itemToImg(key);
        img.alt = name;
        img.loading = "lazy";
        img.onerror = () => { img.src = itemToImg("unknown"); };
        const span = document.createElement("span");
        span.textContent = name;
        wrap.append(img, span);
        tdTitle.appendChild(wrap);
        r1.appendChild(tdTitle);
        // Row 2: percentages
        const r2 = document.createElement("tr");
        r2.className = "res-sub";
        const tdLabelPct = document.createElement("td");
        tdLabelPct.className = "sub-label";
        tdLabelPct.textContent = "percent";
        const tdCoalPct = document.createElement("td");
        tdCoalPct.className = "num";
        tdCoalPct.textContent = round_sig(coalPer * 100, 6);
        const tdNucPct = document.createElement("td");
        tdNucPct.className = "num";
        tdNucPct.textContent = round_sig(nucPer * 100, 6);
        r2.append(tdLabelPct, tdCoalPct, tdNucPct);
        // Row 3: extractors
        const r3 = document.createElement("tr");
        r3.className = "res-sub";
        const tdLabelEx = document.createElement("td");
        tdLabelEx.className = "sub-label";
        tdLabelEx.textContent = "extractors";
        const tdCoalEx = document.createElement("td");
        tdCoalEx.className = "num";
        tdCoalEx.textContent = round_sig(coalExt, 6);
        const tdNucEx = document.createElement("td");
        tdNucEx.className = "num";
        tdNucEx.textContent = round_sig(nucExt, 6);
        r3.append(tdLabelEx, tdCoalEx, tdNucEx);
        // Optional spacer row between resources
        const spacer = document.createElement("tr");
        spacer.className = "res-gap";
        const spacerTd = document.createElement("td");
        spacerTd.colSpan = 3;
        spacer.appendChild(spacerTd);
        tbody.append(r1, r2, r3, spacer);
    }
    table.appendChild(tbody);
    output.appendChild(table);
}
function createSpacerRow(colSpan) {
    const tr = document.createElement("tr");
    tr.className = "spacer";
    const td = document.createElement("td");
    td.colSpan = colSpan;
    td.innerHTML = "&nbsp;";
    tr.appendChild(td);
    return tr;
}
function adjust_item_dict(item_dict, divide, show_zero) {
    let keys = Object.keys(item_dict);
    const first_keys = [target_box.value];
    for (const res of RESOURCES) {
        first_keys.push(res.key);
    }
    let last_keys = keys.filter(item => !first_keys.includes(item) && !item.endsWith('_Ex') && item != "Coal_RAW" && item != "Resource_Sum");
    if (!alt_box.checked) {
        last_keys = last_keys.filter(item => !item.endsWith('_ALT') && !item.endsWith('_STD'));
    }
    last_keys.sort();
    keys = first_keys.concat(last_keys);
    let new_dict = {};
    for (const [index, key] of keys.entries()) {
        let value = divide ? item_dict[key] / item_dict[keys[0]] : item_dict[key];
        if (!show_zero && index > 7 && value <= 0) {
            continue;
        }
        new_dict[key] = value;
    }
    return new_dict;
}
function show_result(raw_item_dict, divide, show_zero) {
    const item_dict = adjust_item_dict(raw_item_dict, divide, show_zero);
    output.replaceChildren();
    const table = document.createElement("table");
    table.className = "items";
    for (const [name, amount] of Object.entries(item_dict)) {
        const tr = document.createElement("tr");
        const tdImg = document.createElement("td");
        const img = document.createElement("img");
        img.className = "item-img";
        img.src = itemToImg(name.replace(/_(ALT|STD)$/, ""));
        img.alt = name;
        img.loading = "lazy";
        img.onerror = () => { img.src = itemToImg("unknown"); };
        tdImg.appendChild(img);
        const tdName = document.createElement("td");
        tdName.textContent = name.replace(/_/g, ' ');
        const tdAmount = document.createElement("td");
        tdAmount.textContent = round_sig(amount, 6);
        tr.append(tdImg, tdName, tdAmount);
        table.appendChild(tr);
    }
    table.insertBefore(createSpacerRow(3), table.rows[1]);
    table.insertBefore(createSpacerRow(3), table.rows[9]);
    output.appendChild(table);
}
//#endregion
//#region Other functions
function itemToImg(value) {
    return "assets/" + value + ".png";
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
        const lastWarningRect = lastWarning.getBoundingClientRect(); // Get position
        warning.style.top = `${lastWarningRect.bottom / 1.5 - 14.28454342 + 5}px`; // Adjust position
    }
    // Add class for identification
    warning.classList.add("warning-message");
    document.body.appendChild(warning);
    // Remove warning when user clicks anywhere on the page
    document.addEventListener("click", () => warning.remove(), { once: true });
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
function extractor_values() {
    const result = [];
    for (const res of RESOURCES) {
        result.push(Number(res.field.value) || 0);
    }
    return result;
}
function roundN(value, decimals) {
    return Math.round(value * 10 ** decimals) / (10 ** decimals);
}
function round_sig(num, sig, preRound = 6) {
    num = roundN(num, preRound);
    const abs = Math.abs(num);
    // Always return a string (formatter function)
    if (abs === 0)
        return "0";
    if (Number.isInteger(num))
        return String(num);
    const intDigits = Math.floor(Math.log10(abs)) + 1;
    let decimals = sig - intDigits;
    if (decimals < 1)
        decimals = 1;
    let s = num.toFixed(decimals);
    // Trim trailing zeros but keep at least one digit after the dot
    s = s.replace(/(\.\d*?[1-9])0+$/, "$1"); // 12.3400 -> 12.34
    s = s.replace(/\.(0+)$/, ".0"); // 12.000 -> 12.0
    return s;
}
function get_url_param(target_key) {
    const url_vars = window.location.search.substring(1).split('&');
    for (const url_var of url_vars) {
        const [key, value] = url_var.split('=');
        if (key === target_key) {
            return value;
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
    const order = ["alt", "boost", "gen2", "item", "goal", "wd", "st", "ir", "cp", "cl", "wr", "ur"];
    if (value) {
        params.set(param, value);
    }
    else {
        params.delete(param);
    }
    const ordered_params = new URLSearchParams();
    for (let key of order) {
        if (params.has(key)) {
            ordered_params.set(key, params.get(key));
        }
    }
    window.history.replaceState({}, '', `${url.origin}${url.pathname}?${ordered_params.toString()}`);
}
function paste_insert(event) {
    const data = event.clipboardData || window.clipboardData; // other browsers || safari
    if (data) {
        const values = data.getData('text/plain').split(/\s+/);
        if (values.length > 1) {
            for (const res of RESOURCES) {
                res.field.value = values[res.i] || "";
                res.field.dispatchEvent(new Event("change"));
            }
        }
        else {
            wood.value = values[0];
            wood.dispatchEvent(new Event("change"));
        }
    }
}
function makeFakeSelect({ realSelect, fakeSelect, withImages = false }) {
    const selectedBtn = fakeSelect.querySelector(".selected");
    const optionsDiv = fakeSelect.querySelector(".options");
    function renderSelected(option) {
        if (withImages) {
            selectedBtn.innerHTML = `
                <img src="${itemToImg(option.value)}" alt="">
                <span>${option.textContent}</span>
            `;
        }
        else {
            selectedBtn.textContent = option.textContent;
        }
    }
    optionsDiv.replaceChildren();
    for (const option of realSelect.options) {
        const div = document.createElement("div");
        div.className = "option";
        if (withImages) {
            div.innerHTML = `
                <img src="${itemToImg(option.value)}" alt="">
                <span>${option.textContent}</span>
            `;
        }
        else {
            div.textContent = option.textContent;
        }
        div.addEventListener("click", () => {
            realSelect.value = option.value;
            renderSelected(option);
            fakeSelect.classList.remove("open");
            // forward native change event
            realSelect.dispatchEvent(new Event("change"));
        });
        optionsDiv.appendChild(div);
        if (option.selected) {
            renderSelected(option);
        }
    }
    // toggle dropdown
    selectedBtn.addEventListener("click", e => {
        e.stopPropagation();
        fakeSelect.classList.toggle("open");
    });
    // close when clicking outside
    document.addEventListener("click", e => {
        if (!fakeSelect.contains(e.target)) {
            fakeSelect.classList.remove("open");
        }
    });
}
//#endregion
//#region Run when loaded
goal.value = get_url_param("goal");
if (goal.value === "") {
    for (const res of RESOURCES) {
        res.field.value = get_url_param(res.url);
    }
}
else {
    limit_box.value = "Goal";
    limit_box.dispatchEvent(new Event("change"));
    for (const res of RESOURCES) {
        update_url_param(res.url, "");
    }
}
let url_item = proper(get_url_param("item"), '_');
if (url_item) {
    if ([...target_box.options].some(option => option.value === url_item)) {
        target_box.value = url_item;
    }
    else {
        show_warning(`"${url_item}" is not a valid item!`);
    }
}
for (let setting of ["alt", "boost", "gen2"]) {
    let url_param = get_url_param(setting);
    if (url_param != 0) {
        if (url_param === "1") {
            let checkbox = document.getElementById(`${setting}_box`);
            checkbox.checked = true;
            checkbox.dispatchEvent(new Event("change"));
        }
        else {
            show_warning(`${setting} should be 0 or 1!`);
        }
    }
}
if ([...RESOURCES].every(res => Number(res.field.value) > 0) || Number(goal.value) > 0) {
    let limit = (limit_box.value === "Goal") ? Number(goal.value) : extractor_values();
    show_result(await SeedSolver.solve(limit, alt_box.checked, boost_box.checked, gen2_box.checked), ratio_box.checked, zero_box.checked);
}
//#endregion
//# sourceMappingURL=script.js.map