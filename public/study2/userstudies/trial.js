
import { TrialState, TrialBtnState } from './constant.js';
import { TechniqueType } from '../technique/constant.js';

export class Trial {
    constructor(state) {
        this.status = TrialState.OPEN;
        this.visitTimeBtn = performance.now();

        this.cursorOverBtn = false;
        this.cursorOverBackBtn = false;

        this.startBtn = {
            rect: new cv.Rect(1, 1, 70, 50),
            label: 'Start',
            color: new cv.Scalar(20, 20, 20)
        }

        this.backBtn = {
            rect: new cv.Rect(state.width - 150, state.height / 2 - 25, 140, 50),
            label: 'Go back',
            color: new cv.Scalar(20, 200, 200)
        }

        this.permutation = [];
        if (state.technique.type == TechniqueType.Landmark_Btn || state.technique.type == TechniqueType.Landmark_Btn_FishEye ||
            state.technique.type == TechniqueType.LayoutFlow || state.technique.type == TechniqueType.LayoutGrid) {
                for (let btn_id = 0; btn_id < state.config.landmarkButtons.total; btn_id++) 
                    this.permutation.push({ 
                        "btn_id": btn_id, 
                        "row_i": null, 
                        "col_j": null 
                    });
        } else {
            for (let row_i = 1; row_i <= state.menu.cellscnt.row; row_i ++)
                for (let col_j = 1; col_j <= state.menu.cellscnt.col; col_j ++) {
                    this.permutation.push({ 
                        "btn_id": null, 
                        "row_i": row_i, 
                        "col_j": col_j 
                    });
                }
        }

        this.targetList = [];
        for (let i = 0; i < state.config.experiment.repetitions;) {
            const plist = [];
            
            for (let j = 0;i < state.config.experiment.repetitions && j < this.permutation.length; j++) {
                const k = Math.floor(Math.random() *(this.permutation.length - j)) + j;
                const tmp = this.permutation[j];
                this.permutation[j] = {
                    "btn_id": this.permutation[k].btn_id,
                    "row_i": this.permutation[k].row_i,
                    "col_j": this.permutation[k].col_j
                };

                this.permutation[k] = {
                    "btn_id": tmp.btn_id,
                    "row_i": tmp.row_i,
                    "col_j": tmp.col_j
                };

                plist.push(this.permutation[j]);
                i++;
            }
            
            console.log("this.permutation:", this.permutation);
            
            for (let j = 0; j < plist.length; j ++) 
                this.targetList.push(plist[j]);
        }

        console.log("this.targetList:", this.targetList);

        this.targetID = -1;
        this.targetSeqSize = this.targetList.length;

        this.targetsStartTime = new Array(this.targetSeqSize);
        this.targetsEndTime = new Array(this.targetSeqSize);
        this.targetsDuration = new Array(this.targetSeqSize);
        this.targetSeq = new Array(this.targetSeqSize);

        this.stats = {
            attempts: (new Array(this.targetSeqSize)).fill(0),
            distance: {
                cursor: (new Array(this.targetSeqSize)).fill(0),
                palm: {
                    left: (new Array(this.targetSeqSize)).fill(0),
                    right: (new Array(this.targetSeqSize)).fill(0)
                }
            },
            lastPos: {
                cursor: { x: -1, y: -1 },
                palm: {
                    left: { x: -1, y: -1 },
                    right: { x: -1, y: -1 }
                }
            },
            visitedCells: (new Array(this.targetSeqSize)).fill(0),
            targetsLastVisitedTime: (new Array(this.targetSeqSize)).fill(0),
            valid: true,
            events: ""
        }
    }



    elapsedTime() {
        if (this.targetsDuration[this.targetID]) {
            return this.targetsDuration[this.targetID].toFixed(1);
        }

        return 0.0;
    }

    lastVisitTime() {
        return this.stats.targetsLastVisitedTime[this.targetID].toFixed(1);
    }

