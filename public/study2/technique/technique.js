import { S2HRelative } from './s2h_rel.js';
import { S2HAbsolute } from './s2h_abs.js';
import { H2SRelative } from './h2s_rel.js';
import { MidAir } from './midair.js';
import { FishEye } from './fisheye.js';
import { Grid } from '../ds/grid.js';
import { PresentationType, TechniqueType } from './constant.js';
import { H2SAbsolute } from './h2s_abs.js';
import { GridFishEye } from '../ds/gridfisheye.js';
import { S2HRelativeFinger } from './s2h_rel_finger.js';
import { H2SRelativeFinger } from './h2s_rel_finger.js';
import { LandmarkBtn } from './landmark_btn.js';
import { LandmarkBtnFishEye } from './landmark_btn_fisheye.js';
import { LayoutGrid } from './layout_grid.js';
import { LayoutFlow } from './layout_flow.js';

import {drawFillCircle, drawFillRect, drawFillShape} from '../util/draw.js';


class Technique {
    constructor(state) {

        this.name = state.menu.technique;

        this.grid = {}

        if (this.name.toLowerCase().includes("fisheye")) {
            this.grid.input = new GridFishEye(state, "fisheye_input");
            this.grid.output = new GridFishEye(state, "fisheye_output");
        } else {
            this.grid.input = new Grid(state, "input");
            this.grid.output = new Grid(state, "output");
        }

        this.message = "";

        this.stats = {
            visitedCells: 0,
            lastVisitTime: [...Array(11)].map(e => Array(11)),
            lastVisitTimeByID: [...Array(11)].map(e => Array(11))
        };

        this.images = {
            palm: {
                image: null,
                mask: null,
                topleft: {
                    x: -1,
                    y: -1
                },
                width: -1,
                height: -1
            },
            background: {
                image: null
            }
        };

        this.isBtnSzDynamic = state.config.buttons.isDynamic;

        switch(state.menu.study2.presentation) {
            case PresentationType.Reordered:
                this.palmOutRect = this._palmOutRect;
                break;
            case PresentationType.Existing:
                this.palmOutRect = this._palmOutRectStatic;
                break;
            default:
                console.error("invalid presentation option");
                return;
        }

        switch (this.name) {
            case "S2H_Palm":
                this.anchor = new S2HRelative(this, state);
                break;
            case "S2H_Absolute":
                this.anchor = new S2HAbsolute(this, state);
                break;
            case "H2S_Palm":
                this.anchor = new H2SRelative(this, state);
                break;
            case "H2S_Absolute":
                this.anchor = new H2SAbsolute(this, state);
                break;
            case "MidAir":
                this.anchor = new MidAir(this, state);
                break;
            case "FishEye":
                this.anchor = new FishEye(this, state);
                break;
            case "S2H_Finger":
                this.anchor = new S2HRelativeFinger(this, state);
                break;
            case "H2S_Finger":
                this.anchor = new H2SRelativeFinger(this, state);
                break;
            case "Landmark_Btn":
                this.anchor = new LandmarkBtn(this, state);
                break;
            case "Landmark_Btn_FishEye":
                this.anchor = new LandmarkBtnFishEye(this, state);
                break;
            case "Grid":
                this.anchor = new LayoutGrid(this, state);
                break;
            case "Flow":
                this.anchor = new LayoutFlow(this, state);
                break;
            default:
                console.error("technique choice undefinend:", this.name);
                this.type = TechniqueType.Unassigned;
                break;
        }

        this.width = state.width;
        this.height = state.height;

        
    }

    _palmOutRect(state) {
        return state.palmRect();
    }

    _palmOutRectStatic(state) {
        return {
            x: state.width - 160,
            y: 125,
            width: 90,
            height: 90,
            topleft: {
                x: state.width - 300,
                y: 5,
            }
        };
    }

