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
        this.init();
    }
    init() {

    }
    resize(){
        if (this.generatorType == 'Floor') {
            this._floors.resize();
        }
    }
}