    updateTargetLastVisitTime(state) {
        const p = this.targetSeq[this.targetID];
        this.stats.targetsLastVisitedTime[this.targetID] =
            state.technique.anchor.lastTargetVisitTime(p) -
            this.targetsStartTime[this.targetID];
    }

    updateVisitedCells(state) {
        this.stats.visitedCells[this.targetID] =
            state.technique.stats.visitedCells;
    }

    updateTargetTime() {
        this.targetsEndTime[this.targetID] = performance.now();
        this.targetsDuration[this.targetID] =
            this.targetsEndTime[this.targetID] - this.targetsStartTime[this.targetID];

    }

    updateRightPalmDist(state) {
        if (state.initiator.right &&
            state.initiator.right.landmarks[0].x > 0 &&
            state.initiator.right.landmarks[0].y > 0) {
            if (this.stats.lastPos.palm.right.x > 0) {
                this.stats.distance.palm.right[this.targetID] += Math.hypot(
                    state.initiator.right.landmarks[0].x - this.stats.lastPos.palm.right.x,
                    state.initiator.right.landmarks[0].y - this.stats.lastPos.palm.right.y
                );
            }

            this.stats.lastPos.palm.right.x = state.initiator.right.landmarks[0].x;
            this.stats.lastPos.palm.right.y = state.initiator.right.landmarks[0].y;

        } else {
            this.stats.lastPos.palm.right.x = -1;
            this.stats.lastPos.palm.right.y = -1;
        }
    }

    updateLeftPalmDist(state) {
        if (state.initiator.left &&
            state.initiator.left.landmarks[0].x > 0 &&
            state.initiator.left.landmarks[0].y > 0) {
            if (this.stats.lastPos.palm.left.x > 0) {
                this.stats.distance.palm.left[this.targetID] += Math.hypot(
                    state.initiator.left.landmarks[0].x - this.stats.lastPos.palm.left.x,
                    state.initiator.left.landmarks[0].y - this.stats.lastPos.palm.left.y
                );
            }

            this.stats.lastPos.palm.left.x = state.initiator.left.landmarks[0].x;
            this.stats.lastPos.palm.left.y = state.initiator.left.landmarks[0].y;

        } else {
            this.stats.lastPos.palm.left.x = -1;
            this.stats.lastPos.palm.left.y = -1;
        }
    }

    updateCursorDistTraveled(state) {
        if (state.cursor &&
            state.cursor.x > 0 &&
            state.cursor.y > 0) {

            if (this.stats.lastPos.cursor.x > 0) {
                const d = Math.hypot(
                    state.cursor.x - this.stats.lastPos.cursor.x,
                    state.cursor.y - this.stats.lastPos.cursor.y
                );

                this.stats.distance.cursor[this.targetID] += d;
            }

            this.stats.lastPos.cursor.x = state.cursor.x;
            this.stats.lastPos.cursor.y = state.cursor.y;

        } else {
            this.stats.lastPos.cursor.x = -1;
            this.stats.lastPos.cursor.y = -1;
        }

    }

    incrementAttempts(state) {
        const d = performance.now() - this.targetsStartTime[this.targetID];
        this.stats.events += `${this.stats.attempts[this.targetID]}:${state.selection.currentBtn.btn_id}:${d};`;
        this.stats.attempts[this.targetID]++;
    }

    started() {
        return this.status == TrialState.STARTED;
    }

    isCursorOverStartBtn(state) {
        if (state.cursor) {
            if (this.status != TrialState.DONE) {
                const r = this.startBtn.rect;
                if (this.status != TrialState.STARTED &&
                    r.x <= state.cursor.x && state.cursor.x <= r.x + r.width + 5 &&
                    r.y <= state.cursor.y && state.cursor.y <= r.y + r.height + 5) {
                        return true;
                }
            }
        }

        this.cursorOverBtn = false;
        return false;
    }

