// Raw items, power plant boosts and power plants for the resource solver, from deposit totals alone (no
// coordinates; only the number of extractors per raw item and Gen 1 or Gen 2).
//
// Deposits come in patches of one raw item. estimate_data.ts holds, per Gen and resource setting, how many
// patches of each size there are per deposit, and how many deposits one nuclear plant or 1, 2, 3... coal
// plants boost on such a patch (measured on generated worlds). The total number of extractors picks the
// resource setting (between two settings both are mixed).
//
// Per raw item (extractor name X, e.g. "Iron"):
//   X_Ex                   extractors (as entered)
//   X_Coal_Ex, X_Nuc_Ex    extractors boosted by coal / nuclear plants
//   patch options          per patch size: how many patches get one nuclear plant, or 1, 2, 3... coal plants
//                          (together at most the number of such patches); the boosted extractors are at
//                          most what the chosen patches boost
// A boost share that is entered fixes X_Coal_Ex or X_Nuc_Ex; the patches then only say how many plants
// that takes. Plants of a kind:
//   count empty            the plants the chosen patches need. If the fuel cannot run that many for the
//                          entered shares (the estimate can be a few plants off), the boosts stay as entered
//                          and as few plants as possible are left out ("shortfall", see the solver).
//   count entered          that many plants (they all burn fuel). Raw items without an entered share of that
//                          kind may use what is left after the items with an entered share (at least the
//                          plants those need). With a share entered for every raw item nothing is estimated:
//                          the boosts and the plants are as entered.

import type { Constraint, GLPK, LPModel } from "./glpk.js";
import type { ItemId, ItemMap, Settings } from '../data/types.js';
import { I, V } from '../data/enums.js';
import { C_BOOST, N_BOOST } from '../data/constants.js';
import { RAW_ITEMS } from '../data/name_lists.js';
import { ESTIMATE_GEN1, ESTIMATE_GEN2, EstimateLevel } from '../data/estimate_data.js';
import { get_speed } from './production.js';


type Term = { name: string, coef: number };
type Kind = "Coal" | "Nuc";
const KINDS: readonly Kind[] = ["Coal", "Nuc"];

/** extractor name of a raw item: "Iron_Ore" -> "Iron" */
export function ex_name(item: ItemId): string {
    return item.split('_')[0] as string;
}

/** the entered boost shares of one kind */
function shares(settings: Settings, kind: Kind): ItemMap {
    return kind === "Coal" ? settings.coal_fracs : settings.nuclear_fracs;
}

/** the resource settings to use for this many extractors in total, with their weights */
function pick_levels(levels: readonly EstimateLevel[], total: number): [EstimateLevel, number][] {
    const first = levels[0]!, last = levels[levels.length - 1]!;
    if (total <= first.T) return [[first, 1]];
    if (total >= last.T) return [[last, 1]];
    let i = 0;
    while (levels[i + 1]!.T < total) i++;
    const a = levels[i]!, b = levels[i + 1]!;
    const t = (total - a.T) / (b.T - a.T);
    return [[a, 1 - t], [b, t]];
}


/**
 * The patch options of the given raw items: rows "at most this many patches" and "boosted extractors at
 * most what the chosen patches boost". Returns per raw item and kind the plants its chosen patches use.
 */
