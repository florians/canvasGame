class Enemies {
    constructor() {
        this.enemies = [];
    }
    /************************
     ******** Getter ********
     ************************/
    get(id) {
        return this.enemies[id];
    }
    /************************
     ***** Add Enemy ********
     ************************/
    add(result) {
        return new Enemy(result);
    }
    /************************
     ***** Remove Enemy *****
     ************************/
    remove(id) {
        this.enemies.splice(id, 1);
    }
}
