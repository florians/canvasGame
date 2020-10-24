class Tile {
    constructor(parent, result) {
        this.parent = parent;
        this.x = 0;
        this.y = 0;
        this.col = 0;
        this.row = 0;
        this.level = 0;
        this.blank = false;
        this.asset = [];
        this.collision = [];
        this.orig = '';
        this.setTile(result);
    }
    /************************
     ******** Getter ********
     ************************/
    getX() {
        return this.x;
    }
    getY() {
        return this.y;
    }
    getCol() {
        return this.col;
    }
    getRow() {
        return this.row;
    }
    getLevel() {
        return this.level;
    }
    getIsEmpty() {
        return this.isEmpty;
    }
    getCollision() {
        return this.collision;
    }
    getOrig() {
        return this.orig;
    }
    /************************
     ******** Setter ********
     ************************/
    setTile(id) {
        if (this.parent._assets.get(id)) {
            this.setIsEmpty(false);
            this.asset = this.parent._assets.get(id);
        } else {
            this.setIsEmpty(true);
            this.asset = {
                collision: [1, 1, 1, 1],
                factor: 0
            }
        }
    }
    setX(x) {
        this.x = x;
    }
    setY(y) {
        this.y = y;
    }
    setCol(col) {
        this.col = col;
    }
    setRow(row) {
        this.row = row;
    }
    setLevel(level) {
        this.level = level;
    }
    setIsEmpty(blank) {
        this.isEmpty = blank;
    }
    setCollision(collision) {
        this.collision = collision;
    }
    setOrig(orig) {
        this.orig = orig;
    }
}
