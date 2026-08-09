import GLPK from './glpk.js';
import type { Constraint, LPModel, LPResult } from "./glpk.js";
import { ItemId, Settings, Pair, NumberRec, ItemMap, VariantId, BuildMap } from '../data/types.js';
import { I, V } from '../data/enums.js';
import { C_BOOST, N_BOOST } from '../data/constants.js';
import { ALT_ITEMS, RAW_ITEMS } from '../data/name_lists.js';
import { get_speed } from './production.js';





const glpk = await GLPK();


const EX_CPP    : Pair = [11 , 4   ];
const EX_CPP_UR : Pair = [6.5, 3.0 ];
const EX_NPP    : Pair = [44 , 15.7];
const EX_NPP_UR : Pair = [8.5,  3.9];

const NPP_RATE: number = 0.5;
const CPP_RATE: number = 10;


const boost_cons: Constraint[] = [
    {
        vars: [
            { name: 'Wood_Coal_Ex', coef: 1.0 },
            { name: 'Wood_Nuc_Ex', coef: 1.0 },
            { name: 'Wood_Ex', coef: -1.0 },
        ],
        bnds: { type: glpk.GLP_UP, ub: 0.0},
    },
    {
        vars: [
            { name: 'Stone_Coal_Ex', coef: 1.0 },
            { name: 'Stone_Nuc_Ex', coef: 1.0 },
            { name: 'Stone_Ex', coef: -1.0 },
        ],
        bnds: { type: glpk.GLP_UP, ub: 0.0},
    },
    {
        vars: [
            { name: 'Iron_Coal_Ex', coef: 1.0 },
            { name: 'Iron_Nuc_Ex', coef: 1.0 },
            { name: 'Iron_Ex', coef: -1.0 },
        ],
        bnds: { type: glpk.GLP_UP, ub: 0.0},
    },
    {
        vars: [
            { name: 'Copper_Coal_Ex', coef: 1.0 },
            { name: 'Copper_Nuc_Ex', coef: 1.0 },
            { name: 'Copper_Ex', coef: -1.0 },
        ],
        bnds: { type: glpk.GLP_UP, ub: 0.0},
    },
    {
        vars: [
            { name: 'Coal_Coal_Ex', coef: 1.0 },
            { name: 'Coal_Nuc_Ex', coef: 1.0 },
            { name: 'Coal_Ex', coef: -1.0 },
        ],
        bnds: { type: glpk.GLP_UP, ub: 0.0},
    },
    {
        vars: [
            { name: 'Wolframite_Coal_Ex', coef: 1.0 },
            { name: 'Wolframite_Nuc_Ex', coef: 1.0 },
            { name: 'Wolframite_Ex', coef: -1.0 },
        ],
        bnds: { type: glpk.GLP_UP, ub: 0.0},
    },
    {
        vars: [
            { name: 'Uranium_Coal_Ex', coef: 1.0 },
            { name: 'Uranium_Nuc_Ex', coef: 1.0 },
            { name: 'Uranium_Ex', coef: -1.0 },
        ],
        bnds: { type: glpk.GLP_UP, ub: 0.0},
    }
];

