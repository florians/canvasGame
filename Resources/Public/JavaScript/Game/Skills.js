class Skills{
    constructor(){
        this.skills = [];
    }
    set(result) {
        _game.loader.reset();
        _game.loader.addMax(result.length);
        _game.loader.addText('Loading skills...');
        for (let i = 0; i < result.length; i++) {
            this.skills[result[i].uid] = this.add(result[i]);
        }
        return this;
    }
    add(result){
        return new Skill(result);
    }
    get(id) {
        return this.skills[id];
    }
    load(game) {
        game.loader.add('data', 'skills', {
            type: 'getAllSkills'
        });
    }
    // garbage collection
    // remove(id){
    // }
}
