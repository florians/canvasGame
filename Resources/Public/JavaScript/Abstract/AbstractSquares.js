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
    setTileInfo(data, row, col, rowY, colX, h, w) {
        this.tiles[row][col].x = colX;
        this.tiles[row][col].y = rowY;
        this.tiles[row][col].col = col;
        this.tiles[row][col].row = row;
        this.tiles[row][col].h = h;
        this.tiles[row][col].w = w;
        if (this.level(data)) {
            this.tiles[row][col].level = this.level(data);
        }
        if (this.req(data)) {
            this.tiles[row][col].req = this.req(data);
            this.tiles[row][col].setRequirements();
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
        if (Array.isArray(data) && !data[1].includes('*')) {
            return data[1];
        } else {
            return false;
        }
    }
    req(data) {
        if (Array.isArray(data) && data[1].includes('*')) {
            return data[1];
        } else {
            return '';
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
