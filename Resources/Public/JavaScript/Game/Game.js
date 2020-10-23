class Game {
    constructor() {
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
        // give loader an object for calling functions
        this.loader.setObj(this);
        // calls _game.preloaderResult
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
        $('body').addClass('loading-done');
        this.stopGame = false;
        this.setCanvasSize();
        // create ui
        this.ui = new Ui();
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
        _ctxWorld.clearRect(0, 0, _ctxWorld.canvas.width, _ctxWorld.canvas.height);
        _ctxWorld.restore();

        this.lastTimestamp = now;
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
        _ctxWorld.canvas.width = $('body').width();
        _ctxWorld.canvas.height = $('body').height();
        _ctxUi.canvas.width = $('body').width();
        _ctxUi.canvas.height = $('body').height();
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
}
