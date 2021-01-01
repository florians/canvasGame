class Action {
    constructor(target, skill) {
        this.target = target;
        this.skill = skill;
        this.turns = parseInt(skill.turns);
        this.type = parseInt(skill.type);
        this.value = parseInt(skill.value);
    }
    use() {
        this.addExp();
        if (this.type == 2 || this.type == 3) {
            _game.ui.addStat(this.target, 'hp', this.value);
        } else {
            _game.ui.removeStat(this.target, 'hp', this.value);
        }
    }
    addExp() {
        this.skill.exp.current++;
        if (this.skill.exp.current >= this.skill.exp.max) {
            this.skill.exp.max = this.skill.exp.max + 10;
            this.skill.exp.current = 0;
            this.skill.level++;
        }
    }
}