    isCursorOverBackBtn(state) {
        if (state.cursor) {
            if (this.status == TrialState.DONE) {
                const b = this.backBtn.rect;

                if (this.status == TrialState.DONE &&
                    b.x <= state.cursor.x && state.cursor.x <= b.x + b.width &&
                    b.y <= state.cursor.y && state.cursor.y <= b.y + b.height) {
                    return true;
                }
            }
        }

        this.cursorOverBackBtn = false;
        return false;
    }
    updateBackBtnInputLoc(state) {
        if (state.technique.type == TechniqueType.Landmark_Btn || state.technique.type == TechniqueType.Landmark_Btn_FishEye ||
            state.technique.type == TechniqueType.LayoutGrid || state.technique.type == TechniqueType.LayoutFlow) {
            this._updateBackBtnInputLocBtnID(state);
        } else {
            this._updateBackBtnInputLoc(state);
        }
    }

    _updateBackBtnInputLocBtnID(state) {
        const p = state.initiator.left.landmarks[4];

        const tl = new cv.Point(
            p.x - state.config.landmarkButtons.widthHalf - 70,
            p.y - state.config.landmarkButtons.heightHalf - 45,
        );

        const br = new cv.Point(
            p.x + state.config.landmarkButtons.widthHalf + 70,
            p.y + state.config.landmarkButtons.heightHalf + 45,
        );

        this.backBtn.rect = new cv.Rect(tl.x, tl.y, br.x - tl.x, br.y - tl.y);
    }

    _updateBackBtnInputLoc(state) {

        let tl = new cv.Point(
            state.technique.grid.input.x_cols[0] + state.technique.grid.input.width + 10,
            state.technique.grid.input.y_rows[0] + state.technique.grid.input.height / 2 - 45
        );

        let br = new cv.Point(
            state.technique.grid.input.x_cols[0] + state.technique.grid.input.width + 10 + 130,
            state.technique.grid.input.y_rows[0] + state.technique.grid.input.height / 2 + 45
        );

        if (state.technique.type == TechniqueType.H2S_Absolute) {
            tl = new cv.Point(
                state.technique.grid.output.x_cols[0] + state.technique.grid.output.width + 10,
                state.technique.grid.output.y_rows[0] + state.technique.grid.output.height / 2 - 45
            );

            br = new cv.Point(
                state.technique.grid.output.x_cols[0] + state.technique.grid.output.width + 10 + 130,
                state.technique.grid.output.y_rows[0] + state.technique.grid.output.height / 2 + 45
            );
        }

        this.backBtn.rect = new cv.Rect(tl.x, tl.y, br.x - tl.x, br.y - tl.y);
    }

    updateStartBtnInputLoc(state) {
        if (state.technique.type == TechniqueType.Landmark_Btn || state.technique.type == TechniqueType.Landmark_Btn_FishEye ||
            state.technique.type == TechniqueType.LayoutGrid || state.technique.type == TechniqueType.LayoutFlow) {
                this._updateStartBtnInputLocBtnID(state);
        } else {
            this._updateStartBtnInputLoc(state);
        }
    }

    _updateStartBtnInputLocBtnID(state) {

        const p = state.initiator.left.landmarks[4];

        const tl = new cv.Point(
            p.x - state.config.landmarkButtons.widthHalf - state.config.experiment.startButton.widthHalf,
            p.y - state.config.landmarkButtons.heightHalf - state.config.experiment.startButton.heightHalf,
        );

        const br = new cv.Point(
            p.x + state.config.landmarkButtons.widthHalf + state.config.experiment.startButton.widthHalf,
            p.y + state.config.landmarkButtons.heightHalf + state.config.experiment.startButton.heightHalf,
        );

        this.startBtn.rect = new cv.Rect(tl.x, tl.y, br.x - tl.x, br.y - tl.y);
    }

