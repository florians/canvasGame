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
    setStat(stat, val, dir = '') {
        if (stat.includes('.')) {
            let splitStat = stat.split('.');
            if (dir == '+') {
                this.stats[splitStat[0]][splitStat[1]] += val;
            } else if (dir == '-') {
                this.stats[splitStat[0]][splitStat[1]] += val;
            } else {
                this.stats[splitStat[0]][splitStat[1]] = val;
            }
        } else {
            if (dir == '+') {
                this.stats[stat] += val;
            } else if (dir == '-') {
                this.stats[stat] -= val;
            } else {
                this.stats[stat] = val;
            }
        }
    }
    setStats(stats) {
        this.stats = JSON.parse(stats);;
    }
}
