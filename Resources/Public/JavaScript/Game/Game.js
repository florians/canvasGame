class Game {
    constructor() {
        this.mousehandler = new MouseHandler(this);
        this.keyboardHandler = new KeyboardHandler(this);
        this.joystickHandler = new Joystick(this);
        this.fullscreenHandler = new Fullscreen();

        this.loader = new Loader(this);
        this._assets = new Assets(this);
        this._floors = new Floors(this);
        this._skills = new Skills(this);
        this._player = new Player(this);

        this.enemy = [];
        this.delta = 0;
        this.raF = 0;
        this.stopGame = false;
        this.lastTimestamp = 0;

        this.mousehandler.add('.fullscreen', 'click', 'doFullscreen');
        this.keyboardHandler.add(document, 'keydown', 'doFullscreen');

        this.preloader();
    }
    /************************
     **** Setup Loader ******
     ************************/
    preloader() {
        this._assets.load();
        this._floors.load(1);
        this._skills.load();
        this._player.load(playerName);
        this._player.loadSkills(playerName);
        // calls > preloaderResult
        this.loader.run();
    }
    /************************
     ***** Loader init ******
     ************************/
    preloaderResult(result) {
        for (let i = 0; i < result.length; i++) {
            if (result[i].name == "assets") {
                this._assets.init(result[i].data.result);
            }
            if (result[i].name == "floors") {
                this._floors.init(result[i].data.result);
            }
            if (result[i].name == "skills") {
                this._skills.init(result[i].data.result);
            }
            if (result[i].name == "player") {
                this._player.init(result[i].data.result);
            }
            if (result[i].name == "playerSkills") {
                this._player.initSkills(result[i].data.result);
            }
        }
        this.init();
    }
    init() {
        document.body.classList.add('loading-done');
        this.stopGame = false;
        this.setCanvasSize();
        // create ui
        this.ui = new UserInterface(this);
        this.ui.repaint = true;
        this.resize();
        this.animate();
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
        if (this.stopGame == true) {
            this.draw();
        }
    }
    doFullscreen(event) {
        if (event.keyCode == 70 || event.target.className == 'fullscreen') {
            this.fullscreenHandler.toggle();
        }
    }
}
