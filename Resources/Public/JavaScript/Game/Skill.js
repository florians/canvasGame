class Skill {
    constructor(result, playerSkill = null) {
        this.uid = parseInt(result.uid);
        this.cost = parseInt(result.cost);
        this.name = result.name;
        this.text = result.text;
        this.turns = parseInt(result.turns);
        this.type = parseInt(result.type);
        this.value = parseInt(result.value);
        this.exp = {
            current: 0,
            max: 30
        }
        if (playerSkill) {
            this.level = parseInt(playerSkill.level);
            if (playerSkill.exp) {
                this.exp = {
                    current: parseInt(playerSkill.exp.current),
                    max: parseInt(playerSkill.exp.max)
                }
            }
            if (playerSkill.player_uid) {
                this.player_uid = parseInt(playerSkill.player_uid);
            }
        }
    }
    draw() {
        _ctxUi.fillStyle = this.color;
        _ctxUi.fillRect(this.x, this.y, this.w, this.h);
    }
    drawText() {
        _ctxUi.font = this.font;
        _ctxUi.fillStyle = this.fontColor;
        _ctxUi.fillText(this.name, this.x + 5, this.y + 30);
    }
    db() {
        let skill = {
            skills_uid: this.uid,
            level: this.level,
            exp: this.exp
        }
        if (this.player_uid) {
            skill.player_uid = this.player_uid;
        }
        return skill;
    }
}
