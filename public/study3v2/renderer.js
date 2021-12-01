"use strict";

import { checkRadio, checkSelectList, State } from './state.js';
import { Initiator } from './initiator.js';
import { Technique } from './technique/technique.js';
import { Trigger } from './trigger/trigger.js';
import { TRIGGER } from './trigger/triggerstate.js';
import { Trial } from './userstudies/trial.js';
import { TrialState } from './userstudies/constant.js';
import { PresentationType, TechniqueType, TrainUIState } from "./technique/constant.js";
import { Study } from './userstudies/study.js';

window.onload = function () {

    const userIDElement = document.getElementById('selectUserID');

    for (let i = 1; i < 101; i++) {
        let opt = document.createElement('option');
        opt.appendChild(document.createTextNode(i));
        opt.value = i;
        userIDElement.appendChild(opt);
    }

    const repetitionsElem = document.getElementById('repetitions');
    for (let i = 1; i <= 40; i++) {
        let opt = document.createElement('option');
        opt.appendChild(document.createTextNode(i));
        opt.value = i;
        if (i == 30) opt.selected = true;
        repetitionsElem.appendChild(opt);
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
        document.getElementById("menutechnique_grid").onchange = function(ev) {
            document.getElementById("cameraCheck").checked = true;
        }

        document.getElementById("menutechnique_midair").onchange = function(ev) {
            document.getElementById("cameraCheck").checked = false;
        }

        if (document.getElementById("menutechnique_grid").checked) {
            document.getElementById("cameraCheck").checked = true;
        } else {
            document.getElementById("cameraCheck").checked = false;
        }
    }

    {
        const practiceElem = document.getElementById('practiceCheck');

        practiceElem.onchange = function (ev) {

            let v = '30';
            if (ev && ev.target.checked) v = '10';
            const opts = repetitionsElem.options;
            for (let opt, j = 0; opt = opts[j]; j++) {
                if (opt.value == v) {
                    repetitionsElem.selectedIndex = j;
                    break;
                }
            }

            if (practiceElem.checked) {
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

    const state = new State();

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
        state.menu.camera = document.getElementById("cameraCheck").checked;

        // study2 choices
        state.menu.study2 = {
            layout: state.menu.technique,
            readingDirection: checkRadio("menuReadingDirection"),
            numberOfButtonsPerRow: parseInt(checkRadio("menuNumberOfButtonsPerRow")),
            presentation: checkRadio("menupresentation"),
            startButtonPauseTime: parseInt(document.getElementById("startbtn_pausetime_sec").value),
            uiPauseTime: parseInt(document.getElementById("ui_pausetime_sec").value)
        };

        state.config.landmarkButtons.total = state.menu.study2.numberOfButtonsPerRow;

        console.table(state.menu.study2);

        state.menu.cellscnt = {
            row: 3, // parseInt(checkSelectList("selectCellsRow")),
            col: 3 // parseInt(checkSelectList("selectCellsCol"))
        };

        state.menu.buttonSize = checkRadio("buttonSize");
        state.height = state.config.CAMHEIGHT;
        state.width = state.config.CAMWIDTH;

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
                return `third_party/mediapipe/hands/${file}`;
                // return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
            }
        });

        hands.setOptions({
            selfieMode: true,
            maxNumHands: 2,
            minDetectionConfidence: 0.7,
            minTrackingConfidence: 0.7
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

        if (!state.menu.camera ||
            state.menu.study2.presentation == PresentationType.Existing ||
            state.technique.type == TechniqueType.H2S_Relative ||
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

        const remainingStartButtonPauseTime = state.experiment.trial.remainingStartButtonPauseTime(state);
        const remainingUIPauseTime = state.experiment.trial.remainingUIPauseTime(state);

        if (remainingUIPauseTime > 0 || remainingStartButtonPauseTime > 0) {
            // console.log("remainingUIPauseTime:", remainingUIPauseTime, "remainingStartButtonPauseTime:", remainingStartButtonPauseTime);
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
            let resetSelection = false;

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
                        state.experiment.trial.setCurrentUIStartTime();
                        state.technique.stats.visitedCells = 0;
                        resetAnchor = true;
                        resetSelection = true;
                        state.technique.reset();
                    } else if (state.experiment.trial.isCursorOverBackBtn(state)) {
                        goBackToMenu();
                    } else if (state.experiment.trial.started()) {

                        if (state.experiment.trial.matchedUI(state)) {
                            state.technique.anchor.markSelected(state);
                            state.experiment.trial.incrementAttempts(state);
                            if (state.experiment.trial.matched(state)) {

                                state.selection.resetMarkedButton();
                                state.technique.anchor.moveToNextUI(state);
                                
                                state.experiment.trial.setCurrentUIEndTime();
                                state.experiment.trial.moveToNextUI();
                                state.experiment.trial.setCurrentUIStartTime();

                                if (state.experiment.trial.currentTarget().currentUI == TrainUIState.Done) {
                                    state.experiment.trial.clickTarget(state);
                                    if (!state.menu.practice) {
                                        state.experiment.study1.save(state); // should use worker to send save request
                                    }

                                    state.experiment.trial.generateTarget(state);
                                    resetAnchor = true;
                                }
                            } else {
                                state.experiment.trial.resetCurrentTarget(state);
                                resetAnchor = true;
                            }
                            
                            resetSelection = true;                                
                        } else {
                            console.error("current UI is in invalid state:", state);
                        }
                    }

                    state.selection.resetSelectedButton();
                    state.trigger.reset(state);
                    break;
                default:
                    state.trigger.reset(state);
                    break;
            }

            if (resetSelection || 
                (state.experiment.trial.started() && remainingUIPauseTime > 0) ||
                (!state.experiment.trial.started() && remainingStartButtonPauseTime > 0)) {
                console.log("reseting selection");
                state.selection.reset();
            }


            if (resetAnchor) {
                state.technique.reset();
                state.technique.resetLastTimeVisited();
            }

            state.overlay = state.imageCV.clone();

            state.technique.draw(state);

            state.experiment.trial.drawBackBtn(state);
            // state.experiment.trial.drawCompletedTargetsText(state);
            // state.experiment.trial.drawCurrentUITarget();
            // state.experiment.trial.drawTarget(state);

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
            // draw marked button text
            if (state.selection.markedBtn.btn_id != -1) {
                canvasCVOutCtx.font = "22px Georgia";
                canvasCVOutCtx.fillStyle = "green";

                canvasCVOutCtx.fillText(
                    state.selection.messages.marked,
                    state.width - 250,
                    state.height - 80
                );
                
            }

        }

        // if (state.initiator.show || state.technique.alwaysShow) {
        //     state.technique.drawIconsOnGridCanvas(state);
        // }

        if (state.experiment.trial.started()) {
            state.technique.drawCustom(state);


            if (state.selection.currentBtn.btn_id != -1 && remainingUIPauseTime <= 0) {
                // draw rectangle around highlighted button

                canvasCVOutCtx.strokeStyle = "white";
                canvasCVOutCtx.lineWidth = 4;
                canvasCVOutCtx.globalAlpha = 0.4;

                const p = state.selection.currentBtn.ref;
                canvasCVOutCtx.strokeRect(
                    p.topleft.x,
                    p.topleft.y,
                    p.width,
                    p.height,
                );
            }

        } else {
            if (remainingStartButtonPauseTime <= 0) {
                state.experiment.trial.drawStartBtn(state);
            }
        }

        {
            canvasCVOutCtx.font = "30px Georgia";
            canvasCVOutCtx.fillStyle = "white";

            // completedtargets / totaltargets
            canvasCVOutCtx.fillText(
                state.experiment.trial.completedTargetsStr(),
                20,
                state.height - 50
            );

            const s = state.experiment.trial.currentTargetUIStr();
            canvasCVOutCtx.fillStyle = "black";
            canvasCVOutCtx.globalAlpha = 0.5;
            canvasCVOutCtx.fillRect(
                state.width/11,
                10,
                s.length * 14,
                40
            );

            canvasCVOutCtx.font = "30px Georgia";
            canvasCVOutCtx.fillStyle = "white";
            canvasCVOutCtx.globalAlpha = 0.8;
            canvasCVOutCtx.fillText(
                s,
                state.width / 10,
                40
            );

            if (state.menu.practice) {
                canvasCVOutCtx.fillText(
                    "Practice Mode",
                    state.width - 220,
                    60
                );
            }
        }

        {
            canvasCVOutCtx.fillStyle = "black";
            canvasCVOutCtx.globalAlpha = 0.7;
            canvasCVOutCtx.fillRect(
                state.width - 270,
                state.height - 60,
                270,
                60
            );

            canvasCVOutCtx.font = "15px Georgia";
            canvasCVOutCtx.fillStyle = "white";
            if (remainingStartButtonPauseTime > 0) {
                canvasCVOutCtx.fillText(
                    `Waiting for ${remainingStartButtonPauseTime} seconds.`,
                    state.width - 250,
                    state.height - 40
                );
            } else if (remainingUIPauseTime > 0) {
                canvasCVOutCtx.fillText(
                    `Waiting for ${remainingUIPauseTime} seconds for UI update.`,
                    state.width - 250,
                    state.height - 40
                );
            }

            const tt = Math.max(
                0,
                state.config.experiment.trialMaxDurationMilliSec -
                state.experiment.trial.targetsDuration[state.experiment.trial.targetID]
            );

            canvasCVOutCtx.font = "15px Georgia";
            canvasCVOutCtx.fillStyle = "white";
            canvasCVOutCtx.fillText(
                `Remaining time: ${((tt | 0) / 1000).toFixed()} seconds.`,
                state.width - 250,
                state.height - 20
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