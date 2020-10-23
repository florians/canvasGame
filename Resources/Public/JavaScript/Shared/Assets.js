class Assets {
    constructor(game) {
        this.game = game;
        this.assets = [];
    }
    /************************
     **** Setup Loader ******
     ************************/
    load() {
        this.game.loader.add('data', 'assets', {
            type: 'getAllAssets'
        });
    }
    /************************
     ***** Loader init ******
     ************************/
    init(result) {
        this.game.loader.reset();
        this.game.loader.addMax(result.length);
        this.game.loader.addText('Loading assets...');
        for (let i = 0; i < result.length; i++) {
            this.assets[result[i].uid] = this.add(result[i]);
        }
        return this;
    }
    /************************
     ******** Getter ********
     ************************/
    get(id) {
        return this.assets[id];
    }
    /************************
     ****** Add Tile ********
     ************************/
    add(result) {
        return new Asset(result);
    }

    // garbage collection
    // remove(){
    // }
}
