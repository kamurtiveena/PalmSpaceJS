


import { TechniqueType, ReadingDirectionType } from "./constant.js";

import { LandmarkButton } from "../ds/button.js";

import { TrainUIState } from "./constant.js";

export class MidAir {
    // todo implement delete attributes in class destructor
    constructor(parent, state) {
        this.parent = parent;
        this.parent.type = TechniqueType.MidAir;
        this.gap = 80;

        // this.trainUIState = TrainUIState.Welcome;
        this.trainUIState = TrainUIState.Choice;

        this.parent.alwaysShow = true;

        this.fixedDim = {
            button: {
                width: 160,
                height: 80
            }
        };

        this.offset = {
            y: -60,
            x_secondrow: 120
        };

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
            // Welcome: {
            //     finger: {
            //         input: [
            //         ],
            //         output: [

            //         ]
            //     },
            //     palm: {
            //         input: [
            //             new LandmarkButton(this, 0, state, null, ["Welcome"])
            //         ],
            //         output: [
            //             new LandmarkButton(this, 0, state, null, ["Welcome"])
            //         ]
            //     }
            // },
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
                        new LandmarkButton(this, 6, state, null, ["Previous"]),
                    ],
                    output: [
                        new LandmarkButton(this, 3, state, null, ["Help"]),
                        new LandmarkButton(this, 4, state, null, ["Exit"]),
                        new LandmarkButton(this, 5, state, null, ["Next"]),
                        new LandmarkButton(this, 6, state, null, ["Previous"]),
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
                        new LandmarkButton(this, 7, state, null, ["Next"]),
                        new LandmarkButton(this, 8, state, null, ["Previous"]),
                    ],
                    output: [
                        new LandmarkButton(this, 5, state, null, ["Help"]),
                        new LandmarkButton(this, 6, state, null, ["Exit"]),
                        new LandmarkButton(this, 7, state, null, ["Next"]),
                        new LandmarkButton(this, 8, state, null, ["Previous"]),
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
                        new LandmarkButton(this, 4, state, null, ["Next"]),
                        new LandmarkButton(this, 5, state, null, ["Go", "Back"]),
                    ],
                    output: [
                        new LandmarkButton(this, 2, state, null, ["Help"]),
                        new LandmarkButton(this, 3, state, null, ["Exit"]),
                        new LandmarkButton(this, 4, state, null, ["Next"]),
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

        this._align(state);


        this.isCursorInsideBtn = false; // todo what is it doing
    }

    calculate(state) {
        // if (!state.initiator.left.show) return;

        this._align(state);
        this.parent._setupSelectionTrain(state);

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
                console.error("midair moveToNextUI(): state should not be in Welcome");
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
            case TrainUIState.Done:
                console.error("midair moveToNextUI(): state should not be in Done");
                break;
            default:
                console.error("midair moveToNextUI(): invalid state:", this.trainUIState);
                break;
        }

