import {S2HRelative} from './s2h_rel.js';
import {Grid} from './grid.js';


class Technique {
    constructor(state) {
        this.grid = {}
        this.grid.input = new Grid(state, "input");
        this.grid.output = new Grid(state, "output");
        
        this.selection = {
            currentBtn: {
                row_i: -1,
                col_j: -1
            },
            previousBtn: {
                row_i: -1,
                col_j: -1
            }, 
            locked: false
        }
        
        this.last_time_visited = [...Array(11)].map(e => Array(11));
        this.visited_cells = 0;
        this.message = "";

        this.name = state.menu.technique;
        if (this.name == "S2H_Relative") {
            this.anchor = new S2HRelative(this);
        }
        
    }

    calculate(state) {
        this.anchor.calculate(state);
    }



    _setupSelection(state) {
        this.selection.previousBtn = this.selection.currentBtn;
        if (this.selection.locked) {
            return;
        }
        
        const btn = this.grid.input.btnPointedBy(state.cursor);
        // console.log("_setupSelection() btn:", btn);

        if (btn.row_i != -1 && btn.col_j != -1) {
            if (btn.row_i != this.selection.previousBtn.row_i && 
                btn.col_j != this.selection.previousBtn.col_j) {
                
                this.last_time_visited[btn.row_i][btn.col_j] = Date.now();
                this.message = `Highlighted: ${(btn.row_i-1)*this.grid.input.divisions + btn.col_j}`;
                this.visited_cell += 1;
                this.selection.currentBtn.row_i = btn.row_i;
                this.selection.currentBtn.col_j = btn.col_j;
                
                // console.log("changing highlight, tech:", this);
            }
        }
    }

}


function getTechnique(state) {
    console.log("getTechnique state:", state);
    return new Technique(state);

}


export {getTechnique};