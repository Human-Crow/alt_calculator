declare module "./glpk.js" {
    export interface GLPK {
        // Message levels
        GLP_MSG_OFF: 0;
        GLP_MSG_ERR: 1;
        GLP_MSG_ON: 2;
        GLP_MSG_ALL: 3;
        GLP_MSG_DBG: 4;
        
        // Objective direction
        GLP_MIN: 1;
        GLP_MAX: 2;

        // Bound types
        GLP_FR: 1;
        GLP_LO: 2;
        GLP_UP: 3;
        GLP_DB: 4;
        GLP_FX: 5;
        
        // Solution status
        GLP_UNDEF: 1;
        GLP_FEAS: 2;
        GLP_INFEAS: 3;
        GLP_NOFEAS: 4;
        GLP_OPT: 5;
        GLP_UNBND: 6;
        
        solve(model: LPModel, options?: any): Promise<LPResult>;
    }

    export interface LPModel {
        name: string;
        objective: {
            direction: number;
            vars: { name: string; coef: number }[];
        };
        subjectTo: Constraint[];
    }

    export interface Constraint {
        vars: { name: string; coef: number }[];
        bnds: {
            type: number;
            ub?: number;
            lb?: number;
        };
    }

    export interface LPResult {
        result: {
            z: number;
            vars: Record<string, number>;
        };
    }

    const GLPK: () => Promise<GLPK>;
    export default GLPK;
}

export {};