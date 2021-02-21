class Tile extends AbstractSquare {
    constructor(parent, id) {
        super(parent);
        this.set(id);
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
            let randomNr = Math.floor(Math.random() * 2) + 1;
            _game._player.items.addToCategory(item, randomNr);
        }
    }
}
