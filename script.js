import GLPK from './glpk.js';


//#region Elements
const clear_button = document.getElementById("clear_button");
const score_button = document.getElementById("score_button");
const alt_recipe_button = document.getElementById("alt_recipe_button");
const res_boosts_button = document.getElementById("res_boosts_button");

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
//#endregion


//#region Constants
const R = {
    wood: 0,
    stone: 1,
    iron: 2,
    copper: 3,
    coal: 4,
    wolframite: 5,
    uranium: 6,
    list: [0, 1, 2, 3, 4, 5]
};

const NUCLEAR_BOOST = 1.4;
const COAL_BOOST = 1.2;
const EX_RATE = 30;
const UR_EX_RATE = 10;
const COAL_PP_RATE = 10;
const NUC_PP_RATE = 0.5;
const FUEL_COST_RATIO = [18,20,18,0,18,30,30];
const ALT_FUEL_COST_RATIO = [0,20,18,0,18,7.5,30];
const ET_RATIO = [7242,5028,7932,5315,6954,3520];
const MAX_RES_NUMS = [610,410,310,210];

const AV_UR = 7;
const UR_PATCH_ERROR = 1;
const SCORE_ERROR = 0.99;
const COAL_BOOST_UR = 1.2;
const PLANT_CONS = [
    {coal: 7.8, nuclear: 23.29},
    {coal: 7.8, nuclear: 33.09},
    {coal: 7.8, nuclear: 41.28},
    {coal: 7.8, nuclear: 42.9},
    {coal: 7.8, nuclear: 42.9}
];
const double_ERROR = -1e-8;

const ALT_RECIPES = [
    "Concrete","Copper_Wire","Electric_Motor","Electromagnet",
    "Industrial_Frame","Iron_Gear","Logic_Circuit","Rotor","Steel",
    "Super_Computer","Tungsten_Carbide","Turbocharger"
];
const RESOURCES = [
    {key: "Wood_Log", i: R.wood, field: wood, url: "wd"},
    {key: "Stone", i: R.stone, field: stone, url: "st"},
    {key: "Iron_Ore", i: R.iron, field: iron, url: "ir"},
    {key: "Copper_Ore", i: R.copper, field: copper, url: "cp"},
    {key: "Coal", i: R.coal, field: coal, url: "cl"},
    {key: "Wolframite", i: R.wolframite, field: wolframite, url: "wr"},
    {key: "Uranium_Ore", i: R.uranium, field: uranium, url: "ur"}
];
//#endregion


