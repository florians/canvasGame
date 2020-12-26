class Interactions extends AbstractSquares {
    constructor(parent) {
        super(parent);
    }
    /************************
     ***** Add Enemy ********
     ************************/
    add(data, row, col, rowY, colX) {
        this.addToArray(row, col);
        this.tiles[row][col] = new Interaction(this.parent, this.id(data));
        this.setTileInfo(data, row, col, rowY, colX);
    }
}
