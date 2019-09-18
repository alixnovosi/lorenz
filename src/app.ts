import * as odex from "odex";

class LorentzSystem {
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
            this.LorentzSystem(this.rho, this.sigma, this.beta),
            0,
            [1,1,1],
            this.max_t,
            this.solver.grid(this.dt, function(x, y) {
                that.results.push(y);
            }),
        );
    }

    public getPos(): number[] {
        let res =  this.results[this.t_index];
        this.t_index = (this.t_index + 1) % this.results.length;

        return res;
    }

    private LorentzSystem = function(rho:number, sigma:number, beta:number) {
        return function(x:any, y:any) {
            return [
                sigma*(y[1] - y[0]),
                (y[0]*(rho - y[2])) - y[1],
                (y[0]*y[1]) - (beta*y[2]),
            ]
        }
    }
}

class App {
    private lorentz: LorentzSystem;

    // primary canvas.
    private canvas: HTMLCanvasElement;
    private ctx: any;

    // offscreen canvas for lorentz pre-render.
    private offCanvas: HTMLCanvasElement;
    private offCtx: any;

    private height: number = 500;
    private width: number = 500;

    private borderWidth: number = 2;
    private bgColor: string = "#CCCCFF";

    private lorentzIndex: number = 0;
    private oldPos: number[]|null = null;

    constructor() {
        this.canvas = document.getElementById('canvas');
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.ctx = this.canvas.getContext('2d');

        this.offCanvas = document.createElement('canvas');
        this.offCanvas.width = this.width;
        this.offCanvas.height = this.height;
        this.offCtx = this.offCanvas.getContext('2d');

        this.lorentz = new LorentzSystem(
            28,
            10,
            8.0 / 3.0,
        );
    }

    public setup(): void {
        this.initCanvas();

        this.gameLoop();
    }

    private gameLoop(): void {
        requestAnimationFrame(this.gameLoop.bind(this));

        this.render();
    }

    private initCanvas(): void {
        this.offCtx.beginPath();
        this.offCtx.fillStyle = this.bgColor;
        this.offCtx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.offCtx.lineWidth = `${this.borderWidth}`
        this.offCtx.fillStyle = "#000000";
        this.offCtx.rect(
            this.borderWidth, this.borderWidth,
            this.canvas.width-(this.borderWidth+1), this.canvas.height-(this.borderWidth+1),
        );
        this.offCtx.stroke();

        // render lorentz to offscreen canvas.
        for (let pos of this.lorentz.results) {
            if (this.oldPos) {
                this.offCtx.beginPath();
                this.offCtx.fillStyle = "#000000";
                this.offCtx.lineWidth = 0.5;
                this.offCtx.moveTo(
                    this.scale(this.oldPos[0], this.canvas.width, false),
                    this.scale(this.oldPos[2], this.canvas.height, true),
                );
                this.offCtx.lineTo(
                    this.scale(pos[0], this.canvas.width, false),
                    this.scale(pos[2], this.canvas.height, true),
                );
                this.offCtx.stroke();
            }
            this.oldPos = pos;
        }

        let image = this.offCtx.getImageData(0, 0, this.offCanvas.width, this.offCanvas.height);
        this.ctx.putImageData(image, 0, 0);
    }

    private scale(coord: number, axisLength: number, rev: boolean) {
        if (rev) {
            return (-5 * coord) + Math.floor(axisLength / 2);
        } else {
            return (5 * coord) + Math.floor(axisLength / 2);
        }
    }

    private render(): void {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        let image = this.offCtx.getImageData(0, 0, this.offCanvas.width, this.offCanvas.height);
        this.ctx.putImageData(image, 0, 0);

        let pos = this.lorentz.results[this.lorentzIndex];
        this.lorentzIndex = (this.lorentzIndex + 1) % this.lorentz.results.length;

        this.ctx.beginPath();
        this.ctx.ellipse(
            this.scale(pos[0], this.canvas.width, false),
            this.scale(pos[2], this.canvas.height, true),
            5,
            5,
            0,
            0,
            Math.PI * 2,
        );
        this.ctx.fillStyle = "#FFFFFF";
        this.ctx.fill();
        this.ctx.stroke();
    }
}

window.onload = () => {
    let app = new App();

    app.setup();
}
