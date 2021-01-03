class Player extends AbstractCharacter {
    constructor() {
        super();
        this.w = 50;
        this.h = 50;
        this.offsetTop = Math.round(this.h / 2);
        this.offsetBottom = Math.round(this.h / 2);
        this.offsetLeft = Math.round(this.w / 2);
        this.offsetRight = Math.round(this.w / 2);
        this.x = 0;
        this.y = 0;
        this.items = [];
        this.skills = [];
        this.uid = 0;
        this.name = '';
        this.level = 0;
        this.stats = {};
        this.bars = new Bars(this);
        // values type, x, y, h, w, color
        // y = [0, 10] 0% + 10
        this.bars.add('hp', 0, 0, 20, 50, 'rgb(255,0,0)');
        this.bars.add('es', 0, [0, 10], 10, 50, 'rgb(0,0,255)');
        this.bars.add('exp', 0, [0, 25], 10, 50, 'rgb(0,255,0)');
    }
    /************************
     **** Setup Loader ******
     ************************/
    load(playerName) {
        _game.loader.add('data', 'player', {
            type: 'getPlayer',
            name: playerName
        });
    }
    loadSkills(playerName) {
        _game.loader.add('data', 'playerSkills', {
            type: 'getPlayerSkills',
            name: playerName
        });
    }
    savePlayer() {
        let skillArray = [];
        for (var i = 0; i < this.skills.length; i++) {
            if (!this.skills[i].new) {
                this.skills[i].player_uid = this.uid;
            }
            skillArray.push(this.skills[i].db());
            this.skills[i].new = false;
        }
        _game.loader.add('data', 'playerUid', {
            type: 'savePlayer',
            name: this.name,
            level: this.level,
            stats: JSON.stringify(this.stats),
            skills: JSON.stringify(skillArray)
        });
        _game.loader.run();
    }
    /************************
     ***** Loader init ******
     ************************/
    init(result) {
        this.stats = new StatsHandler(JSON.parse(result.stats));
        this.setUid(result.uid);
        this.setLevel(result.level);
        this.name = result.name;
        this.stats.reset();
    }
    initSkills(result) {
        for (let i = 0; i < result.length; i++) {
            let playerSkill = {
                level: result[i]['level'] || 1,
            }
            if (result[i]['player_uid']) {
                playerSkill.player_uid = result[i]['player_uid'];
            }
            if (result[i]['exp']) {
                let exp = result[i]['exp'].split(',');
                playerSkill.exp = {
                    current: exp[0],
                    max: exp[1]
                }
            }
            this.skills.push(new Skill(_game._skills.get(result[i]['skills_uid']), playerSkill));
        }
    }
    addSkill(skill_uid) {
        this.skills.push(new Skill(_game._skills.get(skill_uid)));
    }
    /************************
     **** Canvas changes ****
     ************************/
    draw() {
        this.bars.draw();
    }
    resize() {
        this.x = Math.floor(_ctxUi.canvas.width / 2 - this.w / 2);
        this.y = Math.floor(_ctxUi.canvas.height / 2 - this.h / 2);
        this.bars.resize();
    }
    drawPlayer() {
        // save already rendered ctx to only translate player
        _ctxUi.save();
        _ctxUi.translate(this.x + this.w / 2, this.y + this.h / 2);
        _ctxUi.arc(0, 0, this.w / 2, 0, Math.PI * 2, true);
        _ctxUi.fillStyle = 'rgb(255,0,0)';
        _ctxUi.fill();
        // restore all saved ctx with new object
        _ctxUi.restore();
    }
    /************************
     ******** Getter ********
     ************************/
    getStat(stat) {
        if (stat.includes('.')) {
            let splitStat = stat.split('.');
            return this.stats[splitStat[0]][splitStat[1]];
        } else {
            return this.stats[stat];
        }
    }
    /************************
     ***** Stat handling ****
     ************************/
    levelUp() {
        this.setLevel(this.level + 1);
        this.stats.hp.max++;
        this.stats.exp.max++;
        this.stats.exp.current = 0;
        this.stats.fill();

        // heal
        if (this.level == 2) {
            this.addSkill(3);
        }
        // hot
        if (this.level == 3) {
            this.addSkill(4);
        }
        // dot
        if (this.level == 4) {
            this.addSkill(5);
        }
    }
}
