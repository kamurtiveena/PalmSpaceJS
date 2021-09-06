import {Config} from './config.js';
import {ButtonSelection} from './ds/btnselection.js';
import {Point} from './ds/point.js';
import {PresentationType, ReadingDirectionType, TechniqueType} from './technique/constant.js';


class State {
    constructor() {

        this.outputFrame = null;
        this.menu = {};
        this.menu.showMenu = true;
        this.menu.technique = null;
        this.menu.technique = null;
        this.menu.userID = null;
        this.menu.practice = false;
        this.menu.debug = false;
        this.menu.cellscnt = null;

        this.menu.study2 = {
            layout: null,
            readingDirection: null,
            numberOfButtonsPerRow: null,
            presentation: null
        };

        this.initiator = null;
        this.cursor = null;
        this.palmLandmarkIDs = [0, 1, 5, 9, 13, 17]; // TODO make it static
        this.fingersLandmarkIDs = [6, 8, 12, 16, 18, 20]; // TODO make it static
        
        this.progressBar = {
            size: -1,
            maxWidth: 100,
            maxHeight: 30
        };

        this.config = new Config();
        this.selection = new ButtonSelection();
  
        this.cursorPath = {
            show: false,
            head: null,
            tail: null,
            cnt: 0
        }

        this.experiment = {
            study1: {},
            study2: {},
        };

        this.imageCombinations = {}

        console.log(PresentationType, TechniqueType, ReadingDirectionType);

        let catID = 0;

        const layouts = [TechniqueType.LayoutFlow, TechniqueType.LayoutGrid];
        for (const [presentation, _] of Object.entries(PresentationType)) {
            if (presentation == "Unassigned") continue;
            this.imageCombinations[presentation] = {}
            for (const layout of layouts) {
                this.imageCombinations[presentation][layout] = {}
                
                for (const [readingDirection, _] of Object.entries(ReadingDirectionType)) {
                    if (readingDirection == "Unassigned") continue;
                    this.imageCombinations[presentation][layout][readingDirection] = this.config.icons.categories[catID];
                    catID ++;
                    console.log(layout, presentation, readingDirection);
                }
            }
        }

        console.log(this.imageCombinations);
    }

    moveOutputFrameFromView() {
        this.outputFrame.style.top = "-1000px";
        this.outputFrame.style.left = "-1000px";
    }

    alignOutputFrame() {
        const p = this.technique.buttonsUIs.Output.palm.output[0];
        const tx = -this.canvasCVOutCtx.canvas.width + p.x;
        const ty = -this.canvasCVOutCtx.canvas.height + parseInt(this.outputFrame.style.height) + p.y;

        this.outputFrame.style.top = `${ty}px`;
        this.outputFrame.style.left = `${tx}px`;
        this.outputFrame.style.width = `${p.width}px`;
        this.outputFrame.style.height = `${p.height}px`;
    }

    study2ImageIndices() {
        const ret = [];


        console.log("this.menu.study2.presentation", this.menu.study2.presentation, "this.menu.study2.layout", this.menu.study2.layout, "this.menu.study2.readingDirection", this.menu.study2.readingDirection)

        console.log(this.imageCombinations);
        console.log(`this.imageCombinations[${this.menu.study2.presentation}]`, this.imageCombinations[this.menu.study2.presentation]);
        const categoryName = this.imageCombinations[this.menu.study2.presentation]["Layout" + this.menu.study2.layout][this.menu.study2.readingDirection];

        for (let i = 0; i < this.config.icons.all.length; i ++) {
            if (this.config.icons.all[i].type == categoryName) ret.push(i);
        }

        return ret;
    }

    trialCombinationStr() {
        // return technique.name + "_" + menu.cellscnt.row + "x" + menu.cellscnt.col;
        return this.menu.study2.layout + "_" + this.menu.study2.readingDirection + "_" + this.menu.study2.presentation;                
    }

