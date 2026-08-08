const MAX_DECIMALS = 10;
export function formatNumber(n) {
    return n.toLocaleString("en-US", {
        useGrouping: false,
        maximumFractionDigits: MAX_DECIMALS
    });
}
export function roundN(value, decimals = MAX_DECIMALS) {
    const factor = 10 ** decimals;
    return Math.round(value * factor) / factor;
}
export function ceilN(value, decimals = MAX_DECIMALS) {
    return Math.ceil(roundN(value, decimals));
}
export function formatCeil(n) {
    return formatNumber(ceilN(n));
}
export function round_sig(num, sig, preRound = 6) {
    num = roundN(num, preRound);
    const abs = Math.abs(num);
    // Always return a string (formatter function)
    if (abs === 0)
        return "0";
    if (Number.isInteger(num))
        return String(num);
    const intDigits = Math.floor(Math.log10(abs)) + 1;
    let decimals = sig - intDigits;
    if (decimals < 1)
        decimals = 1;
    let s = num.toFixed(decimals);
    // Trim trailing zeros but keep at least one digit after the dot
    s = s.replace(/(\.\d*?[1-9])0+$/, "$1"); // 12.3400 -> 12.34
    s = s.replace(/\.(0+)$/, ".0"); // 12.000 -> 12.0
    return s;
}
//# sourceMappingURL=math.js.map