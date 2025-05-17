import GLPK from './glpk.js';


//#region Constants
const clear_button = document.getElementById("clear_button");
const score_button = document.getElementById("score_button");
const alt_recipe_button = document.getElementById("alt_recipe_button");
const res_boosts_button = document.getElementById("res_boosts_button");

const target_box = document.getElementById("target_box");
const alt_box = document.getElementById("alt_box");
const boost_box = document.getElementById("boost_box");
const boost_note = document.getElementById("boost_note");

const wood = document.getElementById("wood");
const stone = document.getElementById("stone");
const iron = document.getElementById("iron");
const copper = document.getElementById("copper");
const coal = document.getElementById("coal");
const wolframite = document.getElementById("wolframite");
const uranium = document.getElementById("uranium");

const output = document.getElementById("output");

const RESOURCES = [
    {key: "Wood_Log", i: 0, field: wood, url: "wd"},
    {key: "Stone", i: 1, field: stone, url: "st"},
    {key: "Iron_Ore", i: 2, field: iron, url: "ir"},
    {key: "Copper_Ore", i: 3, field: copper, url: "cp"},
    {key: "Coal", i: 4, field: coal, url: "cl"},
    {key: "Wolframite", i: 5, field: wolframite, url: "wr"},
    {key: "Uranium_Ore", i: 6, field: uranium, url: "ur"}
];
//#endregion


//#region Field functions
for (const res of RESOURCES) {
    res.field.value = get_url_param(res.url);
    res.field.onchange = function() {
        update_url_param(res.url, res.field.value);
    };
    res.field.onpaste = function(ev) {res.field.blur(); paste_insert(ev);};
}

function get_url_param(target_key) {
    const url_vars = window.location.search.substring(1).split('&');
    for (const url_var of url_vars) {
        const [key, value] = url_var.split('=');
        if (key == target_key) {
            return value;
        }
    }
    return "";
}

function update_url_param(param, value) {
    const url = new URL(window.location.href);
    if (value) { 
        url.searchParams.set(param, value);
        window.history.pushState({}, '', url.href);
    } else {
        url.searchParams.delete(param);
        window.history.replaceState(null, null, url);
    }
}

function paste_insert(event) {
    const data = event.clipboardData || window.clipboardData; // other browsers || safari
    if (data) {
        const values = data.getData('text/plain').split(/\s+/);
        for (const res of RESOURCES) {
            res.field.value = values[res.i] || "";
            update_url_param(res.url, res.field.value);
        }
    }
}
//#endregion


//#region Button/Checkbox functions
alt_box.onchange = function() {
    output.textContent = "\n".repeat(40);
    alt_recipe_button.style.display = (alt_box.checked)? 'block':'none';
};

boost_box.onchange = function() {
    output.textContent = "\n".repeat(40);
    if (boost_box.checked) {
        res_boosts_button.style.display = 'block';
        boost_note.textContent = "The calculations are\nbased on an approximation";
    } else {
        res_boosts_button.style.display = 'none';
        boost_note.textContent = "";
    }
};

alt_recipe_button.onclick = function() {recipe_ratios.show();};
res_boosts_button.onclick = function() {resource_boosts.show();};

score_button.onclick = async function() {
    show_result(await SeedSolver.solve(extractor_values(), alt_box.checked, boost_box.checked));
};

let clear_state = false;
document.onclick = function(event) {
    clear_button.innerText = "Clear Fields";
    if (event.target === clear_button) {
        if (clear_state) {
            for (const res of RESOURCES) {
                res.field.value = "";
                update_url_param(res.url, res.field.value);
            }
        } else {
            clear_button.innerText = "Tap again";
        }
        clear_state = !clear_state;
    } else {
        clear_state = false;
    }
};
//#endregion