    _updateStartBtnInputLoc(state) {

        let tl = new cv.Point(
            state.technique.grid.input.x_cols[0] + state.technique.grid.input.width + 10,
            state.technique.grid.input.y_rows[0] + state.technique.grid.input.height / 2 - state.config.experiment.startButton.heightHalf
        );

        let br = new cv.Point(
            state.technique.grid.input.x_cols[0] + state.technique.grid.input.width + 10 + state.config.experiment.startButton.width,
            state.technique.grid.input.y_rows[0] + state.technique.grid.input.height / 2 + state.config.experiment.startButton.heightHalf
        );

        if (state.technique.type == TechniqueType.H2S_Absolute) {
            tl = new cv.Point(
                state.technique.grid.output.x_cols[0] + state.technique.grid.output.width + 10,
                state.technique.grid.output.y_rows[0] + state.technique.grid.output.height / 2 - state.config.experiment.startButton.heightHalf
            );

            br = new cv.Point(
                state.technique.grid.output.x_cols[0] + state.technique.grid.output.width + 10 + state.config.experiment.startButton.width,
                state.technique.grid.output.y_rows[0] + state.technique.grid.output.height / 2 + state.config.experiment.startButton.heightHalf
            );
        }

        this.startBtn.rect = new cv.Rect(tl.x, tl.y, br.x - tl.x, br.y - tl.y);
    }

    drawBackBtn(state) {
        if (this.status == TrialState.DONE) {

            let tl = null, br = null;

            if (state.technique.type == TechniqueType.Landmark_Btn || state.technique.type == TechniqueType.Landmark_Btn_FishEye ||
                state.technique.type == TechniqueType.LayoutGrid || state.technique.type == TechniqueType.LayoutFlow) {
                    const p = this._drawBackBtnBtnID(state);
                    tl = p.tl;
                    br = p.br;
            } else {
                const p = this._drawBackBtn(state);
                tl = p.tl;
                br = p.br;
            }

            cv.rectangle(
                state.overlay,
                tl,
                br,
                this.backBtn.color,
                -1
            );

            cv.putText(
                state.overlay,
                this.backBtn.label,
                new cv.Point(-45 + (tl.x + br.x) / 2, (tl.y + br.y + 10) / 2),
                cv.FONT_HERSHEY_SIMPLEX,
                0.8,
                new cv.Scalar(225, 225, 225),
                2
            );
        }
    }

    _drawBackBtnBtnID(state) {
        const p = state.initiator.left.landmarks[4];

        const tl = new cv.Point(
            p.x - state.config.landmarkButtons.widthHalf - 45,
            p.y - state.config.landmarkButtons.heightHalf - 60,
        );

        const br = new cv.Point(
            p.x + state.config.landmarkButtons.widthHalf + 45,
            p.y + state.config.landmarkButtons.heightHalf + 60,
        );

        return { tl, br };
    }

    _drawBackBtn(state) {

        let tl = new cv.Point(
            state.technique.grid.output.x_cols[0] + state.technique.grid.output.width + 10,
            state.technique.grid.output.y_rows[0] + state.technique.grid.output.height / 2 - 45
        );

        let br = new cv.Point(
            state.technique.grid.output.x_cols[0] + state.technique.grid.output.width + 10 + 120,
            state.technique.grid.output.y_rows[0] + state.technique.grid.output.height / 2 + 45
        );

        if (state.technique.type == TechniqueType.H2S_Absolute) {
            tl = new cv.Point(
                state.technique.grid.output.x_cols[0] + state.technique.grid.output.width + 10,
                state.technique.grid.output.y_rows[0] + state.technique.grid.output.height / 2 - 45
            );

            br = new cv.Point(
                state.technique.grid.output.x_cols[0] + state.technique.grid.output.width + 10 + 120,
                state.technique.grid.output.y_rows[0] + state.technique.grid.output.height / 2 + 45
            );
        }

        return { tl, br };
    }

