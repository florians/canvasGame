class AbstractCharacter {
    constructor() {
    }
    /************************
     **** Skill handler *****
     ************************/
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
    /************************
     ******** Setter ********
     ************************/
    setUid(uid) {
        this.uid = parseInt(uid);
    }
    setLevel(level) {
        this.level = parseInt(level);
    }
}
