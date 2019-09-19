export default class RadioButton {
    public element: HTMLInputElement;
    public label: HTMLLabelElement;

    constructor(base: HTMLElement, rowName: string, value: string, checked: boolean=false) {
        let div = document.createElement("div");
        base.appendChild(div);

        this.element = document.createElement("input");
        this.element.checked = checked;
        this.element.type = "radio";
        this.element.name = rowName;
        this.element.value = value;
        this.element.id = value;

        this.label = document.createElement("label");
        this.label.setAttribute("for", this.element.id);
        this.label.innerHTML = value;

        div.appendChild(this.label);
        div.appendChild(this.element);
    }
}
