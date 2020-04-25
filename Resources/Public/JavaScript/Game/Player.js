function Player(ctx) {
    this.ctx = ctx;
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
    this.stats = {};

    // get player from DB
    this.getPlayer = function(name) {
        ajaxHandler(getPlayer,
            data = {
                type: 'getPlayer',
                name: name
            });
    }
    // save player tp DB
    this.savePlayer = function() {
        ajaxHandler('',
            data = {
                type: 'savePlayer',
                name: this.name,
                level: this.level,
                stats: JSON.stringify(this.stats)
            });
    }
    this.draw = function() {
        // player stuff
        game.ui.drawStat(this.stats.hp, 0, 0, 20, 'rgb(255,0,0)');
        if (this.stats.es.current > 0) {
            game.ui.drawStat(this.stats.es, 0, 10, 10, 'rgb(0,0,255)');
        }
        if (this.stats.exp.current > 0) {
            game.ui.drawStat(this.stats.exp, 0, 20, 5, 'rgb(0,255,0)');
        }
        if (this.items) {
            game.ui.drawItem(this.items, 0, 25, 50, 50);
        }
        if (game.battle) {
            game.ui.drawSkills(this.skills, 5, (this.ctx.canvas.height / 2) + 5, 150, 30);
        }
        game.ui.repaint = false;
    }
    this.resize = function() {
        this.x = Math.floor(this.ctx.canvas.width / 2 - this.w / 2);
        this.y = Math.floor(this.ctx.canvas.height / 2 - this.h / 2);
    }
    this.drawPlayer = function() {
        // save already rendered ctx to only translate player
        this.ctx.save();
        this.ctx.translate(this.x + this.w / 2, this.y + this.h / 2);
        this.ctx.arc(0, 0, this.w / 2, 0, Math.PI * 2, true);
        this.ctx.fillStyle = 'rgb(255,0,0)';
        this.ctx.fill();
        // restore all saved ctx with new object
        this.ctx.restore();
    }
    this.deathCheck = function() {
        if (this.stats.hp.current == 0) {
            this.resetStat('hp');
            this.resetStat('es');
            game.newFloor(floorLevel, true);
        }
    }
    this.levelUp = function() {
        this.level += 1;
        this.stats.hp.max += 1;
        this.stats.hp.current = this.stats.hp.max;
        this.stats.exp.max += 1;
        this.stats.exp.current = 0;
    }
    this.addStat = function(stat) {
        game.ui.repaint = true;
        if (this.stats[stat].max) {
            if (this.stats[stat].current < this.stats[stat].max) {
                this.stats[stat].current++;
                if (stat == 'exp' && this.stats[stat].max == this.stats[stat].current) {
                    this.levelUp();
                }
                return true;
            }
        } else {
            this.stats[stat].current++;
            return true;
        }
        return false;
    }
    this.removeStat = function(stat) {
        game.ui.repaint = true;
        if (this.stats[stat].current > 0) {
            this.stats[stat].current--;
            this.deathCheck();
            return true;
        }
        return false;
    }
    this.addItem = function(type, uid) {
        game.ui.repaint = true;
        var item = allTiles[uid];
        this.items[type] = item;
    }
    this.removeItem = function(type, uid) {
        game.ui.repaint = true;
        delete this.items[type];
    }
    this.resetStat = function(stat) {
        game.ui.repaint = true;
        this.stats[stat].current = this.stats[stat].max;
    }
}

function getPlayer(result, params = '') {
    // no db result = default player
    if (result == null) {
        game.player.name = params.name;
        game.player.level = 1;
        game.player.stats = {
            hp: {
                max: 4,
                current: 4
            },
            es: {
                current: 0
            },
            mp: {
                max: 4,
                current: 1
            },
            exp: {
                max: 3,
                current: 0
            }
        }
    } else {
        game.player.name = result.name;
        game.player.level = parseInt(result.level);
        game.player.stats = JSON.parse(result.stats);
        game.player.stats.hp.current = game.player.stats.hp.max;
        game.player.stats.es.current = 0;
    }
    ajaxHandler(getSkills,
        data = {
            type: 'getSkills',
            name: result.name
        });
}

function getSkills(result, params = '') {
    game.player.skills = result;
    // start the game when player is loaded / set
    game.animate();
}
