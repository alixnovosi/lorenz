import * as odex from "odex";

export default class LorentzSystem {
    public rho: number;
    public sigma: number;
    public beta: number;

    // time control
    public max_t: number = 100;
    public dt: number = 0.01;
    public t_index: number = 0;

    // positions.
    public results: any[] = [];
    private solver: odex.Solver;

    constructor(rho: number, sigma: number, beta: number) {
        this.rho = rho;
        this.sigma = sigma;
        this.beta = beta;

        this.solver = new odex.Solver(3);

        this.solver.denseOutput = true;
        let that = this;
        this.solver.solve(
            this.equations(this.rho, this.sigma, this.beta),
            0,
            [1,1,1],
            this.max_t,
            this.solver.grid(this.dt, function(_, y) {
                that.results.push(y);
            }),
        );
    }

    public getPos(): number[] {
        let res =  this.results[this.t_index];
        this.t_index = (this.t_index + 1) % this.results.length;

        return res;
    }

    private equations = (rho:number, sigma:number, beta:number) => {
        return (_:number, y:number[]) => {
            return [
                sigma*(y[1] - y[0]),
                (y[0]*(rho - y[2])) - y[1],
                (y[0]*y[1]) - (beta*y[2]),
            ]
        }
    }
}
