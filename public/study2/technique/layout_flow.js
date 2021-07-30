import { TechniqueType, ReadingDirectionType } from "./constant.js";
import {LandmarkButton} from "../ds/button.js";

export class LayoutFlow {
    constructor(parent, state) {
        this.parent = parent;
        this.parent.type = TechniqueType.LayoutFlow;
        this.gap = 3;

        console.log("state.menu.study2:", state.menu.study2);

        switch (state.menu.study2.readingDirection) {
            case ReadingDirectionType.LtoR:
                switch(state.menu.study2.numberOfButtonsPerRow) {
                    case 4:
                        this.iconsSeq = [0, 1, 2, 3];
                        this._align = this._alignLtoR4;
                        break;
                    case 5:
                        this.iconsSeq = [0, 1, 2, 3, 4];
                        this._align = this._align5;
                        break;
                    default:
                        console.error("number of buttons invalid: ", state.menu.study2.readingDirection);
                        return;
                }   
                break;

            case ReadingDirectionType.RtoL:
                switch(state.menu.study2.numberOfButtonsPerRow) {
                    case 4:
                        this.iconsSeq = [2, 3, 1, 0];
                        this._align = this._alignRtoL4;
                        break;
                    case 5:
                        this.iconsSeq = [2, 3, 4, 0, 1];
                        this._align = this._align5;
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

    _alignRtoL4(state) {
        let palm = state.palmRect();

        this.width = palm.width;
        this.height = palm.height;
        this.dx_col = (this.width - 4*this.gap) / 2;
        this.dy_row = (this.height -3*this.gap) / 3;

        // 0
        {       
            this.parent.buttons.input[this.iconsSeq[0]].x = palm.x - this.gap + (this.dx_col/2); 
            this.parent.buttons.input[this.iconsSeq[0]].y = palm.y - this.gap + (this.dy_row/2);
            this.parent.buttons.input[this.iconsSeq[0]].width = this.dx_col + 2*this.gap;
            this.parent.buttons.input[this.iconsSeq[0]].height = this.dy_row + 2*this.gap;
            this.parent.buttons.input[this.iconsSeq[0]].topleft.x = this.parent.buttons.input[this.iconsSeq[0]].x - this.dx_col/2; 
            this.parent.buttons.input[this.iconsSeq[0]].topleft.y = this.parent.buttons.input[this.iconsSeq[0]].y - this.dy_row/2; 

            this.parent.buttons.output[this.iconsSeq[0]].x = palm.x + this.gap + (this.dx_col/2); 
            this.parent.buttons.output[this.iconsSeq[0]].y = palm.y + this.gap + (this.dy_row/2);
            this.parent.buttons.output[this.iconsSeq[0]].width = this.dx_col;
            this.parent.buttons.output[this.iconsSeq[0]].height = this.dy_row;
            this.parent.buttons.output[this.iconsSeq[0]].topleft.x = this.parent.buttons.output[this.iconsSeq[0]].x - this.dx_col/2; 
            this.parent.buttons.output[this.iconsSeq[0]].topleft.y = this.parent.buttons.output[this.iconsSeq[0]].y - this.dy_row/2; 
        } 

        // 1
        {
            this.parent.buttons.input[this.iconsSeq[1]].x = palm.x + 2*this.gap + this.dx_col + (this.dx_col/2); 
            this.parent.buttons.input[this.iconsSeq[1]].y = palm.y + this.gap + (this.dy_row/2);
            this.parent.buttons.input[this.iconsSeq[1]].width = this.dx_col;
            this.parent.buttons.input[this.iconsSeq[1]].height = this.dy_row;
            this.parent.buttons.input[this.iconsSeq[1]].topleft.x = this.parent.buttons.input[this.iconsSeq[1]].x - this.dx_col/2; 
            this.parent.buttons.input[this.iconsSeq[1]].topleft.y = this.parent.buttons.input[this.iconsSeq[1]].y - this.dy_row/2; 


            this.parent.buttons.output[this.iconsSeq[1]].x = palm.x + 2*this.gap + this.dx_col + (this.dx_col/2); 
            this.parent.buttons.output[this.iconsSeq[1]].y = palm.y + this.gap + (this.dy_row/2);
            this.parent.buttons.output[this.iconsSeq[1]].width = this.dx_col;
            this.parent.buttons.output[this.iconsSeq[1]].height = this.dy_row;
            this.parent.buttons.output[this.iconsSeq[1]].topleft.x = this.parent.buttons.output[this.iconsSeq[1]].x - this.dx_col/2; 
            this.parent.buttons.output[this.iconsSeq[1]].topleft.y = this.parent.buttons.output[this.iconsSeq[1]].y - this.dy_row/2; 
        }

        // 2
        {
            this.parent.buttons.input[this.iconsSeq[2]].x = palm.x + this.gap + (this.dx_col/2); 
            this.parent.buttons.input[this.iconsSeq[2]].y = palm.y + 2*this.gap + this.dy_row + (this.dy_row/2);
            this.parent.buttons.input[this.iconsSeq[2]].width = this.gap + 2*this.dx_col;
            this.parent.buttons.input[this.iconsSeq[2]].height = this.dy_row;
            this.parent.buttons.input[this.iconsSeq[2]].topleft.x = this.parent.buttons.input[this.iconsSeq[2]].x - this.dx_col/2; 
            this.parent.buttons.input[this.iconsSeq[2]].topleft.y = this.parent.buttons.input[this.iconsSeq[2]].y - this.dy_row/2; 


            this.parent.buttons.output[this.iconsSeq[2]].x = palm.x + this.width/2;
            this.parent.buttons.output[this.iconsSeq[2]].y = palm.y + 2*this.gap + this.dy_row + (this.dy_row/2); 
            this.parent.buttons.output[this.iconsSeq[2]].width = this.dx_col;
            this.parent.buttons.output[this.iconsSeq[2]].height = this.dy_row;
            this.parent.buttons.output[this.iconsSeq[2]].topleft.x = this.parent.buttons.output[this.iconsSeq[2]].x - this.dx_col/2; 
            this.parent.buttons.output[this.iconsSeq[2]].topleft.y = this.parent.buttons.output[this.iconsSeq[2]].y - this.dy_row/2; 
        }

        // 3
        {
            this.parent.buttons.input[this.iconsSeq[3]].x = palm.x + this.gap + (this.dx_col/2); 
            this.parent.buttons.input[this.iconsSeq[3]].y = palm.y + 3*this.gap + 2*this.dy_row + (this.dy_row/2);
            this.parent.buttons.input[this.iconsSeq[3]].width = this.gap + 2*this.dx_col;
            this.parent.buttons.input[this.iconsSeq[3]].height = this.dy_row;
            this.parent.buttons.input[this.iconsSeq[3]].topleft.x = this.parent.buttons.input[this.iconsSeq[3]].x - this.dx_col/2; 
            this.parent.buttons.input[this.iconsSeq[3]].topleft.y = this.parent.buttons.input[this.iconsSeq[3]].y - this.dy_row/2; 


            this.parent.buttons.output[this.iconsSeq[3]].x = palm.x + this.width/2;
            this.parent.buttons.output[this.iconsSeq[3]].y = palm.y + 3*this.gap + 2*this.dy_row + (this.dy_row/2); 
            this.parent.buttons.output[this.iconsSeq[3]].width = this.dx_col;
            this.parent.buttons.output[this.iconsSeq[3]].height = this.dy_row;
            this.parent.buttons.output[this.iconsSeq[3]].topleft.x = this.parent.buttons.output[this.iconsSeq[3]].x - this.dx_col/2; 
            this.parent.buttons.output[this.iconsSeq[3]].topleft.y = this.parent.buttons.output[this.iconsSeq[3]].y - this.dy_row/2; 
        }

    }

    _alignLtoR4(state) {
        let palm = state.palmRect();
        
        this.width = palm.width;
        this.height = palm.height;
        this.dx_col = (this.width - 4*this.gap) / 2;
        this.dy_row = (this.height -3*this.gap) / 3;

        // 0
        {       
            this.parent.buttons.input[this.iconsSeq[0]].x = palm.x + this.gap + (this.dx_col/2); 
            this.parent.buttons.input[this.iconsSeq[0]].y = palm.y + this.gap + (this.dy_row/2);
            this.parent.buttons.input[this.iconsSeq[0]].width = this.dx_col;
            this.parent.buttons.input[this.iconsSeq[0]].height = 3*this.dy_row;
            this.parent.buttons.input[this.iconsSeq[0]].topleft.x = this.parent.buttons.input[this.iconsSeq[0]].x - this.dx_col/2; 
            this.parent.buttons.input[this.iconsSeq[0]].topleft.y = this.parent.buttons.input[this.iconsSeq[0]].y - this.dy_row/2; 

            this.parent.buttons.output[this.iconsSeq[0]].x = palm.x + this.gap + (this.dx_col/2); 
            this.parent.buttons.output[this.iconsSeq[0]].y = palm.y + this.gap + (this.dy_row/2);
            this.parent.buttons.output[this.iconsSeq[0]].width = this.dx_col;
            this.parent.buttons.output[this.iconsSeq[0]].height = this.dy_row;
            this.parent.buttons.output[this.iconsSeq[0]].topleft.x = this.parent.buttons.output[this.iconsSeq[0]].x - this.dx_col/2; 
            this.parent.buttons.output[this.iconsSeq[0]].topleft.y = this.parent.buttons.output[this.iconsSeq[0]].y - this.dy_row/2; 
        } 

        // 1
        {
            this.parent.buttons.input[this.iconsSeq[1]].x = palm.x + 2*this.gap + this.dx_col + (this.dx_col/2); 
            this.parent.buttons.input[this.iconsSeq[1]].y = palm.y + this.gap + (this.dy_row/2);
            this.parent.buttons.input[this.iconsSeq[1]].width = this.dx_col;
            this.parent.buttons.input[this.iconsSeq[1]].height = this.dy_row;
            this.parent.buttons.input[this.iconsSeq[1]].topleft.x = this.parent.buttons.input[this.iconsSeq[1]].x - this.dx_col/2; 
            this.parent.buttons.input[this.iconsSeq[1]].topleft.y = this.parent.buttons.input[this.iconsSeq[1]].y - this.dy_row/2; 


            this.parent.buttons.output[this.iconsSeq[1]].x = palm.x + 2*this.gap + this.dx_col + (this.dx_col/2); 
            this.parent.buttons.output[this.iconsSeq[1]].y = palm.y + this.gap + (this.dy_row/2);
            this.parent.buttons.output[this.iconsSeq[1]].width = this.dx_col;
            this.parent.buttons.output[this.iconsSeq[1]].height = this.dy_row;
            this.parent.buttons.output[this.iconsSeq[1]].topleft.x = this.parent.buttons.output[this.iconsSeq[1]].x - this.dx_col/2; 
            this.parent.buttons.output[this.iconsSeq[1]].topleft.y = this.parent.buttons.output[this.iconsSeq[1]].y - this.dy_row/2; 
        }

        // 2
        {
            this.parent.buttons.input[this.iconsSeq[2]].x = palm.x + 2*this.gap + this.dx_col + (this.dx_col/2); 
            this.parent.buttons.input[this.iconsSeq[2]].y = palm.y + 2*this.gap + this.dy_row + (this.dy_row/2);
            this.parent.buttons.input[this.iconsSeq[2]].width = this.dx_col;
            this.parent.buttons.input[this.iconsSeq[2]].height = this.dy_row;
            this.parent.buttons.input[this.iconsSeq[2]].topleft.x = this.parent.buttons.input[this.iconsSeq[2]].x - this.dx_col/2; 
            this.parent.buttons.input[this.iconsSeq[2]].topleft.y = this.parent.buttons.input[this.iconsSeq[2]].y - this.dy_row/2; 


            this.parent.buttons.output[this.iconsSeq[2]].x = palm.x + 2*this.gap + this.dx_col + (this.dx_col/2);
            this.parent.buttons.output[this.iconsSeq[2]].y = palm.y + 2*this.gap + this.dy_row + (this.dy_row/2); 
            this.parent.buttons.output[this.iconsSeq[2]].width = this.dx_col;
            this.parent.buttons.output[this.iconsSeq[2]].height = this.dy_row;
            this.parent.buttons.output[this.iconsSeq[2]].topleft.x = this.parent.buttons.output[this.iconsSeq[2]].x - this.dx_col/2; 
            this.parent.buttons.output[this.iconsSeq[2]].topleft.y = this.parent.buttons.output[this.iconsSeq[2]].y - this.dy_row/2; 
        }

        // 3
        {
            this.parent.buttons.input[this.iconsSeq[3]].x = palm.x + 2*this.gap + this.dx_col + (this.dx_col/2); 
            this.parent.buttons.input[this.iconsSeq[3]].y = palm.y + 3*this.gap + 2*this.dy_row + (this.dy_row/2);
            this.parent.buttons.input[this.iconsSeq[3]].width = this.dx_col;
            this.parent.buttons.input[this.iconsSeq[3]].height = this.dy_row;
            this.parent.buttons.input[this.iconsSeq[3]].topleft.x = this.parent.buttons.input[this.iconsSeq[3]].x - this.dx_col/2; 
            this.parent.buttons.input[this.iconsSeq[3]].topleft.y = this.parent.buttons.input[this.iconsSeq[3]].y - this.dy_row/2; 

            this.parent.buttons.output[this.iconsSeq[3]].x = palm.x + 2*this.gap + this.dx_col + (this.dx_col/2); 
            this.parent.buttons.output[this.iconsSeq[3]].y = palm.y + 3*this.gap + 2*this.dy_row + (this.dy_row/2);
            this.parent.buttons.output[this.iconsSeq[3]].width = this.dx_col;
            this.parent.buttons.output[this.iconsSeq[3]].height = this.dy_row;
            this.parent.buttons.output[this.iconsSeq[3]].topleft.x = this.parent.buttons.output[this.iconsSeq[3]].x - this.dx_col/2; 
            this.parent.buttons.output[this.iconsSeq[3]].topleft.y = this.parent.buttons.output[this.iconsSeq[3]].y - this.dy_row/2; 
        }
    }

    calculate(state) {
        if (!state.initiator.left.show) return;
        
        if (state.initiator.left.landmarks) {
            this._align(state);
            this.parent._setupSelectionLandmarks(state);
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
