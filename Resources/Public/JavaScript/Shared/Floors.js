class Floors {
    constructor(parent) {
        this.parent = parent;
        this.floors = [];
        this.floorLevel = 1;
    }
    /************************
     **** Setup Loader ******
     ************************/
    load(level) {
        this.parent.loader.add('data', 'floors', {
            type: 'getFloor',
            level: level
        });
        this.floorLevel = level;
    }
    loadAll() {
        this.parent.loader.add('data', 'allFloors', {
            type: 'getAllFloors'
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
        return new Floor(this.parent, result);
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
        this.parent.stopGame = true;
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



    /************************
     ****** Generator *******
     ************************/
    fillFloorSelect(result) {
        $('.floorSelect').html('<option></option>');
        for (let i = 0; i < result.length; i++) {
            $('.floorSelect').append('<option value="' + result[i].level + '">Level ' + result[i].level + '</option>');
        }
        $('select.floorSelect').val(this.floorLevel);
        $('.controls input.level').val(this.floorLevel);
    }
}
