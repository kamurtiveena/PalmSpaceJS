

export class Layout {
    constructor(state) {
        this.name = state.menu.study2.layout;

        switch (this.name) {
            case "Grid":
                this.layout = new LayoutGrid(this);
                break;
            case "Flow":
                this.layout = new LayoutFlow(this);
                break;
            default:
                console.error("layout choice undefinend:", this.name);
        }
    }
}