    btnIDPointedBy(state) {
        this.isCursorInsideBtn = false;

        for (let i = 0; i < this.buttons.input.length; i ++)
            if (this.buttons.input[i].isCursorInside(state)) {
                this.isCursorInsideBtn = true;
                return this.buttons.input[i].id;
            }

        return -1;
    }

    drawTargetsLegend(state, y = 70) {
        const width = 7*(state.technique.buttons.output.length - 1) + (state.technique.buttons.output.length * 100);
        let px = (state.width/2) - width/2;
        const py = y;


        for (let i = 0; i < state.technique.buttons.output.length; i ++) {
            state.canvasCVOutCtx.globalAlpha = 0.8;
            state.canvasCVOutCtx.drawImage(
                state.technique.buttons.output[i].icon.image,
                px+5,
                py+5,
                90,
                90
            );
            
            if (state.experiment.trial.currentTarget().btn_id == i) {
                if (state.experiment.trial.started()) {
                    state.canvasCVOutCtx.globalAlpha = 0.7;
                    state.canvasCVOutCtx.strokeStyle = "purple";
                    state.canvasCVOutCtx.lineWidth = 5;

                } else {
                    state.canvasCVOutCtx.globalAlpha = 0.4;
                    state.canvasCVOutCtx.strokeStyle = "grey";
                    state.canvasCVOutCtx.lineWidth = 3;
                }
                state.canvasCVOutCtx.strokeRect(
                    px-5,
                    py-5,
                    110,
                    110 
                );
                
                state.canvasCVOutCtx.globalAlpha = 0.8;
                state.canvasCVOutCtx.font = "28px Georgia";
                state.canvasCVOutCtx.fillStyle = "black";
                state.canvasCVOutCtx.fillText(`Please select ${state.technique.buttons.output[i].icon.name}`, (state.width/2) - 130, 50);
            }
                
            if (state.experiment.trial.started()) {
                if (state.selection.currentBtn.btn_id == i) {
                    state.canvasCVOutCtx.strokeStyle = "blue";
                    state.canvasCVOutCtx.lineWidth = 3;
                    state.canvasCVOutCtx.globalAlpha = 0.4;
                    state.canvasCVOutCtx.strokeRect(
                        px,
                        py,
                        100,
                        100 
                    );
                }
            }

            px += 107;
        }

    }

    _drawIconsOnCanvas(state, landmarkBtn) {    
        // this._drawShapes(state, landmarkBtn);
        const p = landmarkBtn.box();
        state.canvasCVOutCtx.drawImage(
            landmarkBtn.icon.image,
            p.x,
            p.y,
            Math.min(p.width, p.height),
            Math.min(p.width, p.height)
        );
    }

    _drawBtnsBoundary(state, btns) {
        // if (!state.initiator.left.show) return;
        if (!state.initiator.left.show)
            state.canvasCVOutCtx.strokeStyle = "red";
        else 
            state.canvasCVOutCtx.strokeStyle = "green";

        state.canvasCVOutCtx.lineWidth = 3;
        state.canvasCVOutCtx.globalAlpha = 0.7;
    
        for (let i = 0; i < btns.length; i ++) {
            const p = btns[i].box();
            state.canvasCVOutCtx.strokeRect(
                p.x,
                p.y,
                p.width,
                p.height
            );
        }
    }

    drawOutputBoundary(state) {
        this._drawBtnsBoundary(state, this.buttons.output);
    }

    drawInputBoundary(state) {
        this._drawBtnsBoundary(state, this.buttons.input);
    }

