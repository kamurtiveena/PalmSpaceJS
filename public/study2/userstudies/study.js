
class Study {
    constructor(state) {

    }

    save(state) {

        const t = state.experiment.trial.currentTarget();


        let body = {
            user_id: state.menu.userID,
            technique: "",
            trigger: "",
            cells_row: "",
            cells_col: "",
            button_sz: "",
            btn_width: "",
            btn_height: "",
            target_btn_id: t.btn_id | "",
            target_rowcol: "",
            target_id: state.experiment.trial.targetID,
            targets_visit_time_ms: state.experiment.trial.lastVisitTime(),
            elapsed_time_ms: state.experiment.trial.elapsedTime(),
            cursor_dist_px: state.experiment.trial.stats.distance.cursor[state.experiment.trial.targetID].toFixed(1),
            attempts: state.experiment.trial.stats.attempts[state.experiment.trial.targetID],
            visited_cells: state.experiment.trial.stats.visitedCells[state.experiment.trial.targetID],
            valid: state.experiment.trial.stats.valid,
            layout: state.menu.study2.layout,
            readingDirection: state.menu.study2.readingDirection,
            numberOfButtonsPerRow: state.menu.study2.numberOfButtonsPerRow,
            presentation: state.menu.study2.presentation
        }

        state.myWorker.postMessage([`post_record`, `${state.config.host.url}/save/study2`, body]);

        console.log("study2.save() body:", JSON.stringify(body));
    }
}

export { Study };