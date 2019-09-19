export default class Input {
    public element: HTMLInputElement;
    public label: HTMLLabelElement;

    constructor(base: HTMLElement, name: string, value: number) {
        this.element = document.createElement("input");
        this.element.type = "text";
        this.element.name = name;
        this.element.value = `${value}`;
        this.element.id = `${value}`;

        this.label = document.createElement("label");
        this.label.setAttribute("for", this.element.id);
        this.label.innerHTML = name;

        base.appendChild(this.label);
        base.appendChild(this.element);
    }
}
