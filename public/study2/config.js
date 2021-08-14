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
        
        this.icons = {
            hand: {
                src: "res/hand_full.png",
                image: null,
                name: "Hand"
            },
            categories: ['animals', 'transport', 'furniture', 'sports', 'food', 'vegetables', 'electronics', 'fruits'],
            all: [
                {
                    "image": "",
                    "name": "cow",
                    "src": "res/images/cow.png",
                    "type": "animals"
                },
                {
                    "image": "",
                    "name": "goat",
                    "src": "res/images/goat.png",
                    "type": "animals"
                },
                {
                    "image": "",
                    "name": "dog",
                    "src": "res/images/dog.png",
                    "type": "animals"
                },
                {
                    "image": "",
                    "name": "sheep",
                    "src": "res/images/sheep.png",
                    "type": "animals"
                },
                {
                    "image": "",
                    "name": "cat",
                    "src": "res/images/cat.png",
                    "type": "animals"
                },
                {
                    "image": "",
                    "name": "bycicle",
                    "src": "res/images/bycicle.png",
                    "type": "transport"
                },
                {
                    "image": "",
                    "name": "truck",
                    "src": "res/images/truck.png",
                    "type": "transport"
                },
                {
                    "image": "",
                    "name": "train",
                    "src": "res/images/train.png",
                    "type": "transport"
                },
                {
                    "image": "",
                    "name": "bicycle",
                    "src": "res/images/bicycle.png",
                    "type": "transport"
                },
                {
                    "image": "",
                    "name": "car",
                    "src": "res/images/car.png",
                    "type": "transport"
                },
                {
                    "image": "",
                    "name": "bed",
                    "src": "res/images/bed.png",
                    "type": "furniture"
                },
                {
                    "image": "",
                    "name": "chair",
                    "src": "res/images/chair.png",
                    "type": "furniture"
                },
                {
                    "image": "",
                    "name": "wardrobe",
                    "src": "res/images/wardrobe.png",
                    "type": "furniture"
                },
                {
                    "image": "",
                    "name": "table",
                    "src": "res/images/table.png",
                    "type": "furniture"
                },
                {
                    "image": "",
                    "name": "couch",
                    "src": "res/images/couch.png",
                    "type": "furniture"
                },
                {
                    "image": "",
                    "name": "baseball",
                    "src": "res/images/baseball.png",
                    "type": "sports"
                },
                {
                    "image": "",
                    "name": "cricket",
                    "src": "res/images/cricket.png",
                    "type": "sports"
                },
                {
                    "image": "",
                    "name": "basketball",
                    "src": "res/images/basketball.png",
                    "type": "sports"
                },
                {
                    "image": "",
                    "name": "tennis",
                    "src": "res/images/tennis.png",
                    "type": "sports"
                },
                {
                    "image": "",
                    "name": "soccer",
                    "src": "res/images/soccer.png",
                    "type": "sports"
                },
                {
                    "image": "",
                    "name": "french-fries",
                    "src": "res/images/french-fries.png",
                    "type": "food"
                },
                {
                    "image": "",
                    "name": "noodles",
                    "src": "res/images/noodles.png",
                    "type": "food"
                },
                {
                    "image": "",
                    "name": "hamburger",
                    "src": "res/images/hamburger.png",
                    "type": "food"
                },
                {
                    "image": "",
                    "name": "soup",
                    "src": "res/images/soup.png",
                    "type": "food"
                },
                {
                    "image": "",
                    "name": "pizza",
                    "src": "res/images/pizza.png",
                    "type": "food"
                },
                {
                    "image": "",
                    "name": "carrot",
                    "src": "res/images/carrot.png",
                    "type": "vegetables"
                },
                {
                    "image": "",
                    "name": "broccoli",
                    "src": "res/images/broccoli.png",
                    "type": "vegetables"
                },
                {
                    "image": "",
                    "name": "spinach",
                    "src": "res/images/spinach.png",
                    "type": "vegetables"
                },
                {
                    "image": "",
                    "name": "cabbage",
                    "src": "res/images/cabbage.png",
                    "type": "vegetables"
                },
                {
                    "image": "",
                    "name": "potato",
                    "src": "res/images/potato.png",
                    "type": "vegetables"
                },
                {
                    "image": "",
                    "name": "fridge",
                    "src": "res/images/fridge.png",
                    "type": "electronics"
                },
                {
                    "image": "",
                    "name": "guiter",
                    "src": "res/images/guiter.png",
                    "type": "electronics"
                },
                {
                    "image": "",
                    "name": "laptop",
                    "src": "res/images/laptop.png",
                    "type": "electronics"
                },
                {
                    "image": "",
                    "name": "oven",
                    "src": "res/images/oven.png",
                    "type": "electronics"
                },
                {
                    "image": "",
                    "name": "desktop",
                    "src": "res/images/desktop.png",
                    "type": "electronics"
                },
                {
                    "image": "",
                    "name": "banana",
                    "src": "res/images/banana.png",
                    "type": "fruits"
                },
                {
                    "image": "",
                    "name": "grapes",
                    "src": "res/images/grapes.png",
                    "type": "fruits"
                },
                {
                    "image": "",
                    "name": "mango",
                    "src": "res/images/mango.png",
                    "type": "fruits"
                },
                {
                    "image": "",
                    "name": "apple",
                    "src": "res/images/apple.png",
                    "type": "fruits"
                },
                {
                    "image": "",
                    "name": "orange",
                    "src": "res/images/orange.png",
                    "type": "fruits"
                }
            ],
            loadcnt: 0
        }


        this.icons.hand.image = new Image();
        this.icons.hand.image.onload = () => {
            console.log("hand image loaded");
        }
        this.icons.hand.image.src = this.icons.hand.src;


        console.log("this.icons.all.length", this.icons.all.length);
        for (let i = 0; i < this.icons.all.length; i ++) {

            this.icons.all[i].image = new Image();
            this.icons.all[i].image.onload = () => {
                this.icons.loadcnt ++;
                console.log("loaded", this.icons.all[i].src, "loadcnt:", this.icons.loadcnt);
            }

            this.icons.all[i].image.src = this.icons.all[i].src; 
        }

    };

}

export { Config };