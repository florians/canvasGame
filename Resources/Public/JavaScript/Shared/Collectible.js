class Collectible extends AbstractSquare {
    constructor(parent, id, canavs = _ctxWorld) {
        super(parent);
        this.set(id);
        this.canvas = canavs;
    }
    hp() {
        if (this.parent._player.stats.hp.current < this.parent._player.stats.hp.max) {
            //this.parent.ui.addStat(this.parent._player, 'hp');
            _game._player.stats.addStat('hp');
            this.remove();
        }
    }
    es() {
        _game._player.stats.addStat('es');
        this.remove();
    }
    key() {
        let key = new Collectible(this.parent, this.uid, _ctxUi);
        key.asset = this.asset;
        this.remove();
        _game._player.items.push(key);
        _game.ui.inventory.resize();
    }
    draw(){
        if(this.asset.image){
            this.canvas.drawImage(this.asset.image, this.x, this.y, this.h, this.w);
        }
    }
}
