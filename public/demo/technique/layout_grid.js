import { TechniqueType, ReadingDirectionType } from "./constant.js";

import { LandmarkButton } from "../ds/button.js";

import { TrainUIState } from "./constant.js";

export class LayoutGrid {
    // todo implement delete attributes in class destructor
    constructor(parent, state) {
        this.parent = parent;
        this.parent.type = TechniqueType.LayoutGrid;
        this.gap = 3;

        // this.parent.buttons = {
        //     input: [],
        //     output: []
        // };

        // this.trainUIState = TrainUIState.Welcome;
        this.trainUIState = TrainUIState.Choice;

        this.parent.buttonsUIs = {
            Unassigned: {
                finger: {
                    input: [
                    ],
                    output: [

                    ]
                },
                palm: {
                    input: [
                    ],
                    output: [

                    ]
                }
            },
            Choice: {
                finger: {
                    input: [
                    ],
                    output: [
                    ]
                },
                palm: {
                    input: [
                        new LandmarkButton(this, 0, state, null, ["View", "Nearby", "Map"]),
                        new LandmarkButton(this, 1, state, null, ["Menu"]),
                        new LandmarkButton(this, 2, state, null, ["Bus", "Routes"]),
                    ],
                    output: [
                        new LandmarkButton(this, 0, state, null, ["View", "Nearby", "Map"]),
                        new LandmarkButton(this, 1, state, null, ["Menu"]),
                        new LandmarkButton(this, 2, state, null, ["Bus", "Routes"]),                    ]
                }

            },
            Output: {
                finger: {
                    input: [
                        new LandmarkButton(this, 6, state, null, ["Go", "Back"]),
                    ],
                    output: [
                        new LandmarkButton(this, 6, state, null, ["Go", "Back"]),
                    ]
                },
                palm: {
                    input: [
                        new LandmarkButton(this, 0, state, null, ["Output"])
                    ],
                    output: [
                        new LandmarkButton(this, 0, state, null, ["Output"])
                    ]
                }
            },
        };


        this.isCursorInsideBtn = false; // todo what is it doing
    }

    calculate(state) {
        if (!state.initiator.left.show) return;

        if (state.initiator.left.landmarks) {
            this._align(state);
            this.parent._setupSelectionTrain(state);

        }
    }

    reset() {
        // this.trainUIState = TrainUIState.Welcome;
        this.trainUIState = TrainUIState.Choice;
    }

    moveToNextUI(state) {
        // state required for aligning grid
        switch (this.trainUIState) {
            case TrainUIState.Welcome:
                // this.trainUIState = TrainUIState.Choice;
                console.error("palm moveToNextUI(): state should not be in Welcome");
                break;
            case TrainUIState.Choice:
                this.trainUIState = TrainUIState.Output;
                break;
            case TrainUIState.Output:
                this.trainUIState = TrainUIState.Choice;
                break;
            case TrainUIState.Done:
                console.error("palm moveToNextUI(): state should not be in Done");
                break;
            default:
                console.error("palm moveToNextUI(): invalid state:", this.trainUIState);
                break;
        }

    }

    doneUI() { return this.trainUIState == TrainUIState.Done; }

    buttonsSelect(trainUIState) {
        switch (trainUIState) {
            case TrainUIState.Welcome:
                console.error("palm buttonsSelect(): trainUIState should not be Welcome");
                return null;
            // return this.parent.buttonsUIs.Welcome;
            case TrainUIState.Choice:
                return this.parent.buttonsUIs.Choice;
            case TrainUIState.Output:
                return this.parent.buttonsUIs.Output;
            case TrainUIState.Done:
                console.error("palm buttonsSelect(): trainUIState should not be Done");
                return null;
            default:
                console.error("palm buttonsSelect(): invalid state:", trainUIState);
                return null;
        }
    }

    buttons() {
        switch (this.trainUIState) {
            case TrainUIState.Welcome:
                console.error("palm buttons(): trainUIState should not be Welcome");
                return null;
            // return this.parent.buttonsUIs.Welcome;
            case TrainUIState.Choice:
                return this.parent.buttonsUIs.Choice;
            case TrainUIState.Output:
                return this.parent.buttonsUIs.Output;
            case TrainUIState.Done:
                console.error("palm buttons(): trainUIState should not be Done");
                return null;
            default:
                console.error("palm buttons(): invalid state:", trainUIState);
                return null;
        }

    }

