class Item extends Tile {
    constructor(parent, id) {
        super(parent);
        super.setTile(id);
    }
    hit(type) {
        if (this.isEmpty == false) {
            console.log("Item Hit", this.asset.name);
            if (this[this.asset.name] instanceof Function) {
                this[this.asset.name]();
            }
            _game.ui.draw();
            this.del();
        }
    }
    hp() {
        this.parent.ui.addStat(this.parent._player, 'hp');
    }
    es() {
        this.parent.ui.addStat(this.parent._player, 'es');
    }
    // key() {
    //
    // }
    // lock() {
    //
    // }
}
