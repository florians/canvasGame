/**
 * Abstact Character, defines Player and Enemy> not yet done
 * @class
 */
class AbstractCharacter {
    constructor() {
        this.name = '';
        this.stats = {};
        this.skills = [];
        this.bars = new Bars(this);
    }
    /**
     * @param  {array} result
     * @return {array} skillContainer contains up/downscaled skill
     */
    scaleSkill(result) {
        let skillContainer = {};
        let skill = _game._skills.get(result['skills_uid']);
        return skillContainer = {
            cost: skill.cost,
            level: result.level,
            name: skill.name,
            text: skill.text,
            turns: skill.turns,
            type: skill.type,
            uid: skill.uid,
            value: skill.value,
            exp: result.exp
        }
    }
    /**
     * @param {string} uid set the uid > parsed to int
     */
    setUid(uid) {
        this.uid = parseInt(uid);
    }
    /**
     * @param {string} level set level > parsed to int
     */
    setLevel(level) {
        this.level = parseInt(level);
    }
}
