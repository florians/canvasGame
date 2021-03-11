/**
 * Includes an Action of Player/Enemy
 */
class Action {
    /**
     * @param {object} target some target
     * @param {object} skill some skill
     */
    constructor(target, skill) {
        this.target = target;
        this.skill = skill;
        this.turns = parseInt(skill.turns);
        this.type = parseInt(skill.type);
        this.value = parseInt(skill.value);
    }
    use() {
        this.skill.addExp();
        if (_game.battle) {
            if (this.type == 2 || this.type == 3) {
                this.target.stats.addStat('hp', this.value);
            } else {
                this.target.stats.removeHp(this.value);
                _game.battle.challengers.deathCheck(this.target);
            }
        }
    }
}
