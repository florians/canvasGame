class Game {
    constructor() {
        this._tiles = new Tiles();
        // this._floorSettings = new FloorSettings();
        this._floors = new Floors();
        this._skills = new Skills();
        this._player = new Player();

        this.enemy = [];
        this.delta = 0;
        this.raF = 0;
        this.stopGame = false;
        this.lastTimestamp = 0;
        this.floorLevel = floorLevel;
        this.loader = new Loader();
        this.preloader();
    }
    preloader() {
        this._tiles.load(this);
        this._floors.load(this, 1);
        this._skills.load(this);
        this._player.load(this, playerName);
        this._player.loadSkills(this, playerName);

        // give loader an object for calling functions
        this.loader.setObj(this);
        // calls _game.preloaderResult
        this.loader.run();
    }
    // calls init afterwards
    preloaderResult(result) {
        for (let i = 0; i < result.length; i++) {
            if (result[i].name == "tiles") {
                this._tiles.set(result[i].data.result);
            }
            if (result[i].name == "floors") {
                this._floors.add(result[i].data.result);
            }
            if (result[i].name == "skills") {
                this._skills.set(result[i].data.result);
            }
            if (result[i].name == "player") {
                this._player.set(result[i].data.result);
            }
            if (result[i].name == "playerSkills") {
                this._player.addSkills(this,result[i].data.result);
            }
        }
        this.init();
    }

    // this.animate freaks out otherwise
    animate() {
        let now = Date.now(),
            timeDelta = (now - (this.lastTimestamp || now)) / 1000; // in seconds
        this.delta = timeDelta * 30; // meaning: 30px per second

        // clear both canvas
        _ctxWorld.save();
        // used to removed old translate
        _ctxWorld.setTransform(1, 0, 0, 1, 0, 0);
        _ctxWorld.clearRect(0, 0, _ctxWorld.canvas.width, _ctxWorld.canvas.height);
        _ctxWorld.restore();

        this.lastTimestamp = now;
        this.draw();

        if (!this.stopGame == true) {
            this.raF = requestAnimationFrame(() => this.animate());
        }
    }
    init() {
        $('body').addClass('loading-done');
        this.stopGame = false;
        this.setCanvasSize();
        // create ui
        this.ui = new Ui();
        this.ui.repaint = true;
        this.resize();
        this.animate();
    }
    newFloor(newFloor, reset = false) {
        this.floorLevel = newFloor;
        $('body').removeClass('loading-done');
        this.stopGame = true;
        if (!this._floors.get(this.floorLevel)) {
            this._floors.load(this, this.floorLevel);
        } else {
            this._floors.get(this.floorLevel).resetStart();
        }
    }
    draw() {
        this._floors.get(this.floorLevel).draw();
        if (this.ui.repaint == true) {
            this.ui.draw();
        }
    }
    setCanvasSize() {
        _ctxWorld.canvas.width = $('body').width();
        _ctxWorld.canvas.height = $('body').height();
        _ctxUi.canvas.width = $('body').width();
        _ctxUi.canvas.height = $('body').height();
    }
    resize() {
        this.setCanvasSize();
        this.ui.repaint = true;
        this._floors.get(this.floorLevel).resize();
        this._player.resize();
        if (this.stopGame == true) {
            this.draw();
        }
    }
}