    drawStartBtn(state) {
        if (this.status == TrialState.DONE) {
            return;
        }

        let tl = null, br = null;
        if (state.isExistingPresentation()) {
            const p = this._drawStartBtnTopRight(state);
            tl = p.tl;
            br = p.br;
        } else if (state.technique.type == TechniqueType.Landmark_Btn || state.technique.type == TechniqueType.Landmark_Btn_FishEye ||
            state.technique.type == TechniqueType.LayoutGrid || state.technique.type == TechniqueType.LayoutFlow) {
            const p = this._drawStartBtnBtnID(state);
            tl = p.tl;
            br = p.br;
        } else {
            const p = this._drawStartBtn(state);
            tl = p.tl;
            br = p.br;
        }

        // if (this.status == TrialState.STARTED) {
        //     this.startBtn.color = new cv.Scalar(220, 248, 255);
        // }

        // if (this.status == TrialState.OPEN ||
        //     this.status == TrialState.PAUSED) {
            
        if (state.experiment.trial.started()) {
            state.canvasCVOutCtx.fillStyle = "green";
        } else {
            state.canvasCVOutCtx.fillStyle = "black";
        }
        state.canvasCVOutCtx.lineWidth = 3;
        state.canvasCVOutCtx.globalAlpha = 0.7;
        state.canvasCVOutCtx.fillRect(
            tl.x,
            tl.y,
            br.x - tl.x,
            br.y - tl.y 
        );

        state.canvasCVOutCtx.globalAlpha = 0.8;
        state.canvasCVOutCtx.font = "18px Georgia";
        state.canvasCVOutCtx.fillStyle = "white";
        state.canvasCVOutCtx.fillText(this.startBtn.label, -20 + (tl.x + br.x) / 2, (tl.y + br.y + 10) / 2);
        // }
    }

    _drawStartBtnTopRight(state) {
        const p = state.initiator.left.landmarks[4];

        const tl = new cv.Point(
            state.width - 50,
            100,
        );

        const br = new cv.Point(
            state.width - 5,
            130
        );

        return { tl, br };
    }

    _drawStartBtnBtnID(state) {
        const p = state.initiator.left.landmarks[4];

        const tl = new cv.Point(
            p.x - state.config.landmarkButtons.widthHalf - state.config.experiment.startButton.widthHalf,
            p.y - state.config.landmarkButtons.heightHalf - state.config.experiment.startButton.heightHalf,
        );

        const br = new cv.Point(
            p.x + state.config.landmarkButtons.widthHalf + state.config.experiment.startButton.widthHalf,
            p.y + state.config.landmarkButtons.heightHalf + state.config.experiment.startButton.heightHalf,
        );

        return { tl, br };
    }


    _drawStartBtn(state) {


        let tl = new cv.Point(
            state.technique.grid.output.x_cols[0] + state.technique.grid.output.width + 10,
            state.technique.grid.output.y_rows[0] + state.technique.grid.output.height / 2 - state.config.experiment.startButton.heightHalf
        );

        let br = new cv.Point(
            state.technique.grid.output.x_cols[0] + state.technique.grid.output.width + 10 + state.config.experiment.startButton.width,
            state.technique.grid.output.y_rows[0] + state.technique.grid.output.height / 2 + state.config.experiment.startButton.heightHalf
        );

        if (state.technique.type == TechniqueType.H2S_Absolute) {
            tl = new cv.Point(
                state.technique.grid.output.x_cols[0] + state.technique.grid.output.width + 10,
                state.technique.grid.output.y_rows[0] + state.technique.grid.output.height / 2 - state.config.experiment.startButton.heightHalf
            );

            br = new cv.Point(
                state.technique.grid.output.x_cols[0] + state.technique.grid.output.width + 10 + state.config.experiment.startButton.width,
                state.technique.grid.output.y_rows[0] + state.technique.grid.output.height / 2 + state.config.experiment.startButton.heightHalf
            );
        }


        return { tl, br };
    }

    completedTargetsStr() {
        return this.targetID + "/" + this.targetSeqSize;
    }

    drawCompletedTargetsText(state) {
        if (this.status == TrialState.STARTED) {
            cv.putText(
                state.overlay,
                this.completedTargetsStr(),
                new cv.Point(state.width - 110, state.height - 20),
                cv.FONT_HERSHEY_SIMPLEX,
                1.0,
                new cv.Scalar(200, 200, 200),
                2
            );
        }
    }

