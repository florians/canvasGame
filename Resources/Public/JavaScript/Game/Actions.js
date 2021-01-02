class Actions {
    constructor(target) {
        this.target = target;
        this.actions = [];
    }
    add(skill) {
        // skill cost > remove mana
        let newAction = null;
        if (skill instanceof Action) {
            newAction = skill;
        } else {
            newAction = new Action(this.target, skill);
        }
        if (!this.renewAction(newAction)) {
            this.actions.push(newAction);
        }
    }
    detach(index) {
        this.actions.splice(index, 1);
    }
    trigger(skill) {
        let triggerSkill = new Action(this.target, skill);
        triggerSkill.use();
        // hot
        if (skill.type == 2) {
            if (!this.renewAction(triggerSkill)) {
                this.actions.push(triggerSkill);
            }
        }
    }
    // renews dot / hot actions
    renewAction(action) {
        for (let i = 0; i < this.actions.length; i++) {
            if (this.actions[i].type == action.skill.type) {
                this.actions[i] = action;
                return true;
            }
        }
        return false;
    }
    use() {
        for (let i = 0; i < this.actions.length; i++) {
            this.actions[i].use();
            this.actions[i].turns--;
            if (this.actions[i].turns <= 0) {
                this.detach(i);
            }
        }
    }
}
