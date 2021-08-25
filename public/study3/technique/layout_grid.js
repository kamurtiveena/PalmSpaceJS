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

        this.trainUIState = TrainUIState.Welcome;

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
            Welcome: {
                finger: {
                    input: [
                    ],
                    output: [
                        
                    ]
                },
                palm: {
                    input: [
                        new LandmarkButton(this, 0, state, null, ["Welcome"])
                    ],
                    output: [
                        new LandmarkButton(this, 0, state, null, ["Welcome"])
                    ]
                }
            },
            Choice: {
                finger: {
                    input: [
                        new LandmarkButton(this, 3, state, null, ["Help"]),
                        new LandmarkButton(this, 4, state, null, ["Exit"]),
                        new LandmarkButton(this, 5, state, null, ["Next"]),
                    ],
                    output: [
                        new LandmarkButton(this, 3, state, null, ["Help"]),
                        new LandmarkButton(this, 4, state, null, ["Exit"]),
                        new LandmarkButton(this, 5, state, null, ["Next"]),
                    ]
                },
                palm: {
                    input: [
                        new LandmarkButton(this, 0, state, null, ["Load", "to", "Card"]),
                        new LandmarkButton(this, 1, state, null, ["Buy", "Card"]),
                        new LandmarkButton(this, 2, state, null, ["Buy", "Ticket"]),
                    ],
                    output: [
                        new LandmarkButton(this, 0, state, null, ["Load", "to", "Card"]),
                        new LandmarkButton(this, 1, state, null, ["Buy", "Card"]),
                        new LandmarkButton(this, 2, state, null, ["Buy", "Ticket"]),
                    ]
                }

            },
            CardTypeQty: {
                finger: {
                    input: [
                        new LandmarkButton(this, 3, state, null, ["Help"]),
                        new LandmarkButton(this, 4, state, null, ["Exit"]),
                        new LandmarkButton(this, 5, state, null, ["Next"]),
                        new LandmarkButton(this, 6, state, null, ["Erase", "Mode"]),
                    ],
                    output: [
                        new LandmarkButton(this, 3, state, null, ["Help"]),
                        new LandmarkButton(this, 4, state, null, ["Exit"]),
                        new LandmarkButton(this, 5, state, null, ["Next"]),
                        new LandmarkButton(this, 6, state, null, ["Erase", "Mode"]),
                    ]
                },
                palm: {
                    input: [
                        new LandmarkButton(this, 0, state, null, ["Day", "Pass"]),
                        new LandmarkButton(this, 1, state, null, ["One", "Way"]),
                        new LandmarkButton(this, 2, state, null, ["Two", "Way"]),
                    ],
                    output: [
                        new LandmarkButton(this, 0, state, null, ["Day", "Pass"]),
                        new LandmarkButton(this, 1, state, null, ["One", "Way"]),
                        new LandmarkButton(this, 2, state, null, ["Two", "Way"]),
                    ]
                }
            },
            PayAmnt: {
                finger: {
                    input: [
                        new LandmarkButton(this, 5, state, null, ["Help"]),
                        new LandmarkButton(this, 6, state, null, ["Exit"]),
                        new LandmarkButton(this, 7, state, null, ["Confirm"]),
                        new LandmarkButton(this, 8, state, null, ["Erase", "Mode"]),
                    ],
                    output: [
                        new LandmarkButton(this, 5, state, null, ["Help"]),
                        new LandmarkButton(this, 6, state, null, ["Exit"]),
                        new LandmarkButton(this, 7, state, null, ["Confirm"]),
                        new LandmarkButton(this, 8, state, null, ["Erase", "Mode"]),
                    ]
                },
                palm: {
                    input: [
                        new LandmarkButton(this, 0, state, null, ["10"]),
                        new LandmarkButton(this, 1, state, null, ["20"]),
                        new LandmarkButton(this, 2, state, null, ["50"]),
                        new LandmarkButton(this, 3, state, null, ["100"]),
                        new LandmarkButton(this, 4, state, null, ["200"]),
                    ],
                    output: [
                        new LandmarkButton(this, 0, state, null, ["10"]),
                        new LandmarkButton(this, 1, state, null, ["20"]),
                        new LandmarkButton(this, 2, state, null, ["50"]),
                        new LandmarkButton(this, 3, state, null, ["100"]),
                        new LandmarkButton(this, 4, state, null, ["200"]),
                    ]
                }
            },
            PaymentMethod: {
                finger: {
                    input: [
                        new LandmarkButton(this, 2, state, null, ["Help"]),
                        new LandmarkButton(this, 3, state, null, ["Exit"]),
                        new LandmarkButton(this, 4, state, null, ["Confirm"]),
                        new LandmarkButton(this, 5, state, null, ["Go", "Back"]),
                    ],
                    output: [
                        new LandmarkButton(this, 2, state, null, ["Help"]),
                        new LandmarkButton(this, 3, state, null, ["Exit"]),
                        new LandmarkButton(this, 4, state, null, ["Confirm"]),
                        new LandmarkButton(this, 5, state, null, ["Go", "Back"]),
                    ]
                },
                palm: {
                    input: [
                        new LandmarkButton(this, 0, state, null, ["Debit", "Card"]),
                        new LandmarkButton(this, 1, state, null, ["Credit", "Card"]),
                    ],
                    output: [
                        new LandmarkButton(this, 0, state, null, ["Debit", "Card"]),
                        new LandmarkButton(this, 1, state, null, ["Credit", "Card"]),
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
        this.trainUIState = TrainUIState.Welcome;
    }

    transitionUI() {
        switch(this.trainUIState) {
            case TrainUIState.Welcome:
                this.trainUIState = TrainUIState.Choice;
                break;
            case TrainUIState.Choice:
                this.trainUIState = TrainUIState.CardTypeQty;
                break;
            case TrainUIState.CardTypeQty:
                this.trainUIState = TrainUIState.PayAmnt;
                break;
            case TrainUIState.PayAmnt:
                this.trainUIState = TrainUIState.PaymentMethod;
                break;
            case TrainUIState.PaymentMethod:
                this.trainUIState = TrainUIState.Done;
                break;
        }
        
    }

    doneUI() { return this.trainUIState == TrainUIState.Done; }

    buttonsSelect(trainUIState) {
        switch (trainUIState) {
            case TrainUIState.Welcome:
                return this.parent.buttonsUIs.Welcome;
            case TrainUIState.Choice:
                return this.parent.buttonsUIs.Choice;
            case TrainUIState.CardTypeQty:
                return this.parent.buttonsUIs.CardTypeQty;
            case TrainUIState.PayAmnt:
                return this.parent.buttonsUIs.PayAmnt;
            case TrainUIState.PaymentMethod:
                return this.parent.buttonsUIs.PaymentMethod;
            default:
                console.error("invalid train ui state");
                return null;
        }
    }

    buttons() {
        switch (this.trainUIState) {
            case TrainUIState.Welcome:
                return this.parent.buttonsUIs.Welcome;
            case TrainUIState.Choice:
                return this.parent.buttonsUIs.Choice;
            case TrainUIState.CardTypeQty:
                return this.parent.buttonsUIs.CardTypeQty;
            case TrainUIState.PayAmnt:
                return this.parent.buttonsUIs.PayAmnt;
            case TrainUIState.PaymentMethod:
                return this.parent.buttonsUIs.PaymentMethod;
            case TrainUIState.Done:
                console.error("Done ui should not render buttons");
                return null;
            default:
                console.error("invalid train ui state");
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
            this.dx_col = (this.width  - 4 * this.gap) / 3; 
            this.dy_row = (this.height - 4 * this.gap) / 3;
            
            for (let i = 0, j = 8; i < n; i++, j += 4) {
                btns.finger.input[i].x = state.initiator.left.landmarks[j].x;
                btns.finger.input[i].y = state.initiator.left.landmarks[j].y;
                btns.finger.input[i].width  = this.dx_col;
                btns.finger.input[i].height = this.dy_row;
                btns.finger.input[i].topleft.x = btns.finger.input[i].x - this.dx_col/2; 
                btns.finger.input[i].topleft.y = btns.finger.input[i].y - this.dy_row/2; 
    
                btns.finger.output[i].x = state.initiator.left.landmarks[j].x;
                btns.finger.output[i].y = state.initiator.left.landmarks[j].y;
                btns.finger.output[i].width = this.dx_col;
                btns.finger.output[i].height = this.dy_row;
                btns.finger.output[i].topleft.x = btns.finger.output[i].x - this.dx_col/2; 
                btns.finger.output[i].topleft.y = btns.finger.output[i].y - this.dy_row/2; 
            }
        }

        if (btns && btns.palm && btns.palm.input) {
            const n = btns.palm.input.length;
            if(n >= 3) {
                this.dx_col = (this.width - 4 * this.gap) / 3;
                this.dy_row = (this.height - (1 + n - 3) * this.gap) / (n-2);
            } else if (n == 2) {
                this.dx_col = (this.width - 3 * this.gap) / 2;
                this.dy_row = (this.height - 2 * this.gap);
            } else if (n == 1) {
                this.dx_col = (this.width - 2 * this.gap);
                this.dy_row = (this.height - 2 * this.gap);
            }
        
            for (let i = 0, j = 0, k = 0; i < n; i++) {
                btns.palm.input[i].x = this.palm.x + (j * this.dx_col) + (this.dx_col / 2) + (j*this.gap);
                btns.palm.input[i].y = this.palm.y + (k * this.dy_row) + (this.dy_row / 2) + (k*this.gap);
                btns.palm.input[i].width = this.dx_col;
                btns.palm.input[i].height = this.dy_row / ((j == 3) ? 3: 1);
                btns.palm.input[i].topleft.x = btns.palm.input[i].x; 
                btns.palm.input[i].topleft.y = btns.palm.input[i].y; 
    
                btns.palm.output[i].x = this.palm.x + (j * this.dx_col) + (j*this.gap);
                btns.palm.output[i].y = this.palm.y + (k * this.dy_row) + (k*this.gap);
                btns.palm.output[i].width = this.dx_col;
                btns.palm.output[i].height = this.dy_row / ((j == 3) ? 3: 1);
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

    isCursorInside(state) {
        return this.isCursorInsideBtn;
    }

    draw(state) {
        if (!state.initiator.left.show) return;

        this.parent._drawTextHighlightedBtnID(state);
        this.parent._drawTextMarkedMarkedBtnID(state);
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
