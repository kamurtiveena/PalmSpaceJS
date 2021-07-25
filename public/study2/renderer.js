"use strict";

import { checkRadio, checkSelectList, State } from './state.js';
import { Initiator } from './initiator.js';
import { Technique } from './technique/technique.js';
import { Trigger } from './trigger/trigger.js';
import { TRIGGER } from './trigger/triggerstate.js';
import { Trial } from './userstudies/trial.js';
import { TrialState } from './userstudies/constant.js';
import { TechniqueType } from "./technique/constant.js";
import { Study } from './userstudies/study.js';



window.onload = function () {

    const userIDElement = document.getElementById('selectUserID');

    for (let i = 1; i < 101; i++) {
        var opt = document.createElement('option');
        opt.appendChild(document.createTextNode(i));
        opt.value = i;
        userIDElement.appendChild(opt);
    }

    document.getElementById('size_input').style.display = 'none';

    document.getElementById('buttonSize_dynamic').onchange = function () {
        document.getElementById('size_input').style.display = 'none';
    }

    document.getElementById('buttonSize_custom').onchange = function () {
        document.getElementById('size_input').style.display = 'block';
    }

    {
        const techniqueList = document.getElementById('technique_list');

        for (let i = 0; i < techniqueList.children.length; i++) {
            const c = techniqueList.children[i];
            if (c.className.includes('form-check')) {
                const u = c.firstElementChild;
                if (u.value.includes('Landmark')) {
                    u.onclick = function () {
                        document.getElementById('no_of_cells_per_rowcol').style.display = 'none';
                    }
                } else {
                    u.onclick = function () {
                        document.getElementById('no_of_cells_per_rowcol').style.display = 'block';
                    }
                }
            }
        }
    }

    const cellsPerCol = document.getElementById('selectCellsCol');
    const cellsPerRow = document.getElementById('selectCellsRow');
    
    {
        document.getElementById('selectCellsRow').onchange = function () {
            if (document.getElementById('cellsPerRowColSameCheck').checked) {
                const v = document.getElementById('selectCellsRow').value;
                const opts = cellsPerCol.options;
                for (let opt, j = 0; opt = opts[j]; j++) {
                    if (opt.value == v) {
                        cellsPerCol.selectedIndex = j;
                        break;
                    }
                }
            }
        }

        document.getElementById('selectCellsCol').onchange = function () {
            if (document.getElementById('cellsPerRowColSameCheck').checked) {
                const v = document.getElementById('selectCellsCol').value;
                const opts = cellsPerRow.options;
                for (let opt, j = 0; opt = opts[j]; j++) {
                    if (opt.value == v) {
                        cellsPerRow.selectedIndex = j;
                        break;
                    }
                }
            }
        }
    }

    {
        const practiceElem = document.getElementById('practiceCheck');
        const repetitionsElem = document.getElementById('repetitions');
        
        practiceElem.onchange = function(ev) {
            if (practiceElem.checked) {
                const opts = repetitionsElem.options;
                for (let opt, j = 0; opt = opts[j]; j++) {
                    if (opt.value == '2') {
                        repetitionsElem.selectedIndex = j;
                        break;
                    }
                }

                const colopts = cellsPerCol.options;
                for (let opt, j = 0; opt = colopts[j]; j++) {
                    if (opt.value == '3') {
                        cellsPerCol.selectedIndex = j;
                        break;
                    }
                }

                const rowopts = cellsPerRow.options;
                for (let opt, j = 0; opt = rowopts[j]; j++) {
                    if (opt.value == '3') {
                        cellsPerRow.selectedIndex = j;
                        break;
                    }
                }
            }
        }
        
        practiceElem.onchange();
    }

    let state = new State();

    state.experiment = {
        study1: {},
        study2: {},
    };

    if (window.Worker) {
        state.myWorker = new Worker("worker.js");

        state.myWorker.postMessage(["test_worker", 4, 5]);

        state.myWorker.onmessage = function (e) {
            console.log("Message received from state.myWorker:", e.data);
        }

        state.myWorker.onerror = function (e) {
            console.error("Error from state.myWorker:", { "message": e.message, "filename": e.filename, "lineno": e.lineno });
        }
    } else {
        console.error('Your browser doesn\'t support web workers.');
        state.myWorker = null;
    }

    let menuElement = document.getElementById("menu");

    // Our input frames will come from here.

    const videoContainer = document.getElementById("video_container");
    // videoContainer.style.display = "none";

    const videoElement =
        document.getElementById('input_video');
    videoElement.style.display = "none";

    const canvasElement =
        document.getElementById('output_canvas');
    canvasElement.style.width = state.config.CAMWIDTH + "px";
    canvasElement.style.height = state.config.CAMHEIGHT + "px";
    canvasElement.style.display = "none";

    const canvasCtx = canvasElement.getContext('2d');


    const canvasCVOut =
        document.getElementById('cv_output_canvas');
    canvasCVOut.style.width = state.config.CAMWIDTH + "px";
    canvasCVOut.style.height = state.config.CAMHEIGHT + "px";

    const canvasCVOutCtx = canvasCVOut.getContext('2d');
    state.canvasCVOutCtx = canvasCVOutCtx;

    const startBtn = document.getElementById("start_btn");

    document.getElementById('download_study1_btn').onclick = async function () {
        const data = await fetch(`${state.config.host.url}/study1`)
            .then(response => {
                if (!response || !response.ok) throw new TypeError(`response not ok`);
                return response.json();
            })
            .catch(err => {
                console.error(err);
                postMessage("err");
            });

        console.log(data);

        let csv = 'id,user_id,technique,selection,cells_row,cells_col,button_sz,btn_width,btn_height,target_btn_id,target_rowcol,target_id,targets_visit_time_ms,elapsed_time_ms,cursor_dist_px,attempts,visited_cells\n';

        data.forEach(function (row) {
            console.log("row:", row);
            let r = "";
            r += row.id + ","
            r += row.user_id + ","
            r += row.technique + ","
            r += row.selection + ","
            r += row.cells_row + ","
            r += row.cells_col + ","
            r += row.button_sz + ","
            r += row.btn_width + ","
            r += row.btn_height + ","
            r += row.target_btn_id + ","
            r += row.target_rowcol + ","
            r += row.target_id + ","
            r += row.targets_visit_time_ms + ","
            r += row.elapsed_time_ms + ","
            r += row.cursor_dist_px + ","
            r += row.attempts + ","
            r += row.visited_cells;

            csv += r + '\n';
        });

        console.log(csv);

        var hiddenElement = document.createElement('a');
        hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
        hiddenElement.target = '_blank';
        hiddenElement.download = 'study1.csv';
        hiddenElement.click();
    };

    document.addEventListener("keypress", function (event) {
        console.group("document keypress event");
        console.table(event);
        console.groupEnd();
        if (event.key == "Enter") {
            event.preventDefault();
            startBtn.click();
        }
    });

    startBtn.onclick = function () {
        state.menu.showMenu = false;
        state.menu.technique = checkRadio("menutechnique");
        state.menu.trigger = checkRadio("menutrigger");
        state.menu.userID = parseInt(checkSelectList("selectUserID"));
        state.menu.practice = document.getElementById("practiceCheck").checked;
        state.menu.debug = document.getElementById("debugCheck").checked;

        state.menu.cellscnt = {
            row: parseInt(checkSelectList("selectCellsRow")),
            col: parseInt(checkSelectList("selectCellsCol"))
        };

        state.menu.buttonSize = checkRadio("buttonSize");
        state.height = state.config.CAMHEIGHT;
        state.width = state.config.CAMWIDTH;

        switch (state.menu.buttonSize) {
            case "Dynamic":
                state.config.landmarkButtons.width = 30;
                state.config.landmarkButtons.height = 30;
                state.config.buttons.width = 30;
                state.config.buttons.height = 30;
                state.config.buttons.isDynamic = true;
                break;
            case "Small":
                state.config.landmarkButtons.width = 30;
                state.config.landmarkButtons.height = 30;
                state.config.buttons.width = 30;
                state.config.buttons.height = 30;
                break;
            case "Large":
                state.config.landmarkButtons.width = 50;
                state.config.landmarkButtons.height = 50;
                state.config.buttons.width = 50;
                state.config.buttons.height = 50;

                break;
            case "Custom":
                state.config.landmarkButtons.width = parseInt(document.getElementById('cell_width').value, 10);
                state.config.landmarkButtons.height = parseInt(document.getElementById('cell_height').value, 10);
                state.config.buttons.width = parseInt(document.getElementById('cell_width').value, 10);
                state.config.buttons.height = parseInt(document.getElementById('cell_height').value, 10);
                console.table(state.config.buttons);
                console.table(state.config.landmarkButtons);
                break;
            default:
                state.config.landmarkButtons.width = 30;
                state.config.landmarkButtons.height = 30;
                state.config.buttons.width = 30;
                state.config.buttons.height = 30;
        }

        state.config.landmarkButtons.widthHalf = state.config.landmarkButtons.width / 2;
        state.config.landmarkButtons.heightHalf = state.config.landmarkButtons.height / 2;
        state.config.buttons.widthHalf = state.config.buttons.width / 2;
        state.config.buttons.heightHalf = state.config.buttons.height / 2;

        state.config.grid.width = state.config.grid.gap * (state.menu.cellscnt.col + 1) + state.config.buttons.width * (state.menu.cellscnt.col);
        state.config.grid.height = state.config.grid.gap * (state.menu.cellscnt.row + 1) + state.config.buttons.height * (state.menu.cellscnt.row);

        state.config.experiment.repetitions = parseInt(checkSelectList('repetitions'));

        console.group("state.config.grid");
        console.table(state.config.grid);
        console.table(state.width, state.height);
        console.groupEnd();

        menu.style.display = "none";
        videoContainer.style.display = "block";

        state.initiator = new Initiator(state);
        state.technique = new Technique(state);
        state.trigger = new Trigger(state);

        state.experiment = {
            trial: new Trial(state),
            study1: new Study(state),
            prev_marked_i: -1,
            prev_marked_j: -1
        };

        state.experiment.trial.generateTarget(state);

        const hands = new Hands({
            locateFile: (file) => {
                // return `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.1/${file}`;
                return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
            }
        });
        
        hands.setOptions({
            selfieMode: true,
            maxNumHands: 2,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5
        });
        
        hands.onResults(onResults);
        
        const camera = new Camera(videoElement, {
            onFrame: async () => {
                await hands.send({ image: videoElement });
            },
            width: state.config.CAMWIDTH,
            height: state.config.CAMHEIGHT
        });
        
        camera.start();
    }

    function goBackToMenu() {
        location.reload();
    }

    function onResults(results) {

        // Draw the overlays.

        canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
        
        if (state.technique.type == TechniqueType.H2S_Relative ||
            state.technique.type == TechniqueType.H2S_Absolute ||
            state.technique.type == TechniqueType.H2S_Relative_Finger
            ) {
                canvasCtx.fillStyle = "#fec";
                canvasCtx.fillRect(0, 0, canvasElement.width, canvasElement.height);
            } else {
                canvasCtx.drawImage(
                    results.image, 0, 0, canvasElement.width, canvasElement.height
                );
            }

        canvasCtx.save();
        
        state.imageCV = cv.imread('output_canvas');
        state.outputCV = state.imageCV.clone();

        state.initiator.initiate(state, results);

        state.cursor = (state.initiator.right.dataID != null) ? state.initiator.right.landmarks[8] : null;

        if (state.cursor == null) {
            state.trigger.reset(state);
        }

        // todo move to webworker
        if (state.experiment.trial.status == TrialState.STARTED) {
            state.experiment.trial.updateCursorDistTraveled(state);
            state.experiment.trial.updateLeftPalmDist(state);
            state.experiment.trial.updateRightPalmDist(state);
            state.experiment.trial.updateTargetTime();

            state.experiment.trial.updateVisitedCells(state);

            state.experiment.trial.updateTargetLastVisitTime(state);
        }

        if (state.experiment.trial.targetsDuration[state.experiment.trial.targetID] > state.config.experiment.trialMaxDurationMilliSec) {
            state.resetCursorPath();

            console.error("target taking long time", "elapsed time:", state.experiment.trial.elapsedTime());
            state.experiment.trial.stats.valid = false;
            state.experiment.trial.clickTarget(state);
            state.selection.resetMarkedButton();
            if (!state.menu.practice) {
                state.experiment.study1.save(state); // should use worker to send save request
            }

            state.experiment.trial.generateTarget(state);
            state.selection.reset();
            state.technique.resetLastTimeVisited();

            state.selection.resetSelectedButton();
            state.trigger.reset(state);
        }

        if (state.initiator.show || state.technique.alwaysShow) {

            state.technique.calculate(state);

            state.experiment.trial.updateStartBtnInputLoc(state);
            state.experiment.trial.updateBackBtnInputLoc(state);

            state.trigger.update(state);


            if (state.trigger.status != TRIGGER.PRESSED) {
                state.selection.locked = false;
                state.resetCursorPath();
            }

            let resetAnchor = false;

            switch (state.trigger.status) {
                case TRIGGER.ONHOLD:
                    break;
                case TRIGGER.OPEN:

                    break;
                case TRIGGER.PRESSED:

                    if (state.technique.isCursorInside(state)) {
                        state.technique.anchor.adjustSelection(state);
                        state.lockSelection();
                    }
                    state.updateCursorPath();
                    break;
                case TRIGGER.RELEASED:
                    state.resetCursorPath();

                    if (state.experiment.trial.isCursorOverStartBtn(state)) {
                        state.experiment.trial.clickStartBtn(state);
                        state.technique.stats.visitedCells = 0;
                        resetAnchor = true;
                        state.technique.reset();
                    } else if (state.experiment.trial.isCursorOverBackBtn(state)) {
                        goBackToMenu();
                    } else if (state.experiment.trial.status == TrialState.STARTED) {

                        state.technique.anchor.markSelected(state);
                        state.experiment.trial.incrementAttempts();

                        if (state.experiment.trial.matched(state)) {
                            state.experiment.trial.clickTarget(state);
                            state.selection.resetMarkedButton();
                            if (!state.menu.practice) {
                                state.experiment.study1.save(state); // should use worker to send save request
                            }

                            state.experiment.trial.generateTarget(state);
                            resetAnchor = true;
                        }
                    }

                    state.selection.resetSelectedButton();
                    state.trigger.reset(state);
                    break;
                default:
                    state.trigger.reset(state);
                    break;
            }

            if (resetAnchor) {
                state.selection.reset();
                state.technique.resetLastTimeVisited();
            }
            
            state.overlay = state.imageCV.clone();

            state.technique.draw(state);
            state.experiment.trial.drawStartBtn(state);
            state.experiment.trial.drawBackBtn(state);
            // state.experiment.trial.drawCompletedTargetsText(state);
            state.experiment.trial.drawTarget(state);


            cv.addWeighted(
                state.overlay,
                state.config.TRANSPARENCY_ALPHA,
                state.imageCV,
                1 - state.config.TRANSPARENCY_ALPHA,
                0.0,
                state.outputCV,
                -1);


            state.overlay.delete();

        }

        if (state.cursor) {

            const colsz = state.initiator.right.scale;
            cv.circle(
                state.outputCV,
                new cv.Point(state.cursor.x, state.cursor.y),
                colsz.thickness,
                new cv.Scalar(colsz.color, colsz.color, colsz.color),
                -1);
        }

        cv.imshow('cv_output_canvas', state.outputCV);

        {
            canvasCVOutCtx.font = "24px Georgia";
            canvasCVOutCtx.fillStyle = "fuchsia";

            canvasCVOutCtx.fillText(
                state.experiment.trial.completedTargetsStr(),
                state.width - 100, 
                state.height - 20
            );

            canvasCVOutCtx.fillText(
                state.technique.name + "_" + state.menu.cellscnt.row + "x" + state.menu.cellscnt.col,
                state.width - 220, 
                30
            );

            if (state.menu.practice) {
                canvasCVOutCtx.fillText(
                    "Practice Mode",
                    state.width - 220, 
                    60
                );  
            }
        }    

        if (state.initiator.left.show &&
            (
                (
                    state.selection.currentBtn.row_i != -1 &&
                    state.selection.currentBtn.col_j != -1
                )
                || state.selection.currentBtn.btn_id != -1
            )
        ) {

            canvasCVOutCtx.strokeStyle = "blue";
            canvasCVOutCtx.lineWidth = 3;
            canvasCVOutCtx.globalAlpha = 0.4;

            if (state.technique.type == TechniqueType.Landmark_Btn || state.technique.type == TechniqueType.Landmark_Btn_FishEye) {
                canvasCVOutCtx.strokeRect(
                    state.initiator.left.landmarks[state.selection.currentBtn.btn_id].x - state.technique.buttons.output[state.selection.currentBtn.btn_id].widthHalf,
                    state.initiator.left.landmarks[state.selection.currentBtn.btn_id].y - state.technique.buttons.output[state.selection.currentBtn.btn_id].heightHalf,
                    state.technique.buttons.output[state.selection.currentBtn.btn_id].width,
                    state.technique.buttons.output[state.selection.currentBtn.btn_id].height,
                );
            } else {
                canvasCVOutCtx.strokeRect(
                    state.technique.grid.output.x_cols[state.selection.currentBtn.col_j],
                    state.technique.grid.output.y_rows[state.selection.currentBtn.row_i],
                    state.technique.grid.output.x_cols[state.selection.currentBtn.col_j + 1] - state.technique.grid.output.x_cols[state.selection.currentBtn.col_j],
                    state.technique.grid.output.y_rows[state.selection.currentBtn.row_i + 1] - state.technique.grid.output.y_rows[state.selection.currentBtn.row_i]
                );
            }
        }

        if (state.cursorPath.head != null) {

            let p = state.cursorPath.head;
            let q = p.next;

            let r = p;

            canvasCVOutCtx.beginPath();
            canvasCVOutCtx.lineWidth = 3;
            canvasCVOutCtx.globalAlpha = 0.6;
            canvasCVOutCtx.strokeStyle = "purple";
            while (q != null) {
                canvasCVOutCtx.moveTo(r.x, r.y);
                // canvasCVOutCtx.lineTo(q.x, q.y);                
                canvasCVOutCtx.quadraticCurveTo(p.x, p.y, q.x, q.y);
                r = p;
                p = q;
                q = p.next;
            }

            canvasCVOutCtx.stroke();
        }

        if (state.technique.type == TechniqueType.H2S_Absolute && state.technique.inputBound && state.technique.inputBound) {
            canvasCVOutCtx.strokeStyle = "white";
            canvasCVOutCtx.lineWidth = 3;
            canvasCVOutCtx.globalAlpha = 0.4;
            canvasCVOutCtx.strokeRect(
                state.technique.inputBound.topleft.x,
                state.technique.inputBound.topleft.y,
                state.technique.inputBound.bottomright.x - state.technique.inputBound.topleft.x,
                state.technique.inputBound.bottomright.y - state.technique.inputBound.topleft.y
            );
        }

        if (state.menu.debug) {

            if (results.multiHandLandmarks) {
                for (let index = 0; index < results.multiHandLandmarks.length; index++) {
                    const classification = results.multiHandedness[index];
                    const isRightHand = classification.label === 'Right';
                    const landmarks = results.multiHandLandmarks[index];
                    drawConnectors(
                        canvasCVOutCtx, landmarks, HAND_CONNECTIONS,
                        { color: isRightHand ? '#00FF00' : '#FF0000' })
                    if (!isRightHand) {
                        drawLandmarks(canvasCVOutCtx, landmarks, {
                            color: isRightHand ? '#00FF00' : '#FF0000',
                            fillColor: isRightHand ? '#FF0000' : '#00FF00',
                            radius: (x) => {
                                return lerp(x.from.z, -0.15, .1, 10, 1);
                            }
                        });
                    }
                }
            }
            // draw trial stats
            canvasCVOutCtx.font = "24px Georgia";
            canvasCVOutCtx.fillStyle = "fuchsia";
            canvasCVOutCtx.fillText(
                `targets visit time: ${state.experiment.trial.lastVisitTime()} ms`,
                10, state.height - 130);
            canvasCVOutCtx.fillText(
                `elapsed time: ${state.experiment.trial.elapsedTime()} ms`,
                10, state.height - 110);
            canvasCVOutCtx.fillText(
                `cursor distance: ${state.experiment.trial.stats.distance.cursor[state.experiment.trial.targetID].toFixed(1)} pixels`,
                10, state.height - 90);
            canvasCVOutCtx.fillText(
                `attempts: ${state.experiment.trial.stats.attempts[state.experiment.trial.targetID]}`,
                10, state.height - 70);
            canvasCVOutCtx.fillText(
                `m visited cells: ${state.experiment.trial.stats.visitedCells[state.experiment.trial.targetID]}`,
                10, state.height - 50);
        }

        if (state.outputCV) {
            state.outputCV.delete();
        }

        if (state.imageCV) {
            state.imageCV.delete();
        }

        canvasCtx.restore();
    }

}