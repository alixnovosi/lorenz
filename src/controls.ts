import RadioButton from "./button";
import Input from "./input";

export default class Controls {
    public base: HTMLElement;

    private reloadButton: HTMLButtonElement

    private rho: number;
    private sigma: number;
    private beta: number;

    private rhoInput: Input;
    private sigmaInput: Input;
    private betaInput: Input;

    private xHorRadio: RadioButton;
    private yHorRadio: RadioButton;
    private zHorRadio: RadioButton;

    private xVerRadio: RadioButton;
    private yVerRadio: RadioButton;
    private zVerRadio: RadioButton;

    constructor(base: HTMLElement, rho: number, sigma: number, beta: number) {
        this.base = base;

        let horButtonRow = document.createElement("div");
        horButtonRow.className = "lorenzControlRow";
        this.base.appendChild(horButtonRow);

        let horRowLabel = document.createElement("label");
        horRowLabel.innerHTML = "X Axis";

        horButtonRow.appendChild(horRowLabel);

        this.xHorRadio = new RadioButton(horButtonRow, "horizontalAxis", "x", true);
        this.yHorRadio = new RadioButton(horButtonRow, "horizontalAxis", "y");
        this.zHorRadio = new RadioButton(horButtonRow, "horizontalAxis", "z");

        let verButtonRow = document.createElement("div");
        verButtonRow.className = "lorenzControlRow";
        this.base.appendChild(verButtonRow);

        let verRowLabel = document.createElement("label");
        verRowLabel.innerHTML = "Y Axis";
        verButtonRow.appendChild(verRowLabel);

        this.xVerRadio = new RadioButton(verButtonRow, "verticalAxis", "x");
        this.yVerRadio = new RadioButton(verButtonRow, "verticalAxis", "y");
        this.zVerRadio = new RadioButton(verButtonRow, "verticalAxis", "z", true);

        let paramRow = document.createElement("div");
        paramRow.className = "lorenzControlRow";
        this.base.appendChild(paramRow);

        let paramRowLabel = document.createElement("label");
        paramRowLabel.innerHTML = "Lorenz parameters";
        paramRow.appendChild(paramRowLabel);

        let rhoRow = document.createElement("div");
        rhoRow.className = "lorenzControlRow";
        this.base.appendChild(rhoRow);

        this.rho = rho;
        this.sigma = sigma;
        this.beta = beta;

        let sigmaRow = document.createElement("div");
        sigmaRow.className = "lorenzControlRow";
        this.base.appendChild(sigmaRow);

        let betaRow = document.createElement("div");
        betaRow.className = "lorenzControlRow";
        this.base.appendChild(betaRow);

        this.rhoInput = new Input(rhoRow, "ρ (rho)", this.rho);
        this.sigmaInput = new Input(sigmaRow, "σ (sigma)", this.sigma);
        this.betaInput = new Input(betaRow, "β (beta)", this.beta);

        this.reloadButton = document.createElement("button");
        this.base.appendChild(this.reloadButton);
        this.reloadButton.className = "reload";
        this.reloadButton.name = "reload"
        this.reloadButton.innerHTML = "Reload";
    }
}
