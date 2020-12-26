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
    }
    /************************
     ***** Hit action *******
     ************************/
    hit(type) {
        this.del = false;
        if (this.isEmpty == false) {
            if (this[this.asset.name] instanceof Function) {
                this[this.asset.name]();
            }
        }
    }

    /************************
     ******** Setter ********
     ************************/
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
    remove() {
        this.set(0);
        this.collision = false;
        _game.ui.draw();
    }
}
