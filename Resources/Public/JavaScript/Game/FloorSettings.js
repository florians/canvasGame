class FloorSettings {
    constructor() {
        this.settings = [];
    }
    get(level) {
        if (this.settings[level]) {
            return this.settings[level];
        }
        return false;
    }
    getAll() {
        return this.settings;
    }
    add(result) {
        this.settings[result.level] = {
            level: result.level,
            startX: result.startX,
            startY: result.startY,
            endLink: result.endLink,
            height: result.height,
            width: result.width,
            tiles: JSON.parse(result.tile_json)
        }
    }
    load(game, level) {
        game.loader.add('data', 'floorSettings', {
            type: 'getFloor',
            level: level
        });
    }
    // garbage collection
    // remove(){
    // }
}