    _drawShapes(state, landmarkBtn) {
        const name = landmarkBtn.icon.name;
        
        const p = landmarkBtn.box();

        switch (name) {
            case "rect":
                drawFillRect(state.canvasCVOutCtx, p.x, p.y, p.width, p.height, 'blue', 0.4);
                break;
            case "circle":
                const r = Math.min(p.width, p.height)/2;
                drawFillCircle(state.canvasCVOutCtx, p.x + r, p.y + r, r, 'green', 0.4);
                break;
            case "triangle":
                const pointsT1 = [
                    {
                        x: p.x,
                        y: p.y + p.height
                    },{
                        x: p.x + p.width,
                        y: p.y + p.height
                    },
                    {
                        x: p.x + p.width/2,
                        y: p.y
                    }
                ];

                drawFillShape(state.canvasCVOutCtx, pointsT1, 'purple', 0.4);
                break;
            case "triangle_down":
                const pointsT2 = [
                    {
                        x: p.x,
                        y: p.y
                    },{
                        x: p.x + p.width,
                        y: p.y
                    },
                    {
                        x: p.x + p.width/2,
                        y: p.y + p.height
                    }
                ];

                drawFillShape(state.canvasCVOutCtx, pointsT2, 'orange', 0.4);
                break;
            case "pentagon":
                const pointsT5 = [
                    {
                        x: p.x + p.width/2,
                        y: p.y
                    },
                    {
                        x: p.x + p.width,
                        y: p.y + p.height/2
                    },
                    {
                        x: p.x + 3*p.width/4,
                        y: p.y + p.height
                    },
                    {
                        x: p.x + p.width/4,
                        y: p.y + p.height
                    },
                    {
                        x: p.x,
                        y: p.y + p.height/2
                    }
                ];

                drawFillShape(state.canvasCVOutCtx, pointsT5, 'cyan', 0.4);
                break;

            default:
                break;
        }
    }

    drawIconsOnGridCanvas(state) {

        for (let j = 1; j <= 3; j ++) {
            for (let i = 1; i <= 3; i ++) {
                const p = this.grid.output.getButton(i, j);
                // state.config.icons.all[(i-1)*3 + (j-1)].dim = {
                //     x: p.x,
                //     y: p.y,
                //     width: p.width,
                //     height: p.height
                // };

                const name = state.config.icons.all[(i-1)*3 + (j-1)].name;
                

                switch (name) {
                    case "rect":
                        drawFillRect(state.canvasCVOutCtx, p.x, p.y, p.width, p.height, 'blue', 0.4);
                        break;
                    case "circle":
                        const r = Math.min(p.width, p.height)/2;
                        drawFillCircle(state.canvasCVOutCtx, p.x + r, p.y + r, r, 'green', 0.4);
                        break;
                    case "triangle":
                        const pointsT1 = [
                            {
                                x: p.x,
                                y: p.y + p.height
                            },{
                                x: p.x + p.width,
                                y: p.y + p.height
                            },
                            {
                                x: p.x + p.width/2,
                                y: p.y
                            }
                        ];

                        drawFillShape(state.canvasCVOutCtx, pointsT1, 'purple', 0.4);
                        break;
                    case "triangle_down":
                        const pointsT2 = [
                            {
                                x: p.x,
                                y: p.y
                            },{
                                x: p.x + p.width,
                                y: p.y
                            },
                            {
                                x: p.x + p.width/2,
                                y: p.y + p.height
                            }
                        ];

                        drawFillShape(state.canvasCVOutCtx, pointsT2, 'orange', 0.4);
                        break;
                    case "pentagon":
                        const pointsT5 = [
                            {
                                x: p.x + p.width/2,
                                y: p.y
                            },
                            {
                                x: p.x + p.width,
                                y: p.y + p.height/2
                            },
                            {
                                x: p.x + 3*p.width/4,
                                y: p.y + p.height
                            },
                            {
                                x: p.x + p.width/4,
                                y: p.y + p.height
                            },
                            {
                                x: p.x,
                                y: p.y + p.height/2
                            }
                        ];

                        drawFillShape(state.canvasCVOutCtx, pointsT5, 'cyan', 0.4);
                        break;

                    default:
                        break;
                }

            }
        }
    }

    calculate(state) {
        this.anchor.calculate(state);
    }

    draw(state) {
        this.anchor.draw(state);
    }

