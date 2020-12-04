class Tile {
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
     ******** Setter ********
     ************************/
    setTile(id) {
        if (id && this.parent._assets.get(id)) {
            this.isEmpty = false;
            this.asset = this.parent._assets.get(id);
        } else {
            this.isEmpty = true;
            this.asset = {
                collision: [1, 1, 1, 1],
                factor: 0
            }
        }
    }
    // setX(x) {
    //     this.x = x;
    // }
    // setY(y) {
    //     this.y = y;
    // }
    // setCol(col) {
    //     this.col = col;
    // }
    // setRow(row) {
    //     this.row = row;
    // }
    // setLevel(level) {
    //     this.level = level;
    // }
    // setIsEmpty(isEmpty) {
    //     this.isEmpty = isEmpty;
    // }
    // setCollision(collision) {
    //     this.collision = collision;
    // }
    // setOrig(orig) {
    //     this.orig = orig;
    // }

    del() {
        this.setTile(0);
        this.collision = false;
    }
}
