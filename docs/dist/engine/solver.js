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
// at least the maximum (minus a rounding margin: an exact equality can make GLPK fail)
function get_target_con(item_name, amount, margin = 0) {
    return {
        vars: [
            { name: item_name, coef: 1.0 },
        ],
        bnds: { type: glpk.GLP_LO, lb: amount - margin * Math.max(1, Math.abs(amount)) },
    };
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
        subjectTo: constraints,
    };
    const result = await glpk.solve(lp_max, { msglev: glpk.GLP_MSG_OFF });
    const status = result.result.status;
    if (status !== glpk.GLP_OPT) {
        throw new Error(`Max Solver: ${status_text(status)}`);
    }
    return result;
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
export async function resource_solver(settings) {
    const { alt_ratios, selected_item } = settings;
    const constraints = [...general_cons];
    add_alt_cons(constraints, alt_ratios);
    await solve_shortfall(constraints, settings);
    const max_result = await solve_max(selected_item, constraints);
    const z = max_result.result.z;
    let min_res_result;
    let last_error;
    for (const margin of [1e-9, 1e-7, 1e-6]) {
        const target = get_target_con(selected_item, z, margin);
        try {
            min_res_result = await solve_min_resources([...constraints, target]);
            break;
        }
        catch (e) {
            last_error = e;
        }
    }
    if (min_res_result === undefined) {
        const reason = last_error instanceof Error ? last_error.message : String(last_error);
        throw new Error(reason);
    }
    console.log("Resource Solver finished");
    return min_res_result.result.vars;
}
export async function goal_solver(settings) {
    const { alt_ratios, selected_item, goal_amount, coal_pp, nuclear_pp } = settings;
    const constraints = [...general_cons];
    add_alt_cons(constraints, alt_ratios);
    add_fix_con(constraints, selected_item, goal_amount);
    add_fix_con(constraints, I.Coal_Power_Plant, coal_pp || 0);
    add_fix_con(constraints, I.Nuclear_Power_Plant, nuclear_pp || 0);
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