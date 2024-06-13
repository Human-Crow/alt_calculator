window.addEventListener("DOMContentLoaded", (event) => {
    const GLPK = require('glpk.js');
    document.getElementById("calc_button").addEventListener("click", function () {
        const Wood_Extractors = parseFloat(document.getElementById("wood").value);
        const Stone_Extractors = parseFloat(document.getElementById("stone").value);
        const Iron_Extractors = parseFloat(document.getElementById("iron").value);
        const Copper_Extractors = parseFloat(document.getElementById("copper").value);
        const Coal_Extractors = parseFloat(document.getElementById("coal").value);
        const Wolframite_Extractors = parseFloat(document.getElementById("wolframite").value);
        const Uranium_Extractors = 0;

        const resources = [Wood_Extractors,Stone_Extractors,Iron_Extractors,Copper_Extractors,Coal_Extractors,Wolframite_Extractors];
        const et_ratio = [7242,5028,7932,5315,6954,3520]
        let score = 10000;
        for (let i = 0; i < et_ratio.length; i++) {
            score = Math.min(score, resources[i] * 30 / et_ratio[i]);
        }

        document.getElementById("result").textContent = "Score: " + score;
    });
});