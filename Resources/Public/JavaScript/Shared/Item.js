class Item extends Tile {
    constructor(parent, id) {
        super(parent);
        super.set(id);
    }
    hp() {
        if (this.parent._player.stats.hp.current < this.parent._player.stats.hp.max) {
            this.parent.ui.addStat(this.parent._player, 'hp');
            super.del();
        }
    }
    es() {
        this.parent.ui.addStat(this.parent._player, 'es');
        super.del();
    }
    // key() {
    //
    // }
    // lock() {
    //
    // }
}
