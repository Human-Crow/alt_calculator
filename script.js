import GLPK from './glpk.js';


document.addEventListener('DOMContentLoaded', () => {
    const fields = document.querySelectorAll('.resource');
    fields.forEach(field => {
        field.addEventListener('paste', e => {
            const data = e.clipboardData || window.clipboardData;
            if (data) {
                const text = data.getData('text/plain');
                text.split(/\s/).forEach((value, i) => {
                    fields[i] && (fields[i].value = value || '');
                });
            }
        });
    });
});


document.getElementById("alt_button").onclick = async function() {
    display_result(await alt_solver());
};
document.getElementById("norm_button").onclick = function() {
    display_result(norm_solver());
};
document.getElementById("rec_button").onclick = recipe_ratios;


const ET_RATIO = [7242, 5028, 7932, 5315, 6954, 3520];
const EX_RATE = 30;
const UR_EX_RATE = 10;
const ALT_RECIPES = [
    "Concrete","Copper_Wire","Electric_Motor","Electromagnet",
    "Industrial_Frame","Iron_Gear","Logic_Circuit","Rotor","Steel",
    "Super_Computer","Tungsten_Carbide","Turbocharger"
];

async function alt_solver() {
    const [
        Wood_Extractors,
        Stone_Extractors,
        Iron_Extractors,
        Copper_Extractors,
        Coal_Extractors,
        Wolframite_Extractors
    ] = get_extractor_values();
    const Uranium_Extractors = 0;

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
    
        const res = await glpk.solve(lp, opt);
        return res.result.vars;
    } catch (err) {
        console.error("Error:", err);
    }
}

