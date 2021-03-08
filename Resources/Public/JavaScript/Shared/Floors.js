class Floors {
    constructor(parent) {
        this.parent = parent;
        this.floors = [];
        this.floorLevel = 2;
        this.counter = 0;
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
            if (!this.floors[result.level]) {
                this.floors[result.level] = this.add(result);
            }
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
        document.body.classList.remove('loading-done');
        this.parent.stop();
        if (!this.get(this.floorLevel)) {
            this.counter = 0;
            this.load(this.floorLevel);
        } else {
            this.getCurrent().resetStart();
            this.parent.init();
        }
    }
    /************************
     **** Canvas changes ****
     ************************/
    draw() {
        if (this.getCurrent()) {
            this.getCurrent().draw();
        }
    }
    resize() {
        if (this.getCurrent()) {
            this.getCurrent().resize();
        }
    }

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

        $('.portal-to').html('<option></option>');
        for (let i = 0; i < result.length; i++) {
            $('.portal-to').append('<option value="' + result[i].level + '">Level ' + result[i].level + '</option>');
        }
    }
}
