class AbstractSquare {
    constructor(parent, result) {
        this.parent = parent;
        this.x = 0;
        this.y = 0;
        this.col = 0;
        this.row = 0;
        this.level = 0;
        this.isEmpty = false;
        this.asset = [];
        this.collision = [];
        this.orig = '';
        this.isLooted = false;
    }
    /************************
     ***** Hit action *******
     ************************/
    hit(type) {
        this.del = false;
        if (this.isEmpty == false) {
            if (this[this.asset.name] instanceof Function) {
                this[this.asset.name]();
            } else {
                if (this instanceof Collectible) {
                    this.newItem();
                }
            }
        }
    }
    draw() {
        // if (_game.spriteSheet) {
        //     if (this.asset.pos) {
        //         _ctxWorld.drawImage(
        //             _game.spriteSheet,
        //             this.asset.pos.col * this.w,
        //             this.asset.pos.row * this.h,
        //             this.w,
        //             this.h,
        //             this.x,
        //             this.y,
        //             this.w,
        //             this.h
        //         );
        //     }
        // }
        if (this.asset.image) {
            _ctxWorld.drawImage(this.asset.image, this.x, this.y, this.w, this.h);
        }
    }
    set(id) {
        if (id && this.parent._assets.get(id)) {
            this.isEmpty = false;
            this.asset = this.parent._assets.get(id);
        } else {
            this.isEmpty = true;
            this.asset = {
                collision: false,
                factor: 0
            }
        }
    }
    newItem() {
        _game._player.items.addToCategory(this.asset);
        this.remove();
        _game.ui.inventory.resize();

    }
    remove() {
        this.set(0);
        this.collision = false;
        _game.ui.repaint = true;
    }
}
