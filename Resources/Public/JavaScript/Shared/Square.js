class Square extends Tile {
    constructor(parent, id) {
        super(parent);
        super.setTile(id);
    }
    hit(type) {
        if (this.isEmpty == false) {
            if (type == 'portal') {
                _game.keyboardHandler.reset();
                _game._player.savePlayer();
                _game._floors.newFloor(this.level);
                _game.loader.run();
            }
        }
    }
}
