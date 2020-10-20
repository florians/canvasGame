class Floors {
    constructor() {
        this.floors = [];
    }
    add(result) {
        if (!this.floors[result.level]) {
            this.floors[result.level] = new Floor(result);
        } else {
            // fallback
            _game.floorLevel = 1;
            this.get(_game.floorLevel).resetStart();
        }
        return this;
    }
    get(id) {
        return this.floors[id];
    }
    getAll() {
        return this.floors;
    }
    load(game, level) {
        game.loader.add('data', 'floors', {
            type: 'getFloor',
            level: level
        });
    }
    // garbage collection
    // remove(id){
    // }
}