//#region Solver function
const SeedSolver = {
    EX_RATE: 30,
    EX_RATE_UR: 10,
    NPP_RATE: 0.5,
    CPP_RATE: 10,
    NUC_BOOST: 1.4,
    COAL_BOOST: 1.2,

    EX_NPP: 44,
    EX_CPP: 11,
    EX_NPP_UR: 8.5,
    EX_CPP_UR: 6.5,

    solve: async function(resources, alt, boost) {
        const [
            Wood_Extractors,
            Stone_Extractors,
            Iron_Extractors,
            Copper_Extractors,
            Coal_Extractors,
            Wolframite_Extractors,
            Uranium_Extractors
        ] = resources;
    
        const glpk = await GLPK();

        const boost_cons = [
            {
                vars: [
                    { name: 'Wood_Coal_Ex', coef: 1.0 },
                    { name: 'Wood_Nuc_Ex', coef: 1.0 },
                ],
                bnds: { type: glpk.GLP_UP, ub: Wood_Extractors * 0.95, lb: 0.0},
            },
            {
                vars: [
                    { name: 'Stone_Coal_Ex', coef: 1.0 },
                    { name: 'Stone_Nuc_Ex', coef: 1.0 },
                ],
                bnds: { type: glpk.GLP_UP, ub: Stone_Extractors * 0.95, lb: 0.0},
            },
            {
                vars: [
                    { name: 'Iron_Coal_Ex', coef: 1.0 },
                    { name: 'Iron_Nuc_Ex', coef: 1.0 },
                ],
                bnds: { type: glpk.GLP_UP, ub: Iron_Extractors * 0.95, lb: 0.0},
            },
            {
                vars: [
                    { name: 'Copper_Coal_Ex', coef: 1.0 },
                    { name: 'Copper_Nuc_Ex', coef: 1.0 },
                ],
                bnds: { type: glpk.GLP_UP, ub: Copper_Extractors * 0.95, lb: 0.0},
            },
            {
                vars: [
                    { name: 'Coal_Coal_Ex', coef: 1.0 },
                    { name: 'Coal_Nuc_Ex', coef: 1.0 },
                ],
                bnds: { type: glpk.GLP_UP, ub: Coal_Extractors * 0.95, lb: 0.0},
            },
            {
                vars: [
                    { name: 'Wolframite_Coal_Ex', coef: 1.0 },
                    { name: 'Wolframite_Nuc_Ex', coef: 1.0 },
                ],
                bnds: { type: glpk.GLP_UP, ub: Wolframite_Extractors * 0.95, lb: 0.0},
            },
            {
                vars: [
                    { name: 'Uranium_Coal_Ex', coef: 1.0 },
                    { name: 'Uranium_Nuc_Ex', coef: 1.0 },
                ],
                bnds: { type: glpk.GLP_UP, ub: Uranium_Extractors * 0.95, lb: 0.0},
            },
            {
                vars: [
                    { name: 'Wood_Nuc_Ex', coef: 1.0 },
                ],
                bnds: { type: glpk.GLP_UP, ub: Wood_Extractors * 0.9, lb: 0.0},
            },
            {
                vars: [
                    { name: 'Stone_Nuc_Ex', coef: 1.0 },
                ],
                bnds: { type: glpk.GLP_UP, ub: Stone_Extractors * 0.9, lb: 0.0},
            },
            {
                vars: [
                    { name: 'Iron_Nuc_Ex', coef: 1.0 },
                ],
                bnds: { type: glpk.GLP_UP, ub: Iron_Extractors * 0.9, lb: 0.0},
            },
            {
                vars: [
                    { name: 'Copper_Nuc_Ex', coef: 1.0 },
                ],
                bnds: { type: glpk.GLP_UP, ub: Copper_Extractors * 0.9, lb: 0.0},
            },
            {
                vars: [
                    { name: 'Coal_Nuc_Ex', coef: 1.0 },
                ],
                bnds: { type: glpk.GLP_UP, ub: Coal_Extractors * 0.9, lb: 0.0},
            },
            {
                vars: [
                    { name: 'Wolframite_Nuc_Ex', coef: 1.0 },
                ],
                bnds: { type: glpk.GLP_UP, ub: Wolframite_Extractors * 0.9, lb: 0.0},
            },
            {
                vars: [
                    { name: 'Uranium_Nuc_Ex', coef: 1.0 },
                ],
                bnds: { type: glpk.GLP_UP, ub: Uranium_Extractors * 0.2, lb: 0.0},
            },
            {
                vars: [
                    { name: 'Coal_Power_Plant', coef: 1.0 },
                    { name: 'Wood_Coal_Ex', coef: -1.0 / this.EX_CPP },
                    { name: 'Stone_Coal_Ex', coef: -1.0 / this.EX_CPP },
                    { name: 'Iron_Coal_Ex', coef: -1.0 / this.EX_CPP },
                    { name: 'Copper_Coal_Ex', coef: -1.0 / this.EX_CPP },
                    { name: 'Coal_Coal_Ex', coef: -1.0 / this.EX_CPP },
                    { name: 'Wolframite_Coal_Ex', coef: -1.0 / this.EX_CPP },
                    { name: 'Uranium_Coal_Ex', coef: -1.0 / this.EX_CPP_UR },
                ],
                bnds: { type: glpk.GLP_FX, ub: 0.0, lb: 0.0},
            },
            {
                vars: [
                    { name: 'Nuclear_Fuel_Cell', coef: 1.0 },
                    { name: 'Wood_Nuc_Ex', coef: -this.NPP_RATE / this.EX_NPP },
                    { name: 'Stone_Nuc_Ex', coef: -this.NPP_RATE / this.EX_NPP },
                    { name: 'Iron_Nuc_Ex', coef: -this.NPP_RATE / this.EX_NPP },
                    { name: 'Copper_Nuc_Ex', coef: -this.NPP_RATE / this.EX_NPP },
                    { name: 'Coal_Nuc_Ex', coef: -this.NPP_RATE / this.EX_NPP },
                    { name: 'Wolframite_Nuc_Ex', coef: -this.NPP_RATE / this.EX_NPP },
                    { name: 'Uranium_Nuc_Ex', coef: -this.NPP_RATE / this.EX_NPP_UR },
                ],
                bnds: { type: glpk.GLP_FX, ub: 0.0, lb: 0.0},
            },
            {
                vars: [
                    { name: 'Wood_Log', coef: 1.0 },
                    { name: 'Wood_Coal_Ex', coef: (1 - this.COAL_BOOST) * this.EX_RATE },
                    { name: 'Wood_Nuc_Ex', coef: (1 - this.NUC_BOOST) * this.EX_RATE },
                ],
                bnds: { type: glpk.GLP_UP, ub: Wood_Extractors * this.EX_RATE, lb: 0.0},
            },
            {
                vars: [
                    { name: 'Stone', coef: 1.0 },
                    { name: 'Stone_Coal_Ex', coef: (1 - this.COAL_BOOST) * this.EX_RATE },
                    { name: 'Stone_Nuc_Ex', coef: (1 - this.NUC_BOOST) * this.EX_RATE },
                ],
                bnds: { type: glpk.GLP_UP, ub: Stone_Extractors * this.EX_RATE, lb: 0.0},
            },
            {
                vars: [
                    { name: 'Iron_Ore', coef: 1.0 },
                    { name: 'Iron_Coal_Ex', coef: (1 - this.COAL_BOOST) * this.EX_RATE },
                    { name: 'Iron_Nuc_Ex', coef: (1 - this.NUC_BOOST) * this.EX_RATE },
                ],
                bnds: { type: glpk.GLP_UP, ub: Iron_Extractors * this.EX_RATE, lb: 0.0},
            },
            {
                vars: [
                    { name: 'Copper_Ore', coef: 1.0 },
                    { name: 'Copper_Coal_Ex', coef: (1 - this.COAL_BOOST) * this.EX_RATE },
                    { name: 'Copper_Nuc_Ex', coef: (1 - this.NUC_BOOST) * this.EX_RATE },
                ],
                bnds: { type: glpk.GLP_UP, ub: Copper_Extractors * this.EX_RATE, lb: 0.0},
            },
            {
                vars: [
                    { name: 'Coal', coef: 1.0 },
                    { name: 'Coal_Power_Plant', coef: this.CPP_RATE },
                    { name: 'Coal_Coal_Ex', coef: (1 - this.COAL_BOOST) * this.EX_RATE },
                    { name: 'Coal_Nuc_Ex', coef: (1 - this.NUC_BOOST) * this.EX_RATE },
                ],
                bnds: { type: glpk.GLP_UP, ub: Coal_Extractors * this.EX_RATE, lb: 0.0},
            },
            {
                vars: [
                    { name: 'Wolframite', coef: 1.0 },
                    { name: 'Wolframite_Coal_Ex', coef: (1 - this.COAL_BOOST) * this.EX_RATE },
                    { name: 'Wolframite_Nuc_Ex', coef: (1 - this.NUC_BOOST) * this.EX_RATE },
                ],
                bnds: { type: glpk.GLP_UP, ub: Wolframite_Extractors * this.EX_RATE, lb: 0.0},
            },
            {
                vars: [
                    { name: 'Uranium_Ore', coef: 1.0 },
                    { name: 'Uranium_Coal_Ex', coef: (1 - this.COAL_BOOST) * this.EX_RATE_UR },
                    { name: 'Uranium_Nuc_Ex', coef: (1 - this.NUC_BOOST) * this.EX_RATE_UR },
                ],
                bnds: { type: glpk.GLP_UP, ub: Uranium_Extractors * this.EX_RATE_UR, lb: 0.0},
            }
        ];
        const non_boost_cons = [
            {
                vars: [
                    { name: 'Wood_Log', coef: 1.0 },
                ],
                bnds: { type: glpk.GLP_UP, ub: Wood_Extractors * this.EX_RATE, lb: 0.0},
            },
            {
                vars: [
                    { name: 'Stone', coef: 1.0 },
                ],
                bnds: { type: glpk.GLP_UP, ub: Stone_Extractors * this.EX_RATE, lb: 0.0},
            },
            {
                vars: [
                    { name: 'Iron_Ore', coef: 1.0 },
                ],
                bnds: { type: glpk.GLP_UP, ub: Iron_Extractors * this.EX_RATE, lb: 0.0},
            },
            {
                vars: [
                    { name: 'Copper_Ore', coef: 1.0 },
                ],
                bnds: { type: glpk.GLP_UP, ub: Copper_Extractors * this.EX_RATE, lb: 0.0},
            },
            {
                vars: [
                    { name: 'Coal', coef: 1.0 },
                ],
                bnds: { type: glpk.GLP_UP, ub: Coal_Extractors * this.EX_RATE, lb: 0.0},
            },
            {
                vars: [
                    { name: 'Wolframite', coef: 1.0 },
                ],
                bnds: { type: glpk.GLP_UP, ub: Wolframite_Extractors * this.EX_RATE, lb: 0.0},
            },
            {
                vars: [
                    { name: 'Uranium_Ore', coef: 1.0 },
                ],
                bnds: { type: glpk.GLP_UP, ub: Uranium_Extractors * this.EX_RATE_UR, lb: 0.0},
            }
        ];
        const non_alt_cons = [
            {
                vars: [
                    { name: 'Copper_Wire_ALT', coef: 1.0 },
                ],
                bnds: { type: glpk.GLP_FX, ub: 0.0, lb: 0.0},
            },
            {
                vars: [
                    { name: 'Super_Computer_ALT', coef: 1.0 },
                ],
                bnds: { type: glpk.GLP_FX, ub: 0.0, lb: 0.0},
            },
            {
                vars: [
                    { name: 'Turbocharger_ALT', coef: 1.0 },
                ],
                bnds: { type: glpk.GLP_FX, ub: 0.0, lb: 0.0},
            },
            {
                vars: [
                    { name: 'Logic_Circuit_ALT', coef: 1.0 },
                ],
                bnds: { type: glpk.GLP_FX, ub: 0.0, lb: 0.0},
            },
            {
                vars: [
                    { name: 'Iron_Gear_ALT', coef: 1.0 },
                ],
                bnds: { type: glpk.GLP_FX, ub: 0.0, lb: 0.0},
            },
            {
                vars: [
                    { name: 'Steel_ALT', coef: 1.0 },
                ],
                bnds: { type: glpk.GLP_FX, ub: 0.0, lb: 0.0},
            },
            {
                vars: [
                    { name: 'Industrial_Frame_ALT', coef: 1.0 },
                ],
                bnds: { type: glpk.GLP_FX, ub: 0.0, lb: 0.0},
            },
            {
                vars: [
                    { name: 'Concrete_ALT', coef: 1.0 },
                ],
                bnds: { type: glpk.GLP_FX, ub: 0.0, lb: 0.0},
            },
            {
                vars: [
                    { name: 'Electromagnet_ALT', coef: 1.0 },
                ],
                bnds: { type: glpk.GLP_FX, ub: 0.0, lb: 0.0},
            },
            {
                vars: [
                    { name: 'Electric_Motor_ALT', coef: 1.0 },
                ],
                bnds: { type: glpk.GLP_FX, ub: 0.0, lb: 0.0},
            },
            {
                vars: [
                    { name: 'Rotor_ALT', coef: 1.0 },
                ],
                bnds: { type: glpk.GLP_FX, ub: 0.0, lb: 0.0},
            },
            {
                vars: [
                    { name: 'Tungsten_Carbide_ALT', coef: 1.0 },
                ],
                bnds: { type: glpk.GLP_FX, ub: 0.0, lb: 0.0},
            }
        ];
        const general_cons = [
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
                bnds: { type: glpk.GLP_FX, ub: 0.0, lb: 0.0},
            },
            {
                vars: [
                    { name: 'Wood_Log', coef: 1.0 },
                    { name: 'Wood_Plank', coef: -1.0 },
                    { name: 'Graphite', coef: -3.0 },
                ],
                bnds: { type: glpk.GLP_LO, lb: 0.0},
            },
            {
                vars: [
                    { name: 'Stone', coef: 1.0 },
                    { name: 'Sand', coef: -1.0 },
                    { name: 'Concrete_ALT', coef: -20.0 },
                ],
                bnds: { type: glpk.GLP_LO, lb: 0.0},
            },
            {
                vars: [
                    { name: 'Iron_Ore', coef: 1.0 },
                    { name: 'Iron_Ingot', coef: -1.0 },
                    { name: 'Steel', coef: -6.0 },
                    { name: 'Steel_ALT', coef: -4.0 },
                ],
                bnds: { type: glpk.GLP_LO, lb: 0.0},
            },
            {
                vars: [
                    { name: 'Copper_Ore', coef: 1.0 },
                    { name: 'Copper_Ingot', coef: -1.0 },
                ],
                bnds: { type: glpk.GLP_LO, lb: 0.0},
            },
            {
                vars: [
                    { name: 'Coal', coef: 1.0 },
                    { name: 'Graphite', coef: -3.0 },
                    { name: 'Steel_ALT', coef: -4.0 },
                ],
                bnds: { type: glpk.GLP_LO, lb: 0.0},
            },
            {
                vars: [
                    { name: 'Wolframite', coef: 1.0 },
                    { name: 'Tungsten_Ore', coef: -5.0 },
                ],
                bnds: { type: glpk.GLP_LO, lb: 0.0},
            },
            {
                vars: [
                    { name: 'Uranium_Ore', coef: 1.0 },
                    { name: 'Enriched_Uranium', coef: -30.0 },
                ],
                bnds: { type: glpk.GLP_LO, lb: 0.0},
            },
            {
                vars: [
                    { name: 'Atomic_Locator', coef: 1.0 },
                    { name: 'Matter_Duplicator', coef: -4.0 },
                ],
                bnds: { type: glpk.GLP_LO, lb: 0.0},
            },
            {
                vars: [
                    { name: 'Battery', coef: 1.0 },
                    { name: 'Energy_Cube', coef: -2.0 },
                    { name: 'Electric_Motor', coef: -1.0 },
                ],
                bnds: { type: glpk.GLP_LO, lb: 0.0},
            },
            {
                vars: [
                    { name: 'Carbon_Fiber', coef: 1.0 },
                    { name: 'Nano_Wire', coef: -2.0 },
                    { name: 'Copper_Wire_ALT', coef: -0.125 },
                    { name: 'Industrial_Frame_ALT', coef: -4.0 },
                ],
                bnds: { type: glpk.GLP_LO, lb: 0.0},
            },
            {
                vars: [
                    { name: 'Computer', coef: 1.0 },
                    { name: 'Stabilizer', coef: -1.0 },
                    { name: 'Super_Computer', coef: -2.0 },
                    { name: 'Super_Computer_ALT', coef: -1.0 },
                    { name: 'Turbocharger_ALT', coef: -1.0 },
                ],
                bnds: { type: glpk.GLP_LO, lb: 0.0},
            },
            {
                vars: [
                    { name: 'Concrete', coef: 1.0 },
                    { name: 'Concrete_ALT', coef: 1.0 },
                    { name: 'Industrial_Frame', coef: -6.0 },
                    { name: 'Tank', coef: -4.0 },
                    { name: 'Atomic_Locator', coef: -24.0 },
                ],
                bnds: { type: glpk.GLP_LO, lb: 0.0},
            },
            {
                vars: [
                    { name: 'Condenser_Lens', coef: 1.0 },
                    { name: 'Electron_Microscope', coef: -4.0 },
                ],
                bnds: { type: glpk.GLP_LO, lb: 0.0},
            },
            {
                vars: [
                    { name: 'Copper_Ingot', coef: 1.0 },
                    { name: 'Copper_Wire', coef: -1.5 },
                    { name: 'Heat_Sink', coef: -5.0 },
                    { name: 'Rotor_ALT', coef: -18.0 },
                ],
                bnds: { type: glpk.GLP_LO, lb: 0.0},
            },
            {
                vars: [
                    { name: 'Copper_Wire', coef: 1.0 },
                    { name: 'Copper_Wire_ALT', coef: 1.0 },
                    { name: 'Electromagnet', coef: -6.0 },
                    { name: 'Logic_Circuit', coef: -3.0 },
                    { name: 'Gyroscope', coef: -12.0 },
                    { name: 'Atomic_Locator', coef: -50.0 },
                ],
                bnds: { type: glpk.GLP_LO, lb: 0.0},
            },
            {
                vars: [
                    { name: 'Coupler', coef: 1.0 },
                    { name: 'Turbocharger', coef: -4.0 },
                    { name: 'Super_Computer', coef: -8.0 },
                ],
                bnds: { type: glpk.GLP_LO, lb: 0.0},
            },
            {
                vars: [
                    { name: 'Electric_Motor', coef: 1.0 },
                    { name: 'Electric_Motor_ALT', coef: 1.0 },
                    { name: 'Stabilizer', coef: -1.0 },
                    { name: 'Matter_Compressor', coef: -2.0 },
                ],
                bnds: { type: glpk.GLP_LO, lb: 0.0},
            },
            {
                vars: [
                    { name: 'Electromagnet', coef: 1.0 },
                    { name: 'Electromagnet_ALT', coef: 1.0 },
                    { name: 'Battery', coef: -8.0 },
                    { name: 'Electron_Microscope', coef: -8.0 },
                    { name: 'Magnetic_Field_Generator', coef: -10.0 },
                    { name: 'Electric_Motor_ALT', coef: -6.0 },
                ],
                bnds: { type: glpk.GLP_LO, lb: 0.0},
            },
            {
                vars: [
                    { name: 'Electron_Microscope', coef: 1.0 },
                    { name: 'Atomic_Locator', coef: -2.0 },
                ],
                bnds: { type: glpk.GLP_LO, lb: 0.0},
            },
            {
                vars: [
                    { name: 'Empty_Fuel_Cell', coef: 1.0 },
                    { name: 'Nuclear_Fuel_Cell', coef: -1.0 },
                    { name: 'Electric_Motor_ALT', coef: -1.0 },
                ],
                bnds: { type: glpk.GLP_LO, lb: 0.0},
            },
            {
                vars: [
                    { name: 'Energy_Cube', coef: 1.0 },
                    { name: 'Matter_Duplicator', coef: -5.0 },
                ],
                bnds: { type: glpk.GLP_LO, lb: 0.0},
            },
            {
                vars: [
                    { name: 'Enriched_Uranium', coef: 1.0 },
                    { name: 'Nuclear_Fuel_Cell', coef: -1.0 },
                ],
                bnds: { type: glpk.GLP_LO, lb: 0.0},
            },
            {
                vars: [
                    { name: 'Glass', coef: 1.0 },
                    { name: 'Condenser_Lens', coef: -3.0 },
                    { name: 'Nano_Wire', coef: -4.0 },
                    { name: 'Empty_Fuel_Cell', coef: -5.0 },
                    { name: 'Tank', coef: -2.0 },
                ],
                bnds: { type: glpk.GLP_LO, lb: 0.0},
            },
            {
                vars: [
                    { name: 'Graphite', coef: 1.0 },
                    { name: 'Carbon_Fiber', coef: -4.0 },
                    { name: 'Battery', coef: -8.0 },
                    { name: 'Steel', coef: -1.0 },
                    { name: 'Tungsten_Carbide', coef: -1.0 },
                ],
                bnds: { type: glpk.GLP_LO, lb: 0.0},
            },
            {
                vars: [
                    { name: 'Gyroscope', coef: 1.0 },
                    { name: 'Stabilizer', coef: -2.0 },
                    { name: 'Super_Computer_ALT', coef: -1.0 },
                    { name: 'Turbocharger_ALT', coef: -1.0 },
                ],
                bnds: { type: glpk.GLP_LO, lb: 0.0},
            },
            {
                vars: [
                    { name: 'Heat_Sink', coef: 1.0 },
                    { name: 'Computer', coef: -3.0 },
                    { name: 'Super_Computer', coef: -8.0 },
                    { name: 'Logic_Circuit_ALT', coef: -1.0 },
                    { name: 'Turbocharger_ALT', coef: -4.0 },
                ],
                bnds: { type: glpk.GLP_LO, lb: 0.0},
            },
            {
                vars: [
                    { name: 'Industrial_Frame', coef: 1.0 },
                    { name: 'Industrial_Frame_ALT', coef: 1.0 },
                    { name: 'Energy_Cube', coef: -1.0 },
                    { name: 'Matter_Compressor', coef: -1.0 },
                    { name: 'Magnetic_Field_Generator', coef: -1.0 },
                    { name: 'Super_Computer_ALT', coef: -0.5 },
                ],
                bnds: { type: glpk.GLP_LO, lb: 0.0},
            },
            {
                vars: [
                    { name: 'Iron_Gear', coef: 1.0 },
                    { name: 'Iron_Gear_ALT', coef: 1.0 },
                    { name: 'Electric_Motor', coef: -4.0 },
                    { name: 'Turbocharger', coef: -8.0 },
                ],
                bnds: { type: glpk.GLP_LO, lb: 0.0},
            },
            {
                vars: [
                    { name: 'Iron_Ingot', coef: 1.0 },
                    { name: 'Iron_Gear', coef: -2.0 },
                    { name: 'Iron_Plating', coef: -2.0 },
                    { name: 'Electromagnet', coef: -2.0 },
                ],
                bnds: { type: glpk.GLP_LO, lb: 0.0},
            },
            {
                vars: [
                    { name: 'Iron_Plating', coef: 1.0 },
                    { name: 'Metal_Frame', coef: -4.0 },
                    { name: 'Rotor', coef: -2.0 },
                    { name: 'Rotor_ALT', coef: -18.0 },
                    { name: 'Industrial_Frame_ALT', coef: -10.0 },
                    { name: 'Logic_Circuit_ALT', coef: -1.0 },
                ],
                bnds: { type: glpk.GLP_LO, lb: 0.0},
            },
            {
                vars: [
                    { name: 'Logic_Circuit', coef: 1.0 },
                    { name: 'Logic_Circuit_ALT', coef: 1.0 },
                    { name: 'Computer', coef: -3.0 },
                    { name: 'Turbocharger', coef: -4.0 },
                ],
                bnds: { type: glpk.GLP_LO, lb: 0.0},
            },
            {
                vars: [
                    { name: 'Magnetic_Field_Generator', coef: 1.0 },
                    { name: 'Quantum_Entangler', coef: -1.0 },
                ],
                bnds: { type: glpk.GLP_LO, lb: 0.0},
            },
            {
                vars: [
                    { name: 'Matter_Compressor', coef: 1.0 },
                    { name: 'Particle_Glue', coef: -0.1 },
                ],
                bnds: { type: glpk.GLP_LO, lb: 0.0},
            },
            {
                vars: [
                    { name: 'Matter_Duplicator', coef: 1.0 },
                    { name: 'Earth_Token', coef: -1.0 },
                ],
                bnds: { type: glpk.GLP_LO, lb: 0.0},
            },
            {
                vars: [
                    { name: 'Metal_Frame', coef: 1.0 },
                    { name: 'Computer', coef: -1.0 },
                    { name: 'Industrial_Frame', coef: -2.0 },
                    { name: 'Electron_Microscope', coef: -2.0 },
                ],
                bnds: { type: glpk.GLP_LO, lb: 0.0},
            },
            {
                vars: [
                    { name: 'Nano_Wire', coef: 1.0 },
                    { name: 'Electron_Microscope', coef: -2.0 },
                    { name: 'Turbocharger', coef: -2.0 },
                    { name: 'Magnetic_Field_Generator', coef: -10.0 },
                    { name: 'Electromagnet_ALT', coef: -1.0/12.0 },
                ],
                bnds: { type: glpk.GLP_LO, lb: 0.0},
            },
            {
                vars: [
                    { name: 'Particle_Glue', coef: 1.0 },
                    { name: 'Matter_Duplicator', coef: -100.0 },
                ],
                bnds: { type: glpk.GLP_LO, lb: 0.0},
            },
            {
                vars: [
                    { name: 'Quantum_Entangler', coef: 1.0 },
                    { name: 'Matter_Duplicator', coef: -2.0 },
                ],
                bnds: { type: glpk.GLP_LO, lb: 0.0},
            },
            {
                vars: [
                    { name: 'Rotor', coef: 1.0 },
                    { name: 'Rotor_ALT', coef: 1.0 },
                    { name: 'Gyroscope', coef: -2.0 },
                    { name: 'Electric_Motor', coef: -2.0 },
                ],
                bnds: { type: glpk.GLP_LO, lb: 0.0},
            },
            {
                vars: [
                    { name: 'Sand', coef: 1.0 },
                    { name: 'Silicon', coef: -2.0 },
                    { name: 'Glass', coef: -4.0 },
                    { name: 'Concrete', coef: -10.0 },
                ],
                bnds: { type: glpk.GLP_LO, lb: 0.0},
            },
            {
                vars: [
                    { name: 'Silicon', coef: 1.0 },
                    { name: 'Logic_Circuit', coef: -2.0 },
                    { name: 'Super_Computer_ALT', coef: -20.0 },
                ],
                bnds: { type: glpk.GLP_LO, lb: 0.0},
            },
            {
                vars: [
                    { name: 'Stabilizer', coef: 1.0 },
                    { name: 'Quantum_Entangler', coef: -2.0 },
                    { name: 'Magnetic_Field_Generator', coef: -1.0 },
                ],
                bnds: { type: glpk.GLP_LO, lb: 0.0},
            },
            {
                vars: [
                    { name: 'Steel', coef: 1.0 },
                    { name: 'Steel_ALT', coef: 1.0 },
                    { name: 'Steel_Rod', coef: -3.0 },
                    { name: 'Iron_Gear_ALT', coef: -0.125 },
                    { name: 'Electric_Motor_ALT', coef: -6.0 },
                    { name: 'Tungsten_Carbide_ALT', coef: -0.5 },
                    { name: 'Industrial_Frame_ALT', coef: -18.0 },
                ],
                bnds: { type: glpk.GLP_LO, lb: 0.0},
            },
            {
                vars: [
                    { name: 'Steel_Rod', coef: 1.0 },
                    { name: 'Rotor', coef: -1.0 },
                    { name: 'Concrete', coef: -1.0 },
                    { name: 'Nuclear_Fuel_Cell', coef: -1.0 },
                    { name: 'Electromagnet_ALT', coef: -1.0/12.0 },
                ],
                bnds: { type: glpk.GLP_LO, lb: 0.0},
            },
            {
                vars: [
                    { name: 'Super_Computer', coef: 1.0 },
                    { name: 'Super_Computer_ALT', coef: 1.0 },
                    { name: 'Atomic_Locator', coef: -2.0 },
                ],
                bnds: { type: glpk.GLP_LO, lb: 0.0},
            },
            {
                vars: [
                    { name: 'Tank', coef: 1.0 },
                    { name: 'Matter_Compressor', coef: -1.0 },
                ],
                bnds: { type: glpk.GLP_LO, lb: 0.0},
            },
            {
                vars: [
                    { name: 'Tungsten_Carbide', coef: 1.0 },
                    { name: 'Tungsten_Carbide_ALT', coef: 1.0 },
                    { name: 'Coupler', coef: -1.0 },
                    { name: 'Empty_Fuel_Cell', coef: -3.0 },
                    { name: 'Industrial_Frame', coef: -8.0 },
                    { name: 'Tank', coef: -4.0 },
                    { name: 'Turbocharger_ALT', coef: -1.0 },
                ],
                bnds: { type: glpk.GLP_LO, lb: 0.0},
            },
            {
                vars: [
                    { name: 'Tungsten_Ore', coef: 1.0 },
                    { name: 'Tungsten_Carbide', coef: -2.0 },
                    { name: 'Tungsten_Carbide_ALT', coef: -0.5 },
                ],
                bnds: { type: glpk.GLP_LO, lb: 0.0},
            },
            {
                vars: [
                    { name: 'Turbocharger', coef: 1.0 },
                    { name: 'Turbocharger_ALT', coef: 1.0 },
                    { name: 'Super_Computer', coef: -1.0 },
                    { name: 'Matter_Compressor', coef: -2.0 },
                ],
                bnds: { type: glpk.GLP_LO, lb: 0.0},
            },
            {
                vars: [
                    { name: 'Wood_Frame', coef: 1.0 },
                    { name: 'Metal_Frame', coef: -1.0 },
                    { name: 'Concrete_ALT', coef: -4.0 },
                ],
                bnds: { type: glpk.GLP_LO, lb: 0.0},
            },
            {
                vars: [
                    { name: 'Wood_Plank', coef: 1.0 },
                    { name: 'Wood_Frame', coef: -4.0 },
                ],
                bnds: { type: glpk.GLP_LO, lb: 0.0},
            },
        ];

        let all_constraints;
        if (alt && boost) {
            all_constraints = general_cons.concat(boost_cons);
        } else if (alt) {
            all_constraints = general_cons.concat(non_boost_cons);
        } else if (boost) {
            all_constraints = general_cons.concat(boost_cons).concat(non_alt_cons);
        } else {
            all_constraints = general_cons.concat(non_boost_cons).concat(non_alt_cons);
        }

        // Solve target
        let lp = {
            name: 'LP',
            objective: {
                direction: glpk.GLP_MAX,
                vars: [
                    { name: target_box.value, coef: 1.0 },
                ],
            },
            subjectTo: all_constraints,
        };
        const opt = {
            msglev: glpk.GLP_MSG_OFF
        };
        let lp_res = await glpk.solve(lp, opt);

        // Minimize Resources
        all_constraints.push({
            vars: [
                { name: target_box.value, coef: 1.0 },
            ],
            bnds: { type: glpk.GLP_FX, ub: lp_res.result.z, lb: lp_res.result.z},
        });
        lp = {
            name: 'LP',
            objective: {
                direction: glpk.GLP_MIN,
                vars: [
                    { name: "Resource_Sum", coef: 1.0 },
                ],
            },
            subjectTo: all_constraints,
        };
        lp_res = await glpk.solve(lp, opt);

        console.log("Solver finished successfully!");
        return lp_res.result.vars;
    }
}
//#endregion


