class Tile {
    constructor(parent, result) {
        this.parent = parent;
        this.x = 0;
        this.y = 0;
        this.col = 0;
        this.row = 0;
        this.isBlank = false;
        this.asset = [];
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
    /************************
     ******** Setter ********
     ************************/
    setTile(id) {
        id = (id.uid) ? id.uid : id;
        if (this.parent._assets.get(id)) {
            this.isBlank = false;
            this.asset = this.parent._assets.get(id);
        } else {
            this.isBlank = true;
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
}