    drawCustom(state) {
        // draw hand image at the top-right corner
        state.canvasCVOutCtx.globalAlpha = 0.8;
        if (state.menu.study2.presentation == PresentationType.Existing) {
            state.canvasCVOutCtx.drawImage(
                state.config.icons.hand.image,
                state.width-200,
                27,
                200,
                220
            );
        }

        if (!state.isExistingPresentation() && !state.initiator.left.show) return;

        // draw targets
        for (let i = 0; i < this.buttons.output.length; i ++) {
            // this.buttons.output[i].draw(state);
            this._drawIconsOnCanvas(
                state, 
                this.buttons.output[i]
            );
        }
    }

    reset() {
        if (this.type == TechniqueType.Landmark_Btn || this.type == TechniqueType.Landmark_Btn_FishEye) {
            console.log("landmark btn technique reset");
        } else {
            this.grid.input.reset();
            this.grid.output.reset();
        }
    }

    resetLastTimeVisited() {
        const t = performance.now();
        for (let i = 0; i < 11; i++) {
            for (let j = 0; j < 11; j++) {
                this.stats.lastVisitTime[i][j] = t;
            }
        }
    }

    isCursorInside(state) {
        if (this.type == TechniqueType.Landmark_Btn || this.type == TechniqueType.Landmark_Btn_FishEye ||
            this.type == TechniqueType.LayoutFlow || this.type == TechniqueType.LayoutGrid) {
            return this._isCursorInsideBtnID(state);
        }

        return this._isCursorInside(state);
    }

    _isCursorInside(state) {
        return this.grid.input.isCursorInside(state);
    }

    _isCursorInsideBtnID(state) {
        return this.anchor.isCursorInside(state);
    }

    _setupPalmActiveZone(state) {
        const g = state.palmbase();

        if (g) {
            this.images.palm.topleft.x = g.x - this.images.palm.image.cols / 2;
            this.images.palm.topleft.y = g.y - this.images.palm.image.rows;

            if (this.images.palm.topleft.x < 0) this.images.palm.topleft.x = 0;
            if (this.images.palm.topleft.y < 0) this.images.palm.topleft.y = 0;

            if (state.width < this.images.palm.topleft.x + this.images.palm.image.cols)
                this.images.palm.topleft.x = state.width - this.images.palm.image.cols;

            if (state.height < this.images.palm.topleft.y + this.images.palm.image.rows)
                this.images.palm.topleft.y = state.height - this.images.palm.image.rows;
        }
    }

    _setupPalmImageTopLeft(state) {
        const g = state.initiator.left.landmarks[0];

        if (g.x != -1 && g.y != -1) {
            this.images.palm.topleft.x = g.x - this.images.palm.image.cols / 2 + this.images.palm.image.cols / 5;
            this.images.palm.topleft.y = g.y - (7*this.images.palm.image.rows)/8;

            if (this.images.palm.topleft.x < 0) this.images.palm.topleft.x = 0;
            if (this.images.palm.topleft.y < 0) this.images.palm.topleft.y = 0;

            if (state.width < this.images.palm.topleft.x + this.images.palm.image.cols)
                this.images.palm.topleft.x = state.width - this.images.palm.image.cols;

            if (state.height < this.images.palm.topleft.y + this.images.palm.image.rows)
                this.images.palm.topleft.y = state.height - this.images.palm.image.rows;
        }
    }

    _setupPalmImage(width, height) {
        this.images.palm.width = width;
        this.images.palm.height = height;
        if (this.images.palm.image) {
            this.images.palm.image.delete();
        }
        this.images.palm.image = cv.imread('imgpalm', cv.CV_LOAD_UNCHANGED);
        cv.flip(this.images.palm.image, this.images.palm.image, 1);

        if (this.images.palm.image.channels() < 4) {
            console.error("less than 4 channels");
            return;
        }

        cv.resize(this.images.palm.image, this.images.palm.image, new cv.Size(width, height));

        let rgbaPlanes = new cv.MatVector();
        cv.split(this.images.palm.image, rgbaPlanes);
        this.images.palm.mask = rgbaPlanes.get(3);
        cv.merge(rgbaPlanes, this.images.palm.image);
        rgbaPlanes.delete();
    }

