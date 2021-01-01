class AbstractSquares {
    constructor(parent) {
        this.parent = parent;
        this.tiles = [];
        this.startIsSet = false;
    }
    /************************
     ******** Getter ********
     ************************/
    get(row, col) {
        return this.tiles[row][col];
    }
    getCount() {
        return this.tiles.length;
    }
    /************************
     ******** Setter ********
     ************************/
    setOrig(orig, row, col) {
        this.tiles[row][col].setOrig(orig);
    }
    /************************
     ***** Add tiles ********
     ************************/
    addToArray(row, col) {
        if (!this.tiles[row]) {
            this.tiles[row] = [];
        }
        if (!this.tiles[row][col]) {
            this.tiles[row][col] = [];
        }
    }
    setTileInfo(data, row, col, rowY, colX) {
        this.tiles[row][col].x = colX;
        this.tiles[row][col].y = rowY;
        this.tiles[row][col].col = col;
        this.tiles[row][col].row = row;
        if (this.level(data)) {
            this.tiles[row][col].level = this.level(data);
        }
        if (!this.tiles[row][col].isEmpty && this.tiles[row][col].asset.type == 'start') {
            this.startIsSet = true;
        }
    }
    id(data) {
        if (Array.isArray(data)) {
            return data[0];
        } else {
            return data;
        }
    }
    level(data) {
        if (Array.isArray(data)) {
            return data[1];
        } else {
            return false;
        }
    }
    /************************
     **** clear tiles *******
     ************************/
    clear() {
        this.tiles = [];
        this.startIsSet = false;
    }
}
