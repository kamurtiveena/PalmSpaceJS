
class Study {
    constructor(state) {

    }

    save(state) {

        const t = state.experiment.trial.currentTarget();


        let body = {
            user_id: state.menu.userID,
            technique: state.technique.name,
            trigger: state.trigger.name,
            cells_row: state.menu.cellscnt.row, 
            cells_col: state.menu.cellscnt.col,
            button_sz: state.menu.buttonSize,
            btn_width: state.config.buttons.width, 
            btn_height: state.config.buttons.height,
            target_btn_id: t.btn_id | "",
            target_rowcol: `${t.row_i | ""},${t.col_j | "" }`,
            target_id: state.experiment.trial.targetID,
            targets_visit_time_ms: state.experiment.trial.lastVisitTime(),
            elapsed_time_ms: state.experiment.trial.elapsedTime(),
            cursor_dist_px: state.experiment.trial.stats.distance.cursor[state.experiment.trial.targetID].toFixed(1),
            attempts: state.experiment.trial.stats.attempts[state.experiment.trial.targetID],
            visited_cells: state.experiment.trial.stats.visitedCells[state.experiment.trial.targetID] 
        }

        state.myWorker.postMessage([`post_record`, `http://localhost:3000/save/record`, body]);

        console.log("study1.save() body:", JSON.stringify(body));
    }
}

export {Study};