    isExistingPresentation() {
        return this.menu.study2.presentation == PresentationType.Existing;
    }

    updateCursorPath() {
        if (!this.cursor) return;

        if (this.cursorPath.tail == null) {
            this.cursorPath.tail = new Point(this.cursor.x, this.cursor.y);
            this.cursorPath.head = this.cursorPath.tail;
            this.cursorPath.cnt = 1;
        } else {
            
            this.cursorPath.tail.next = new Point(this.cursor.x, this.cursor.y);
            this.cursorPath.tail = this.cursorPath.tail.next;
            this.cursorPath.cnt ++;
            if (this.cursorPath > 50) {
                this.cursorPath.head = this.cursorPath.head.next;
                this.cursorPath = 50;
            }
        }
    }

    resetCursorPath() {
        this.cursorPath.head = null;
        this.cursorPath.tail = null;
        this.cursorPath.cnt = 0;
        this.cursorPath.show = false;
    }

    lockSelection() {
        if (!this.selection.locked) {
            this.selection.locked = true;
            this.selection.lastLockTime = performance.now();
        }
    }

    fingersRect() {
        let ret = {
            x: 0,
            y: 0,
            width: 0,
            height: 0,
            mxx: 0,
            mxy: 0,
            maxDim: 0
        }

        if (this.initiator && this.initiator.left.landmarks) {
            ret.x = this.initiator.left.landmarks[this.fingersLandmarkIDs[0]].x;
            ret.y = this.initiator.left.landmarks[this.fingersLandmarkIDs[0]].y;
            
            for (let i = 1, len = this.fingersLandmarkIDs.length; i < len; i ++) {
                
                const l = this.initiator.left.landmarks[this.fingersLandmarkIDs[i]];
                
                ret.x = Math.min(ret.x, l.x);
                ret.y = Math.min(ret.y, l.y);
                ret.mxx = Math.max(ret.mxx, l.x);
                ret.mxy = Math.max(ret.mxy, l.y);
            }

            ret.width = ret.mxx - ret.x;
            ret.height = ret.mxy - ret.y;
            ret.maxDim = Math.max(ret.width, ret.height);
        }

        return ret;
    }

    palmRect() {
        let ret = {
            x: 0,
            y: 0,
            width: 0,
            height: 0,
            mxx: 0,
            mxy: 0,
            maxDim: 0
        }

        if (this.initiator && this.initiator.left.landmarks) {
            ret.x = this.initiator.left.landmarks[this.palmLandmarkIDs[0]].x;
            ret.y = this.initiator.left.landmarks[this.palmLandmarkIDs[0]].y;
            
            for (let i = 1, len = this.palmLandmarkIDs.length; i < len; i ++) {
                
                const l = this.initiator.left.landmarks[this.palmLandmarkIDs[i]];
                
                ret.x = Math.min(ret.x, l.x);
                ret.y = Math.min(ret.y, l.y);
                ret.mxx = Math.max(ret.mxx, l.x);
                ret.mxy = Math.max(ret.mxy, l.y);
            }


            ret.x -= 25;
            ret.y -= 5;
            ret.mxx += 25;
            ret.mxy += 5;

            ret.width = ret.mxx - ret.x;
            ret.height = ret.mxy - ret.y;
            ret.maxDim = Math.max(ret.width, ret.height);
        }

        return ret;
    }

    palmbase() {
        if (this.initiator == null ||
            this.initiator.left == null)
                return null;
        return this.initiator.left.landmarks[0];
    }
}


function checkRadio(tag) {
    const radios = document.getElementsByName(tag);
    for (let i = 0, length = radios.length; i < length; i++) {
        if (radios[i].checked) return radios[i].value;
    }

    return "N/A";
}


function checkSelectList(tag) {
    var e = document.getElementById(tag);
    return e.options[e.selectedIndex].text;
}


export { State, checkRadio, checkSelectList };