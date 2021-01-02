class Skills {
    constructor() {
        this.skills = [];
    }
    /************************
     **** Setup Loader ******
     ************************/
    load() {
        _game.loader.add('data', 'skills', {
            type: 'getAllSkills'
        });
    }
    /************************
     ***** Loader init ******
     ************************/
    init(result) {
        _game.loader.reset();
        _game.loader.addMax(result.length);
        _game.loader.addText('Loading skills...');
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
    getAll(){
        return this.skills;
    }
    /************************
     ***** Add Skill ********
     ************************/
    add(result) {
        return new Skill(result);
    }
}
