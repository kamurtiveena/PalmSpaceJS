import { TechniqueType, ReadingDirectionType } from "./constant.js";

import {LandmarkButton} from "../ds/button.js";

export class LayoutGrid {
    constructor(parent, state) {
        this.parent = parent;
        this.parent.type = TechniqueType.LayoutGrid;

        switch (state.menu.study2.readingDirection) {
            case ReadingDirectionType.LtoR:
                switch(state.menu.study2.numberOfButtonsPerRow) {
                    case 4:
                        this._align = this._alignLtoR4;
                        break;
                    case 5:
                        this._align = this._alignLtoR5;
                        break;
                    default:
                        console.error("number of buttons invalid: ", state.menu.study2.readingDirection);
                        return;
                }   
                break;

            case ReadingDirectionType.RtoL:
                switch(state.menu.study2.numberOfButtonsPerRow) {
                    case 4:
                        this._align = this._alignRtoL4;
                        break;
                    case 5:
                        this._align = this._alignRtoL5;
                        break;
                    default:
                        console.error("number of buttons invalid: ", state.menu.study2.readingDirection);
                        return;
                }
                break;

            default:
                console.error("reading direction invalid: ", state.menu.study2.readingDirection);
                this._align = null;
                return;
        }

        this.parent.buttons = {
            input: [],
            output: []
        };

        for (let i = 0; i < state.config.landmarkButtons.total; i ++) {
            this.parent.buttons.input.push(
                new LandmarkButton(this, i, state)
            );

            this.parent.buttons.output.push(
                new LandmarkButton(this, i, state, state.config.icons.all[i])
            );
        }

        this.isCursorInsideBtn = false; // todo what is it doing
    }

    calculate(state) {

        if (!state.initiator.left.show) return;
        
        if (state.initiator.left.landmarks) {
            this._align(state);
            this.parent._setupSelectionLandmarks(state);
        }
    }

    _alignLtoR4(state) {

        let palm = state.palmRect();

        const w = Math.max(64, Math.min(400, palm.maxDim));
        
        this.width = palm.width;
        this.height = palm.height;

        this.dx_col = (this.width - 3*7) / 2;
        this.dy_row = (this.height -3*7) / 2;
        
        for (let i = 0; i < 2; i ++) {
            for (let j = 0; j < 2; j ++) {
                this.parent.buttons.input[i*2 + j].x = palm.x  + (7*(j+1)) + (this.dx_col*j) + (this.dx_col/2); 
                this.parent.buttons.input[i*2 + j].y = palm.y  + (7*(i+1)) + (this.dy_row*i) + (this.dy_row/2);
                this.parent.buttons.input[i*2 + j].width = this.dx_col;
                this.parent.buttons.input[i*2 + j].height = this.dy_row;

                this.parent.buttons.output[i*2 + j].x = palm.x  + (7*(j+1)) + (this.dx_col*j) + (this.dx_col/2); 
                this.parent.buttons.output[i*2 + j].y = palm.y  + (7*(i+1)) + (this.dy_row*i) + (this.dy_row/2);
                this.parent.buttons.output[i*2 + j].width = this.dx_col;
                this.parent.buttons.output[i*2 + j].height = this.dy_row;
            }
        }
    }

    isCursorInside(state) {
        return this.isCursorInsideBtn;
    }

    btnIDPointedBy(state) {
        this.isCursorInsideBtn = false;

        for (let i = 0; i < this.parent.buttons.input.length; i ++)
            if (this.parent.buttons.input[i].isCursorInside(state)) {
                this.isCursorInsideBtn = true;
                return i;
            }

        return -1;
    }

    drawCustom(state) {
        if (!state.initiator.left.show) return;

        for (let i = 0; i < this.parent.buttons.output.length; i ++) {
            // this.parent.buttons.output[i].draw(state);
            this.parent._drawIconsOnCanvas(
                state, 
                this.parent.buttons.output[i]
            );
        }
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
