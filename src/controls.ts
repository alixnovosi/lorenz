import RadioButton from "./button";
import Input from "./input";

// some constants.
const HORIZONTAL_AXIS: string = "horizontalAxis";
const VERTICAL_AXIS: string = "verticalAxis";

export default class Controls {
    public base: HTMLElement;

    private reloadButton: HTMLButtonElement

    public xAxis: number = 0
    public yAxis: number = 2;
    private axes: object = {
        "x": 0,
        "y": 1,
        "z": 2,
    };

    public rho: number;
    public sigma: number;
    public beta: number;

    private rhoInput: Input;
    private sigmaInput: Input;
    private betaInput: Input;

    private xHorRadio: RadioButton;
    private yHorRadio: RadioButton;
    private zHorRadio: RadioButton;

    private xVerRadio: RadioButton;
    private yVerRadio: RadioButton;
    private zVerRadio: RadioButton;

    constructor(
        base: HTMLElement,
        xAxis: number,
        yAxis: number,
        rho: number,
        sigma: number,
        beta: number,
        updateCallback: (controls: Controls) => () => void,
    ) {
        this.base = base;

        let titleRowLabel = document.createElement("h4");
        titleRowLabel.innerHTML = "Axes of 3D system to map";
        this.base.appendChild(titleRowLabel);

        this.xAxis = xAxis;
        this.yAxis = yAxis;

        let horButtonRow = document.createElement("div");
        horButtonRow.className = "lorenzControlRow";
        this.base.appendChild(horButtonRow);

        let horRowLabel = document.createElement("label");
        horRowLabel.innerHTML = "X Axis";
        horButtonRow.appendChild(horRowLabel);

        this.xHorRadio = new RadioButton(
            horButtonRow,
            HORIZONTAL_AXIS,
            "x",
            this.radioOnClick(),
            true,
        );
        this.yHorRadio = new RadioButton(
            horButtonRow,
            HORIZONTAL_AXIS,
            "y",
            this.radioOnClick(),
        );
        this.zHorRadio = new RadioButton(
            horButtonRow,
            HORIZONTAL_AXIS,
            "z",
            this.radioOnClick(),
        );

        let verButtonRow = document.createElement("div");
        verButtonRow.className = "lorenzControlRow";
        this.base.appendChild(verButtonRow);

        let verRowLabel = document.createElement("label");
        verRowLabel.innerHTML = "Y Axis";
        verButtonRow.appendChild(verRowLabel);

        this.xVerRadio = new RadioButton(
            verButtonRow,
            VERTICAL_AXIS,
            "x",
            this.radioOnClick(),
        );
        this.yVerRadio = new RadioButton(
            verButtonRow,
            VERTICAL_AXIS,
            "y",
            this.radioOnClick(),
        );
        this.zVerRadio = new RadioButton(
            verButtonRow,
            VERTICAL_AXIS,
            "z",
            this.radioOnClick(),
            true,
        );

        let paramRowLabel = document.createElement("h4");
        paramRowLabel.innerHTML = "Lorenz parameters";
        this.base.appendChild(paramRowLabel);

        this.rho = rho;
        let rhoRow = document.createElement("div");
        rhoRow.className = "lorenzControlRow";
        this.base.appendChild(rhoRow);
        this.rhoInput = new Input(rhoRow, "ρ/rho", this.rho, this.fieldOnEdit("rho"));

        this.sigma = sigma;
        let sigmaRow = document.createElement("div");
        sigmaRow.className = "lorenzControlRow";
        this.base.appendChild(sigmaRow);
        this.sigmaInput = new Input(sigmaRow, "σ/sigma", this.sigma, this.fieldOnEdit("sigma"));

        this.beta = beta;
        let betaRow = document.createElement("div");
        betaRow.className = "lorenzControlRow";
        this.base.appendChild(betaRow);
        this.betaInput = new Input(betaRow, "β/beta", this.beta, this.fieldOnEdit("beta"));

        this.reloadButton = document.createElement("button");
        this.base.appendChild(this.reloadButton);
        this.reloadButton.className = "reload";
        this.reloadButton.name = "reload"
        this.reloadButton.innerHTML = "Reload";

        this.reloadButton.addEventListener("click", updateCallback(this));
    }

    private radioOnClick(): (axis: string, value: string) => () => void {
        let that: Controls = this;
        return (axis: string, value: string) => {
            return () => {
                let numAxis: number = that.axes[value];
                axis == HORIZONTAL_AXIS ? that.xAxis = numAxis : that.yAxis = numAxis;
            };
        };
    }

    private fieldOnEdit(field: string): (element: HTMLInputElement) => () => void {
        let that: Controls = this;
        return (element: HTMLInputElement) => {
            return () => {
                that[field] = element.value;
            };
        };
    }
}
