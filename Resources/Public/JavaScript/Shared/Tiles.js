class Tiles {
    constructor(parent, result) {
        this.parent = parent;
        this.tiles = [];
    }
    /************************
     ***** Loader init ******
     ************************/
    // init(result) {
    //     for (let i = 0; i < result.length; i++) {
    //         this.tiles[result[i].uid] = this.add(result[i]);
    //     }
    //     return this;
    // }
    /************************
     ******** Getter ********
     ************************/
    get(row, col) {
        return this.tiles[row][col];
    }
    /************************
     ******** Setter ********
     ************************/
    add(uid, row, col, rowY, colX) {
        if (!this.tiles[row]) {
            this.tiles[row] = [];
        }
        if (!this.tiles[row][col]) {
            this.tiles[row][col] = [];
        }
        this.tiles[row][col] = new Tile(this.parent, uid);
        this.tiles[row][col].setX(colX);
        this.tiles[row][col].setY(rowY);
        this.tiles[row][col].setCol(col);
        this.tiles[row][col].setRow(row);
        this.tiles[row][col].level = uid.level;
    }
}
