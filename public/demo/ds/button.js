export class LandmarkButton {
    constructor(parent, id, state, icon, name, opts, onclick) {
        this.onclick = onclick;
        this.opts = opts;
        this.name = name;
        this.id = id;
        this.parent = parent;
        this.widthMin = state.config.landmarkButtons.width;
        this.heightMin = state.config.landmarkButtons.height;

        this.width = this.widthMin;
        this.height = this.heightMin;

        this.widthHalf = this.width / 2;
        this.heightHalf = this.height / 2;

        // center
        this.x = 0;
        this.y = 0;

        
        this.topleft = {
            x: 0,
            y: 0
        };
        
        this.icon = icon;
    }

    calcTopLeft() {
        this.topleft.x = this.x - Math.min(this.width, this.height)/2;
        this.topleft.y = this.y - Math.min(this.width, this.height)/2;
    }

    box() {
        return {
            x: this.topleft.x,
            y: this.topleft.y,
            width: this.width,
            height: this.height
        };
    }

    reset() {}

    isCursorInside(state) {

        if (!state.cursor) return;

        const {x, y} = state.cursor;
        return (
            this.topleft.x <= x + 10 &&
            x <= this.topleft.x + this.width  + 10 &&
            this.topleft.y <= y + 10 &&
            y <= this.topleft.y + this.height + 10
        );
    }

    draw(state) {
        // outdated
        let c = new cv.Scalar(255, 25, 25);
        
        if(this.id == state.selection.markedBtn.btn_id) {
            c = new cv.Scalar(0, 255, 0);
        }

        cv.rectangle(
            state.overlay,
            new cv.Point(
                this.x - this.widthHalf, 
                this.y - this.heightHalf),
            new cv.Point(
                this.x + this.widthHalf, 
                this.y + this.heightHalf),
            c,
            -1
        );
        
    }

}