import { DemoSelection, TechniqueType } from "./constant.js";

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
        // this.trainUIState = TrainUIState.Output;

        this.demoSelection = DemoSelection.Unassigned;

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
                        new LandmarkButton(
                            this,
                            0,
                            state,
                            null,
                            ["View", "Map"],
                            {
                                outputFrame: {
                                    src: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2896.726385428737!2d-1.5554569845089736!3d43.445430179128934!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd51151c6db98a55%3A0xa0f1a4641e85a2c9!2sExakis%20Nelite%20Biarritz!5e0!3m2!1sen!2sca!4v1630874121900!5m2!1sen!2sca"
                                }
                            },
                            function () {
                                console.log("view map clicked, this:", this);
                                this.parent.demoSelection = DemoSelection.Map;

                            }
                        ),
                        new LandmarkButton(
                            this,
                            1,
                            state,
                            null,
                            ["Food", "Menu"],
                            { outputFrame: { src: "" } },
                            function () {
                                console.log("food menu clicked, this:", this);
                                this.parent.demoSelection = DemoSelection.FoodMenu;
                            }
                        ),
                        new LandmarkButton(
                            this,
                            2,
                            state,
                            null,
                            ["Bus", "Routes"],
                            { 
                                outputFrame: { 
                                    src: "",
                                    img: [
                                        {
                                            src: "res/busroutes/1.png"
                                        }
                                    ] 
                                } 
                            },
                            function () {
                                console.log("bus route clicked, this:", this);
                                this.parent.demoSelection = DemoSelection.BusRoute;
                            }
                        ),
                    ],
                    output: [
                        new LandmarkButton(
                            this,
                            0,
                            state,
                            null,
                            ["View", "Map"],
                            {
                                outputFrame: {
                                    src: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2896.726385428737!2d-1.5554569845089736!3d43.445430179128934!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd51151c6db98a55%3A0xa0f1a4641e85a2c9!2sExakis%20Nelite%20Biarritz!5e0!3m2!1sen!2sca!4v1630874121900!5m2!1sen!2sca"
                                }
                            },
                            function () {
                                console.log("view map clicked, this:", this);
                                this.parent.demoSelection = DemoSelection.Map;
                            }
                        ),
                        new LandmarkButton(
                            this,
                            1,
                            state,
                            null,
                            ["Food", "Menu"],
                            { outputFrame: { src: "" } },
                            function () {
                                console.log("food menu clicked, this:", this);
                                this.parent.demoSelection = DemoSelection.FoodMenu;
                            }
                        ),
                        new LandmarkButton(
                            this,
                            2,
                            state,
                            null,
                            ["Bus", "Routes"],
                            { 
                                outputFrame: { 
                                    src: "",
                                    img: [
                                        {
                                            src: "res/busroutes/1.png"
                                        }
                                    ] 
                                } 
                            },
                            function () {
                                console.log("bus route clicked, this:", this);
                                this.parent.demoSelection = DemoSelection.BusRoute;
                            }
                        ),
                    ]
                }
            },
            Output: {
                finger: {
                    input: [
                        new LandmarkButton(this, 6, state, null, ["Go", "Back"], {}, null),
                    ],
                    output: [
                        new LandmarkButton(this, 6, state, null, ["Go", "Back"], {}, null),
                    ]
                },
                palm: {
                    input: [
                        new LandmarkButton(this, 0, state, null, ["Output"], { dead: true, offset: { x: -400, y: -400 } }, null)
                    ],
                    output: [
                        new LandmarkButton(this, 0, state, null, ["Output"], { dead: true, offset: { x: -400, y: -400 } }, null)
                    ]
                }
            },
        };


        this.isCursorInsideBtn = false; // todo what is it doing
    }

    createOutputFrame(state) {

        const f = document.createElement('iframe');
        f.id = "output_frame";
        f.style.width = state.outputFrame.style.width;
        f.style.height = state.outputFrame.style.height;
        f.style.zIndex = 1;
        f.style.position = "relative";
        f.style.top = state.outputFrame.style.top;
        f.style.left = state.outputFrame.style.left;

        if (this.demoSelection == DemoSelection.BusRoute) {
            f.srcdoc = `<!html doctype><style>*{padding:0;margin:0}</style><img src="${state.selection.currentBtn.ref.opts.outputFrame.img[0].src}">`
        } else {
            f.setAttribute("src", state.selection.currentBtn.ref.opts.outputFrame.src);
        }

        return f;
    }

    isOutput() {
        return this.trainUIState == TrainUIState.Output;
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
            this.dx_col = 80;
            this.dy_row = 60;

            for (let i = 0, j = 4; i < n; i++, j += 4) {
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
                this.dy_row = (this.height - this.gap * 2) / 3;
            } else if (n == 2) {
                this.dx_col = (this.width - 3 * this.gap) / 2;
                // this.dy_row = (this.height - 2 * this.gap);
                this.dy_row = (this.height - 2 * this.gap);
            } else if (n == 1) {
                this.dx_col = (this.width - 2 * this.gap);
                this.dy_row = (this.height - 2 * this.gap);
            }

            if (n == 3) {
                for (let i = 0; i < n; i++) {
                    btns.palm.input[i].x = this.palm.x;
                    btns.palm.input[i].y = this.palm.y + (i * this.dy_row) + (i * this.gap);


                    btns.palm.input[i].width = this.dx_col;
                    btns.palm.input[i].height = this.dy_row;
                    btns.palm.input[i].topleft.x = btns.palm.input[i].x;
                    btns.palm.input[i].topleft.y = btns.palm.input[i].y;

                    btns.palm.output[i].x = btns.palm.input[i].x;
                    btns.palm.output[i].y = btns.palm.input[i].y;
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

                    if (btns.palm.input[i].opts.offset) {

                        const xx = btns.palm.input[i].x + btns.palm.input[i].width;
                        const yy = btns.palm.input[i].y + btns.palm.input[i].height;

                        btns.palm.input[i].x += btns.palm.input[i].opts.offset.x;
                        btns.palm.input[i].y += btns.palm.input[i].opts.offset.y;
                        btns.palm.input[i].width = xx - btns.palm.input[i].x;
                        btns.palm.input[i].height = yy - btns.palm.input[i].y;
                        if (btns.palm.input[i].x < 0) btns.palm.input[i].x = 0;
                        if (btns.palm.input[i].y < 0) btns.palm.input[i].y = 0;
                    }

                    btns.palm.input[i].topleft.x = btns.palm.input[i].x;
                    btns.palm.input[i].topleft.y = btns.palm.input[i].y;

                    btns.palm.output[i].x = btns.palm.input[i].x;
                    btns.palm.output[i].y = btns.palm.input[i].y;
                    btns.palm.output[i].width = btns.palm.input[i].width;
                    btns.palm.output[i].height = btns.palm.input[i].height;
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
