

class DemoObserver {
    constructor(state) {
        this.stats = {
            start_time: performance.now(),
            elapsed_time_ms: 0,
            buttons_clicked: 0
        };

        this.handFound = false;
    }

    resetStats() {
        this.stats.start_time = performance.now();
        this.stats.elapsed_time_ms = 0;
        this.stats.buttons_clicked = 0;
    }

    reset() {
        this.resetStats();
        this.handFound = false;
    }

    processStats() {
        this.stats.elapsed_time_ms = (performance.now() - this.stats.start_time);
    }

    save(state) {

        const t = state.experiment.trial.currentTarget();


        let body = {
            elapsed_time_ms: this.stats.elapsed_time_ms,
            buttons_clicked: this.stats.buttons_clicked,
        }

        state.myWorker.postMessage([`post_record`, `${state.config.host.url}/demo`, body]);

        console.log("demo.save() body:", JSON.stringify(body));
    }

};


export {DemoObserver};