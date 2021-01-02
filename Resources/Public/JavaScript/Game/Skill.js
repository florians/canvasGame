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
        this.level = 1;
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
        } else {
            this.new = true;
        }
    }
    draw() {
        _ctxUi.fillStyle = this.color;
        _ctxUi.fillRect(this.x, this.y, this.w, this.h);
        // exp bar
        _ctxUi.fillStyle = '#ff0';
        let w = Math.floor(this.w / this.exp.max * this.exp.current);
        _ctxUi.fillRect(this.x, this.y + this.h - 2, w, 2);
    }
    drawText() {
        _ctxUi.font = this.font;
        _ctxUi.fillStyle = this.fontColor;
        _ctxUi.fillText(this.name, this.x + 5, this.y + 30);
    }
    addExp(){
        this.exp.current++;
        if (this.exp.current >= this.exp.max) {
            this.levelUp();
        }
    }
    levelUp(){
        this.exp.max = this.exp.max + 10;
        this.exp.current = 0;
        this.level++;
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
