export class LandmarkButton {
    constructor(parent, id, state, icon) {
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
        this.icon = icon;
    }

    box() {
        return {
            x: this.x - this.width/2,
            y: this.y - this.height/2,
            width: this.width,
            height: this.height
        };
    }

    reset() {}

    isCursorInside(state) {

        if (!state.cursor) return;

        const {x, y} = state.cursor;
        return (
            this.x - this.widthHalf <= x + 10 &&
            x <= this.x + this.widthHalf  + 10 &&
            this.y - this.heightHalf <= y + 10 &&
            y <= this.y + this.heightHalf + 10
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