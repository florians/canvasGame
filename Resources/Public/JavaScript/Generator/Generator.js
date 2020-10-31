class Generator {
    constructor(type) {
        this.generatorType = type;
        this._assets = new Assets(this);
        //this.mousehandler = new MouseHandler(this);
        if (this.generatorType == 'Floor') {
            this.loader = new Loader(this);
            this._floors = new Floors(this);
        }
        this.preloader();
    }
    /************************
     **** Setup Loader ******
     ************************/
    preloader() {
        if (this.generatorType == 'Floor') {
            this._assets.load();
            this._floors.load(1);
            this._floors.loadAll();
        }
        // calls > preloaderResult
        this.loader.run();
    }
    /************************
     ***** Loader init ******
     ************************/
    preloaderResult(result) {
        if (result.length == 1) {
            this.msg(result[0].data.type, result[0].data.msg);
        }
        for (let i = 0; i < result.length; i++) {
            if (result[i].name == "assets") {
                this._assets.init(result[i].data.result);
            }
            if (result[i].name == "assetsType") {
                this._assets.initType(result[i].data.result);
            }
            if (result[i].name == "floors") {
                this._floors.init(result[i].data.result);
            }
            if (result[i].name == "allFloors") {
                this._floors.fillFloorSelect(result[i].data.result);
            }
        }
    }
    msg(type, msg) {
        this.msgReset();
        $('.infoBox .' + type).html(msg).addClass('active');
    }

    msgReset() {
        $('.infoBox > span').removeClass('active')
    }
    resize() {
        if (this.generatorType == 'Floor') {
            this._floors.resize();
        }
    }
}
