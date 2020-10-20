class Tiles {
    constructor(result) {
        this.tiles = [];
    }
    generate(result) {
        _game.loader.reset();
        _game.loader.addMax(result.length);
        _game.loader.addText('Loading tiles...');
        for (let i = 0; i < result.length; i++) {
            this.tiles[result[i].uid] = this.set(result[i]);
        }
        return this;
    }
    set(result){
        return new Tile(result);
    }
    get(id) {
        return this.tiles[id];
    }
    load(game) {
        game.loader.add('data', 'tiles', {
            type: 'getAllTiles'
        });
    }
    // garbage collection
    // remove(){
    // }
}