    _align(state) {

        this.palm = state.palmRect();
        this.width = this.palm.width;
        this.height = this.palm.height;

        const btns = this.buttons();

        if (btns && btns.finger && btns.finger.input) {
            const n = btns.finger.input.length;
            this.dx_col = (this.width - 4 * this.gap) / 3;
            this.dy_row = (this.height - 4 * this.gap) / 3;

            for (let i = 0, j = 8; i < n; i++, j += 4) {
                btns.finger.input[i].x = state.initiator.left.landmarks[j].x;
                btns.finger.input[i].y = state.initiator.left.landmarks[j].y;
                btns.finger.input[i].width = this.dx_col;
                btns.finger.input[i].height = this.dy_row;
                btns.finger.input[i].topleft.x = btns.finger.input[i].x - this.dx_col / 2;
                btns.finger.input[i].topleft.y = btns.finger.input[i].y - this.dy_row / 2;

                btns.finger.output[i].x = state.initiator.left.landmarks[j].x;
                btns.finger.output[i].y = state.initiator.left.landmarks[j].y;
                btns.finger.output[i].width = this.dx_col;
                btns.finger.output[i].height = this.dy_row;
                btns.finger.output[i].topleft.x = btns.finger.output[i].x - this.dx_col / 2;
                btns.finger.output[i].topleft.y = btns.finger.output[i].y - this.dy_row / 2;
            }
        }

        if (btns && btns.palm && btns.palm.input) {
            const n = btns.palm.input.length;
            
            if (n > 3) {
                this.dx_col = (this.width - 4 * this.gap) / 3;
                // this.dy_row = (this.height - (1 + n - 3) * this.gap) / (n-2);
                this.dy_row = (this.height - 2 * this.gap);
            } else if (n == 3) {
                this.dx_col = this.width;
                this.dy_row = (this.height - this.gap*2) / 3;
            }else if (n == 2) {
                this.dx_col = (this.width - 3 * this.gap) / 2;
                // this.dy_row = (this.height - 2 * this.gap);
                this.dy_row = (this.height - 2 * this.gap);
            } else if (n == 1) {
                this.dx_col = (this.width - 2 * this.gap);
                this.dy_row = (this.height - 2 * this.gap);
            }

            if (n == 3) {
                for (let i = 0; i < n; i ++) {
                    btns.palm.input[i].x = this.palm.x;
                    btns.palm.input[i].y = this.palm.y + (i * this.dy_row) + (i * this.gap);
                    btns.palm.input[i].width = this.dx_col;
                    btns.palm.input[i].height = this.dy_row;
                    btns.palm.input[i].topleft.x = btns.palm.input[i].x;
                    btns.palm.input[i].topleft.y = btns.palm.input[i].y;
    
                    btns.palm.output[i].x = this.palm.x;
                    btns.palm.output[i].y = this.palm.y + (i * this.dy_row) + (i * this.gap);
                    btns.palm.output[i].width = this.dx_col;
                    btns.palm.output[i].height = this.dy_row;
                    btns.palm.output[i].topleft.x = btns.palm.output[i].x;
                    btns.palm.output[i].topleft.y = btns.palm.output[i].y;
    
                }
            } else {
                for (let i = 0, j = 0, k = 0; i < n; i++) {
                    const dy = this.dy_row / ((n > 3 && (j >= 2)) ? 3 : 1);
                    btns.palm.input[i].x = this.palm.x + (j * this.dx_col) + (j * this.gap);
                    btns.palm.input[i].y = this.palm.y + (k * dy) + (k * this.gap);
                    btns.palm.input[i].width = this.dx_col;
                    btns.palm.input[i].height = dy;
                    btns.palm.input[i].topleft.x = btns.palm.input[i].x;
                    btns.palm.input[i].topleft.y = btns.palm.input[i].y;
    
                    btns.palm.output[i].x = this.palm.x + (j * this.dx_col) + (j * this.gap);
                    btns.palm.output[i].y = this.palm.y + (k * dy) + (k * this.gap);
                    btns.palm.output[i].width = this.dx_col;
                    btns.palm.output[i].height = dy;
                    btns.palm.output[i].topleft.x = btns.palm.output[i].x;
                    btns.palm.output[i].topleft.y = btns.palm.output[i].y;
    
                    if (j < 2) {
                        j++;
                    } else {
                        k++;
                    }
                }
            }
        }
    }

    isCursorInside(state) {
        return this.isCursorInsideBtn;
    }

    draw(state) {
        if (!state.initiator.left.show) return;

        // this.parent._drawTextHighlightedBtnID(state);
        // this.parent._drawTextMarkedMarkedBtnID(state);
        this.parent._drawProgressBar(state);
    }

    adjustSelection(state) {
        state.selection.adjustSelectionBtnID();
    }

    markSelected(state) {
        this.parent._markSelectedBtnID(state);
    }

    lastTargetVisitTime(p) {
        return this.parent._lastTargetVisitTimeBtnID(p);
    }
}
