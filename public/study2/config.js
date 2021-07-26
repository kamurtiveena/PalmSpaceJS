class Config {
    constructor() {
        this.TRANSPARENCY_ALPHA = 0.5;
        this.DWELLWAIT_MS = 600;
        this.CAMWIDTH = 1280;
        this.CAMHEIGHT = 720;
        this.IMGPALM_DIMMAX = Math.min(this.CAMHEIGHT, this.CAMWIDTH) / 3;
        this.ABSOLUTEWIDTH = 350;
        this.progressbar = {
            MAXWIDTH: this.CAMWIDTH / 8,
            MAXHEIGHT: this.CAMHEIGHT / 28
        }; // todo use this

        this.fisheye = {
            weights: {
                MAX: 8,
                NEIGHBOR: 4,
                NORMAL: 3,
                NORMAL2: 6,
                NORMAL3: 9,
                SUMMAXNEIGHBOR: 12,
                SUMMAX2NEIGHBOR: 16
            }
        };

        this.grid = {
            gap: 3,
            width: null,
            height: null
        };

        this.landmarkButtons = {
            total: 17,
            width: 30,
            height: 30,
            widthHalf: 15,
            heightHalf: 15,
        };

        // a single button/cell in grid
        this.buttons = {
            width: 30,
            height: 30,
            isDynamic: false
        };

        this.host = {
            url: 'http://localhost:3000'
        };

        this.experiment = {
            repetitions: 5,
            startButton: {
                width: 60,
                height: 50,
            },
            trialMaxDurationMilliSec: 30000
        };

        this.experiment.startButton.widthHalf = this.experiment.startButton.width / 2;
        this.experiment.startButton.heightHalf = this.experiment.startButton.height / 2;
        
        this.images = {
            fruits: [
                {
                    src: "res/f_banana.png",
                    image: null
                },
                {
                    src: "res/f_grape.png",
                    image: null
                },
                {
                    src: "res/f_mango.png",
                    image: null
                },
                {
                    src: "res/f_orange.png",
                    image: null
                },
                {
                    src: "res/f_strawberry.png",
                    image: null
                }
            ],
            vegetables: [
                {
                    src: "res/v_cabbage.png",
                    image: null
                },
                {
                    src: "res/v_carrot.png",
                    image: null
                },
                {
                    src: "res/v_lemon.png",
                    image: null
                },
                {
                    src: "res/v_lettuce.png",
                    image: null
                }
            ],
            loadcnt: 0
        }



        for (let i = 0; i < this.images.fruits.length; i ++) {

            this.images.fruits[i].image = new Image();
            this.images.fruits[i].image.onload = () => {
                this.images.loadcnt ++;
                console.log("loaded", this.images.fruits[i].src, "loadcnt:", this.images.loadcnt);
            }

            this.images.fruits[i].image.src = this.images.fruits[i].src; 
        }

        for (let i = 0; i < this.images.vegetables.length; i ++) {

            this.images.vegetables[i].image = new Image();
            this.images.vegetables[i].image.onload = () => {
                this.images.loadcnt ++;
                console.log("loaded", this.images.vegetables[i].src, "loadcnt:", this.images.loadcnt);
            }

            this.images.vegetables[i].image.src = this.images.vegetables[i].src; 
        }
    };

}

export { Config };