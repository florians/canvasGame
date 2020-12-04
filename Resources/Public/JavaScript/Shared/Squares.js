class Squares extends Tiles{
    constructor(parent) {
        super(parent);
    }
    /************************
     ***** Add Square *******
     ************************/
    add(data, row, col, rowY, colX) {
        super.addToArray(row, col);
        this.tiles[row][col] = new Square(this.parent, super.id(data));
        super.setTileInfo(data, row, col, rowY, colX);
    }
}
