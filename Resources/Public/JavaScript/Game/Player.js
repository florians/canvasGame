class Player {
    constructor(player) {
        this.w = 50;
        this.h = 50
        this.offsetTop = Math.round(this.h / 2);
        this.offsetBottom = Math.round(this.h / 2);;
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
    }
    set(result) {
        this.setUid(result.uid);
        this.setName(result.name);
        this.setLevel(result.level);
        this.setStats(result.stats);
        this.setStat('hp.current', this.getStat('hp.max'));
        this.setStat('es.current', 0);
    }
    setUid(uid) {
        this.uid = parseInt(uid);
    }
    setName(name) {
        this.name = name;
    }
    getName() {
        return this.name
    }
    setLevel(level) {
        this.level = parseInt(level);
    }
    getLevel() {
        return this.level
    }
    setStats(stats) {
        this.stats = JSON.parse(stats);;
    }
    getStats() {
        return this.stats
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
    getStat(stat) {
        if (stat.includes('.')) {
            let splitStat = stat.split('.');
            return this.stats[splitStat[0]][splitStat[1]];
        } else {
            return this.stats[stat];
        }
    }
    addStat(stat, val = 1) {
        this.setStat(stat, val, '+');
    }
    removeStat(stat, val = 1) {
        this.setStat(stat, val, '-');
    }

    load(game, playerName) {
        game.loader.add('data', 'player', {
            type: 'getPlayer',
            name: playerName
        });
    }
    loadSkills(game, playerName) {
        game.loader.add('data', 'playerSkills', {
            type: 'getPlayerSkills',
            name: playerName
        });
    }
    addSkills(game,result){
        for (let i = 0; i < result.length; i++) {
            this.skills.push(game._skills.get(result[i]['skills_uid']));
        }
    }
    // save player tp DB
    savePlayer() {
        _game.loader.add('data', '', {
            type: 'savePlayer',
            name: this.name,
            level: this.level,
            stats: JSON.stringify(this.stats)
        });
    }
    draw() {
        // player stuff
        _game.ui.drawStat(this.stats.hp, 0, 0, 20, 'rgb(255,0,0)');
        if (this.stats.es.current > 0) {
            _game.ui.drawStat(this.stats.es, 0, 10, 10, 'rgb(0,0,255)');
        }
        if (this.stats.exp.current > 0) {
            _game.ui.drawStat(this.stats.exp, 0, 20, 5, 'rgb(0,255,0)');
        }
        if (this.items) {
            _game.ui.drawItem(this.items, 0, 25, 50, 50);
        }
        if (_game.battle) {
            _game.ui.drawSkills(this.skills, 5, (_ctxUi.canvas.height / 2) + 5, 150, 30);
        }
        _game.ui.repaint = false;
    }
    resize() {
        //this.resize = function() {
        this.x = Math.floor(_ctxUi.canvas.width / 2 - this.w / 2);
        this.y = Math.floor(_ctxUi.canvas.height / 2 - this.h / 2);
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
    levelUp() {
        this.setLevel(this.getLevel() + 1);
        this.addStat('hp.max');
        this.setStat('hp.current', this.getStat('hp.max'));
        this.addStat('exp.max');
        this.setStat('exp.current', 0);
    }
}
