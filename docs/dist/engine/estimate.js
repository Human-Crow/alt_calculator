// Estimate of how many extractors power plants can boost, from deposit totals alone (no coordinates).
//
// Deposits come in patches of one raw item, and patches get bigger when the world has more resources.
// estimate_data.ts holds, per Gen and resource setting, how many patches of each size there are per deposit
// and how many deposits one nuclear plant or 1, 2, 3... coal plants boost on such a patch (measured on
// generated worlds). The total number of deposits picks the resource setting (between two settings both
// are mixed). The LP then decides per patch size how many patches get a nuclear plant, coal plants or none.
import { V } from '../data/enums.js';
import { RAW_ITEMS } from '../data/name_lists.js';
import { ESTIMATE_GEN1, ESTIMATE_GEN2 } from '../data/estimate_data.js';
/** The resource settings to use for this many deposits in total, with their weights. */
function pick_levels(levels, total) {
    const first = levels[0], last = levels[levels.length - 1];
    if (total <= first.T)
        return [[first, 1]];
    if (total >= last.T)
        return [[last, 1]];
    let i = 0;
    while (levels[i + 1].T < total)
        i++;
    const a = levels[i], b = levels[i + 1];
    const t = (total - a.T) / (b.T - a.T);
    return [[a, 1 - t], [b, t]];
}
/**
 * Adds the patch rows for the raw items in `estimated` and limits their `X_Nuc_Ex` / `X_Coal_Ex`
 * to what the chosen patches boost. Returns the plants used, for the power plant rows.
 */
export function add_estimate_cons(constraints, up, extractors, estimated, gen, ex_name) {
    const plants = { coal: [], nuclear: [] };
    if (estimated.length === 0)
        return plants;
    const levels = (gen == V.GEN2) ? ESTIMATE_GEN2 : ESTIMATE_GEN1;
    let total = 0;
    for (const name of RAW_ITEMS)
        total += Math.max(0, extractors.get(name) ?? 0);
    const mix = pick_levels(levels, total);
    for (const name of estimated) {
        const r = RAW_ITEMS.indexOf(name);
        const amount = Math.max(0, extractors.get(name) ?? 0);
        const ex = ex_name(name);
        const nuc_ex = [{ name: `${ex}_Nuc_Ex`, coef: 1.0 }];
        const coal_ex = [{ name: `${ex}_Coal_Ex`, coef: 1.0 }];
        mix.forEach(([level, weight], li) => {
            if (amount <= 0 || weight <= 0)
                return;
            (level.res[r] ?? []).forEach((b, bi) => {
                const patches = amount * b[0] * weight;
                const id = `Est_${ex}_${li}_${bi}`;
                const options = [];
                // one nuclear plant on the patch
                options.push({ name: `${id}_N`, coef: 1.0 });
                nuc_ex.push({ name: `${id}_N`, coef: -b[2] });
                plants.nuclear.push({ name: `${id}_N`, coef: b[1] });
                // 1, 2, 3... coal plants on the patch
                for (let k = 3; k + 1 < b.length; k += 2) {
                    const v = `${id}_C${(k - 1) / 2}`;
                    options.push({ name: v, coef: 1.0 });
                    coal_ex.push({ name: v, coef: -b[k + 1] });
                    plants.coal.push({ name: v, coef: b[k] });
                }
                // each patch gets at most one of the options
                constraints.push({ vars: options, bnds: { type: up, ub: patches, lb: 0.0 } });
            });
        });
        constraints.push({ vars: nuc_ex, bnds: { type: up, ub: 0.0, lb: 0.0 } });
        constraints.push({ vars: coal_ex, bnds: { type: up, ub: 0.0, lb: 0.0 } });
    }
    return plants;
}
//# sourceMappingURL=estimate.js.map