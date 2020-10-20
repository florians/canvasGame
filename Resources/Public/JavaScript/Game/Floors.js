class Floors {
    constructor(game) {
        this.game = game;
        this.floors = [];
        this.floorLevel = floorLevel || 1;
    }
    /************************
     **** Setup Loader ******
     ************************/
    load(level) {
        this.game.loader.add('data', 'floors', {
            type: 'getFloor',
            level: level
        });
    }
    /************************
     ***** Loader init ******
     ************************/
    init(result) {
        if (result) {
            this.floors[result.level] = this.add(result);
        } else {
            this.fallback();
        }
        return this;
    }
    /************************
     ***** Add Floor ********
     ************************/
    add(result) {
        return new Floor(result);
    }
    /************************
     ****** Fallback ********
     ************************/
    fallback() {
        this.floorLevel = 1;
        this.getCurrent().resetStart();
    }
    /************************
     ******** Getter ********
     ************************/
    get(id) {
        return this.floors[id];
    }
    getCurrent() {
        return this.floors[this.floorLevel];
    }
    getAll() {
        return this.floors;
    }
    /************************
     ****** New Floor *******
     ************************/
    newFloor(newFloor) {
        this.floorLevel = newFloor;
        $('body').removeClass('loading-done');
        this.game.stopGame = true;
        if (!this.get(this.floorLevel)) {
            this.load(this.floorLevel);
        } else {
            this.getCurrent().resetStart();
        }
    }
    /************************
     **** Canvas changes ****
     ************************/
    draw() {
        this.getCurrent().draw();
    }
    resize() {
        this.getCurrent().resize();
    }
    // garbage collection
    // remove(id){
    // }
}
