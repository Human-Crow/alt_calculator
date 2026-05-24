// cd alt_calculator; if ($?) { npx tsc --watch }
import GLPK from './glpk.js';
const glpk = await GLPK();
export const EX_RATE = [30, 150];
export const EX_RATE_UR = [10, 50];
export const NPP_RATE = 0.5;
export const CPP_RATE = 10;
export const NUC_BOOST = [1.4 * (3600 / 3612), 1.6];
export const COAL_BOOST = 1.2;
export const EX_NPP = [44, 15.7];
export const EX_CPP = [11, 4];
export const EX_NPP_UR = [8.5, 3.9];
export const EX_CPP_UR = [6.5, 3.0];
export const RAW_RESOURCES = new Set([
    "Wood_Log",
    "Stone",
    "Iron_Ore",
    "Copper_Ore",
    "Coal",
    "Wolframite",
    "Uranium_Ore"
]);
export const ALT_RECIPES = new Set([
    "Concrete", "Copper_Wire", "Electric_Motor", "Electromagnet",
    "Industrial_Frame", "Iron_Gear", "Logic_Circuit", "Rotor", "Steel",
    "Super_Computer", "Tungsten_Carbide", "Turbocharger"
]);
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
const boost_cons_gen_1 = [
    {
        vars: [
            { name: 'Wood_Nuc_Ex', coef: 1.0 },
            { name: 'Wood_Ex', coef: -0.9 },
        ],
        bnds: { type: glpk.GLP_UP, ub: 0.0 },
    },
    {
        vars: [
            { name: 'Stone_Nuc_Ex', coef: 1.0 },
            { name: 'Stone_Ex', coef: -0.9 },
        ],
        bnds: { type: glpk.GLP_UP, ub: 0.0 },
    },
    {
        vars: [
            { name: 'Iron_Nuc_Ex', coef: 1.0 },
            { name: 'Iron_Ex', coef: -0.9 },
        ],
        bnds: { type: glpk.GLP_UP, ub: 0.0 },
    },
    {
        vars: [
            { name: 'Copper_Nuc_Ex', coef: 1.0 },
            { name: 'Copper_Ex', coef: -0.9 },
        ],
        bnds: { type: glpk.GLP_UP, ub: 0.0 },
    },
    {
        vars: [
            { name: 'Coal_Nuc_Ex', coef: 1.0 },
            { name: 'Coal_Ex', coef: -0.9 },
        ],
        bnds: { type: glpk.GLP_UP, ub: 0.0 },
    },
    {
        vars: [
            { name: 'Wolframite_Nuc_Ex', coef: 1.0 },
            { name: 'Wolframite_Ex', coef: -0.9 },
        ],
        bnds: { type: glpk.GLP_UP, ub: 0.0 },
    },
    {
        vars: [
            { name: 'Uranium_Nuc_Ex', coef: 1.0 },
            { name: 'Uranium_Ex', coef: -0.2 },
        ],
        bnds: { type: glpk.GLP_UP, ub: 0.0 },
    },
];
function get_resource_constraints(resources, alt, boost, gen_2) {
    const gen_i = gen_2 ? 1 : 0;
    const max_frac = gen_2 ? 1.00 : 0.95;
    const Wood_Extractors = resources["Wood_Log"] || 0;
    const Stone_Extractors = resources["Stone"] || 0;
    const Iron_Extractors = resources["Iron_Ore"] || 0;
    const Copper_Extractors = resources["Copper_Ore"] || 0;
    const Coal_Extractors = resources["Coal"] || 0;
    const Wolframite_Extractors = resources["Wolframite"] || 0;
    const Uranium_Extractors = resources["Uranium_Ore"] || 0;
    const resource_cons = [
        {
            vars: [
                { name: 'Wood_Ex', coef: 1.0 },
            ],
            bnds: { type: glpk.GLP_FX, ub: Wood_Extractors, lb: Wood_Extractors },
        },
        {
            vars: [
                { name: 'Stone_Ex', coef: 1.0 },
            ],
            bnds: { type: glpk.GLP_FX, ub: Stone_Extractors, lb: Stone_Extractors },
        },
        {
            vars: [
                { name: 'Iron_Ex', coef: 1.0 },
            ],
            bnds: { type: glpk.GLP_FX, ub: Iron_Extractors, lb: Iron_Extractors },
        },
        {
            vars: [
                { name: 'Copper_Ex', coef: 1.0 },
            ],
            bnds: { type: glpk.GLP_FX, ub: Copper_Extractors, lb: Copper_Extractors },
        },
        {
            vars: [
                { name: 'Coal_Ex', coef: 1.0 },
            ],
            bnds: { type: glpk.GLP_FX, ub: Coal_Extractors, lb: Coal_Extractors },
        },
        {
            vars: [
                { name: 'Wolframite_Ex', coef: 1.0 },
            ],
            bnds: { type: glpk.GLP_FX, ub: Wolframite_Extractors, lb: Wolframite_Extractors },
        },
        {
            vars: [
                { name: 'Uranium_Ex', coef: 1.0 },
            ],
            bnds: { type: glpk.GLP_FX, ub: Uranium_Extractors, lb: Uranium_Extractors },
        }
    ];
    const general_boost_cons = [
        {
            vars: [
                { name: 'Wood_Coal_Ex', coef: 1.0 },
                { name: 'Wood_Nuc_Ex', coef: 1.0 },
                { name: 'Wood_Ex', coef: -1.0 * max_frac },
            ],
            bnds: { type: glpk.GLP_UP, ub: 0.0 },
        },
        {
            vars: [
                { name: 'Stone_Coal_Ex', coef: 1.0 },
                { name: 'Stone_Nuc_Ex', coef: 1.0 },
                { name: 'Stone_Ex', coef: -1.0 * max_frac },
            ],
            bnds: { type: glpk.GLP_UP, ub: 0.0 },
        },
        {
            vars: [
                { name: 'Iron_Coal_Ex', coef: 1.0 },
                { name: 'Iron_Nuc_Ex', coef: 1.0 },
                { name: 'Iron_Ex', coef: -1.0 * max_frac },
            ],
            bnds: { type: glpk.GLP_UP, ub: 0.0 },
        },
        {
            vars: [
                { name: 'Copper_Coal_Ex', coef: 1.0 },
                { name: 'Copper_Nuc_Ex', coef: 1.0 },
                { name: 'Copper_Ex', coef: -1.0 * max_frac },
            ],
            bnds: { type: glpk.GLP_UP, ub: 0.0 },
        },
        {
            vars: [
                { name: 'Coal_Coal_Ex', coef: 1.0 },
                { name: 'Coal_Nuc_Ex', coef: 1.0 },
                { name: 'Coal_Ex', coef: -1.0 * max_frac },
            ],
            bnds: { type: glpk.GLP_UP, ub: 0.0 },
        },
        {
            vars: [
                { name: 'Wolframite_Coal_Ex', coef: 1.0 },
                { name: 'Wolframite_Nuc_Ex', coef: 1.0 },
                { name: 'Wolframite_Ex', coef: -1.0 * max_frac },
            ],
            bnds: { type: glpk.GLP_UP, ub: 0.0 },
        },
        {
            vars: [
                { name: 'Uranium_Coal_Ex', coef: 1.0 },
                { name: 'Uranium_Nuc_Ex', coef: 1.0 },
                { name: 'Uranium_Ex', coef: -1.0 * max_frac },
            ],
            bnds: { type: glpk.GLP_UP, ub: 0.0 },
        },
        {
            vars: [
                { name: 'Coal_Power_Plant', coef: 1.0 },
                { name: 'Wood_Coal_Ex', coef: -1.0 / EX_CPP[gen_i] },
                { name: 'Stone_Coal_Ex', coef: -1.0 / EX_CPP[gen_i] },
                { name: 'Iron_Coal_Ex', coef: -1.0 / EX_CPP[gen_i] },
                { name: 'Copper_Coal_Ex', coef: -1.0 / EX_CPP[gen_i] },
                { name: 'Coal_Coal_Ex', coef: -1.0 / EX_CPP[gen_i] },
                { name: 'Wolframite_Coal_Ex', coef: -1.0 / EX_CPP[gen_i] },
                { name: 'Uranium_Coal_Ex', coef: -1.0 / EX_CPP_UR[gen_i] },
            ],
            bnds: { type: glpk.GLP_FX, ub: 0.0, lb: 0.0 },
        },
        {
            vars: [
                { name: 'Nuclear_Power_Plant', coef: 1.0 },
                { name: 'Nuclear_Fuel_Cell', coef: -1.0 / NPP_RATE },
            ],
            bnds: { type: glpk.GLP_FX, ub: 0.0, lb: 0.0 },
        },
        {
            vars: [
                { name: 'Nuclear_Power_Plant', coef: 1.0 },
                { name: 'Wood_Nuc_Ex', coef: -1.0 / EX_NPP[gen_i] },
                { name: 'Stone_Nuc_Ex', coef: -1.0 / EX_NPP[gen_i] },
                { name: 'Iron_Nuc_Ex', coef: -1.0 / EX_NPP[gen_i] },
                { name: 'Copper_Nuc_Ex', coef: -1.0 / EX_NPP[gen_i] },
                { name: 'Coal_Nuc_Ex', coef: -1.0 / EX_NPP[gen_i] },
                { name: 'Wolframite_Nuc_Ex', coef: -1.0 / EX_NPP[gen_i] },
                { name: 'Uranium_Nuc_Ex', coef: -1.0 / EX_NPP_UR[gen_i] },
            ],
            bnds: { type: glpk.GLP_FX, ub: 0.0, lb: 0.0 },
        },
        {
            vars: [
                { name: 'Wood_Log', coef: 1.0 },
                { name: 'Wood_Coal_Ex', coef: (1 - COAL_BOOST) * EX_RATE[gen_i] },
                { name: 'Wood_Nuc_Ex', coef: (1 - NUC_BOOST[gen_i]) * EX_RATE[gen_i] },
                { name: 'Wood_Ex', coef: -1.0 * EX_RATE[gen_i] },
            ],
            bnds: { type: glpk.GLP_UP, ub: 0.0 },
        },
        {
            vars: [
                { name: 'Stone', coef: 1.0 },
                { name: 'Stone_Coal_Ex', coef: (1 - COAL_BOOST) * EX_RATE[gen_i] },
                { name: 'Stone_Nuc_Ex', coef: (1 - NUC_BOOST[gen_i]) * EX_RATE[gen_i] },
                { name: 'Stone_Ex', coef: -1.0 * EX_RATE[gen_i] },
            ],
            bnds: { type: glpk.GLP_UP, ub: 0.0 },
        },
        {
            vars: [
                { name: 'Iron_Ore', coef: 1.0 },
                { name: 'Iron_Coal_Ex', coef: (1 - COAL_BOOST) * EX_RATE[gen_i] },
                { name: 'Iron_Nuc_Ex', coef: (1 - NUC_BOOST[gen_i]) * EX_RATE[gen_i] },
                { name: 'Iron_Ex', coef: -1.0 * EX_RATE[gen_i] },
            ],
            bnds: { type: glpk.GLP_UP, ub: 0.0 },
        },
        {
            vars: [
                { name: 'Copper_Ore', coef: 1.0 },
                { name: 'Copper_Coal_Ex', coef: (1 - COAL_BOOST) * EX_RATE[gen_i] },
                { name: 'Copper_Nuc_Ex', coef: (1 - NUC_BOOST[gen_i]) * EX_RATE[gen_i] },
                { name: 'Copper_Ex', coef: -1.0 * EX_RATE[gen_i] },
            ],
            bnds: { type: glpk.GLP_UP, ub: 0.0 },
        },
        {
            vars: [
                { name: 'Coal', coef: 1.0 },
                { name: 'Coal_RAW', coef: -1.0 },
                { name: 'Coal_Power_Plant', coef: -1.0 * CPP_RATE },
            ],
            bnds: { type: glpk.GLP_FX, ub: 0.0, lb: 0.0 },
        },
        {
            vars: [
                { name: 'Coal', coef: 1.0 },
                { name: 'Coal_Coal_Ex', coef: (1 - COAL_BOOST) * EX_RATE[gen_i] },
                { name: 'Coal_Nuc_Ex', coef: (1 - NUC_BOOST[gen_i]) * EX_RATE[gen_i] },
                { name: 'Coal_Ex', coef: -1.0 * EX_RATE[gen_i] },
            ],
            bnds: { type: glpk.GLP_UP, ub: 0.0 },
        },
        {
            vars: [
                { name: 'Wolframite', coef: 1.0 },
                { name: 'Wolframite_Coal_Ex', coef: (1 - COAL_BOOST) * EX_RATE[gen_i] },
                { name: 'Wolframite_Nuc_Ex', coef: (1 - NUC_BOOST[gen_i]) * EX_RATE[gen_i] },
                { name: 'Wolframite_Ex', coef: -1.0 * EX_RATE[gen_i] },
            ],
            bnds: { type: glpk.GLP_UP, ub: 0.0 },
        },
        {
            vars: [
                { name: 'Uranium_Ore', coef: 1.0 },
                { name: 'Uranium_Coal_Ex', coef: (1 - COAL_BOOST) * EX_RATE_UR[gen_i] },
                { name: 'Uranium_Nuc_Ex', coef: (1 - NUC_BOOST[gen_i]) * EX_RATE_UR[gen_i] },
                { name: 'Uranium_Ex', coef: -1.0 * EX_RATE_UR[gen_i] },
            ],
            bnds: { type: glpk.GLP_UP, ub: 0.0 },
        }
    ];
    const non_boost_cons = [
        {
            vars: [
                { name: 'Wood_Log', coef: 1.0 },
                { name: 'Wood_Ex', coef: -1.0 * EX_RATE[gen_i] },
            ],
            bnds: { type: glpk.GLP_UP, ub: 0.0 },
        },
        {
            vars: [
                { name: 'Stone', coef: 1.0 },
                { name: 'Stone_Ex', coef: -1.0 * EX_RATE[gen_i] },
            ],
            bnds: { type: glpk.GLP_UP, ub: 0.0 },
        },
        {
            vars: [
                { name: 'Iron_Ore', coef: 1.0 },
                { name: 'Iron_Ex', coef: -1.0 * EX_RATE[gen_i] },
            ],
            bnds: { type: glpk.GLP_UP, ub: 0.0 },
        },
        {
            vars: [
                { name: 'Copper_Ore', coef: 1.0 },
                { name: 'Copper_Ex', coef: -1.0 * EX_RATE[gen_i] },
            ],
            bnds: { type: glpk.GLP_UP, ub: 0.0 },
        },
        {
            vars: [
                { name: 'Coal', coef: 1.0 },
                { name: 'Coal_Ex', coef: -1.0 * EX_RATE[gen_i] },
            ],
            bnds: { type: glpk.GLP_UP, ub: 0.0 },
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
                { name: 'Wolframite_Ex', coef: -1.0 * EX_RATE[gen_i] },
            ],
            bnds: { type: glpk.GLP_UP, ub: 0.0 },
        },
        {
            vars: [
                { name: 'Uranium_Ore', coef: 1.0 },
                { name: 'Uranium_Ex', coef: -1.0 * EX_RATE_UR[gen_i] },
            ],
            bnds: { type: glpk.GLP_UP, ub: 0.0 },
        }
    ];
    const boost_cons_gen = gen_2
        ? general_boost_cons
        : general_boost_cons.concat(boost_cons_gen_1);
    const boost_cons = boost ? boost_cons_gen : non_boost_cons;
    return alt
        ? general_cons.concat(resource_cons).concat(boost_cons)
        : general_cons.concat(resource_cons).concat(boost_cons).concat(non_alt_cons);
}
function get_goal_constraints(alt) {
    return (alt) ? general_cons : general_cons.concat(non_alt_cons);
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
    return await glpk.solve(lp_max, { msglev: glpk.GLP_MSG_OFF });
}
async function solve_min_resources(item_name, amount, constraints) {
    constraints.push({
        vars: [
            { name: item_name, coef: 1.0 },
        ],
        bnds: { type: glpk.GLP_FX, ub: amount, lb: amount },
    });
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
    return await glpk.solve(lp_min, { msglev: glpk.GLP_MSG_OFF });
}
export async function resource_solver(item_name, resources, alt, boost, gen_2) {
    const constraints = get_resource_constraints(resources, alt, boost, gen_2);
    const max_result = await solve_max(item_name, constraints);
    const min_res_result = await solve_min_resources(item_name, max_result.result.z, constraints);
    console.log("resource_solver finished successfully!");
    return min_res_result.result.vars;
}
export async function goal_solver(item_name, amount, alt) {
    let constraints = get_goal_constraints(alt);
    const min_res_result = await solve_min_resources(item_name, amount, constraints);
    console.log("goal_solver finished successfully!");
    return min_res_result.result.vars;
}
export function get_resource_boosts(all_items) {
    const result = {};
    for (const res_name of RAW_RESOURCES) {
        const base = res_name.split("_")[0];
        const total_ex = all_items[base + "_Ex"] ?? 0;
        const coal_ex = all_items[base + "_Coal_Ex"] ?? 0;
        const nuc_ex = all_items[base + "_Nuc_Ex"] ?? 0;
        const coal_per = (total_ex <= 0) ? 0 : Math.max(0, Math.min(1, coal_ex / total_ex));
        const nuc_per = (total_ex <= 0) ? 0 : Math.max(0, Math.min(1, nuc_ex / total_ex));
        result[res_name] = [coal_per, nuc_per, coal_ex, nuc_ex];
    }
    return result;
}
export function get_alt_ratios(all_items, split) {
    const npp_items = {
        Steel: 2.25,
        Tungsten_Carbide: 1.5
    };
    const npps = (all_items["Nuclear_Power_Plant"] || 0);
    const result = {};
    for (const name of ALT_RECIPES) {
        let alt = all_items[name + "_ALT"] ?? 0;
        if (split) {
            alt -= npps * (npp_items[name] ?? 0);
        }
        const std = all_items[name + "_STD"] ?? 0;
        const total = alt + std;
        const value = (total <= 0) ? 0 : (alt / total);
        const percent = Math.max(0, Math.min(1, value));
        result[name] = percent;
    }
    return result;
}
//# sourceMappingURL=solver.js.map