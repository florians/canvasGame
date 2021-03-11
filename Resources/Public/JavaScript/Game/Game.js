class Game {
    constructor() {
        this.setCanvasSize();
        this.mousehandler = new MouseHandler(this);
        this.keyboardHandler = new KeyboardHandler(this);
        this.keyboardHandler.setDefault();
        this.joystickHandler = new Joystick();
        this.fullscreenHandler = new Fullscreen();

        this.loader = new Loader(this);
        this._assets = new Assets(this);
        this._floors = new Floors(this);
        this._skills = new Skills();
        this._player = new Player();

        this.delta = 0;
        this.raF = 0;
        this.stopGame = false;
        this.lastTimestamp = 0;

        this.mousehandler.add('.fullscreen', 'click', 'doFullscreen');
        this.keyboardHandler.add(document, 'keydown', 'doFullscreen', [70, 13]);
    }
    /************************
     **** Setup Loader ******
     ************************/
    preloader() {
        this.loader.add('data', 'initLoad', {
            type: 'initLoad',
            level: this._floors.floorLevel,
            name: playerName
        });
        //this._assets.load();
        //this._floors.load(2);
        //this._skills.load();
        //this._player.load(playerName);
        //this._player.loadSkills(playerName);
        this.ui = new UserInterface(this);
        // calls > preloaderResult
        this.loader.run();
    }
    /************************
     ***** Loader init ******
     ************************/
    preloaderResult(result) {
        // new force all to that
        if (result[0].type == 'group') {
            let data = result[0].result;
            for (const property in data) {
                if (typeof this[property] === 'object') {
                    this[property].init(data[property]);
                } else {
                    console.log(property + ' not defined');
                }
            }
        } else {
            // old way > change in gen (used for single operations atm)
            for (let i = 0; i < result.length; i++) {
                if (result[i].name == "assets") {
                    this._assets.init(result[i].result);
                }
                if (result[i].name == "floors") {
                    this._floors.init(result[i].result);
                }
                if (result[i].name == "skills") {
                    this._skills.init(result[i].result);
                }
                if (result[i].name == "player") {
                    this._player.init(result[i].result);
                }
                if (result[i].name == "playerSkills") {
                    this._player.initSkills(result[i].result);
                }
                if (result[i].name == "playerUid") {
                    this._player.setUid(result[i].result);
                }
            }
        }
        this.init();
    }
    init() {
        document.body.classList.add('loading-done');
        // hide the loader
        this.loader.hide();
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
        this.ui.repaint = true;
        this.stopGame = false;
        this.animate();
        document.body.classList.remove('battle', 'suspended');
    }
    doFullscreen(event) {
        this.fullscreenHandler.toggle();
    }
}