function add_patches(rows: Constraint[], glpk: GLPK, settings: Settings, items: readonly ItemId[]): Map<ItemId, Record<Kind, Term[]>> {
    const plants = new Map<ItemId, Record<Kind, Term[]>>();
    const levels = settings.gen == V.GEN2 ? ESTIMATE_GEN2 : ESTIMATE_GEN1;
    let total = 0;
    for (const item of RAW_ITEMS) total += Math.max(0, settings.extractors.get(item) ?? 0);
    const mix = pick_levels(levels, total);

    for (const item of items) {
        const r = RAW_ITEMS.indexOf(item as typeof RAW_ITEMS[number]);
        const amount = Math.max(0, settings.extractors.get(item) ?? 0);
        const x = ex_name(item);
        const boosted: Record<Kind, Term[]> = { Coal: [{ name: `${x}_Coal_Ex`, coef: 1 }], Nuc: [{ name: `${x}_Nuc_Ex`, coef: 1 }] };
        const used: Record<Kind, Term[]> = { Coal: [], Nuc: [] };

        mix.forEach(([level, weight], li) => {
            const buckets = level.res[r] ?? [];
            // the full options boost every deposit of a patch; rounding in the data can leave a tiny part out,
            // so the boosts are scaled to make 100% reachable
            let fullN = 0, fullC = 0;
            for (const b of buckets) { fullN += b[0]! * b[2]!; fullC += b[0]! * b[b.length - 1]!; }
            const scaleN = fullN > 0 ? Math.max(1, 1 / fullN) : 1, scaleC = fullC > 0 ? Math.max(1, 1 / fullC) : 1;

            buckets.forEach((b, bi) => {
                const patches = amount * b[0]! * weight;
                if (patches <= 0) return;
                const id = `Patch_${x}_${li}_${bi}`;
                const options: Term[] = [];
                // one nuclear plant on the patch
                options.push({ name: `${id}_N`, coef: 1 });
                boosted.Nuc.push({ name: `${id}_N`, coef: -b[2]! * scaleN });
                used.Nuc.push({ name: `${id}_N`, coef: b[1]! });
                // 1, 2, 3... coal plants on the patch
                for (let k = 3; k + 1 < b.length; k += 2) {
                    const v = `${id}_C${(k - 1) / 2}`;
                    options.push({ name: v, coef: 1 });
                    boosted.Coal.push({ name: v, coef: -b[k + 1]! * scaleC });
                    used.Coal.push({ name: v, coef: b[k]! });
                }
                rows.push({ vars: options, bnds: { type: glpk.GLP_UP, ub: patches, lb: 0 } });
            });
        });
        for (const kind of KINDS) rows.push({ vars: boosted[kind], bnds: { type: glpk.GLP_UP, ub: 0, lb: 0 } });
        plants.set(item, used);
    }
    return plants;
}


/** the extractor and entered share rows of the given raw items */
function add_extractors(rows: Constraint[], glpk: GLPK, settings: Settings, items: readonly ItemId[]) {
    for (const item of items) {
        const x = ex_name(item);
        const amount = Math.max(0, settings.extractors.get(item) ?? 0);
        rows.push({ vars: [{ name: `${x}_Ex`, coef: 1 }], bnds: { type: glpk.GLP_FX, lb: amount, ub: amount } });
        // an extractor is boosted by one kind at most
        rows.push({ vars: [{ name: `${x}_Coal_Ex`, coef: 1 }, { name: `${x}_Nuc_Ex`, coef: 1 }, { name: `${x}_Ex`, coef: -1 }],
            bnds: { type: glpk.GLP_UP, ub: 0, lb: 0 } });
        const c = settings.coal_fracs.get(item) ?? 0, n = settings.nuclear_fracs.get(item) ?? 0;
        if (c < 0 || n < 0 || c + n > 1 + 1e-9) {
            throw new Error(`${item.replace(/_/g, " ")}: the boost shares must be between 0 and 100% and add up to at most 100%.`);
        }
        for (const kind of KINDS) {
            const share = shares(settings, kind).get(item);
            if (share === undefined) continue;
            rows.push({ vars: [{ name: `${x}_${kind}_Ex`, coef: 1 }, { name: `${x}_Ex`, coef: -share }], bnds: { type: glpk.GLP_FX, lb: 0, ub: 0 } });
        }
    }
}


