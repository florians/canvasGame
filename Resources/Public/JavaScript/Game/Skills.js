class Skills {
    constructor(parent) {
        this.parent = parent;
        this.skills = [];
    }
    /************************
     **** Setup Loader ******
     ************************/
    load() {
        this.parent.loader.add('data', 'skills', {
            type: 'getAllSkills'
        });
    }
    /************************
     ***** Loader init ******
     ************************/
    init(result) {
        this.parent.loader.reset();
        this.parent.loader.addMax(result.length);
        this.parent.loader.addText('Loading skills...');
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
}