    clickStartBtn(state) {
        this.status = TrialState.STARTED;
        this.startBtn.label = 'Next';
        this.targetsStartTime[this.targetID] = performance.now();
        this.stats.valid = true;
        this.stats.events = "";
    }

    generateTarget(state) {
        if (this.status == TrialState.DONE) {
            return;
        }

        this.targetID += 1;

        if (this.targetID == this.targetSeqSize) {
            this.status = TrialState.DONE;
        }
        if (state.technique.type == TechniqueType.Landmark_Btn || state.technique.type == TechniqueType.Landmark_Btn_FishEye ||
            state.technique.type == TechniqueType.LayoutFlow || state.technique.type == TechniqueType.LayoutGrid) {
                this.targetSeq[this.targetID] = this._generateTargetBtnID(state);
        } else {
            this.targetSeq[this.targetID] = this._generateTarget(state);
        }
    }

    _generateTargetBtnID(state) {
        let btn_id = this.targetList[this.targetID].btn_id;
        return { btn_id };
    }

    _generateTarget(state) {
        let row_i = this.targetList[this.targetID].row_i;
        let col_j = this.targetList[this.targetID].col_j;
        return { row_i, col_j };
    }

    matched(state) {
        if (state.technique.type == TechniqueType.Landmark_Btn || state.technique.type == TechniqueType.Landmark_Btn_FishEye ||
            state.technique.type == TechniqueType.LayoutGrid || state.technique.type == TechniqueType.LayoutFlow) {
                return this._matchedBtnID(state);
        } else {
            return this._matched(state);
        }
    }

    currentTarget() {
        return this.targetSeq[this.targetID];
    }

    _matchedBtnID(state) {
        return state.selection.currentBtn.btn_id == this.targetSeq[this.targetID].btn_id;
    }

    _matched(state) {
        return (
            state.selection.currentBtn.row_i == this.targetSeq[this.targetID].row_i &&
            state.selection.currentBtn.col_j == this.targetSeq[this.targetID].col_j
        );
    }

    clickTarget(state) {
        this.targetsEndTime[this.targetID] = performance.now();
        this.targetsDuration[this.targetID] =
            (this.targetsEndTime[this.targetID] - this.targetsStartTime[this.targetID]);

        this.status = TrialState.PAUSED;
    }

    drawTarget(state) {
        if (this.status == TrialState.DONE) {
            return;
        }

        if (this.status == TrialState.STARTED) {
            if (state.technique.type == TechniqueType.Landmark_Btn || state.technique.type == TechniqueType.Landmark_Btn_FishEye ||
                state.technique.type == TechniqueType.LayoutGrid || state.technique.type == TechniqueType.LayoutFlow) {
                    this._drawTargetBtnID(state);
            } else {
                this._drawTarget(state);
            }
        }
    }

    _drawTargetBtnID(state) {
        // const p = state.initiator.left.landmarks[this.targetSeq[this.targetID].btn_id];
        const p = state.technique.buttons.input[this.targetSeq[this.targetID].btn_id].box();

        cv.rectangle(
            state.overlay,
            new cv.Point(
                p.x,
                p.y
            ),
            new cv.Point(
                p.x + p.width,
                p.y + p.height
            ),
            new cv.Scalar(128, 0, 128),
            -1
        );
    }

    _drawTarget(state) {

        cv.rectangle(
            state.overlay,
            new cv.Point(
                state.technique.grid.output.x_cols[this.targetSeq[this.targetID].col_j],
                state.technique.grid.output.y_rows[this.targetSeq[this.targetID].row_i]
            ),
            new cv.Point(
                state.technique.grid.output.x_cols[this.targetSeq[this.targetID].col_j + 1] - state.technique.grid.output.gap,
                state.technique.grid.output.y_rows[this.targetSeq[this.targetID].row_i + 1] - state.technique.grid.output.gap
            ),
            new cv.Scalar(128, 0, 128),
            -1
        );
    }
}
