class Tiles extends AbstractSquares {
    constructor(parent) {
        super(parent);
    }
    /************************
     ***** Add Tiles *******
     ************************/
    add(data, row, col, rowY, colX, h, w) {
        this.addToArray(row, col);
        this.tiles[row][col] = new Tile(this.parent, this.id(data));
        this.setTileInfo(data, row, col, rowY, colX, h, w);
    }
}