    _setupBackground(state) {
        // this.images.background.image = cv.imread('imgbackground', cv.CV_LOAD_UNCHANGED);
        // cv.resize(
        //     this.images.background.image,
        //     this.images.background.image,
        //     new cv.Size(state.width, state.height)
        // );
    }

    _setupSelectionLandmarks(state) {
        state.selection.previousBtn.btn_id = state.selection.currentBtn.btn_id;

        if (state.selection.locked) return;

        const btnID = this.btnIDPointedBy(state);

        if (btnID != -1) {
            if (btnID != state.selection.previousBtn.btn_id) {

                this.stats.lastVisitTimeByID[btnID] = performance.now();
                state.selection.messages.selected =
                    `Highlighted: ${btnID}`;
                this.stats.visitedCells++;
            }

            state.selection.currentBtn.btn_id = btnID;

            state.selection.addToPastSelectionsBtnID(btnID);
        }

    }

    _setupSelection(state) {

        state.selection.previousBtn.row_i =
            state.selection.currentBtn.row_i;
        state.selection.previousBtn.col_j =
            state.selection.currentBtn.col_j;

        if (state.selection.locked) return;

        const btn = this.grid.input.btnPointedBy(state.cursor);

        if (btn.row_i != -1 && btn.col_j != -1) {
            if (btn.row_i != state.selection.previousBtn.row_i ||
                btn.col_j != state.selection.previousBtn.col_j) {

                this.stats.lastVisitTime[btn.row_i][btn.col_j] = performance.now();
                state.selection.messages.selected =
                    `Highlighted: ${(btn.row_i - 1) * this.grid.input.divisions.col + btn.col_j}`;
                this.stats.visitedCells++;
            }

            state.selection.currentBtn.row_i = btn.row_i;
            state.selection.currentBtn.col_j = btn.col_j;

            state.selection.addToPastSelections(btn);
        }
    }

    _draw_main_grid_layout(state) {

        // cv.rectangle(state.overlay, new cv.Point(384,0),new cv.Point(510,128),new cv.Scalar(0,255,0),3);

        cv.rectangle(
            state.overlay,
            new cv.Point(this.grid.output.x, this.grid.output.y),
            new cv.Point(this.grid.output.x + this.grid.output.width, this.grid.output.y + this.grid.output.height),
            new cv.Scalar(240, 250, 255),
            -1
        );
    }

    _setGridAbsolute(state) {
        // const w = state.config.ABSOLUTEWIDTH;
        const w = state.config.grid.width;
        const h = state.config.grid.height;

        this.grid.input.width = w;
        this.grid.input.height = h;
        this.grid.output.width = w;
        this.grid.output.height = h;

        this.grid.input.x = (state.width / 2) -( w / 2);
        this.grid.input.y = (state.height / 2) - (h / 2);
        this.grid.output.x = (state.width / 2) - (w / 2);
        this.grid.output.y = (state.height / 2) - (h / 2);
    }

    _drawCells(state) {
        for (let i = 1; i <= this.grid.output.divisions.row; i++) {
            for (let j = 1; j <= this.grid.output.divisions.col; j++) {
                let c = new cv.Scalar(255, 25, 25);

                if (i == state.selection.markedBtn.row_i &&
                    j == state.selection.markedBtn.col_j) {

                    c = new cv.Scalar(0, 255, 0);
                }

                cv.rectangle(
                    state.overlay,
                    new cv.Point(this.grid.output.x_cols[j], this.grid.output.y_rows[i]),
                    new cv.Point(
                        this.grid.output.x_cols[j + 1] - this.grid.output.gap,
                        this.grid.output.y_rows[i + 1] - this.grid.output.gap),
                    c,
                    -1
                );
            }
        }
    }

