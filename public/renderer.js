import {checkRadio, checkSelectList, newMenuState} from './menu.js';


let done = false;
function onResults(results) {
    
    
    // Hide the spinner.        
    if (!done) {
        console.log("results:", results);
        console.log("canvasElement:", canvasElement);
        done = true;
    }
    
    document.body.classList.add('loaded');
    // Update the frame rate.
    // fpsControl.tick();

    // Draw the overlays.
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(
        results.image, 0, 0, canvasElement.width, canvasElement.height
    );

    if (results.multiHandLandmarks && results.multiHandedness) {
        for (let index = 0; index < results.multiHandLandmarks.length; index++) {
            const classification = results.multiHandedness[index];
            const isRightHand = classification.label === 'Right';
            const landmarks = results.multiHandLandmarks[index];
            // drawConnectors(
            //     canvasCtx, landmarks, HAND_CONNECTIONS,
            //     {color: isRightHand ? '#00FF00' : '#FF0000'}),
            // drawLandmarks(canvasCtx, landmarks, {
            //     color: isRightHand ? '#00FF00' : '#FF0000',
            //     fillColor: isRightHand ? '#FF0000' : '#00FF00',
            //     radius: (x) => {
            //     return lerp(x.from.z, -0.15, .1, 10, 1);
            //     }
            // });
        }
    }

    canvasCtx.restore();
}


window.onload = function() {
    
    console.log("window loaded");
    let menuState = newMenuState();

    let menuElement = document.getElementById("menu");

    let start_study = false;
    
    // Our input frames will come from here.
    
    const videoContainer = document.getElementById("video_container");
    videoContainer.disabled = true;

    const startBtn = document.getElementById("start_btn");
    startBtn.onclick = function() {
        menuState.showMenu = false;
        menuState.technique = checkRadio("menutechnique");
        menuState.trigger = checkRadio("menutrigger");
        menuState.userID = document.getElementById("inputUserID").value;
        menuState.practice = document.getElementById("practiceCheck").checked; 
        menuState.debug = document.getElementById("debugCheck").checked;
        menuState.cellscnt = checkSelectList("selectCells");
        menuState.targetscnt = 3;
        
        console.log("menuState:", menuState);
        start_study = true;
        menu.style.display = "none";
        console.log("start btn clicked");

    }
    
    console.log("startBtn:", startBtn);
    
    
    
    if (start_study) {
        const videoElement =
        document.getElementById('input_video');
        const canvasElement =
        document.getElementById('output_canvas');
        
        const canvasCtx = canvasElement.getContext('2d');
        
        // call tick() each time the graph runs.
        // const fpsControl = new FPS();
        

        
        const hands = new Hands({locateFile: (file) => {
            console.log("hands file:", file);
            return `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.1/${file}`;
        }});
    
        hands.setOptions({
            maxNumHands: 2,
            minDetectionConfidence: 0.9,
            minTrackingConfidence: 0.9
        });
        
        hands.onResults(onResults);
    
        /**
         * Instantiate a camera. We'll feed each frame we receive into the solution.
         */
        const camera = new Camera(videoElement, {
            onFrame: async () => {
                await hands.send({image: videoElement});
            },
            width: 1280,
            height: 720
        });
    
        camera.start();
    }
}