//#region Field functions
for (const res of RESOURCES) {
    res.field.value = get_url_param(res.url);
    res.field.onchange = function() {
        Norm.result = null;
        Boost.result = null;
        Alt.result = null;
        Alt_Boost.result = null;
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


//#region Checkbox functions
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
//#endregion


//#region Button functions
alt_recipe_button.onclick = function() {show_recipe_ratios(boost_box.checked);};
res_boosts_button.onclick = function() {show_resource_boosts(alt_box.checked);};

score_button.onclick = async function() {
    if (alt_box.checked && boost_box.checked) {
        show_result((await Alt_Boost.solve()).items);
    } else if (alt_box.checked) {
        show_result((await Alt.solve()).items);
    } else if (boost_box.checked) {
        show_result(Boost.solve().items);
    } else {
        show_result(Norm.solve().items);
    }
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


//#region Solver functions
let Alt = {
    result: null,

    solve: async function() {
        if (this.result != null) {return this.result;}
        const [
            Wood_Extractors,
            Stone_Extractors,
            Iron_Extractors,
            Copper_Extractors,
            Coal_Extractors,
            Wolframite_Extractors,
            Uranium_Extractors
        ] = extractor_values();
    
        try {
            const glpk = await GLPK();
        
            const lp = {
                name: 'LP',
                objective: {
                    direction: glpk.GLP_MAX,
                    vars: [
                        { name: 'Earth_Token', coef: 1.0 },
                    ],
                },
                subjectTo: [
                    {
                        vars: [
                            { name: 'Wood_Log', coef: 1.0 },
                        ],
                        bnds: { type: glpk.GLP_UP, ub: Wood_Extractors * EX_RATE, lb: 0.0},
                    },
                    {
                        vars: [
                            { name: 'Stone', coef: 1.0 },
                        ],
                        bnds: { type: glpk.GLP_UP, ub: Stone_Extractors * EX_RATE, lb: 0.0},
                    },
                    {
                        vars: [
                            { name: 'Iron_Ore', coef: 1.0 },
                        ],
                        bnds: { type: glpk.GLP_UP, ub: Iron_Extractors * EX_RATE, lb: 0.0},
                    },
                    {
                        vars: [
                            { name: 'Copper_Ore', coef: 1.0 },
                        ],
                        bnds: { type: glpk.GLP_UP, ub: Copper_Extractors * EX_RATE, lb: 0.0},
                    },
                    {
                        vars: [
                            { name: 'Coal', coef: 1.0 },
                        ],
                        bnds: { type: glpk.GLP_UP, ub: Coal_Extractors * EX_RATE, lb: 0.0},
                    },
                    {
                        vars: [
                            { name: 'Wolframite', coef: 1.0 },
                        ],
                        bnds: { type: glpk.GLP_UP, ub: Wolframite_Extractors * EX_RATE, lb: 0.0},
                    },
                    {
                        vars: [
                            { name: 'Uranium_Ore', coef: 1.0 },
                        ],
                        bnds: { type: glpk.GLP_UP, ub: Uranium_Extractors * UR_EX_RATE, lb: 0.0},
                    },
    
                    {
                        vars: [
                            { name: 'Wood_Log', coef: 1.0 },
                            { name: 'Wood_Plank', coef: -1.0 },
                            { name: 'Graphite', coef: -3.0 },
                        ],
                        bnds: { type: glpk.GLP_FX, ub: 0.0, lb: 0.0},
                    },
                    {
                        vars: [
                            { name: 'Stone', coef: 1.0 },
                            { name: 'Sand', coef: -1.0 },
                            { name: 'Concrete_ALT', coef: -20.0 },
                        ],
                        bnds: { type: glpk.GLP_FX, ub: 0.0, lb: 0.0},
                    },
                    {
                        vars: [
                            { name: 'Iron_Ore', coef: 1.0 },
                            { name: 'Iron_Ingot', coef: -1.0 },
                            { name: 'Steel', coef: -6.0 },
                            { name: 'Steel_ALT', coef: -4.0 },
                        ],
                        bnds: { type: glpk.GLP_FX, ub: 0.0, lb: 0.0},
                    },
                    {
                        vars: [
                            { name: 'Copper_Ore', coef: 1.0 },
                            { name: 'Copper_Ingot', coef: -1.0 },
                        ],
                        bnds: { type: glpk.GLP_FX, ub: 0.0, lb: 0.0},
                    },
                    {
                        vars: [
                            { name: 'Coal', coef: 1.0 },
                            { name: 'Graphite', coef: -3.0 },
                            { name: 'Steel_ALT', coef: -4.0 },
                        ],
                        bnds: { type: glpk.GLP_FX, ub: 0.0, lb: 0.0},
                    },
                    {
                        vars: [
                            { name: 'Wolframite', coef: 1.0 },
                            { name: 'Tungsten_Ore', coef: -5.0 },
                        ],
                        bnds: { type: glpk.GLP_FX, ub: 0.0, lb: 0.0},
                    },
                    {
                        vars: [
                            { name: 'Uranium_Ore', coef: 1.0 },
                            { name: 'Enriched_Uranium', coef: -30.0 },
                        ],
                        bnds: { type: glpk.GLP_FX, ub: 0.0, lb: 0.0},
                    },
                    {
                        vars: [
                            { name: 'Atomic_Locator', coef: 1.0 },
                            { name: 'Matter_Duplicator', coef: -4.0 },
                        ],
                        bnds: { type: glpk.GLP_FX, ub: 0.0, lb: 0.0},
                    },
                    {
                        vars: [
                            { name: 'Battery', coef: 1.0 },
                            { name: 'Energy_Cube', coef: -2.0 },
                            { name: 'Electric_Motor', coef: -1.0 },
                        ],
                        bnds: { type: glpk.GLP_FX, ub: 0.0, lb: 0.0},
                    },
                    {
                        vars: [
                            { name: 'Carbon_Fiber', coef: 1.0 },
                            { name: 'Nano_Wire', coef: -2.0 },
                            { name: 'Copper_Wire_ALT', coef: -0.125 },
                            { name: 'Industrial_Frame_ALT', coef: -4.0 },
                        ],
                        bnds: { type: glpk.GLP_FX, ub: 0.0, lb: 0.0},
                    },
                    {
                        vars: [
                            { name: 'Computer', coef: 1.0 },
                            { name: 'Stabilizer', coef: -1.0 },
                            { name: 'Super_Computer', coef: -2.0 },
                            { name: 'Super_Computer_ALT', coef: -1.0 },
                            { name: 'Turbocharger_ALT', coef: -1.0 },
                        ],
                        bnds: { type: glpk.GLP_FX, ub: 0.0, lb: 0.0},
                    },
                    {
                        vars: [
                            { name: 'Concrete', coef: 1.0 },
                            { name: 'Concrete_ALT', coef: 1.0 },
                            { name: 'Industrial_Frame', coef: -6.0 },
                            { name: 'Tank', coef: -4.0 },
                            { name: 'Atomic_Locator', coef: -24.0 },
                        ],
                        bnds: { type: glpk.GLP_FX, ub: 0.0, lb: 0.0},
                    },
                    {
                        vars: [
                            { name: 'Condenser_Lens', coef: 1.0 },
                            { name: 'Electron_Microscope', coef: -4.0 },
                        ],
                        bnds: { type: glpk.GLP_FX, ub: 0.0, lb: 0.0},
                    },
                    {
                        vars: [
                            { name: 'Copper_Ingot', coef: 1.0 },
                            { name: 'Copper_Wire', coef: -1.5 },
                            { name: 'Heat_Sink', coef: -5.0 },
                            { name: 'Rotor_ALT', coef: -18.0 },
                        ],
                        bnds: { type: glpk.GLP_FX, ub: 0.0, lb: 0.0},
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
                        bnds: { type: glpk.GLP_FX, ub: 0.0, lb: 0.0},
                    },
                    {
                        vars: [
                            { name: 'Coupler', coef: 1.0 },
                            { name: 'Turbocharger', coef: -4.0 },
                            { name: 'Super_Computer', coef: -8.0 },
                        ],
                        bnds: { type: glpk.GLP_FX, ub: 0.0, lb: 0.0},
                    },
                    {
                        vars: [
                            { name: 'Electric_Motor', coef: 1.0 },
                            { name: 'Electric_Motor_ALT', coef: 1.0 },
                            { name: 'Stabilizer', coef: -1.0 },
                            { name: 'Matter_Compressor', coef: -2.0 },
                        ],
                        bnds: { type: glpk.GLP_FX, ub: 0.0, lb: 0.0},
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
                        bnds: { type: glpk.GLP_FX, ub: 0.0, lb: 0.0},
                    },
                    {
                        vars: [
                            { name: 'Electron_Microscope', coef: 1.0 },
                            { name: 'Atomic_Locator', coef: -2.0 },
                        ],
                        bnds: { type: glpk.GLP_FX, ub: 0.0, lb: 0.0},
                    },
                    {
                        vars: [
                            { name: 'Empty_Fuel_Cell', coef: 1.0 },
                            { name: 'Nuclear_Fuel_Cell', coef: -1.0 },
                            { name: 'Electric_Motor_ALT', coef: -1.0 },
                        ],
                        bnds: { type: glpk.GLP_FX, ub: 0.0, lb: 0.0},
                    },
                    {
                        vars: [
                            { name: 'Energy_Cube', coef: 1.0 },
                            { name: 'Matter_Duplicator', coef: -5.0 },
                        ],
                        bnds: { type: glpk.GLP_FX, ub: 0.0, lb: 0.0},
                    },
                    {
                        vars: [
                            { name: 'Enriched_Uranium', coef: 1.0 },
                            { name: 'Nuclear_Fuel_Cell', coef: -1.0 },
                        ],
                        bnds: { type: glpk.GLP_FX, ub: 0.0, lb: 0.0},
                    },
                    {
                        vars: [
                            { name: 'Glass', coef: 1.0 },
                            { name: 'Condenser_Lens', coef: -3.0 },
                            { name: 'Nano_Wire', coef: -4.0 },
                            { name: 'Empty_Fuel_Cell', coef: -5.0 },
                            { name: 'Tank', coef: -2.0 },
                        ],
                        bnds: { type: glpk.GLP_FX, ub: 0.0, lb: 0.0},
                    },
                    {
                        vars: [
                            { name: 'Graphite', coef: 1.0 },
                            { name: 'Carbon_Fiber', coef: -4.0 },
                            { name: 'Battery', coef: -8.0 },
                            { name: 'Steel', coef: -1.0 },
                            { name: 'Tungsten_Carbide', coef: -1.0 },
                        ],
                        bnds: { type: glpk.GLP_FX, ub: 0.0, lb: 0.0},
                    },
                    {
                        vars: [
                            { name: 'Gyroscope', coef: 1.0 },
                            { name: 'Stabilizer', coef: -2.0 },
                            { name: 'Super_Computer_ALT', coef: -1.0 },
                            { name: 'Turbocharger_ALT', coef: -1.0 },
                        ],
                        bnds: { type: glpk.GLP_FX, ub: 0.0, lb: 0.0},
                    },
                    {
                        vars: [
                            { name: 'Heat_Sink', coef: 1.0 },
                            { name: 'Computer', coef: -3.0 },
                            { name: 'Super_Computer', coef: -8.0 },
                            { name: 'Logic_Circuit_ALT', coef: -1.0 },
                            { name: 'Turbocharger_ALT', coef: -4.0 },
                        ],
                        bnds: { type: glpk.GLP_FX, ub: 0.0, lb: 0.0},
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
                        bnds: { type: glpk.GLP_FX, ub: 0.0, lb: 0.0},
                    },
                    {
                        vars: [
                            { name: 'Iron_Gear', coef: 1.0 },
                            { name: 'Iron_Gear_ALT', coef: 1.0 },
                            { name: 'Electric_Motor', coef: -4.0 },
                            { name: 'Turbocharger', coef: -8.0 },
                        ],
                        bnds: { type: glpk.GLP_FX, ub: 0.0, lb: 0.0},
                    },
                    {
                        vars: [
                            { name: 'Iron_Ingot', coef: 1.0 },
                            { name: 'Iron_Gear', coef: -2.0 },
                            { name: 'Iron_Plating', coef: -2.0 },
                            { name: 'Electromagnet', coef: -2.0 },
                        ],
                        bnds: { type: glpk.GLP_FX, ub: 0.0, lb: 0.0},
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
                        bnds: { type: glpk.GLP_FX, ub: 0.0, lb: 0.0},
                    },
                    {
                        vars: [
                            { name: 'Logic_Circuit', coef: 1.0 },
                            { name: 'Logic_Circuit_ALT', coef: 1.0 },
                            { name: 'Computer', coef: -3.0 },
                            { name: 'Turbocharger', coef: -4.0 },
                        ],
                        bnds: { type: glpk.GLP_FX, ub: 0.0, lb: 0.0},
                    },
                    {
                        vars: [
                            { name: 'Magnetic_Field_Generator', coef: 1.0 },
                            { name: 'Quantum_Entangler', coef: -1.0 },
                        ],
                        bnds: { type: glpk.GLP_FX, ub: 0.0, lb: 0.0},
                    },
                    {
                        vars: [
                            { name: 'Matter_Compressor', coef: 1.0 },
                            { name: 'Particle_Glue', coef: -0.1 },
                        ],
                        bnds: { type: glpk.GLP_FX, ub: 0.0, lb: 0.0},
                    },
                    {
                        vars: [
                            { name: 'Matter_Duplicator', coef: 1.0 },
                            { name: 'Earth_Token', coef: -1.0 },
                        ],
                        bnds: { type: glpk.GLP_FX, ub: 0.0, lb: 0.0},
                    },
                    {
                        vars: [
                            { name: 'Metal_Frame', coef: 1.0 },
                            { name: 'Computer', coef: -1.0 },
                            { name: 'Industrial_Frame', coef: -2.0 },
                            { name: 'Electron_Microscope', coef: -2.0 },
                        ],
                        bnds: { type: glpk.GLP_FX, ub: 0.0, lb: 0.0},
                    },
                    {
                        vars: [
                            { name: 'Nano_Wire', coef: 1.0 },
                            { name: 'Electron_Microscope', coef: -2.0 },
                            { name: 'Turbocharger', coef: -2.0 },
                            { name: 'Magnetic_Field_Generator', coef: -10.0 },
                            { name: 'Electromagnet_ALT', coef: -1.0/12.0 },
                        ],
                        bnds: { type: glpk.GLP_FX, ub: 0.0, lb: 0.0},
                    },
                    {
                        vars: [
                            { name: 'Particle_Glue', coef: 1.0 },
                            { name: 'Matter_Duplicator', coef: -100.0 },
                        ],
                        bnds: { type: glpk.GLP_FX, ub: 0.0, lb: 0.0},
                    },
                    {
                        vars: [
                            { name: 'Quantum_Entangler', coef: 1.0 },
                            { name: 'Matter_Duplicator', coef: -2.0 },
                        ],
                        bnds: { type: glpk.GLP_FX, ub: 0.0, lb: 0.0},
                    },
                    {
                        vars: [
                            { name: 'Rotor', coef: 1.0 },
                            { name: 'Rotor_ALT', coef: 1.0 },
                            { name: 'Gyroscope', coef: -2.0 },
                            { name: 'Electric_Motor', coef: -2.0 },
                        ],
                        bnds: { type: glpk.GLP_FX, ub: 0.0, lb: 0.0},
                    },
                    {
                        vars: [
                            { name: 'Sand', coef: 1.0 },
                            { name: 'Silicon', coef: -2.0 },
                            { name: 'Glass', coef: -4.0 },
                            { name: 'Concrete', coef: -10.0 },
                        ],
                        bnds: { type: glpk.GLP_FX, ub: 0.0, lb: 0.0},
                    },
                    {
                        vars: [
                            { name: 'Silicon', coef: 1.0 },
                            { name: 'Logic_Circuit', coef: -2.0 },
                            { name: 'Super_Computer_ALT', coef: -20.0 },
                        ],
                        bnds: { type: glpk.GLP_FX, ub: 0.0, lb: 0.0},
                    },
                    {
                        vars: [
                            { name: 'Stabilizer', coef: 1.0 },
                            { name: 'Quantum_Entangler', coef: -2.0 },
                            { name: 'Magnetic_Field_Generator', coef: -1.0 },
                        ],
                        bnds: { type: glpk.GLP_FX, ub: 0.0, lb: 0.0},
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
                        bnds: { type: glpk.GLP_FX, ub: 0.0, lb: 0.0},
                    },
                    {
                        vars: [
                            { name: 'Steel_Rod', coef: 1.0 },
                            { name: 'Rotor', coef: -1.0 },
                            { name: 'Concrete', coef: -1.0 },
                            { name: 'Nuclear_Fuel_Cell', coef: -1.0 },
                            { name: 'Electromagnet_ALT', coef: -1.0/12.0 },
                        ],
                        bnds: { type: glpk.GLP_FX, ub: 0.0, lb: 0.0},
                    },
                    {
                        vars: [
                            { name: 'Super_Computer', coef: 1.0 },
                            { name: 'Super_Computer_ALT', coef: 1.0 },
                            { name: 'Atomic_Locator', coef: -2.0 },
                        ],
                        bnds: { type: glpk.GLP_FX, ub: 0.0, lb: 0.0},
                    },
                    {
                        vars: [
                            { name: 'Tank', coef: 1.0 },
                            { name: 'Matter_Compressor', coef: -1.0 },
                        ],
                        bnds: { type: glpk.GLP_FX, ub: 0.0, lb: 0.0},
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
                        bnds: { type: glpk.GLP_FX, ub: 0.0, lb: 0.0},
                    },
                    {
                        vars: [
                            { name: 'Tungsten_Ore', coef: 1.0 },
                            { name: 'Tungsten_Carbide', coef: -2.0 },
                            { name: 'Tungsten_Carbide_ALT', coef: -0.5 },
                        ],
                        bnds: { type: glpk.GLP_FX, ub: 0.0, lb: 0.0},
                    },
                    {
                        vars: [
                            { name: 'Turbocharger', coef: 1.0 },
                            { name: 'Turbocharger_ALT', coef: 1.0 },
                            { name: 'Super_Computer', coef: -1.0 },
                            { name: 'Matter_Compressor', coef: -2.0 },
                        ],
                        bnds: { type: glpk.GLP_FX, ub: 0.0, lb: 0.0},
                    },
                    {
                        vars: [
                            { name: 'Wood_Frame', coef: 1.0 },
                            { name: 'Metal_Frame', coef: -1.0 },
                            { name: 'Concrete_ALT', coef: -4.0 },
                        ],
                        bnds: { type: glpk.GLP_FX, ub: 0.0, lb: 0.0},
                    },
                    {
                        vars: [
                            { name: 'Wood_Plank', coef: 1.0 },
                            { name: 'Wood_Frame', coef: -4.0 },
                        ],
                        bnds: { type: glpk.GLP_FX, ub: 0.0, lb: 0.0},
                    },
                ],
            };
        
            const opt = {
                msglev: glpk.GLP_MSG_OFF
            };
        
            const lp_res = await glpk.solve(lp, opt);
            this.result = {items: lp_res.result.vars};
            console.log("Alt solver finished successfully!");
            return this.result;
        } catch (err) {
            console.error("Error:", err);
        }
    }
}

let Norm = {
    result: null,

    solve: function() {
        if (this.result != null) {return this.result;}
        const ex_values = extractor_values();
        const all_scores = [];
        for (let i = 0; i < ET_RATIO.length; i++) {
            all_scores[i] = ex_values[i] * EX_RATE / ET_RATIO[i];
        }
        const all = {};
        const Earth_Token = all.Earth_Token = Math.min(...all_scores);
        const Matter_Duplicator = all.Matter_Duplicator = Earth_Token;
        const Atomic_Locator = all.Atomic_Locator = 4 * Matter_Duplicator;
        const Energy_Cube = all.Energy_Cube = 5 * Matter_Duplicator;
        const Particle_Glue = all.Particle_Glue = 100 * Matter_Duplicator;
        const Quantum_Entangler = all.Quantum_Entangler = 2 * Matter_Duplicator;
        const Electron_Microscope = all.Electron_Microscope = 2 * Atomic_Locator;
        const Super_Computer = all.Super_Computer = 2 * Atomic_Locator;
        const Matter_Compressor = all.Matter_Compressor = 1/10 * Particle_Glue;
        const Magnetic_Field_Generator = all.Magnetic_Field_Generator = Quantum_Entangler;
        const Condenser_Lens = all.Condenser_Lens = 4 * Electron_Microscope;
        const Tank = all.Tank = Matter_Compressor;
        const Stabilizer = all.Stabilizer = 2 * Quantum_Entangler + Magnetic_Field_Generator;
        const Gyroscope = all.Gyroscope = 2 * Stabilizer;
        const Computer = all.Computer = Stabilizer + 2 * Super_Computer;
        const Heat_Sink = all.Heat_Sink = 3 * Computer + 8 * Super_Computer;
        const Industrial_Frame = all.Industrial_Frame = Energy_Cube + Matter_Compressor + Magnetic_Field_Generator;
        const Electric_Motor = all.Electric_Motor = Stabilizer + 2 * Matter_Compressor;
        const Battery = all.Battery = 2 * Energy_Cube + Electric_Motor;
        const Turbocharger = all.Turbocharger = Super_Computer + 2 * Matter_Compressor;
        const Nano_Wire = all.Nano_Wire = 2 * Electron_Microscope + 2 * Turbocharger + 10 * Magnetic_Field_Generator;
        const Carbon_Fiber = all.Carbon_Fiber = 2 * Nano_Wire;
        const Concrete = all.Concrete = 6 * Industrial_Frame + 4 * Tank + 24 * Atomic_Locator;
        const Electromagnet = all.Electromagnet = 8 * Battery + 8 * Electron_Microscope + 10 * Magnetic_Field_Generator;
        const Logic_Circuit = all.Logic_Circuit = 3 * Computer + 4 * Turbocharger;
        const Metal_Frame = all.Metal_Frame = Computer + 2 * Industrial_Frame + 2 * Electron_Microscope;
        const Rotor = all.Rotor = 2 * Gyroscope + 2 * Electric_Motor;
        const Copper_Wire = all.Copper_Wire = 6 * Electromagnet + 3 * Logic_Circuit + 12 * Gyroscope + 50 * Atomic_Locator;
        const Copper_Ingot = all.Copper_Ingot = 3/2 * Copper_Wire + 5 * Heat_Sink;
        const Coupler = all.Coupler = 4 * Turbocharger + 8 * Super_Computer;
        const Nuclear_Fuel_Cell = all.Nuclear_Fuel_Cell = 0;
        const Empty_Fuel_Cell = all.Empty_Fuel_Cell = Nuclear_Fuel_Cell;
        const Enriched_Uranium = all.Enriched_Uranium = Nuclear_Fuel_Cell;
        const Steel_Rod = all.Steel_Rod = Rotor + Concrete;
        const Steel = all.Steel = 3 * Steel_Rod;
        const Glass = all.Glass = 3 * Condenser_Lens + 4 * Nano_Wire + 5 * Empty_Fuel_Cell + 2 * Tank;
        const Tungsten_Carbide = all.Tungsten_Carbide = Coupler + 3 * Empty_Fuel_Cell + 8 * Industrial_Frame + 4 * Tank;
        const Tungsten_Ore = all.Tungsten_Ore = 2 * Tungsten_Carbide;
        const Graphite = all.Graphite = 4 * Carbon_Fiber + 8 * Battery + Steel + Tungsten_Carbide;
        const Iron_Gear = all.Iron_Gear = 4 * Electric_Motor + 8 * Turbocharger;
        const Iron_Plating = all.Iron_Plating = 4 * Metal_Frame + 2 * Rotor;
        const Iron_Ingot = all.Iron_Ingot = 2 * Iron_Gear + 2 * Iron_Plating + 2 * Electromagnet;
        const Silicon = all.Silicon = 2 * Logic_Circuit;
        const Sand = all.Sand = 2 * Silicon + 4 * Glass + 10 * Concrete;
        const Wood_Frame = all.Wood_Frame = Metal_Frame;
        const Wood_Plank = all.Wood_Plank = 4 * Wood_Frame;
        all.Wood_Log = Wood_Plank + 3 * Graphite;
        all.Stone = Sand;
        all.Iron_Ore = Iron_Ingot + 6 * Steel;
        all.Copper_Ore = Copper_Ingot;
        all.Coal = 3 * Graphite;
        all.Wolframite = 5 * Tungsten_Ore;
        all.Uranium_Ore = 30 * Enriched_Uranium;
    
        this.result = {items: all};
        console.log("Normal solver finished successfully!");
        return this.result;
    }
}

let Boost = {
    result: null,

    solve: function() {
        if (this.result != null) {return this.result;}
        const all = Norm.solve().items;
        this.result = SeedBoost(extractor_values());
        for (const [key, value] of Object.entries(all)) {
            all[key] = value * this.result.boost;
        }
        const Nuclear_Fuel_Cell = this.result.plants; all.Nuclear_Fuel_Cell += Nuclear_Fuel_Cell;
        const Empty_Fuel_Cell = Nuclear_Fuel_Cell; all.Empty_Fuel_Cell += Empty_Fuel_Cell;
        const Steel_Rod = Nuclear_Fuel_Cell; all.Steel_Rod += Steel_Rod;
        const Enriched_Uranium = Nuclear_Fuel_Cell; all.Enriched_Uranium += Enriched_Uranium;
        const Glass = 5 * Empty_Fuel_Cell; all.Glass += Glass;
        const Tungsten_Carbide = 3 * Empty_Fuel_Cell; all.Tungsten_Carbide += Tungsten_Carbide;
        const Steel = 3 * Steel_Rod; all.Steel += Steel;
        const Tungsten_Ore = 2 * Tungsten_Carbide; all.Tungsten_Ore += Tungsten_Ore;
        const Sand = 4 * Glass; all.Sand += Sand;
        const Graphite = Tungsten_Carbide + Steel; all.Graphite += Graphite;
        all.Uranium_Ore += 30 * Enriched_Uranium;
        all.Stone += Sand;
        all.Wolframite += 5 * Tungsten_Ore;
        all.Iron_Ore += 6 * Steel;
        all.Coal += 3 * Graphite + EX_RATE * this.result.extra_coal;
        all.Wood_Log += 3 * Graphite;
        
        this.result.items = all;
        console.log("Boost solver finished successfully!");
        return this.result;
    }
}

let Alt_Boost = {
    pyodide: null,
    pyodideReady: false,
    result: null,

    solve: async function() {
        if (this.result != null) {return this.result;}
        if (!this.pyodideReady) {
            this.pyodideReady = true;
            output.style.fontSize = 13 + "px";
            output.textContent = "Loading..." + "\n".repeat(39);;
            this.pyodide = await loadPyodide();
            this.pyodide.globals.set("SeedBoost", SeedBoost);
            await this.pyodide.loadPackage('micropip');
            await this.pyodide.runPythonAsync(`
import micropip
await micropip.install('scipy')
from scipy.optimize import minimize
from pyodide.ffi import to_js


NL_values = (1, 1, 0.85, 0.99, 0.68, 1, 0, 1)
NL_bounds = ((0,1),(0,1),(0,1),(0,1),(0,1),(0,1),(0,1),(0,1))
all = {}
result = None
def objective(rec_ratios, resources):
    gear_,steel_,frame_,conc_,magnet_,motor_,rotor_,carbide_ = rec_ratios

    all["Atomic_Locator"] = Atomic_Locator = 4
    all["Computer"] = Computer = 50
    all["Condenser_Lens"] = Condenser_Lens = 32
    all["Coupler"] = Coupler = 64
    all["Earth_Token"] = 1
    Electric_Motor = 26
    all["Electric_Motor"] = Electric_Motor * (1-motor_)
    all["Electric_Motor_ALT"] = Electric_Motor * motor_
    all["Electron_Microscope"] = Electron_Microscope = 8
    all["Energy_Cube"] = Energy_Cube = 5
    all["Gyroscope"] = Gyroscope = 40
    all["Heat_Sink"] = Heat_Sink = 476
    Industrial_Frame = 17
    all["Industrial_Frame"] = Industrial_Frame * (1-frame_)
    all["Industrial_Frame_ALT"] = Industrial_Frame * frame_
    all["Logic_Circuit"] = 0
    all["Logic_Circuit_ALT"] = Logic_Circuit = 150
    all["Magnetic_Field_Generator"] = Magnetic_Field_Generator = 2
    all["Matter_Compressor"] = 10
    all["Matter_Duplicator"] = 1
    all["Particle_Glue"] = 100
    all["Quantum_Entangler"] = 2
    all["Silicon"] = 0
    all["Stabilizer"] = 6
    all["Super_Computer"] = 8
    all["Super_Computer_ALT"] = 0
    all["Tank"] = Tank = 10
    all["Turbocharger"] = 0
    all["Turbocharger_ALT"] = Turbocharger = 28
    all["Uranium_Ore"] = 0
    all["Enriched_Uranium"] = 0
    all["Nuclear_Fuel_Cell"] = 0

    all["Battery"] = Battery = Energy_Cube *2 + Electric_Motor * (1-motor_)
    Electromagnet = Battery *8 + Electron_Microscope *8 + Magnetic_Field_Generator *10 + Electric_Motor *6 * motor_
    all["Electromagnet"] = Electromagnet * (1-magnet_)
    all["Electromagnet_ALT"] = Electromagnet * magnet_
    all["Nano_Wire"] = Nano_Wire = Electron_Microscope *2 + Magnetic_Field_Generator *10 + Electromagnet /12 * magnet_
    all["Carbon_Fiber"] = Carbon_Fiber = Nano_Wire *2 + Industrial_Frame *4 * frame_
    Concrete = Tank *4 + Atomic_Locator *24 + Industrial_Frame *6 * (1-frame_)
    all["Concrete"] = Concrete * (1-conc_)
    all["Concrete_ALT"] = Concrete * conc_
    all["Copper_Wire"] = Copper_Wire = Atomic_Locator *50 + Gyroscope *12 + Electromagnet *6 * (1-magnet_)
    all["Copper_Wire_ALT"] = 0
    Rotor = Gyroscope *2 + Electric_Motor *2 * (1-motor_)
    all["Rotor"] = Rotor * (1-rotor_)
    all["Rotor_ALT"] = Rotor * rotor_
    all["Copper_Ingot"] = Copper_Ingot = Heat_Sink *5 + Copper_Wire *3/2 + Rotor *18 * rotor_
    all["Empty_Fuel_Cell"] = Empty_Fuel_Cell = Electric_Motor * motor_
    all["Glass"] = Glass = Tank *2 + Nano_Wire *4 + Condenser_Lens *3 + Empty_Fuel_Cell *5
    all["Steel_Rod"] = Steel_Rod = Concrete * (1-conc_) + Rotor * (1-rotor_) + Electromagnet /12 * magnet_
    Iron_Gear = Electric_Motor *4 * (1-motor_)
    all["Iron_Gear"] = Iron_Gear * (1-gear_)
    all["Iron_Gear_ALT"] = Iron_Gear * gear_
    Tungsten_Carbide = Tank *4 + Industrial_Frame *8 * (1-frame_) + Coupler + Empty_Fuel_Cell *3 + Turbocharger
    all["Tungsten_Carbide"] = Tungsten_Carbide * (1-carbide_)
    all["Tungsten_Carbide_ALT"] = Tungsten_Carbide * carbide_
    Steel = Steel_Rod *3 + Iron_Gear /8 * gear_ + Electric_Motor *6 * motor_ + Industrial_Frame *18 * frame_ + Tungsten_Carbide /2 * carbide_
    all["Steel"] = Steel * (1-steel_)
    all["Steel_ALT"] = Steel * steel_
    all["Graphite"] = Graphite = Battery *8 + Carbon_Fiber *4 + Steel * (1-steel_) + Tungsten_Carbide * (1-carbide_)
    all["Metal_Frame"] = Metal_Frame = Electron_Microscope *2 + Industrial_Frame *2 * (1-frame_) + Computer
    all["Iron_Plating"] = Iron_Plating = Rotor * (rotor_ *16 +2) + Metal_Frame *4 + Logic_Circuit + Industrial_Frame *10 * frame_
    all["Iron_Ingot"] = Iron_Ingot = Electromagnet *2 * (1-magnet_) + Iron_Plating *2 + Iron_Gear *2 * (1-gear_)
    all["Sand"] = Sand = Concrete *10 * (1-conc_) + Glass *4
    all["Tungsten_Ore"] = Tungsten_Ore = Tungsten_Carbide * (2- 1.5* carbide_)
    all["Wood_Frame"] = Wood_Frame = Metal_Frame + Concrete *4 * conc_
    all["Wood_Plank"] = Wood_Plank = Wood_Frame *4

    all["Wood_Log"] = Wood_Log = Graphite *3 + Wood_Plank
    all["Stone"] = Stone = Sand + Concrete *20 * conc_
    all["Iron_Ore"] = Iron_Ore = Steel * (6- 2* steel_) + Iron_Ingot
    all["Copper_Ore"] = Copper_Ore = Copper_Ingot
    all["Coal"] = Coal = Graphite *3 + Steel *4 * steel_
    all["Wolframite"] = Wolframite = Tungsten_Ore *5
    alt_et_ratio = (Wood_Log, Stone, Iron_Ore, Copper_Ore, Coal, Wolframite)
    global result
    result = SeedBoost(to_js(resources), 3, to_js(alt_et_ratio))

    return -result.score

def alt_boost_solver(resources):
    result = minimize(objective, NL_values, (resources,), 'Nelder-Mead', bounds=NL_bounds)
    for key, value in all.items():
        all[key] = value * -result.fun
    return -result.fun
            `); 
        }
        await this.pyodide.runPythonAsync(`
            alt_boost_solver(${JSON.stringify(extractor_values())})
            js_all = to_js(all)
            js_result = to_js(result)
        `);
        let all = Object.fromEntries(this.pyodide.globals.get('js_all'));
        this.result = this.pyodide.globals.get('js_result');
        const Nuclear_Fuel_Cell = this.result.plants; all.Nuclear_Fuel_Cell += Nuclear_Fuel_Cell;
        const Empty_Fuel_Cell = Nuclear_Fuel_Cell; all.Empty_Fuel_Cell += Empty_Fuel_Cell;
        const Steel_Rod = Nuclear_Fuel_Cell; all.Steel_Rod += Steel_Rod;
        const Enriched_Uranium = Nuclear_Fuel_Cell; all.Enriched_Uranium += Enriched_Uranium;
        const Glass = 5 * Empty_Fuel_Cell; all.Glass += Glass;
        const Tungsten_Carbide_ALT = 3 * Empty_Fuel_Cell; all.Tungsten_Carbide_ALT += Tungsten_Carbide_ALT;
        const Steel_ALT = 3 * Steel_Rod + 0.5 * Tungsten_Carbide_ALT; all.Steel_ALT += Steel_ALT;
        const Tungsten_Ore = 0.5 * Tungsten_Carbide_ALT; all.Tungsten_Ore += Tungsten_Ore;
        const Sand = 4 * Glass; all.Sand += Sand;
        all.Uranium_Ore += 30 * Enriched_Uranium;
        all.Stone += Sand;
        all.Wolframite += 5 * Tungsten_Ore;
        all.Iron_Ore += 4 * Steel_ALT;
        all.Coal += 4 * Steel_ALT + EX_RATE * this.result.extra_coal;
        
        this.result.items = all;
        console.log("Alt Boost solver finished successfully!");
        return this.result;
    }
}
//#endregion


//#region Boost function
function SeedBoost(resources, SIG= 6, et_ratio= ET_RATIO) {
    const fuel_cost_ratio = (et_ratio == ET_RATIO)? FUEL_COST_RATIO : ALT_FUEL_COST_RATIO;
    const av_resource = (resources[R.wood] + resources[R.iron] + resources[R.coal]) /3;
    let resource_amount = 5;
    for (const max_num of MAX_RES_NUMS) {
        if (av_resource > max_num) {break;}
        resource_amount--;
    }
    const npp_cost = [];
    const score = {max: 1000000.0, min: 1000000.0};
    const Plant = PLANT_CONS[resource_amount -1];
    const nuclear_plants = resources[R.uranium] * UR_EX_RATE / fuel_cost_ratio[R.uranium] * COAL_BOOST_UR / NUC_PP_RATE;
    for (const res of R.list) {
        npp_cost[res] = nuclear_plants * fuel_cost_ratio[res] * NUC_PP_RATE / EX_RATE;
        score.min = Math.min(score.min, resources[res] / et_ratio[res] * EX_RATE);
        score.max = Math.min(score.max, (resources[res] * NUCLEAR_BOOST - npp_cost[res]) / et_ratio[res] * EX_RATE * SCORE_ERROR);
    }
    if (score.min <= 0 || score.min > score.max) {score.min = NaN;};
    if (score.max <= 0) {score.max = NaN;};
    const nuc_extractors = nuclear_plants * Plant.nuclear * (NUCLEAR_BOOST -1);
    const factor = 1- COAL_PP_RATE / (COAL_BOOST -1) / Plant.coal / EX_RATE;
    const ur_boost_cost = (COAL_BOOST_UR != 1.2)? 0: ((Math.round(resources[R.uranium] / AV_UR) + UR_PATCH_ERROR) * COAL_PP_RATE / EX_RATE);

    let extra_coal;
    let nuc_boost_coal;
    function is_possible(possible_score, nuc_boost_coal_par=0, final=false) {
        const extra_needed = [0,0,0,0,0,0];
        const min_nuc_ex = [0,0,0,0,0,0];
        const still_needed = [0,0,0,0,0,0];
        let total_needed_coal;
        let sum_still_needed = 0;
        let sum_min_nuc_ex = 0;
        for (const res of R.list) {
            const total_needed = possible_score / EX_RATE * et_ratio[res] / SCORE_ERROR + npp_cost[res];
            if (res == R.coal) {
                extra_needed[res] = resources[R.coal] * (nuc_boost_coal_par * NUCLEAR_BOOST + (1- nuc_boost_coal_par) * COAL_BOOST -1);
                total_needed_coal = total_needed;
            } else {
                if (total_needed > resources[res]) {
                    extra_needed[res] = total_needed - resources[res];
                }
            }
            const total_boost = extra_needed[res] / resources[res] +1;
            const min_nuc_boosted = (total_boost - COAL_BOOST) / (NUCLEAR_BOOST - COAL_BOOST);
            if (min_nuc_boosted > 0) {
                min_nuc_ex[res] = min_nuc_boosted * resources[res] * (NUCLEAR_BOOST -1);
            }
            if (res != R.coal) {
                still_needed[res] = extra_needed[res] - min_nuc_ex[res];
                sum_still_needed += still_needed[res];
            }
            sum_min_nuc_ex += min_nuc_ex[res];
        }
        const leftover_nuc_ex = Math.max(0.0, nuc_extractors - sum_min_nuc_ex);
        let sum_coal_ex = 0;
        let sum_total_nuc_ex = 0;
        const nuc_boost_res = [];
        const coal_boost_res = [];
        for (const res of R.list) {
            const extra_ex = (sum_still_needed == 0)? 0 : leftover_nuc_ex / sum_still_needed * still_needed[res];
            const extra_nuc_ex = Math.min(still_needed[res], extra_ex);
            const total_nuc_ex = extra_nuc_ex + min_nuc_ex[res];
            const coal_ex = extra_needed[res] - total_nuc_ex;
            nuc_boost_res[res] = total_nuc_ex / (NUCLEAR_BOOST -1) / resources[res];
            coal_boost_res[res] = coal_ex / (COAL_BOOST -1) / resources[res];
            sum_total_nuc_ex += total_nuc_ex;
            sum_coal_ex += coal_ex;
        }
        if (final) {
            coal_boost_res.push(1); nuc_boost_res.push(0);
            return [coal_boost_res, nuc_boost_res];
        }
        const coal_excess = resources[R.coal] * COAL_BOOST - total_needed_coal - ur_boost_cost - sum_coal_ex * (1- factor);
        nuc_boost_coal = Math.max(0, Math.min(1.0, -1* coal_excess / resources[R.coal] / factor / (NUCLEAR_BOOST - COAL_BOOST)));
        const nuc_check = nuc_extractors - sum_min_nuc_ex - nuc_boost_coal * resources[R.coal] * (NUCLEAR_BOOST -1);
        const coal_check = coal_excess + nuc_boost_coal * factor * (NUCLEAR_BOOST - COAL_BOOST) * resources[R.coal];
        extra_coal = resources[R.coal] * (nuc_boost_coal * NUCLEAR_BOOST + (1- nuc_boost_coal) * COAL_BOOST) - total_needed_coal;
        return nuc_check >= double_ERROR && coal_check >= double_ERROR;
    }

    const score_range = {...score};
    let estimate_score;
    for (let i = 0; i < 100; i++) {
        estimate_score = (score_range.max + score_range.min)/2;
        if (roundN(score_range.max - score_range.min, SIG) == 0.0) {break;}
        if (is_possible(estimate_score)) {
            score_range.min = estimate_score;
        } else {
            score_range.max = estimate_score;
        }
    }
    const [coal_boosts, nuc_boosts] = is_possible(estimate_score, nuc_boost_coal, true);
    const result = {
        score: estimate_score,
        boost: estimate_score / score.min,
        plants: nuclear_plants,
        extra_coal: extra_coal,
        coal_boosts: coal_boosts,
        nuc_boosts: nuc_boosts
    };
    return result;
}
//#endregion


//#region Show functions
async function show_recipe_ratios(boost_bool) {
    const all_items = (boost_bool)? (await Alt_Boost.solve()).items : (await Alt.solve()).items;
    let content = "Used Alt recipes:\n\n";
    for (const key of ALT_RECIPES) {
        const alt = all_items[key +"_ALT"];
        const norm = all_items[key];
        const value = (alt + norm <= 0)? 0 : (alt / (alt + norm));
        const percent = Math.max(0,Math.min(1,value));
        content += `${key.replace(/_/g,' ').padEnd(16, " ")} ${str_num(percent*100, 7, false)} %\n`;
    }
    output.style.fontSize = Math.min(13, window.innerWidth * 0.043 -0.5) +"px";
    output.textContent = content + "\n".repeat(25);
}

async function show_resource_boosts(alt_bool) {
    const boost_vars = (alt_bool)? (await Alt_Boost.solve()) : (Boost.solve());
    let content = "Resource      Coal      Nuclear\n\n";
    for (const res of RESOURCES) {
        const coal_per = Math.max(0,Math.min(1,boost_vars.coal_boosts[res.i]));
        const nuc_per = Math.max(0,Math.min(1,boost_vars. nuc_boosts[res.i]));
        const extractors = parseFloat(res.field.value) || 0;
        const coal_ext = coal_per * extractors;
        const nuc_ext = nuc_per * extractors;
        content += `${res.key.replace(/_/g,' ')}\n`;
        content += `${"  percentage"}: ${str_num(coal_per *100, 7)}   ${str_num(nuc_per *100, 7)}\n`
        content += `${"  extractors"}: ${str_num(coal_ext, 7)}   ${str_num(nuc_ext, 7)}\n\n`
    }
    output.style.fontSize = Math.min(13, window.innerWidth * 0.037 -0.5) +"px";
    output.textContent = content + "\n".repeat(30);
}

function show_result(item_dict) {
    let keys = Object.keys(item_dict);
    const first_keys = ["Earth_Token"];
    for (const res of RESOURCES) {
        first_keys.push(res.key);
    }
    const last_keys = keys.filter(item => !first_keys.includes(item));
    last_keys.sort();
    keys = first_keys.concat(last_keys);
    let content = "";
    for (const key of keys) {
        content += `${key.replace(/_/g,' ').padEnd(24, " ")} ${roundN(item_dict[key], 6)}\n`
        if (key == "Earth_Token" || key == "Uranium_Ore") {
            content += "\n";
        }
    }
    output.style.fontSize = Math.min(13, window.innerWidth * 0.03 -0.5) +"px";
    output.textContent = content + "\n";
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
