class Collectible extends AbstractSquare {
    constructor(parent, id) {
        super(parent);
        this.set(id);
    }
    hp() {
        if (this.parent._player.stats.hp.current < this.parent._player.stats.hp.max) {
            this.parent.ui.addStat(this.parent._player, 'hp');
            this.remove();
        }
    }
    es() {
        this.parent.ui.addStat(this.parent._player, 'es');
        this.remove();
    }
    // key() {
    //
    // }
    // lock() {
    //
    // }
}
