window.addEventListener("DOMContentLoaded", (event) => {
    import GLPK from "./glpk.js";
    document.getElementById("calc_button").addEventListener("click", function () {
        const glpk = GLPK();

        const options = {
            msglev: glpk.GLP_MSG_ALL, // Set message level (optional)
            presol: true, // Use presolver (optional)
            cb: {
                call: progress => console.log(progress), // Progress callback (optional)
                each: 1, // Callback frequency (optional)
            },
        };

        const res = glpk.solve({
            name: 'LP',
            objective: {
                direction: glpk.GLP_MAX, // Maximize
                name: 'z',
                vars: [
                    { name: 'x', coef: 1.0 },
                    { name: 'y', coef: 2.0 },
                ],
            },
            subjectTo: [
                {
                    name: 'cons1', // 2 * x + y <= 20
                    vars: [
                        { name: 'x', coef: 2.0 },
                        { name: 'y', coef: 1.0 },
                    ],
                    bnds: { type: glpk.GLP_UP, ub: 20.0},
                },
                {
                    name: 'cons2', // 4 * x - 5 * y >= -10
                    vars: [
                        { name: 'x', coef: 4.0 },
                        { name: 'y', coef: -5.0 },
                    ],
                    bnds: { type: glpk.GLP_LO, lb: -10.0 },
                },
                {
                    name: 'cons3', // -x + 2 * y >= -2
                    vars: [
                        { name: 'x', coef: -1.0 },
                        { name: 'y', coef: 2.0 },
                    ],
                    bnds: { type: glpk.GLP_LO, lb: -2.0 },
                },
                {
                    name: 'cons4', // -x + 5 * y = 15
                    vars: [
                        { name: 'x', coef: -1.0 },
                        { name: 'y', coef: 5.0 },
                    ],
                    bnds: { type: glpk.GLP_FX, lb: 15.0, up: 15.0 },
                },
            ],
        }, options);

        const z = res.result.z;

        document.getElementById("result").textContent = "Score: " + z;
    });
});