const general_cons: Constraint[] = [
    {
        vars: [
            { name: 'Nuclear_Power_Plant', coef: 1.0 },
            { name: 'Nuclear_Fuel_Cell', coef: -1.0 / NPP_RATE },
        ],
        bnds: { type: glpk.GLP_FX, ub: 0.0, lb: 0.0},
    },
    {
        vars: [
            { name: 'Coal', coef: 1.0 },
            { name: 'Coal_RAW', coef: -1.0 },
            { name: 'Coal_Power_Plant', coef: -1.0 * CPP_RATE },
        ],
        bnds: { type: glpk.GLP_FX, ub: 0.0, lb: 0.0},
    },
    {
        vars: [
            { name: 'Coal', coef: 1.0 },
            { name: 'Coal_RAW', coef: -1.0 },
        ],
        bnds: { type: glpk.GLP_LO, lb: 0.0},
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
            { name: 'Steel_STD', coef: -6.0 },
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
            { name: 'Coal_RAW', coef: 1.0 },
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
            { name: 'Electric_Motor_STD', coef: -1.0 },
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
            { name: 'Super_Computer_STD', coef: -2.0 },
            { name: 'Super_Computer_ALT', coef: -1.0 },
            { name: 'Turbocharger_ALT', coef: -1.0 },
        ],
        bnds: { type: glpk.GLP_LO, lb: 0.0},
    },
    {
        vars: [
            { name: 'Concrete', coef: 1.0 },
            { name: 'Concrete_STD', coef: -1.0 },
            { name: 'Concrete_ALT', coef: -1.0 },
        ],
        bnds: { type: glpk.GLP_FX, ub: 0.0, lb: 0.0},
    },
    {
        vars: [
            { name: 'Concrete', coef: 1.0 },
            { name: 'Industrial_Frame_STD', coef: -6.0 },
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
            { name: 'Copper_Wire_STD', coef: -1.5 },
            { name: 'Heat_Sink', coef: -5.0 },
            { name: 'Rotor_ALT', coef: -18.0 },
        ],
        bnds: { type: glpk.GLP_LO, lb: 0.0},
    },
    {
        vars: [
            { name: 'Copper_Wire', coef: 1.0 },
            { name: 'Copper_Wire_STD', coef: -1.0 },
            { name: 'Copper_Wire_ALT', coef: -1.0 },
        ],
        bnds: { type: glpk.GLP_FX, ub: 0.0, lb: 0.0},
    },
    {
        vars: [
            { name: 'Copper_Wire', coef: 1.0 },
            { name: 'Electromagnet_STD', coef: -6.0 },
            { name: 'Logic_Circuit_STD', coef: -3.0 },
            { name: 'Gyroscope', coef: -12.0 },
            { name: 'Atomic_Locator', coef: -50.0 },
        ],
        bnds: { type: glpk.GLP_LO, lb: 0.0},
    },
    {
        vars: [
            { name: 'Coupler', coef: 1.0 },
            { name: 'Turbocharger_STD', coef: -4.0 },
            { name: 'Super_Computer_STD', coef: -8.0 },
        ],
        bnds: { type: glpk.GLP_LO, lb: 0.0},
    },
    {
        vars: [
            { name: 'Electric_Motor', coef: 1.0 },
            { name: 'Electric_Motor_STD', coef: -1.0 },
            { name: 'Electric_Motor_ALT', coef: -1.0 },
        ],
        bnds: { type: glpk.GLP_FX, ub: 0.0, lb: 0.0},
    },
    {
        vars: [
            { name: 'Electric_Motor', coef: 1.0 },
            { name: 'Stabilizer', coef: -1.0 },
            { name: 'Matter_Compressor', coef: -2.0 },
        ],
        bnds: { type: glpk.GLP_LO, lb: 0.0},
    },
    {
        vars: [
            { name: 'Electromagnet', coef: 1.0 },
            { name: 'Electromagnet_STD', coef: -1.0 },
            { name: 'Electromagnet_ALT', coef: -1.0 },
        ],
        bnds: { type: glpk.GLP_FX, ub: 0.0, lb: 0.0},
    },
    {
        vars: [
            { name: 'Electromagnet', coef: 1.0 },
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
            { name: 'Steel_STD', coef: -1.0 },
            { name: 'Tungsten_Carbide_STD', coef: -1.0 },
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
            { name: 'Super_Computer_STD', coef: -8.0 },
            { name: 'Logic_Circuit_ALT', coef: -1.0 },
            { name: 'Turbocharger_ALT', coef: -4.0 },
        ],
        bnds: { type: glpk.GLP_LO, lb: 0.0},
    },
    {
        vars: [
            { name: 'Industrial_Frame', coef: 1.0 },
            { name: 'Industrial_Frame_STD', coef: -1.0 },
            { name: 'Industrial_Frame_ALT', coef: -1.0 },
        ],
        bnds: { type: glpk.GLP_FX, ub: 0.0, lb: 0.0},
    },
    {
        vars: [
            { name: 'Industrial_Frame', coef: 1.0 },
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
            { name: 'Iron_Gear_STD', coef: -1.0 },
            { name: 'Iron_Gear_ALT', coef: -1.0 },
        ],
        bnds: { type: glpk.GLP_FX, ub: 0.0, lb: 0.0},
    },
    {
        vars: [
            { name: 'Iron_Gear', coef: 1.0 },
            { name: 'Electric_Motor_STD', coef: -4.0 },
            { name: 'Turbocharger_STD', coef: -8.0 },
        ],
        bnds: { type: glpk.GLP_LO, lb: 0.0},
    },
    {
        vars: [
            { name: 'Iron_Ingot', coef: 1.0 },
            { name: 'Iron_Gear_STD', coef: -2.0 },
            { name: 'Iron_Plating', coef: -2.0 },
            { name: 'Electromagnet_STD', coef: -2.0 },
        ],
        bnds: { type: glpk.GLP_LO, lb: 0.0},
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
        bnds: { type: glpk.GLP_LO, lb: 0.0},
    },
    {
        vars: [
            { name: 'Logic_Circuit', coef: 1.0 },
            { name: 'Logic_Circuit_STD', coef: -1.0 },
            { name: 'Logic_Circuit_ALT', coef: -1.0 },
        ],
        bnds: { type: glpk.GLP_FX, ub: 0.0, lb: 0.0},
    },
    {
        vars: [
            { name: 'Logic_Circuit', coef: 1.0 },
            { name: 'Computer', coef: -3.0 },
            { name: 'Turbocharger_STD', coef: -4.0 },
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
            { name: 'Industrial_Frame_STD', coef: -2.0 },
            { name: 'Electron_Microscope', coef: -2.0 },
        ],
        bnds: { type: glpk.GLP_LO, lb: 0.0},
    },
    {
        vars: [
            { name: 'Nano_Wire', coef: 1.0 },
            { name: 'Electron_Microscope', coef: -2.0 },
            { name: 'Turbocharger_STD', coef: -2.0 },
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
            { name: 'Rotor_STD', coef: -1.0 },
            { name: 'Rotor_ALT', coef: -1.0 },
        ],
        bnds: { type: glpk.GLP_FX, ub: 0.0, lb: 0.0},
    },
    {
        vars: [
            { name: 'Rotor', coef: 1.0 },
            { name: 'Gyroscope', coef: -2.0 },
            { name: 'Electric_Motor_STD', coef: -2.0 },
        ],
        bnds: { type: glpk.GLP_LO, lb: 0.0},
    },
    {
        vars: [
            { name: 'Sand', coef: 1.0 },
            { name: 'Silicon', coef: -2.0 },
            { name: 'Glass', coef: -4.0 },
            { name: 'Concrete_STD', coef: -10.0 },
        ],
        bnds: { type: glpk.GLP_LO, lb: 0.0},
    },
    {
        vars: [
            { name: 'Silicon', coef: 1.0 },
            { name: 'Logic_Circuit_STD', coef: -2.0 },
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
            { name: 'Steel_STD', coef: -1.0 },
            { name: 'Steel_ALT', coef: -1.0 },
        ],
        bnds: { type: glpk.GLP_FX, ub: 0.0, lb: 0.0},
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
        bnds: { type: glpk.GLP_LO, lb: 0.0},
    },
    {
        vars: [
            { name: 'Steel_Rod', coef: 1.0 },
            { name: 'Rotor_STD', coef: -1.0 },
            { name: 'Concrete_STD', coef: -1.0 },
            { name: 'Nuclear_Fuel_Cell', coef: -1.0 },
            { name: 'Electromagnet_ALT', coef: -1.0/12.0 },
        ],
        bnds: { type: glpk.GLP_LO, lb: 0.0},
    },
    {
        vars: [
            { name: 'Super_Computer', coef: 1.0 },
            { name: 'Super_Computer_STD', coef: -1.0 },
            { name: 'Super_Computer_ALT', coef: -1.0 },
        ],
        bnds: { type: glpk.GLP_FX, ub: 0.0, lb: 0.0},
    },
    {
        vars: [
            { name: 'Super_Computer', coef: 1.0 },
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
            { name: 'Tungsten_Carbide_STD', coef: -1.0 },
            { name: 'Tungsten_Carbide_ALT', coef: -1.0 },
        ],
        bnds: { type: glpk.GLP_FX, ub: 0.0, lb: 0.0},
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
        bnds: { type: glpk.GLP_LO, lb: 0.0},
    },
    {
        vars: [
            { name: 'Tungsten_Ore', coef: 1.0 },
            { name: 'Tungsten_Carbide_STD', coef: -2.0 },
            { name: 'Tungsten_Carbide_ALT', coef: -0.5 },
        ],
        bnds: { type: glpk.GLP_LO, lb: 0.0},
    },
    {
        vars: [
            { name: 'Turbocharger', coef: 1.0 },
            { name: 'Turbocharger_STD', coef: -1.0 },
            { name: 'Turbocharger_ALT', coef: -1.0 },
        ],
        bnds: { type: glpk.GLP_FX, ub: 0.0, lb: 0.0},
    },
    {
        vars: [
            { name: 'Turbocharger', coef: 1.0 },
            { name: 'Super_Computer_STD', coef: -1.0 },
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
    }
];



