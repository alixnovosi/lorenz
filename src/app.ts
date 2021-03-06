import Controls from "./controls";
import LorentzSystem from "./lorenz";

import "./styles/main.scss";

class App {
    private lorentz: LorentzSystem;

    private base: HTMLElement;
    private controls: Controls;

    // primary canvas.
    private canvas: HTMLCanvasElement;
    private ctx: any;

    // offscreen canvas for lorentz pre-render.
    private offCanvas: HTMLCanvasElement;
    private offCtx: any;

    private height: number = 500;
    private width: number = 500;

    private bgColor: string = "#CCCCFF";
    private lineColor: string = "#111122";
    private highlightColor: string = "#EFEFFF";

    private lorentzIndex: number = 0;
    private oldPos: number[]|null = null;

    // lorenz values.
    private rho: number = 28;
    private sigma: number = 10;
    private beta: number = 8.0 / 3.0;

    // store what two indices we use for the 2D plot of this 3D system.
    // x y z mapping to 0, 1, 2.
    private xAxis: number = 0;
    private yAxis: number = 2;

    constructor() {
        this.base = <HTMLElement>document.getElementById("app");

        this.canvas = <HTMLCanvasElement>document.createElement("canvas");
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.ctx = this.canvas.getContext("2d");

        this.base.appendChild(this.canvas);

        let div = <HTMLElement>document.createElement("div");
        div.className = "lorenzControlsBox";
        this.base.appendChild(div);
        this.controls = new Controls(
            div,
            this.xAxis,
            this.yAxis,
            this.rho,
            this.sigma,
            this.beta,
            this.onReload(),
            );

        this.offCanvas = document.createElement("canvas");
        this.offCanvas.width = this.width;
        this.offCanvas.height = this.height;
        this.offCtx = this.offCanvas.getContext("2d");

        this.lorentz = new LorentzSystem(
            this.rho,
            this.sigma,
            this.beta,
        );
    }

    public setup(): void {
        this.initCanvas();

        this.gameLoop();
    }

    private gameLoop(): void {
        let pos = this.lorentz.results[this.lorentzIndex];
        this.lorentzIndex = (this.lorentzIndex + 1) % this.lorentz.results.length;
        this.render(pos);

        requestAnimationFrame(this.gameLoop.bind(this));
    }

    private initCanvas(): void {
        this.offCtx.beginPath();
        this.offCtx.fillStyle = this.bgColor;
        this.offCtx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.offCtx.stroke();

        // render lorentz to offscreen canvas.
        let i = 0;
        for (let pos of this.lorentz.results) {
            if (i != 0) {
                this.offCtx.beginPath();
                this.offCtx.fillStyle = this.lineColor;
                this.offCtx.lineWidth = 0.5;
                this.offCtx.moveTo(
                    this.scale(this.oldPos[this.xAxis], this.canvas.width, false),
                    this.scale(this.oldPos[this.yAxis], this.canvas.height, true),
                );
                this.offCtx.lineTo(
                    this.scale(pos[this.xAxis], this.canvas.width, false),
                    this.scale(pos[this.yAxis], this.canvas.height, true),
                );
                this.offCtx.stroke();
            }
            this.oldPos = pos;
            i++;
        }

        let image = this.offCtx.getImageData(0, 0, this.offCanvas.width, this.offCanvas.height);
        this.ctx.putImageData(image, 0, 0);

        this.lorentzIndex = Math.floor(Math.random() * this.lorentz.results.length);
    }

    private scale(coord: number, axisLength: number, rev: boolean) {
        if (rev) {
            return (-5 * coord) + Math.floor(axisLength * 0.5);
        }
        return (5 * coord) + Math.floor(axisLength * 0.5);
    }

    private render(pos: any): void {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        let image = this.offCtx.getImageData(0, 0, this.offCanvas.width, this.offCanvas.height);
        this.ctx.putImageData(image, 0, 0);
        this.ctx.beginPath();
        this.ctx.ellipse(
            this.scale(pos[this.xAxis], this.canvas.width, false),
            this.scale(pos[this.yAxis], this.canvas.height, true),
            5,
            5,
            0,
            0,
            Math.PI * 2,
        );
        this.ctx.fillStyle = this.highlightColor;
        this.ctx.fill();
        this.ctx.stroke();
    }

    public onReload(): (controls: Controls) => () => void {
        let that: App = this;
        return (controls: Controls) => {
            return () => {
                that.rho = controls.rho;
                that.sigma = controls.sigma;
                that.beta = controls.beta;

                that.xAxis = controls.xAxis;
                that.yAxis = controls.yAxis;

                that.lorentz = new LorentzSystem(
                    that.rho,
                    that.sigma,
                    that.beta,
                );
                that.initCanvas();
            };
        };
    }
}

window.onload = () => {
    let app = new App();

    app.setup();
}