        this._align(state);
    }

    doneUI() { return this.trainUIState == TrainUIState.Done; }

    buttonsSelect(trainUIState) {
        switch (trainUIState) {
            case TrainUIState.Welcome:
                console.error("midair buttonsSelect(): trainUIState should not be Welcome");
                return null;
            // return this.parent.buttonsUIs.Welcome;
            case TrainUIState.Choice:
                return this.parent.buttonsUIs.Choice;
            case TrainUIState.CardTypeQty:
                return this.parent.buttonsUIs.CardTypeQty;
            case TrainUIState.PayAmnt:
                return this.parent.buttonsUIs.PayAmnt;
            case TrainUIState.PaymentMethod:
                return this.parent.buttonsUIs.PaymentMethod;
            case TrainUIState.Done:
                console.error("midair buttonsSelect(): trainUIState should not be Done");
                return null;
            default:
                console.error("midair buttonsSelect(): invalid state:", trainUIState);
                return null;
        }
    }

    buttons() {
        switch (this.trainUIState) {
            case TrainUIState.Welcome:
                console.error("midair buttons(): trainUIState should not be Welcome");
                return null
            // return this.parent.buttonsUIs.Welcome;
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
            case TrainUIState.Done:
                console.error("midair buttons(): trainUIState should not be Done");
                return null;
            default:
                console.error("midair buttons(): invalid state:", trainUIState);
                return null;
        }

    }

    _fingerRect(state) {
        let n, w, h;
        switch (this.trainUIState) {
            case TrainUIState.Welcome:
                console.error("midair _fingerRect(): trainUIState should not be Welcome");
                return null;
            // return {
            //     x: state.width / 2 - this.midairWidth / 2,
            //     y: state.height / 2 - 1.5 * this.midairHeight + 50,
            //     width: this.midairWidth,
            //     height: this.midairHeight - 50
            // };
            case TrainUIState.Choice:
                n = this.parent.buttonsUIs.Choice.finger.input.length;
                w = n * this.fixedDim.button.width + (n - 1) * this.gap;
                h = this.fixedDim.button.height;
                return {
                    x: state.width / 2 - w / 2,
                    y: state.height / 2 - h + this.offset.y - this.gap/2,
                    width: w,
                    height: h
                };
            case TrainUIState.CardTypeQty:
                n = this.parent.buttonsUIs.CardTypeQty.finger.input.length;
                w = n * this.fixedDim.button.width + (n - 1) * this.gap;
                h = this.fixedDim.button.height;
                return {
                    x: state.width / 2 - w / 2,
                    y: state.height / 2 - h + this.offset.y - this.gap/2,
                    width: w,
                    height: h
                };
            case TrainUIState.PayAmnt:
                n = this.parent.buttonsUIs.PayAmnt.finger.input.length;
                w = n * this.fixedDim.button.width + (n - 1) * this.gap;
                h = this.fixedDim.button.height;
                return {
                    x: state.width / 2 - w / 2,
                    y: state.height / 2 - h + this.offset.y - this.gap/2,
                    width: w,
                    height: h
                };
            case TrainUIState.PaymentMethod:
                n = this.parent.buttonsUIs.PaymentMethod.finger.input.length;
                w = n * this.fixedDim.button.width + (n - 1) * this.gap;
                h = this.fixedDim.button.height;
                return {
                    x: state.width / 2 - w / 2,
                    y: state.height / 2 - h + this.offset.y - this.gap/2,
                    width: w,
                    height: h
                };
            case TrainUIState.Done:
                console.error("midair _fingerRect(): trainUIState should not be Done");
                return {
                    x: -1,
                    y: -1,
                    width: -1,
                    height: -1
                };
            default:
                console.error("midair _fingerRect(): invalid state:", trainUIState);
                return {
                    x: -1,
                    y: -1,
                    width: -1,
                    height: -1
                };
        }
    }

    _palmRect(state) {
        let w, h, n;
        switch (this.trainUIState) {
            case TrainUIState.Welcome:
                console.error("midair _palmRect(): trainUIState should not be Welcome");
                return null;
            // return {
            //     x: state.width / 2 - this.midairWidth / 2,
            //     y: state.height / 2 - this.midairHeight / 2,
            //     width: this.midairWidth,
            //     height: this.midairHeight
            // };
            case TrainUIState.Choice:
                n = this.parent.buttonsUIs.Choice.palm.input.length;
                w = n * this.fixedDim.button.width + (n - 1) * this.gap;
                h = this.fixedDim.button.height;
                if (n > 3) {
                    w = 3 * this.fixedDim.button.width + 2 * this.gap;
                    h = 2 * this.fixedDim.button.height + this.gap;
                }
                return {
                    x: state.width / 2 - w / 2,
                    y: state.height / 2 + this.offset.y + this.gap/2,
                    width: w,
                    height: h
                };
            case TrainUIState.CardTypeQty:
                n = this.parent.buttonsUIs.CardTypeQty.palm.input.length;
                w = n * this.fixedDim.button.width + (n - 1) * this.gap;
                h = this.fixedDim.button.height;
                if (n > 3) {
                    w = 3 * this.fixedDim.button.width + 2 * this.gap;
                    h = 2 * this.fixedDim.button.height + this.gap;
                }
                return {
                    x: state.width / 2 - w / 2,
                    y: state.height / 2 + this.offset.y + this.gap/2,
                    width: w,
                    height: h
                };
            case TrainUIState.PayAmnt:
                n = this.parent.buttonsUIs.PayAmnt.palm.input.length;
                w = n * this.fixedDim.button.width + (n - 1) * this.gap;
                h = this.fixedDim.button.height;
                if (n > 3) {
                    w = 3 * this.fixedDim.button.width + 2 * this.gap;
                    h = 2 * this.fixedDim.button.height + this.gap;
                }
                return {
                    x: state.width / 2 - w / 2,
                    y: state.height / 2 + this.offset.y + this.gap/2,
                    width: w,
                    height: h
                };
            case TrainUIState.PaymentMethod:
                n = this.parent.buttonsUIs.PaymentMethod.palm.input.length;
                w = n * this.fixedDim.button.width + (n - 1) * this.gap;
                h = this.fixedDim.button.height;
                if (n > 3) {
                    w = 3 * this.fixedDim.button.width + 2*this.gap;
                    h = 2 * this.fixedDim.button.height + this.gap;
                }
                return {
                    x: state.width / 2 - w / 2,
                    y: state.height / 2 + this.offset.y + this.gap/2,
                    width: w,
                    height: h
                };
            case TrainUIState.Done:
                console.error("midair _palmRect(): trainUIState should not be Done");
                return {
                    x: -1,
                    y: -1,
                    width: -1,
                    height: -1
                };
            default:
                console.error("midair _fingerRect(): invalid state:", trainUIState);
                return {
                    x: -1,
                    y: -1,
                    width: -1,
                    height: -1
                };
        }
    }

    _align(state) {

        const btns = this.buttons();
        // this.finger = state.fingerRect();
        this.finger = this._fingerRect(state);
        this.width = this.finger.width;
        this.height = this.finger.height;


        if (btns && btns.finger && btns.finger.input) {
            const n = btns.finger.input.length;
            this.dx_col = this.fixedDim.button.width;
            this.dy_row = this.fixedDim.button.height;

            for (let i = 0; i < n; i++) {
                btns.finger.input[i].x = this.finger.x + i * this.dx_col + i * this.gap;
                btns.finger.input[i].y = this.finger.y;
                btns.finger.input[i].width = this.dx_col;
                btns.finger.input[i].height = this.dy_row;
                btns.finger.input[i].topleft.x = btns.finger.input[i].x;
                btns.finger.input[i].topleft.y = btns.finger.input[i].y;

                btns.finger.output[i].x = this.finger.x + i * this.dx_col + i * this.gap;
                btns.finger.output[i].y = this.finger.y;
                btns.finger.output[i].width = this.dx_col;
                btns.finger.output[i].height = this.dy_row;
                btns.finger.output[i].topleft.x = btns.finger.output[i].x;
                btns.finger.output[i].topleft.y = btns.finger.output[i].y;
            }
        }

        this.palm = this._palmRect(state);
        this.width = this.palm.width;
        this.height = this.palm.height;


        if (btns && btns.palm && btns.palm.input) {
            const n = btns.palm.input.length;
            let dx = (this.width - (Math.min(2, n-1)*this.gap))/ Math.min(3, n);
            this.dy_row = this.fixedDim.button.height;

            for (let i = 0, j = 0, k = 0; i < n; i++) {
                btns.palm.input[i].x = this.palm.x + (j * dx) + (j * this.gap) + k * (this.offset.x_secondrow);
                btns.palm.input[i].y = this.palm.y + (k * this.dy_row) + (k * this.gap);
                btns.palm.input[i].width = dx;
                btns.palm.input[i].height = this.dy_row;
                btns.palm.input[i].topleft.x = btns.palm.input[i].x;
                btns.palm.input[i].topleft.y = btns.palm.input[i].y;

                btns.palm.output[i].x = btns.palm.input[i].x;
                btns.palm.output[i].y = btns.palm.input[i].y;
                btns.palm.output[i].width = dx;
                btns.palm.output[i].height = this.dy_row;
                btns.palm.output[i].topleft.x = btns.palm.output[i].x;
                btns.palm.output[i].topleft.y = btns.palm.output[i].y;

                if (j < 2) {
                    j++;
                } else {
                    // dx = (this.width - Math.min(n-4, 1)*this.gap)/ Math.min(n-3, 2);
                    j = 0;
                    k++;
                }
            }
        }
    }

    isCursorInside(state) {
        return this.isCursorInsideBtn;
    }

    draw(state) {
        // if (!state.initiator.left.show) return;

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