function get_extractor_name(item_name: ItemId): string {
    return item_name.split('_')[0] as string;
}


// #region Add Constraint Functions

function add_extractor_cons(constraints: Constraint[], extractors: ItemMap) {
    for (const name of RAW_ITEMS) {
        const ex_name = get_extractor_name(name);
        const ex_bound = extractors.get(name) ?? 0;

        const constraint = {
            vars: [
                { name: `${ex_name}_Ex`, coef: 1.0 },
            ],
            bnds: { type: glpk.GLP_FX, ub: ex_bound, lb: ex_bound },
        };
        constraints.push(constraint);
    }
}


function add_alt_cons(constraints: Constraint[], alt_ratios: ItemMap) {
    for (const name of ALT_ITEMS) {
        const ratio = alt_ratios.get(name);
        if (ratio === undefined) { continue; }

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


function add_coal_pp_con(
    constraints: Constraint[], 
    coal_pp: number | undefined,
    gen: VariantId
) {
    const gen_i = (gen == V.GEN1) ? 0 : 1;

    if (typeof coal_pp === "number") {
        constraints.push({
            vars: [
                { name: 'Coal_Power_Plant', coef: 1.0 },
            ],
            bnds: { type: glpk.GLP_FX, ub: coal_pp, lb: coal_pp },
        });
    } else {
        constraints.push({
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
        });
    }
}


function add_nuclear_pp_con(
    constraints: Constraint[], 
    nuclear_pp: number | undefined,
    gen: VariantId
) {
    const gen_i = (gen == V.GEN1) ? 0 : 1;

    if (typeof nuclear_pp === "number") {
        constraints.push({
            vars: [
                { name: 'Nuclear_Power_Plant', coef: 1.0 },
            ],
            bnds: { type: glpk.GLP_FX, ub: nuclear_pp, lb: nuclear_pp },
        });
    } else {
        constraints.push({
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
            bnds: { type: glpk.GLP_FX, ub: 0.0, lb: 0.0},
        });
    }
}


function add_coal_cons(constraints: Constraint[], coal_fracs: ItemMap) {
    for (const name of RAW_ITEMS) {
        const ex_name = get_extractor_name(name);
        const fraction = coal_fracs.get(name);
        if (fraction === undefined) { continue; }

        const constraint = {
            vars: [
                { name: `${ex_name}_Ex`, coef: -1 * fraction },
                { name: `${ex_name}_Coal_Ex`, coef: 1.0 },
            ],
            bnds: { type: glpk.GLP_FX, ub: 0.0, lb: 0.0 },
        };
        constraints.push(constraint);
    }
}


function add_nuclear_cons(constraints: Constraint[], nuclear_fracs: ItemMap) {
    for (const name of RAW_ITEMS) {
        const ex_name = get_extractor_name(name);
        const fraction = nuclear_fracs.get(name);
        if (fraction === undefined) { continue; }

        const constraint = {
            vars: [
                { name: `${ex_name}_Ex`, coef: -1 * fraction },
                { name: `${ex_name}_Nuc_Ex`, coef: 1.0 },
            ],
            bnds: { type: glpk.GLP_FX, ub: 0.0, lb: 0.0 },
        };
        constraints.push(constraint);
    }
}


function add_nuclear_gen1_cons(
    constraints: Constraint[], 
    nuclear_fracs: ItemMap,
    gen: VariantId
) {
    if (gen != V.GEN1) { return; }

    for (const name of RAW_ITEMS) {
        const nuc_frac = nuclear_fracs.get(name);
        if (typeof nuc_frac === "number") { continue; }

        const max_frac = (name == I.Uranium_Ore) ? 0.2 : 0.9;
        const ex_name = get_extractor_name(name);

        const constraint = {
            vars: [
                { name: `${ex_name}_Nuc_Ex`, coef: 1.0 },
                { name: `${ex_name}_Ex`, coef: -1 * max_frac },
            ],
            bnds: { type: glpk.GLP_UP, ub: 0.0},
        };
        constraints.push(constraint);
    }
}


function add_max_total_cons(
    constraints: Constraint[],
    coal_fracs: ItemMap,
    nuclear_fracs: ItemMap,
    gen: VariantId
) {
    for (const name of RAW_ITEMS) {
        const coal_frac = coal_fracs.get(name);
        const nuc_frac = nuclear_fracs.get(name);

        let max_frac = (gen == V.GEN1) ? 0.95 : 1.00;
        if (typeof coal_frac === "number" && typeof nuc_frac === "number") {
            continue;
        } else if (typeof coal_frac === "number") {
            max_frac = Math.max(coal_frac, max_frac);
        } else if (typeof nuc_frac === "number") {
            max_frac = Math.max(nuc_frac, max_frac);
        }
        
        const ex_name = get_extractor_name(name);
        const constraint = {
            vars: [
                { name: `${ex_name}_Coal_Ex`, coef: 1.0 },
                { name: `${ex_name}_Nuc_Ex`, coef: 1.0 },
                { name: `${ex_name}_Ex`, coef: -1.0 * max_frac },
            ],
            bnds: { type: glpk.GLP_UP, ub: 0.0},
        };
        constraints.push(constraint);
    }
}


function add_raw_item_cons(
    constraints: Constraint[], 
    tiers: BuildMap, 
    gen: VariantId
) {
    for (const name of RAW_ITEMS) {
        const norm_speed = get_speed(tiers, name, gen);
        const coal_extra = get_speed(tiers, name, gen, C_BOOST) - norm_speed;
        const nuc_extra = get_speed(tiers, name, gen, N_BOOST) - norm_speed;

        const ex_name = get_extractor_name(name);
        const constraint = {
            vars: [
                { name: name, coef: 1.0 },
                { name: `${ex_name}_Coal_Ex`, coef: -1 * coal_extra },
                { name: `${ex_name}_Nuc_Ex`, coef: -1 * nuc_extra },
                { name: `${ex_name}_Ex`, coef: -1 * norm_speed },
            ],
            bnds: { type: glpk.GLP_UP, ub: 0.0},
        };
        constraints.push(constraint);
    }
}

function add_target_con(
    constraints: Constraint[], 
    item_name: ItemId, 
    amount: number
) {
    constraints.push({
        vars: [
            { name: item_name, coef: 1.0 },
        ],
        bnds: { type: glpk.GLP_FX, ub: amount, lb: amount},
    });
}

// #endregion





async function solve_max(
    item_name: string, 
    constraints: Constraint[]
): Promise<LPResult> {

    const lp_max: LPModel = {
        name: 'LP',
        objective: {
            direction: glpk.GLP_MAX,
            vars: [
                { name: item_name, coef: 1.0 },
            ],
        },
        subjectTo: constraints,
    };

    return await glpk.solve(lp_max, {msglev: glpk.GLP_MSG_OFF});
}


async function solve_min_resources(
    constraints: Constraint[]
): Promise<LPResult> {

    const lp_min: LPModel = {
        name: 'LP',
        objective: {
            direction: glpk.GLP_MIN,
            vars: [
                { name: "Resource_Sum", coef: 1.0 },
            ],
        },
        subjectTo: constraints,
    };

    return await glpk.solve(lp_min, {msglev: glpk.GLP_MSG_OFF});
}


export async function resource_solver(settings: Settings): Promise<NumberRec> {
    const {
        extractors, alt_ratios, coal_fracs, tiers, 
        nuclear_fracs, coal_pp, nuclear_pp, gen,
        selected_item
    } = settings;

    const constraints = general_cons.concat(boost_cons);
    
    add_extractor_cons   (constraints, extractors);
    add_alt_cons         (constraints, alt_ratios);
    add_coal_pp_con      (constraints, coal_pp, gen);
    add_nuclear_pp_con   (constraints, nuclear_pp, gen);
    add_coal_cons        (constraints, coal_fracs);
    add_nuclear_cons     (constraints, nuclear_fracs);
    add_max_total_cons   (constraints, coal_fracs, nuclear_fracs, gen);
    add_raw_item_cons    (constraints, tiers, gen);
    add_nuclear_gen1_cons(constraints, nuclear_fracs, gen);

    const max_result = await solve_max(selected_item, constraints);

    add_target_con(constraints, selected_item, max_result.result.z);

    const min_res_result = await solve_min_resources(constraints);

    console.log("resource_solver finished successfully!");
    return min_res_result.result.vars;
}


export async function goal_solver(settings: Settings): Promise<NumberRec> {
    const { 
        alt_ratios, selected_item, 
        goal_amount, coal_pp, nuclear_pp 
    } = settings;

    const constraints = [...general_cons];

    add_alt_cons(constraints, alt_ratios);
    add_target_con(constraints, selected_item, goal_amount);
    add_target_con(constraints, I.Coal_Power_Plant, coal_pp || 0);
    add_target_con(constraints, I.Nuclear_Power_Plant, nuclear_pp || 0);

    const min_res_result = await solve_min_resources(constraints)

    console.log("goal_solver finished successfully!");
    return min_res_result.result.vars;
}


export function get_resource_boosts(
    all_items: NumberRec
): {coal_fracs: ItemMap, nuclear_fracs: ItemMap} {

    const coal_fracs: ItemMap = new Map();
    const nuclear_fracs: ItemMap = new Map();

    for (const name of RAW_ITEMS) {
        const ex_name = get_extractor_name(name);

        const total_ex = all_items[ex_name + "_Ex"] ?? 0;
        const coal_ex = all_items[ex_name + "_Coal_Ex"] ?? 0;
        const nuc_ex  = all_items[ex_name + "_Nuc_Ex"] ?? 0;

        const coal_per = (total_ex <= 0) ? 0 : Math.max(0, Math.min(1, coal_ex / total_ex));
        const nuc_per  = (total_ex <= 0) ? 0 : Math.max(0, Math.min(1, nuc_ex / total_ex));
        
        coal_fracs.set(name, coal_per);
        nuclear_fracs.set(name, nuc_per);
    }

    return {coal_fracs, nuclear_fracs};
}


export function get_alt_ratios(all_items: NumberRec): ItemMap {
    const alt_ratios: ItemMap = new Map();

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