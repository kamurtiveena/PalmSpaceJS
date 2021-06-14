export class Button {
    constructor(parent, id) {
        this.id = id;
        this.parent = parent;
        this.width = 30;
        this.height = 30;
        this.widthHalf = this.width / 2;
        this.heightHalf = this.height / 2;
        
    }

    reset() {}

    isCursorInside(state) {

        if (!state.cursor) return;

        const {x, y} = state.cursor;
        console.log("landmark btn cursor x:", x, "y:", y);
        return (
            state.initiator.left.landmarks[this.id].x <= x + 10 &&
            x <= state.initiator.left.landmarks[this.id].x + this.width  + 10 &&
            state.initiator.left.landmarks[this.id].y <= y + 10 &&
            y <= state.initiator.left.landmarks[this.id].y + this.height + 10
        );
    }

    draw(state) {
        let c = new cv.Scalar(255, 25, 25);
        
        if(this.id == state.selection.markedBtn.btn_id) {
            c = new cv.Scalar(0, 255, 0);
        }

        cv.rectangle(
            state.overlay,
            new cv.Point(
                state.initiator.left.landmarks[this.id].x - this.widthHalf, 
                state.initiator.left.landmarks[this.id].y - this.heightHalf),
            new cv.Point(
                state.initiator.left.landmarks[this.id].x + this.widthHalf, 
                state.initiator.left.landmarks[this.id].y + this.heightHalf),
            c,
            -1
        );
        
    }

}