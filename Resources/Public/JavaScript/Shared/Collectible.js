class Collectible extends AbstractSquare {
    constructor(parent, id, canavs) {
        super(parent);
        this.set(id);
        this.canvas = canavs || _ctxWorld;
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
    // draw(){
    //     if(this.asset.image){
    //         this.canvas.drawImage(this.asset.image, this.x, this.y, this.h, this.w);
    //     }
    // }
}
