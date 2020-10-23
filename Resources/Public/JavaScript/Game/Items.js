class Items {
    constructor() {
        this.skills = [];
    }
    /************************
     ***** Loader init ******
     ************************/
    init(result) {
        this.game.loader.reset();
        this.game.loader.addMax(result.length);
        this.game.loader.addText('Loading skills...');
        for (let i = 0; i < result.length; i++) {
            this.skills[result[i].uid] = this.add(result[i]);
        }
        return this;
    }
    /************************
     ******** Getter ********
     ************************/
    get(id) {
        return this.skills[id];
    }
    /************************
     ***** Add Skill ********
     ************************/
    add(result) {
        return new Skill(result);
    }

    // garbage collection
    // remove(id){
    // }
}
