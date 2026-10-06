import GLPK from './glpk.js';
import { I } from '../data/enums.js';
import { ALT_ITEMS, RAW_ITEMS } from '../data/name_lists.js';
import { add_boosts, ex_name } from './boosts.js';
const glpk = await GLPK();
const general_cons = [
    {
        vars: [
            { name: 'Nuclear_Fuel_Cell', coef: 1.0 },
            { name: 'Nuclear_Power_Plant', coef: -0.5 },
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
            { name: 'Coal', coef: 1.0 },
            { name: 'Graphite', coef: -3.0 },
            { name: 'Steel_ALT', coef: -4.0 },
            { name: 'Coal_Power_Plant', coef: -10.0 },
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
    }
];
function status_text(status) {
    switch (status) {
        case glpk.GLP_UNDEF:
            return "Solution is undefined";
        case glpk.GLP_FEAS:
            return "Feasible solution found, but it may not be optimal";
        case glpk.GLP_INFEAS:
            return "Solution is infeasible";
        case glpk.GLP_NOFEAS:
            return "No feasible solution exists";
        case glpk.GLP_OPT:
            return "Optimal solution found";
        case glpk.GLP_UNBND:
            return "Problem is unbounded";
        default:
            return `Unknown status (${status})`;
    }
}
function add_alt_cons(constraints, alt_ratios) {
    for (const name of ALT_ITEMS) {
        const ratio = alt_ratios.get(name);
        if (ratio === undefined) {
            continue;
        }
        const constraint = {
            vars: [
                { name: name, coef: -1 * ratio },
                { name: `${name}_ALT`, coef: 1.0 },
            ],
            bnds: { type: glpk.GLP_FX, ub: 0.0, lb: 0.0 },
        };
        constraints.push(constraint);
    }
}
function add_fix_con(constraints, item_name, amount) {
    constraints.push({
        vars: [
            { name: item_name, coef: 1.0 },
        ],
        bnds: { type: glpk.GLP_FX, ub: amount, lb: amount },
    });
}
// raw items, power plant boosts and power plants (boosts.ts)
async function solve_shortfall(constraints, settings) {
    const shortfall = await add_boosts(constraints, glpk, settings);
    if (shortfall.length <= 0)
        return;
    // entered boost shares: plants left out only when the fuel cannot run the estimated number
    const lp = {
        name: 'LP',
        objective: { direction: glpk.GLP_MIN, vars: shortfall.map((name) => ({ name, coef: 1.0 })) },
        subjectTo: constraints,
    };
    const result = await glpk.solve(lp, { msglev: glpk.GLP_MSG_OFF });
    if (result.result.status !== glpk.GLP_OPT) {
        throw new Error(`Shortfall Solver: ${status_text(result.result.status)}`);
    }
    const s = result.result.z;
    constraints.push({
        vars: shortfall.map((name) => ({ name, coef: 1.0 })),
        bnds: { type: glpk.GLP_UP, ub: s + 1e-9 * Math.max(1, s), lb: 0.0 },
    });
}
async function solve_max(item_name, constraints) {
    const lp_max = {
        name: 'LP',
        objective: {
            direction: glpk.GLP_MAX,
            vars: [
                { name: item_name, coef: 1.0 },
            ],
        },
        // named: GLPK then reports every constraint's dual price (used by optimal_face)
        subjectTo: constraints.map((c, i) => ({ ...c, name: `r${i}` })),
    };
    const result = await glpk.solve(lp_max, { msglev: glpk.GLP_MSG_OFF });
    const status = result.result.status;
    if (status !== glpk.GLP_OPT) {
        throw new Error(`Max Solver: ${status_text(status)}`);
    }
    return result;
}
/**
 * The constraints of every solution that reaches the maximum, from the maximum's dual prices (complementary
 * slackness), so the second solve needs no target number and no margin:
 *   - a constraint with a non-zero price is a bottleneck: it stays exactly at its bound (made = used, all
 *     extracted, ...), at the original bound from the input;
 *   - a variable that is 0 in the maximum and would lower it (non-zero reduced cost) stays 0.
 * Any solution of these constraints reaches the same maximum, and the maximum's own solution is one of them (only
 * constraints that are tight there and variables that are 0 there are fixed), so the second solve always has a
 * solution.
 */
function optimal_face(item_name, constraints, max) {
    const dual = max.result.dual ?? {};
    const x = max.result.vars;
    const reduced = new Map([[item_name, 1.0]]); // c_j - sum_i y_i a_ij
    const face = [];
    constraints.forEach((c, i) => {
        const y = dual[`r${i}`] ?? 0;
        let bnds = c.bnds;
        for (const t of c.vars)
            reduced.set(t.name, (reduced.get(t.name) ?? 0) - y * t.coef);
        if (y !== 0 && (c.bnds.type === glpk.GLP_LO || c.bnds.type === glpk.GLP_UP)) {
            const bound = (c.bnds.type === glpk.GLP_LO ? c.bnds.lb : c.bnds.ub) ?? 0;
            // tight in the maximum's solution (within GLPK's own tolerance, relative to the size of the row's terms)
            let activity = 0, size = Math.abs(bound);
            for (const t of c.vars) {
                const v = t.coef * (x[t.name] ?? 0);
                activity += v;
                size += Math.abs(v);
            }
            if (Math.abs(activity - bound) <= 1e-7 * Math.max(1, size)) {
                bnds = { type: glpk.GLP_FX, lb: bound, ub: bound };
            }
        }
        face.push({ vars: c.vars, bnds });
    });
    for (const [name, d] of reduced) {
        if ((x[name] ?? 0) === 0 && Math.abs(d) > 1e-11) {
            face.push({ vars: [{ name, coef: 1.0 }], bnds: { type: glpk.GLP_FX, lb: 0.0, ub: 0.0 } });
        }
    }
    return face;
}
async function solve_min_resources(constraints) {
    const lp_min = {
        name: 'LP',
        objective: {
            direction: glpk.GLP_MIN,
            vars: [
                { name: "Resource_Sum", coef: 1.0 },
            ],
        },
        subjectTo: constraints,
    };
    const result = await glpk.solve(lp_min, { msglev: glpk.GLP_MSG_OFF });
    const status = result.result.status;
    if (status !== glpk.GLP_OPT) {
        throw new Error(`Min Solver: ${status_text(status)}`);
    }
    return result;
}
/** set by resource_solver when its safety net was used (read once with take_solver_warning) */
let solver_warning;
export function take_solver_warning() {
    const w = solver_warning;
    solver_warning = undefined;
    return w;
}
export async function resource_solver(settings) {
    solver_warning = undefined;
    const { alt_ratios, selected_item } = settings;
    const constraints = [...general_cons];
    add_alt_cons(constraints, alt_ratios);
    await solve_shortfall(constraints, settings);
    // 1. the maximum
    const max_result = await solve_max(selected_item, constraints);
    const z = max_result.result.z;
    // 2. among all solutions reaching that maximum, the one using the fewest resources (see optimal_face)
    let min_res_result;
    try {
        min_res_result = await solve_min_resources(optimal_face(selected_item, constraints, max_result));
    }
    catch (e) {
        console.warn("Resource Solver: the fewest-resources step failed, showing the maximum's own solution", e);
    }
    const reached = min_res_result?.result.vars[selected_item] ?? 0;
    const same = Math.abs(reached - z) <= 1e-9 * Math.max(1, Math.abs(z))
        || (Math.abs(z) < 1e-7 && Math.abs(reached) < 1e-7); // nothing can be made: both are rounding noise around 0
    if (min_res_result === undefined || !same) {
        if (min_res_result !== undefined) {
            console.warn(`Resource Solver: the fewest-resources step reached ${reached} instead of ${z}; showing the maximum's own solution`);
        }
        solver_warning = "The fewest-resources step did not work out for these inputs, so this shows the first plan that " +
            "reaches the maximum: the amount is right, but it may use more resources than needed. Please report these " +
            "inputs (Export) so it can be fixed.";
        console.log("Resource Solver finished");
        return max_result.result.vars;
    }
    console.log("Resource Solver finished");
    return min_res_result.result.vars;
}
export async function goal_solver(settings) {
    const { alt_ratios, selected_item, goal_amount, coal_pp, nuclear_pp } = settings;
    const constraints = [...general_cons];
    add_alt_cons(constraints, alt_ratios);
    // Fix every amount only once: when the goal item is itself a power
    // plant, fixing it to both the goal and the power plant count makes
    // the problem infeasible (e.g. Nuclear_Power_Plant = 1 and = 0).
    // The total is then the larger of the two, like in the tree (tree.ts).
    const fixed = new Map([
        [I.Coal_Power_Plant, coal_pp || 0],
        [I.Nuclear_Power_Plant, nuclear_pp || 0],
    ]);
    fixed.set(selected_item, Math.max(goal_amount, fixed.get(selected_item) ?? 0));
    for (const [item_name, amount] of fixed) {
        add_fix_con(constraints, item_name, amount);
    }
    const min_res_result = await solve_min_resources(constraints);
    console.log("Goal Solver finished");
    return min_res_result.result.vars;
}
export function get_resource_boosts(all_items) {
    const coal_fracs = new Map();
    const nuclear_fracs = new Map();
    for (const name of RAW_ITEMS) {
        const x = ex_name(name);
        const total_ex = all_items[x + "_Ex"] ?? 0;
        const coal_ex = all_items[x + "_Coal_Ex"] ?? 0;
        const nuc_ex = all_items[x + "_Nuc_Ex"] ?? 0;
        const coal_per = (total_ex <= 0) ? 0 : Math.max(0, Math.min(1, coal_ex / total_ex));
        const nuc_per = (total_ex <= 0) ? 0 : Math.max(0, Math.min(1, nuc_ex / total_ex));
        coal_fracs.set(name, coal_per);
        nuclear_fracs.set(name, nuc_per);
    }
    return { coal_fracs, nuclear_fracs };
}
export function get_alt_ratios(all_items) {
    const alt_ratios = new Map();
    for (const name of ALT_ITEMS) {
        const alt = all_items[name + "_ALT"] ?? 0;
        const std = all_items[name + "_STD"] ?? 0;
        const total = alt + std;
        const value = (total <= 0) ? 0 : (alt / total);
        const percent = Math.max(0, Math.min(1, value));
        alt_ratios.set(name, percent);
    }
    return alt_ratios;
}
//# sourceMappingURL=solver.js.map