/** fewest plants of a kind that the entered shares of these raw items need (by the patches) */
async function fewest_plants(glpk: GLPK, settings: Settings, kind: Kind, items: readonly ItemId[]): Promise<number> {
    const rows: Constraint[] = [];
    add_extractors(rows, glpk, settings, items);
    const plants = add_patches(rows, glpk, settings, items);
    const lp: LPModel = {
        name: 'Plants',
        objective: { direction: glpk.GLP_MIN, vars: items.flatMap((item) => plants.get(item)![kind]) },
        subjectTo: rows,
    };
    const result = await glpk.solve(lp, { msglev: glpk.GLP_MSG_OFF });
    if (result.result.status !== glpk.GLP_OPT) throw new Error("The entered boost shares cannot be reached with these deposits.");
    return Math.max(0, result.result.z);
}


/**
 * Adds every raw item's extractors, boosts and production and the power plant rows (see the top of this file).
 * The power plants' fuel is in the solver's recipe rows. Returns the shortfall columns: the solver first makes
 * them as small as possible (normally 0).
 */
export async function add_boosts(constraints: Constraint[], glpk: GLPK, settings: Settings): Promise<string[]> {
    const shortfall: string[] = [];
    add_extractors(constraints, glpk, settings, RAW_ITEMS);

    // production: normal speed for every extractor, plus the extra speed of the boosted ones
    for (const item of RAW_ITEMS) {
        const x = ex_name(item);
        const normal = get_speed(settings.tiers, item, settings.gen);
        const coal = get_speed(settings.tiers, item, settings.gen, C_BOOST) - normal;
        const nuc = get_speed(settings.tiers, item, settings.gen, N_BOOST) - normal;
        constraints.push({
            vars: [
                { name: item, coef: 1 },
                { name: `${x}_Ex`, coef: -normal },
                { name: `${x}_Coal_Ex`, coef: -coal },
                { name: `${x}_Nuc_Ex`, coef: -nuc },
            ],
            bnds: { type: glpk.GLP_UP, ub: 0, lb: 0 },
        });
    }

    // the patches: how much each kind can boost, and how many plants that takes
    const used = add_patches(constraints, glpk, settings, RAW_ITEMS);

    for (const kind of KINDS) {
        const plant = kind === "Coal" ? I.Coal_Power_Plant : I.Nuclear_Power_Plant;
        const count = kind === "Coal" ? settings.coal_pp : settings.nuclear_pp;
        const entered = RAW_ITEMS.filter((item) => shares(settings, kind).has(item));
        const open = RAW_ITEMS.filter((item) => !shares(settings, kind).has(item));
        if (typeof count === "number") {
            constraints.push({ vars: [{ name: plant, coef: 1 }], bnds: { type: glpk.GLP_FX, lb: count, ub: count } });
            // everything entered: nothing estimated for this kind
            if (open.length === 0) continue;
        }
        if (typeof count !== "number") {
            // as many plants as the chosen patches use (less the shortfall, only for entered shares)
            const vars: Term[] = [{ name: plant, coef: 1 }];
            for (const item of RAW_ITEMS) for (const t of used.get(item)![kind]) vars.push({ name: t.name, coef: -t.coef });
            if (entered.length) {
                const short = `${kind}_Plant_Shortfall`;
                shortfall.push(short);
                vars.push({ name: short, coef: 1 });
                const cap: Term[] = [{ name: short, coef: 1 }];
                for (const item of entered) for (const t of used.get(item)![kind]) cap.push({ name: t.name, coef: -t.coef });
                constraints.push({ vars: cap, bnds: { type: glpk.GLP_UP, ub: 0, lb: 0 } });
            }
            constraints.push({ vars, bnds: { type: glpk.GLP_LO, lb: 0, ub: 0 } });
        } else {
            // the raw items without an entered share get the plants the others leave
            const left = Math.max(0, count - (entered.length ? await fewest_plants(glpk, settings, kind, entered) : 0));
            const vars = open.flatMap((item) => used.get(item)![kind]);
            if (vars.length) constraints.push({ vars, bnds: { type: glpk.GLP_UP, ub: left, lb: 0 } });
        }
    }
    return shortfall;
}
