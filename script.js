import GLPK from './glpk.js';

document.getElementById("calc_button").addEventListener("click", function () {
    const Wood_Extractors = parseFloat(document.getElementById("wood").value);
    const Stone_Extractors = parseFloat(document.getElementById("stone").value);
    const Iron_Extractors = parseFloat(document.getElementById("iron").value);
    const Copper_Extractors = parseFloat(document.getElementById("copper").value);
    const Coal_Extractors = parseFloat(document.getElementById("coal").value);
    const Wolframite_Extractors = parseFloat(document.getElementById("wolframite").value);
    const Uranium_Extractors = 0;

    (async () => {
        const glpk = await GLPK();
    
        function solver_output(res) {
            console.log(res)
            document.getElementById("score").textContent = "Score: " + res.result.z;
            const el = window.document.getElementById('all_items');
            el.innerHTML = `All Items:
                            ${JSON.stringify(res.result.vars, null, 2)
                            .replace(/ /g,'').replace(/:/g,': ').replace(/"/g,'')
                            .replace(/_/g,' ').replace(/,/g,'')
                            .replace(/{/g,'').replace(/}/g,'')}`;
        };
    
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
                    bnds: { type: glpk.GLP_UP, ub: Wood_Extractors * 30, lb: 0.0},
                },
                {
                    vars: [
                        { name: 'Stone', coef: 1.0 },
                    ],
                    bnds: { type: glpk.GLP_UP, ub: Stone_Extractors * 30, lb: 0.0},
                },
                {
                    vars: [
                        { name: 'Iron_Ore', coef: 1.0 },
                    ],
                    bnds: { type: glpk.GLP_UP, ub: Iron_Extractors * 30, lb: 0.0},
                },
                {
                    vars: [
                        { name: 'Copper_Ore', coef: 1.0 },
                    ],
                    bnds: { type: glpk.GLP_UP, ub: Copper_Extractors * 30, lb: 0.0},
                },
                {
                    vars: [
                        { name: 'Coal', coef: 1.0 },
                    ],
                    bnds: { type: glpk.GLP_UP, ub: Coal_Extractors * 30, lb: 0.0},
                },
                {
                    vars: [
                        { name: 'Wolframite', coef: 1.0 },
                    ],
                    bnds: { type: glpk.GLP_UP, ub: Wolframite_Extractors * 30, lb: 0.0},
                },
                {
                    vars: [
                        { name: 'Uranium_Ore', coef: 1.0 },
                    ],
                    bnds: { type: glpk.GLP_UP, ub: Uranium_Extractors * 10, lb: 0.0},
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
    
        glpk.solve(lp, opt)
            .then(res => solver_output(res))
            .catch(err => console.log(err));
    })();
});


