class Items extends Tiles {
    constructor(parent) {
        super(parent);
    }
    /************************
     ***** Add Item ********
     ************************/
    add(data, row, col, rowY, colX) {
        super.addToArray(row, col);
        this.tiles[row][col] = new Item(this.parent, super.id(data));
        super.setTileInfo(data, row, col, rowY, colX);
    }
}
