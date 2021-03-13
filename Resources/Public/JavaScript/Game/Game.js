/**
 * Main Game File
 * @class
 */
class Game {
    /** @constructor */
    constructor() {
        /** set _ctxWorld and _ctxUi dimensions */
        this.setCanvasSize();
        /** @type {MouseHandler} */
        this.mousehandler = new MouseHandler(this);
        this.mousehandler.add('.fullscreen', 'click', 'doFullscreen');
        /** @type {KeyboardHandler} */
        this.keyboardHandler = new KeyboardHandler(this);
        this.keyboardHandler.setDefault();
        this.keyboardHandler.add(document, 'keydown', 'doFullscreen', [70, 13]);
        /** @type {Joystick} */
        this.joystickHandler = new Joystick();
        /** @type {Fullscreen} */
        this.fullscreenHandler = new Fullscreen();
        /** @type {Loader} */
        this.loader = new Loader(this);
        /**@type {Assets} */
        this._assets = new Assets(this);
        /** @type {Floors} */
        this._floors = new Floors(this);
        /** @type {Skills} */
        this._skills = new Skills();
        /** @type {Player} */
        this._player = new Player();

        /** @type {boolean} stopGame  - stop the rendering loop */
        this.stopGame = false;
        // rendering loop
        this.raF = 0;
        /** @type {number} delta - rendering loop delta */
        this.delta = 0;
        /** @type {number} lastTimestamp - rendering loop timestamp */
        this.lastTimestamp = 0;
    }
    /** first function called > get from DB */
    preloader() {
        /** initial loading from DB */
        this.loader.add('data', 'initLoad', {
            type: 'initLoad',
            level: this._floors.floorLevel,
            name: playerName
        });
        /** @type {UserInterface} */
        this.ui = new UserInterface(this);
        /** calls > preloaderResult */
        this.loader.run();
    }
    /**
     * will be called when data returns from loader.run
     * @param  {array} result db return
     * @method
     */
    preloaderResult(result) {
        /** multiple DB results */
        if (result[0].type == 'group') {
            let data = result[0].result;
            for (const property in data) {
                if (typeof this[property] === 'object') {
                    this[property].init(data[property]);
                } else {
                    console.log(property + ' not defined');
                }
            }
            /** initialize the game */
            this.init();
        } else {
            /** single DB result */
            // old way > change in gen (used for single operations atm)
            for (let i = 0; i < result.length; i++) {
                /** if floor is returned call init */
                if (result[i].name == "floors") {
                    this._floors.init(result[i].result);
                }
                /** returned player after saving it */
                // if (result[i].name == "player") {
                //     this._player.init(result[i].result);
                // }
                /** returned player after saving it */
                if (result[i].name == "playerUid") {
                    this._player.setUid(result[i].result);
                }
            }
            if (this.stopGame == true) {
                /** start the game if it got stopped */
                this.init();
            }
        }
    }
    /** initialization of game */
    init() {
        /** add classes to hide loader */
        this.loader.hide();
        /** trigger UI repaint */
        this.ui.repaint = true;
        this.resize();
        this.start();
    }

    /************************
     **** Canvas changes ****
     ************************/
    animate() {
        let now = Date.now(),
            timeDelta = (now - (this.lastTimestamp || now)) / 1000; // in seconds
        this.delta = timeDelta * 30; // meaning: 30px per second

        // clear both canvas
        _ctxWorld.save();
        // used to removed old translate
        _ctxWorld.setTransform(1, 0, 0, 1, 0, 0);
        _ctxWorld.fillStyle = 'black';
        _ctxWorld.fillRect(0, 0, _ctxWorld.canvas.width, _ctxWorld.canvas.height);
        //_ctxWorld.clearRect(0, 0, _ctxWorld.canvas.width, _ctxWorld.canvas.height);
        _ctxWorld.restore();

        //let fps = Math.round(1000 / (now - this.lastTimestamp));
        this.lastTimestamp = now;
        //console.log("fps", fps);
        this.draw();

        if (!this.stopGame == true) {
            this.raF = requestAnimationFrame(() => this.animate());
        } else {
            this.raF = null;
        }
    }
    draw() {
        this._floors.draw();
        if (this.ui.repaint == true) {
            this.ui.draw();
        }
    }
    setCanvasSize() {
        _ctxWorld.canvas.width = window.innerWidth;
        _ctxWorld.canvas.height = window.innerHeight;
        _ctxUi.canvas.width = window.innerWidth;
        _ctxUi.canvas.height = window.innerHeight;
    }
    resize() {
        this.setCanvasSize();
        this.ui.repaint = true;
        this._floors.resize();
        this._player.resize();
        this.ui.resize();
        // paint single frame on resize
        if (this.stopGame == true) {
            this.draw();
        }
    }
    stop() {
        this.stopGame = true;
        this.keyboardHandler.reset();
        document.body.classList.add('suspended');
    }
    start() {
        //this.ui.repaint = true;
        this.stopGame = false;
        this.animate();
        document.body.classList.remove('battle', 'suspended');
    }
    doFullscreen(event) {
        this.fullscreenHandler.toggle();
    }
}
