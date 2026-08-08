import { ItemId } from './types.js';
import { I, V, B } from './enums.js';
import { Item, Recipe, RecipeMap } from './models.js';




const ex_map: RecipeMap = new Map([
    [V.GEN1, new Recipe(1, 8, B.Extractor, [])],
    [V.GEN2, new Recipe(1, 4, B.Extractor, [])]
]);


export const RECIPES = new Map<ItemId, RecipeMap>([
    [I.Coal_Power_Plant, new Map([
        [V.STD, new Recipe(0.5, 30, B.Coal_Power_Plant, [new Item(5, I.Coal)])]
    ])],
    [I.Nuclear_Power_Plant, new Map([
        [V.STD, new Recipe(2, 120, B.Nuclear_Power_Plant, [new Item(1, I.Nuclear_Fuel_Cell)])]
    ])],
    [I.Wood_Log   , ex_map],
    [I.Stone      , ex_map],
    [I.Iron_Ore   , ex_map],
    [I.Copper_Ore , ex_map],
    [I.Coal       , ex_map],
    [I.Wolframite , ex_map],
    [I.Uranium_Ore, new Map([
        [V.GEN1, new Recipe(1, 6  , B.Uranium_Extractor, [])],
        [V.GEN2, new Recipe(1, 1.2, B.Uranium_Extractor, [])]
    ])],
    [I.Gem_Apple, new Map([
        [V.STD, new Recipe(1, 300, B.Gem_Tree, [])]
    ])],
    [I.Atomic_Locator, new Map([
        [V.STD, new Recipe(1, 30, B.Manufacturer,
            [   new Item(2, I.Super_Computer),
                new Item(2, I.Electron_Microscope),
                new Item(24, I.Concrete),
                new Item(50, I.Copper_Wire)])]
    ])],
    [I.Battery, new Map([
        [V.STD, new Recipe(1, 24, B.Machine_Shop,
            [   new Item(8, I.Electromagnet),
                new Item(8, I.Graphite)])]
    ])],
    [I.Carbon_Fiber, new Map([
        [V.STD, new Recipe(1, 8, B.Workshop,
            [   new Item(4, I.Graphite)])]
    ])],
    [I.Computer, new Map([
        [V.STD, new Recipe(1, 8, B.Industrial_Factory,
            [   new Item(1, I.Metal_Frame),
                new Item(3, I.Heat_Sink),
                new Item(3, I.Logic_Circuit)])]
    ])],
    [I.Concrete, new Map([
        [V.STD, new Recipe(1, 8, B.Forge,
            [   new Item(10, I.Sand),
                new Item(1, I.Steel_Rod)])],
        [V.ALT, new Recipe(1, 12, B.Forge,
            [   new Item(20, I.Stone),
                new Item(4, I.Wood_Frame)])]
    ])],
    [I.Condenser_Lens, new Map([
        [V.STD, new Recipe(1, 3, B.Workshop,
            [   new Item(3, I.Glass)])]
    ])],
    [I.Copper_Ingot, new Map([
        [V.STD, new Recipe(1, 2, B.Furnace,
            [   new Item(1, I.Copper_Ore)])]
    ])],
    [I.Copper_Wire, new Map([
        [V.STD, new Recipe(2, 4, B.Workshop,
            [   new Item(3, I.Copper_Ingot)])],
        [V.ALT, new Recipe(8, 8, B.Workshop,
            [   new Item(1, I.Carbon_Fiber)])]
    ])],
    [I.Coupler, new Map([
        [V.STD, new Recipe(1, 10, B.Workshop,
            [   new Item(1, I.Tungsten_Carbide)])]
    ])],
    [I.Earth_Token, new Map([
        [V.STD, new Recipe(1, 42, B.Earth_Teleporter,
            [   new Item(1, I.Matter_Duplicator)])]
    ])],
    [I.Electric_Motor, new Map([
        [V.STD, new Recipe(1, 20, B.Industrial_Factory,
            [   new Item(1, I.Battery),
                new Item(4, I.Iron_Gear),
                new Item(2, I.Rotor)])],
        [V.ALT, new Recipe(1, 22, B.Industrial_Factory,
            [   new Item(6, I.Electromagnet),
                new Item(6, I.Steel),
                new Item(1, I.Empty_Fuel_Cell)])]
    ])],
    [I.Electromagnet, new Map([
        [V.STD, new Recipe(1, 8, B.Machine_Shop,
            [   new Item(6, I.Copper_Wire),
                new Item(2, I.Iron_Ingot)])],
        [V.ALT, new Recipe(12, 20, B.Machine_Shop,
            [   new Item(1, I.Nano_Wire),
                new Item(1, I.Steel_Rod)])]
    ])],
    [I.Electron_Microscope, new Map([
        [V.STD, new Recipe(1, 24, B.Manufacturer,
            [   new Item(2, I.Nano_Wire),
                new Item(8, I.Electromagnet),
                new Item(4, I.Condenser_Lens),
                new Item(2, I.Metal_Frame)])]
    ])],
    [I.Empty_Fuel_Cell, new Map([
        [V.STD, new Recipe(1, 15, B.Machine_Shop,
            [   new Item(3, I.Tungsten_Carbide),
                new Item(5, I.Glass)])]
    ])],
    [I.Energy_Cube, new Map([
        [V.STD, new Recipe(1, 30, B.Machine_Shop,
            [   new Item(2, I.Battery),
                new Item(1, I.Industrial_Frame)])]
    ])],
    [I.Enriched_Uranium, new Map([
        [V.STD, new Recipe(1, 60, B.Furnace,
            [   new Item(30, I.Uranium_Ore)])]
    ])],
    [I.Glass, new Map([
        [V.STD, new Recipe(1, 6, B.Furnace,
            [   new Item(4, I.Sand)])]
    ])],
    [I.Graphite, new Map([
        [V.STD, new Recipe(1, 4, B.Forge,
            [   new Item(3, I.Coal),
                new Item(3, I.Wood_Log)])]
    ])],
    [I.Gyroscope, new Map([
        [V.STD, new Recipe(1, 12, B.Machine_Shop,
            [   new Item(12, I.Copper_Wire),
                new Item(2, I.Rotor)])]
    ])],
    [I.Heat_Sink, new Map([
        [V.STD, new Recipe(1, 6, B.Workshop,
            [   new Item(5, I.Copper_Ingot)])]
    ])],
    [I.Industrial_Frame, new Map([
        [V.STD, new Recipe(1, 20, B.Industrial_Factory,
            [   new Item(6, I.Concrete),
                new Item(2, I.Metal_Frame),
                new Item(8, I.Tungsten_Carbide)])],
        [V.ALT, new Recipe(1, 36, B.Industrial_Factory,
            [   new Item(18, I.Steel),
                new Item(10, I.Iron_Plating),
                new Item(4, I.Carbon_Fiber)])]
    ])],
    [I.Iron_Gear, new Map([
        [V.STD, new Recipe(1, 4, B.Workshop,
            [   new Item(2, I.Iron_Ingot)])],
        [V.ALT, new Recipe(8, 8, B.Workshop,
            [   new Item(1, I.Steel)])]
    ])],
    [I.Iron_Ingot, new Map([
        [V.STD, new Recipe(1, 2, B.Furnace,
            [   new Item(1, I.Iron_Ore)])]
    ])],
    [I.Iron_Plating, new Map([
        [V.STD, new Recipe(2, 6, B.Workshop,
            [   new Item(4, I.Iron_Ingot)])]
    ])],
    [I.Logic_Circuit, new Map([
        [V.STD, new Recipe(1, 6, B.Machine_Shop,
            [   new Item(3, I.Copper_Wire),
                new Item(2, I.Silicon)])],
        [V.ALT, new Recipe(1, 8, B.Machine_Shop,
            [   new Item(1, I.Iron_Plating),
                new Item(1, I.Heat_Sink)])]
    ])],
    [I.Magnetic_Field_Generator, new Map([
        [V.STD, new Recipe(1, 40, B.Manufacturer,
            [   new Item(1, I.Stabilizer),
                new Item(1, I.Industrial_Frame),
                new Item(10, I.Electromagnet),
                new Item(10, I.Nano_Wire)])]
    ])],
    [I.Matter_Compressor, new Map([
        [V.STD, new Recipe(1, 30, B.Manufacturer,
            [   new Item(1, I.Industrial_Frame),
                new Item(2, I.Turbocharger),
                new Item(2, I.Electric_Motor),
                new Item(1, I.Tank)])]
    ])],
    [I.Matter_Duplicator, new Map([
        [V.STD, new Recipe(1, 90, B.Manufacturer,
            [   new Item(4, I.Atomic_Locator),
                new Item(2, I.Quantum_Entangler),
                new Item(5, I.Energy_Cube),
                new Item(100, I.Particle_Glue)])]
    ])],
    [I.Metal_Frame, new Map([
        [V.STD, new Recipe(1, 12, B.Machine_Shop,
            [   new Item(1, I.Wood_Frame),
                new Item(4, I.Iron_Plating)])]
    ])],
    [I.Nano_Wire, new Map([
        [V.STD, new Recipe(1, 12, B.Machine_Shop,
            [   new Item(2, I.Carbon_Fiber),
                new Item(4, I.Glass)])]
    ])],
    [I.Nuclear_Fuel_Cell, new Map([
        [V.STD, new Recipe(1, 30, B.Industrial_Factory,
            [   new Item(1, I.Empty_Fuel_Cell),
                new Item(1, I.Steel_Rod),
                new Item(1, I.Enriched_Uranium)])]
    ])],
    [I.Particle_Glue, new Map([
        [V.STD, new Recipe(10, 30, B.Workshop,
            [   new Item(1, I.Matter_Compressor)])]
    ])],
    [I.Quantum_Entangler, new Map([
        [V.STD, new Recipe(1, 60, B.Machine_Shop,
            [   new Item(1, I.Magnetic_Field_Generator),
                new Item(2, I.Stabilizer)])]
    ])],
    [I.Rotor, new Map([
        [V.STD, new Recipe(1, 6, B.Machine_Shop,
            [   new Item(1, I.Steel_Rod),
                new Item(2, I.Iron_Plating)])],
        [V.ALT, new Recipe(1, 18, B.Machine_Shop,
            [   new Item(18, I.Copper_Ingot),
                new Item(18, I.Iron_Plating)])]
    ])],
    [I.Sand, new Map([
        [V.STD, new Recipe(1, 1.5, B.Workshop,
            [   new Item(1, I.Stone)])]
    ])],
    [I.Silicon, new Map([
        [V.STD, new Recipe(1, 3, B.Furnace,
            [   new Item(2, I.Sand)])]
    ])],
    [I.Stabilizer, new Map([
        [V.STD, new Recipe(1, 24, B.Industrial_Factory,
            [   new Item(1, I.Computer),
                new Item(1, I.Electric_Motor),
                new Item(2, I.Gyroscope)])]
    ])],
    [I.Steel, new Map([
        [V.STD, new Recipe(1, 8, B.Forge,
            [   new Item(1, I.Graphite),
                new Item(6, I.Iron_Ore)])],
        [V.ALT, new Recipe(1, 6, B.Forge,
            [   new Item(4, I.Iron_Ore),
                new Item(4, I.Coal)])]
    ])],
    [I.Steel_Rod, new Map([
        [V.STD, new Recipe(1, 4, B.Workshop,
            [   new Item(3, I.Steel)])]
    ])],
    [I.Super_Computer, new Map([
        [V.STD, new Recipe(1, 30, B.Manufacturer,
            [   new Item(2, I.Computer),
                new Item(8, I.Heat_Sink),
                new Item(1, I.Turbocharger),
                new Item(8, I.Coupler)])],
        [V.ALT, new Recipe(2, 30, B.Manufacturer,
            [   new Item(2, I.Computer),
                new Item(40, I.Silicon),
                new Item(2, I.Gyroscope),
                new Item(1, I.Industrial_Frame)])]
    ])],
    [I.Tank, new Map([
        [V.STD, new Recipe(1, 10, B.Industrial_Factory,
            [   new Item(2, I.Glass),
                new Item(4, I.Concrete),
                new Item(4, I.Tungsten_Carbide)])]
    ])],
    [I.Tungsten_Carbide, new Map([
        [V.STD, new Recipe(1, 5, B.Forge,
            [   new Item(2, I.Tungsten_Ore),
                new Item(1, I.Graphite)])],
        [V.ALT, new Recipe(2, 15, B.Forge,
            [   new Item(1, I.Tungsten_Ore),
                new Item(1, I.Steel)])]
    ])],
    [I.Tungsten_Ore, new Map([
        [V.STD, new Recipe(1, 2.5, B.Furnace,
            [   new Item(5, I.Wolframite)])]
    ])],
    [I.Turbocharger, new Map([
        [V.STD, new Recipe(1, 15, B.Manufacturer,
            [   new Item(8, I.Iron_Gear),
                new Item(4, I.Logic_Circuit),
                new Item(2, I.Nano_Wire),
                new Item(4, I.Coupler)])],
        [V.ALT, new Recipe(1, 10, B.Manufacturer,
            [   new Item(4, I.Heat_Sink),
                new Item(1, I.Computer),
                new Item(1, I.Gyroscope),
                new Item(1, I.Tungsten_Carbide)])]
    ])],
    [I.Wood_Frame, new Map([
        [V.STD, new Recipe(1, 8, B.Workshop,
            [   new Item(4, I.Wood_Plank)])]
    ])],
    [I.Wood_Plank, new Map([
        [V.STD, new Recipe(1, 4, B.Workshop,
            [   new Item(1, I.Wood_Log)])]
    ])]
]);