//#region Show functions
const recipe_ratios = {
    ALT_RECIPES: [
        "Concrete","Copper_Wire","Electric_Motor","Electromagnet",
        "Industrial_Frame","Iron_Gear","Logic_Circuit","Rotor","Steel",
        "Super_Computer","Tungsten_Carbide","Turbocharger"
    ],

    show: async function() {
        const all_items = await SeedSolver.solve(extractor_values(), alt_box.checked, boost_box.checked);
        let content = "Used Alt recipes:\n\n";
        for (const key of this.ALT_RECIPES) {
            const alt = all_items[key +"_ALT"];
            const norm = all_items[key];
            const value = (alt + norm <= 0)? 0 : (alt / (alt + norm));
            const percent = Math.max(0,Math.min(1,value));
            content += `${key.replace(/_/g,' ').padEnd(16, " ")} ${str_num(percent*100, 7, false)} %\n`;
        }
        output.style.fontSize = Math.min(13, window.innerWidth * 0.043 -0.5) +"px";
        output.textContent = content + "\n".repeat(25);
    }
}

const resource_boosts = {
    show: async function() {
        const resources = extractor_values();
        const all_items = await SeedSolver.solve(resources, alt_box.checked, boost_box.checked);
        let content = "Resource      Coal      Nuclear\n\n";
        for (const res of RESOURCES) {
            const res_str = res.key.split('_')[0];
            const coal_ext = all_items[res_str + '_Coal_Ex'];
            const nuc_ext = all_items[res_str + '_Nuc_Ex'];
            const coal_per = Math.max(0,Math.min(1,coal_ext / resources[res.i]));
            const nuc_per = Math.max(0,Math.min(1,nuc_ext / resources[res.i]));
            content += `${res.key.replace(/_/g,' ')}\n`;
            content += `${"  percentage"}: ${str_num(coal_per *100, 7)}   ${str_num(nuc_per *100, 7)}\n`
            content += `${"  extractors"}: ${str_num(coal_ext, 7)}   ${str_num(nuc_ext, 7)}\n\n`
        }
        output.style.fontSize = Math.min(13, window.innerWidth * 0.037 -0.5) +"px";
        output.textContent = content + "\n".repeat(30);
    }
}


