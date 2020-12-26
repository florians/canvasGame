class Collectibles extends AbstractSquares {
    constructor(parent) {
        super(parent);
    }
    /************************
     ***** Add Item ********
     ************************/
    add(data, row, col, rowY, colX) {
        this.addToArray(row, col);
        this.tiles[row][col] = new Collectible(this.parent, this.id(data));
        this.setTileInfo(data, row, col, rowY, colX);
    }
}
