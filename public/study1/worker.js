onmessage = function (e) {

    const type = e.data[0];
    console.log(`Worker: Message received from main script, type: ${type}`);
    console.log(e);

    switch (type) {
        case "test_worker":
            testWorker(e.data.slice(1));
            break;
        case "post_record":
            postData(e.data[1], e.data.slice(2));
            break;
        default:
            console.error("command not defined:", type);
            break;
    }

}


async function postData(url, data) {
    const content = JSON.stringify(data);
    
    const resp = await fetch(url, {
        method: 'POST',
        mode: 'cors', 
        cache: 'no-cache',
        // credentials: 'same-origin',
        credentials: 'omit',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': content.length.toString()
            // 'Access-Control-Allow-Origin': 
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: content
    })
    .then(response => {
        if (!response || !response.ok) throw new TypeError(`response not ok`);
        postMessage(response.json());
    })
    .catch(err => {
        // console.log(err); // todo fix DataCloneError
        postMessage({"error": "err msg"});
    });
}


function testWorker(data) {
    const result = data[0] * data[1];
    if (isNaN(result)) {
        postMessage('Please write two numbers');
    } else {
        const workerResult = 'Result: ' + result;
        console.log('Worker: Posting message back to main script');
        postMessage(workerResult);
    }
}

// JSON.stringify