function show_result(item_dict) {
    let keys = Object.keys(item_dict);
    const first_keys = [target_box.value];
    for (const res of RESOURCES) {
        first_keys.push(res.key);
    }
    const last_keys = keys.filter(
        item => !first_keys.includes(item) && !item.endsWith('_Ex') && item != 'Coal_Power_Plant' && item != "Resource_Sum"
    );
    last_keys.sort();
    keys = first_keys.concat(last_keys);
    let content = [];
    for (const key of keys) {
        content.push(`${key.replace(/_/g,' ').padEnd(24, " ")} ${roundN(item_dict[key], 6)}`)
    }
    content.splice(1,0,"");
    content.splice(9,0,"");
    output.style.fontSize = Math.min(13, window.innerWidth * 0.03 -0.5) +"px";
    output.textContent = content.join("\n") + "\n\n";
}
//#endregion


//#region Other functions
function extractor_values() {
    const result = [];
    for (const res of RESOURCES) {
        result.push(parseFloat(res.field.value) || 0);
    }
    return result;
}

function roundN(value, decimals) {
    return Math.round(value * 10**decimals) / (10**decimals);
}

function str_num(num, max_len, fill= true) {
    let num_len = String(num).length;
    let str = num.toPrecision(max_len -1);
    if (num_len <= max_len) {
        str = String(num);
    } else if (str.length > max_len){
        str = num.toFixed(max_len -2);
    }
    if (fill) {
        return str.padEnd(max_len, ' ');
    } else {
        return str;
    }
}
//#endregion
