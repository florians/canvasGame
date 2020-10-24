class Tiles {
    constructor(parent, result) {
        this.parent = parent;
        this.tiles = [];
    }
    /************************
     ******** Getter ********
     ************************/
    get(row, col) {
        return this.tiles[row][col];
    }
    /************************
     ******** Setter ********
     ************************/
    add(data, row, col, rowY, colX) {

        let id, level;
        if (Array.isArray(data)) {
            id = data[0];
            level = data[1];
        } else {
            id = data;
        }
        if (!this.tiles[row]) {
            this.tiles[row] = [];
        }
        if (!this.tiles[row][col]) {
            this.tiles[row][col] = [];
        }
        this.tiles[row][col] = new Tile(this.parent, id);
        this.tiles[row][col].setX(colX);
        this.tiles[row][col].setY(rowY);
        this.tiles[row][col].setCol(col);
        this.tiles[row][col].setRow(row);
        if (level) {
            this.tiles[row][col].setLevel(level);
        }
    }
    setOrig(orig, row, col) {
        this.tiles[row][col].setOrig(orig);
    }
    /************************
     **** clear tiles *******
     ************************/
    clear() {
        this.tiles = [];
    }
}
