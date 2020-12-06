class Actions {
    constructor(target) {
        this.target = target;
        this.actions = [];
    }
    add(skill) {
        // skill cost > remove mana
        this.actions.push(new Action(this.target, skill));
    }
    del(index) {
        this.actions.splice(index, 1);
    }
    trigger(skill) {
        let triggerSkill = new Action(this.target, skill);
        triggerSkill.use();
        // hot
        if (skill.type == 2) {
            this.actions.push(triggerSkill);
        }
    }
    use() {
        for (let i = 0; i < this.actions.length; i++) {
            this.actions[i].use();
            this.del(i);
        }
    }
}
