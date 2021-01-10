class Tile extends AbstractSquare {
    constructor(parent, id) {
        super(parent);
        this.set(id);
    }
    portal() {
        _game.keyboardHandler.reset();
        _game._player.savePlayer();
        _game._floors.newFloor(this.level);
        _game.loader.run();
    }
    forest() {
        this.addToItems(38);
    }
    mountain() {
        this.addToItems(39);
    }
    addToItems(id) {
        if (!this.isLooted) {
            let item = _game._assets.get(id);
            this.isLooted = true;
            let randomNr = Math.floor(Math.random() * 5) + 1;
            _game._player.items.addToCategory(item, randomNr);
        }
    }
}
