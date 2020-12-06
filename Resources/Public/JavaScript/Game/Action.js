class Action {
    constructor(target, skill) {
        this.target = target;
        this.turns = parseInt(skill.turns);
        this.type = parseInt(skill.type);
        this.value = parseInt(skill.value);
    }
    use() {
        if (this.type == 2 || this.type == 3) {
            _game.ui.addStat(this.target, 'hp', this.value);
        } else {
            _game.ui.removeStat(this.target, 'hp', this.value);
        }
    }
}