    _markSelectedBtnID(state) {
        state.selection.markedBtn.btn_id = state.selection.currentBtn.btn_id;
        if (state.selection.markedBtn.btn_id == -1) return;
        state.selection.messages.marked = `Marked: ${state.selection.currentBtn.btn_id + 1}`;
    }

    _markSelected(state) {
        state.selection.markedBtn.row_i = state.selection.currentBtn.row_i;
        state.selection.markedBtn.col_j = state.selection.currentBtn.col_j;

        if (state.selection.markedBtn.row_i > 0 &&
            state.selection.markedBtn.col_j > 0) {
            state.selection.messages.marked = `Marked: ${(state.selection.currentBtn.row_i - 1) * this.grid.input.divisions.col + state.selection.currentBtn.col_j}`;
        }
    }

    _lastTargetVisitTimeBtnID(p) {
        return this.stats.lastVisitTimeByID[p.btn_id];
    }

    _lastTargetVisitTime(p) {
        return this.stats.lastVisitTime[p.row_i][p.col_j];
    }

    _drawTextHighlightedBtnID(state) {
        return; // added for video
        if (state.selection.currentBtn.btn_id != -1) {

            cv.putText(
                state.overlay,
                state.selection.messages.selected,
                new cv.Point(5, 40),
                cv.FONT_HERSHEY_DUPLEX,
                1.0,
                new cv.Scalar(240, 240, 240),
                2
            );
        }
    }

    _drawTextHighlighted(state) {
        return; // added for video
        if (state.selection.currentBtn.row_i != -1 &&
            state.selection.currentBtn.col_j != -1) {

            cv.putText(
                state.overlay,
                state.selection.messages.selected,
                new cv.Point(5, 40),
                cv.FONT_HERSHEY_DUPLEX,
                1.0,
                new cv.Scalar(240, 240, 240),
                2
            );
        }
    }

    _drawTextMarkedMarkedBtnID(state) {
        return; // added for video
        if (state.selection.markedBtn.btn_id != -1) {
            cv.putText(
                state.overlay,
                state.selection.messages.marked,
                new cv.Point(5, 80),
                cv.FONT_HERSHEY_DUPLEX,
                1.0,
                new cv.Scalar(0, 100, 0),
                2
            );
        }
    }

    _drawTextMarked(state) {
        return; // added for video
        if (state.selection.markedBtn.row_i != -1 &&
            state.selection.markedBtn.col_j != -1) {

            cv.putText(
                state.overlay,
                state.selection.messages.marked,
                new cv.Point(5, 80),
                cv.FONT_HERSHEY_DUPLEX,
                1.0,
                new cv.Scalar(0, 100, 0),
                2
            );
        }
    }

    _drawProgressBar(state) {
        if (state.progressBar.size >= 0) {
            const pwidth = state.progressBar.size * state.progressBar.maxWidth;

            cv.rectangle(
                state.overlay,
                new cv.Point(10, state.height - 10 - state.progressBar.maxHeight),
                new cv.Point(10 + pwidth, state.height - 10),
                new cv.Scalar(0, 100, 0),
                cv.FILLED,
                8,
                0
            );

            cv.rectangle(
                state.overlay,
                new cv.Point(10 + pwidth, state.height - 10 - state.progressBar.maxHeight),
                new cv.Point(10 + state.progressBar.maxWidth, state.height - 10),
                new cv.Scalar(128, 128, 128),
                cv.FILLED,
                8,
                0
            );

            cv.rectangle(
                state.overlay,
                new cv.Point(10, state.height - 10 - state.progressBar.maxHeight),
                new cv.Point(10 + state.progressBar.maxWidth, state.height - 10),
                new cv.Scalar(128, 128, 128),
                2,
                8,
                0
            );
        }
    }


}


export { Technique };