function norm_solver() {
    const all_scores = [];
    const ex_values = get_extractor_values();
    for (let i = 0; i < ET_RATIO.length; i++) {
        all_scores.push(ex_values[i] * EX_RATE / ET_RATIO[i]);
    }
    const all = {};
    const Earth_Token = Math.min(...all_scores); all["Earth_Token"] = Earth_Token;
    const Matter_Duplicator = Earth_Token; all["Matter_Duplicator"] = Matter_Duplicator;
    const Atomic_Locator = 4 * Matter_Duplicator; all["Atomic_Locator"] = Atomic_Locator;
    const Energy_Cube = 5 * Matter_Duplicator; all["Energy_Cube"] = Energy_Cube;
    const Particle_Glue = 100 * Matter_Duplicator; all["Particle_Glue"] = Particle_Glue;
    const Quantum_Entangler = 2 * Matter_Duplicator; all["Quantum_Entangler"] = Quantum_Entangler;
    const Electron_Microscope = 2 * Atomic_Locator; all["Electron_Microscope"] = Electron_Microscope;
    const Super_Computer = 2 * Atomic_Locator; all["Super_Computer"] = Super_Computer;
    const Matter_Compressor = 1/10 * Particle_Glue; all["Matter_Compressor"] = Matter_Compressor;
    const Magnetic_Field_Generator = Quantum_Entangler; all["Magnetic_Field_Generator"] = Magnetic_Field_Generator;
    const Condenser_Lens = 4 * Electron_Microscope; all["Condenser_Lens"] = Condenser_Lens;
    const Tank = Matter_Compressor; all["Tank"] = Tank;
    const Stabilizer = 2 * Quantum_Entangler + Magnetic_Field_Generator; all["Stabilizer"] = Stabilizer;
    const Gyroscope = 2 * Stabilizer; all["Gyroscope"] = Gyroscope;
    const Computer = Stabilizer + 2 * Super_Computer; all["Computer"] = Computer;
    const Heat_Sink = 3 * Computer + 8 * Super_Computer; all["Heat_Sink"] = Heat_Sink;
    const Industrial_Frame = Energy_Cube + Matter_Compressor + Magnetic_Field_Generator; all["Industrial_Frame"] = Industrial_Frame;
    const Electric_Motor = Stabilizer + 2 * Matter_Compressor; all["Electric_Motor"] = Electric_Motor;
    const Battery = 2 * Energy_Cube + Electric_Motor; all["Battery"] = Battery;
    const Turbocharger = Super_Computer + 2 * Matter_Compressor; all["Turbocharger"] = Turbocharger;
    const Nano_Wire = 2 * Electron_Microscope + 2 * Turbocharger + 10 * Magnetic_Field_Generator; all["Nano_Wire"] = Nano_Wire;
    const Carbon_Fiber = 2 * Nano_Wire; all["Carbon_Fiber"] = Carbon_Fiber;
    const Concrete = 6 * Industrial_Frame + 4 * Tank + 24 * Atomic_Locator; all["Concrete"] = Concrete;
    const Electromagnet = 8 * Battery + 8 * Electron_Microscope + 10 * Magnetic_Field_Generator; all["Electromagnet"] = Electromagnet;
    const Logic_Circuit = 3 * Computer + 4 * Turbocharger; all["Logic_Circuit"] = Logic_Circuit;
    const Metal_Frame = Computer + 2 * Industrial_Frame + 2 * Electron_Microscope; all["Metal_Frame"] = Metal_Frame;
    const Rotor = 2 * Gyroscope + 2 * Electric_Motor; all["Rotor"] = Rotor;
    const Copper_Wire = 6 * Electromagnet + 3 * Logic_Circuit + 12 * Gyroscope + 50 * Atomic_Locator; all["Copper_Wire"] = Copper_Wire;
    const Copper_Ingot = 3/2 * Copper_Wire + 5 * Heat_Sink; all["Copper_Ingot"] = Copper_Ingot;
    const Coupler = 4 * Turbocharger + 8 * Super_Computer; all["Coupler"] = Coupler;
    const Nuclear_Fuel_Cell = 0; all["Nuclear_Fuel_Cell"] = Nuclear_Fuel_Cell;
    const Empty_Fuel_Cell = Nuclear_Fuel_Cell; all["Empty_Fuel_Cell"] = Empty_Fuel_Cell;
    const Enriched_Uranium = Nuclear_Fuel_Cell; all["Enriched_Uranium"] = Enriched_Uranium;
    const Steel_Rod = Rotor + Concrete; all["Steel_Rod"] = Steel_Rod;
    const Steel = 3 * Steel_Rod; all["Steel"] = Steel;
    const Glass = 3 * Condenser_Lens + 4 * Nano_Wire + 5 * Empty_Fuel_Cell + 2 * Tank; all["Glass"] = Glass;
    const Tungsten_Carbide = Coupler + 3 * Empty_Fuel_Cell + 8 * Industrial_Frame + 4 * Tank; all["Tungsten_Carbide"] = Tungsten_Carbide;
    const Tungsten_Ore = 2 * Tungsten_Carbide; all["Tungsten_Ore"] = Tungsten_Ore;
    const Graphite = 4 * Carbon_Fiber + 8 * Battery + Steel + Tungsten_Carbide; all["Graphite"] = Graphite;
    const Iron_Gear = 4 * Electric_Motor + 8 * Turbocharger; all["Iron_Gear"] = Iron_Gear;
    const Iron_Plating = 4 * Metal_Frame + 2 * Rotor; all["Iron_Plating"] = Iron_Plating;
    const Iron_Ingot = 2 * Iron_Gear + 2 * Iron_Plating + 2 * Electromagnet; all["Iron_Ingot"] = Iron_Ingot;
    const Silicon = 2 * Logic_Circuit; all["Silicon"] = Silicon;
    const Sand = 2 * Silicon + 4 * Glass + 10 * Concrete; all["Sand"] = Sand;
    const Wood_Frame = Metal_Frame; all["Wood_Frame"] = Wood_Frame;
    const Wood_Plank = 4 * Wood_Frame; all["Wood_Plank"] = Wood_Plank;
    const Wood_Log = Wood_Plank + 3 * Graphite; all["Wood_Log"] = Wood_Log;
    const Stone = Sand; all["Stone"] = Stone;
    const Iron_Ore = Iron_Ingot + 6 * Steel; all["Iron_Ore"] = Iron_Ore;
    const Copper_Ore = Copper_Ingot; all["Copper_Ore"] = Copper_Ore;
    const Coal = 3 * Graphite; all["Coal"] = Coal;
    const Wolframite = 5 * Tungsten_Ore; all["Wolframite"] = Wolframite;
    const Uranium_Ore = 30 * Enriched_Uranium; all["Uranium_Ore"] = Uranium_Ore;
    return all;
}

async function recipe_ratios() {
    const all_items = await alt_solver();
    let text_value = "";
    for (const key of ALT_RECIPES) {
        const alt = all_items[key +"_ALT"];
        const norm = all_items[key];
        const value = (alt + norm <= 0)? 0 : (alt / (alt + norm));
        text_value += `${key.replace(/_/g,' ')} ALT: ${Nround(value*100, 4)}%\n`;
    }
    document.getElementById("output").textContent = text_value;
}

function get_extractor_values() {
    let result = [];
    for (const resource of ["wood","stone","iron","copper","coal","wolframite"]) {
        const value = parseFloat(document.getElementById(resource).value);
        result.push(isNaN(value)? 0:value);
    }
    return result;
}

function display_result(item_dict) {
    let text_value = "";
    let keys = Object.keys(item_dict);
    const first_keys = [
        "Earth_Token", "Wood_Log", "Stone", "Iron_Ore", 
        "Copper_Ore", "Coal", "Wolframite","Uranium_Ore"
    ];
    const last_keys = keys.filter(item => !first_keys.includes(item));
    last_keys.sort();
    keys = first_keys.concat(last_keys);
    for (const key of keys) {
        text_value += `${key.replace(/_/g,' ')}: ${Nround(item_dict[key],6)}\n`
        if (key == "Earth_Token" || key == "Uranium_Ore") {
            text_value += "\n";
        }
    }
    document.getElementById("output").textContent = text_value;
}

function Nround(value, decimals) {
    return Math.round(value * 10**decimals) / (10**decimals);
}