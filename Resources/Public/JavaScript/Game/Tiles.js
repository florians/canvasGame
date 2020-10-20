class Tiles {
    constructor(game) {
        this.game = game;
        this.tiles = [];
    }
    /************************
     **** Setup Loader ******
     ************************/
    load() {
        this.game.loader.add('data', 'tiles', {
            type: 'getAllTiles'
        });
    }
    /************************
     ***** Loader init ******
     ************************/
    init(result) {
        this.game.loader.reset();
        this.game.loader.addMax(result.length);
        this.game.loader.addText('Loading tiles...');
        for (let i = 0; i < result.length; i++) {
            this.tiles[result[i].uid] = this.add(result[i]);
        }
        return this;
    }
    /************************
     ******** Getter ********
     ************************/
    get(id) {
        return this.tiles[id];
    }
    /************************
     ****** Add Tile ********
     ************************/
    add(result) {
        return new Tile(result);
    }

    // garbage collection
    // remove(){
    // }
}
