class Ui{
    constructor(){
        this.repaint = false;
    }

    draw(callback) {
        _ctxUi.save();
        _ctxUi.setTransform(1, 0, 0, 1, 0, 0);
        _ctxUi.clearRect(0, 0, _ctxUi.canvas.width, _ctxUi.canvas.height);
        // draw player
        if (_game._player) {
            _game._player.drawPlayer();
        }
        // battle background
        if (_game.battle) {
            _game.battle.drawBackground();
            _game.battle.draw();
            _game.enemy.draw();
        }
        // palyer info
        if (_game._player) {
            _game._player.draw();
        }
        _ctxUi.restore();
    }
    addStat(target, stat, val = 1) {
        this.repaint = true;
        if (_game[target].stats[stat].max) {
            if (_game[target].stats[stat].current < _game[target].stats[stat].max) {
                _game[target].stats[stat].current += val;
                // reset to max if heal to big
                if (_game[target].stats[stat].current > _game[target].stats[stat].max) {
                    _game[target].stats[stat].current = _game[target].stats[stat].max;
                }
                if (stat == 'exp' && _game[target].stats[stat].max == _game[target].stats[stat].current) {
                    _game[target].levelUp();
                }
                return true;
            }
        } else {
            _game[target].stats[stat].current++;
            return true;
        }
        return false;
    }
    removeStat(target, stat, val = 1) {
        this.repaint = true;
        let switchedStat = false;
        let current = _game[target].stats[stat].current;
        if (stat == 'hp' && _game[target].stats['es'].current > 0) {
            current = _game[target].stats['es'].current;
            switchedStat = true;
        }
        let rest = val - current;
        if (current > 0) {
            current -= val;
            if (current <= 0) {
                current = 0;
            }
            if (switchedStat) {
                _game[target].stats['es'].current = current;
            } else {
                _game[target].stats[stat].current = current;
                this.deathCheck(target);
                return;
            }
            if (rest > 0) {
                this.removeStat(target, stat, rest);
            }
        }
    }
    addItem(target, type, uid) {
        this.repaint = true;
        let item = _game._tiles.get(uid);
        _game[target].items[type] = item;
    }
    removeItem(target, type, uid) {
        this.repaint = true;
        delete _game[target].items[type];
    }
    resetStat(target, stat) {
        this.repaint = true;
        _game[target].stats[stat].current = _game[target].stats[stat].max || 0;
    }
    deathCheck(target) {
        if (_game[target].stats.hp.current <= 0) {
            if (target == '_player') {
                this.resetStat(target, 'hp');
                this.resetStat(target, 'es');
                _game.newFloor(floorLevel, true);
            } else {

                _game.stopGame = false;
                this.addStat('_player', 'exp');
                _game.animate();
            }
            $('body.battle').removeClass('battle');
            delete _game.battle;
        }
    }
    drawSkills(skills, x, y, w, h) {
        for (let i = 0; i < skills.length; i++) {
            _ctxUi.fillStyle = 'rgb(0,255,255)';
            _ctxUi.fillRect(x, y + (h + 5) * i, w, h);
            skills[i].x = x;
            skills[i].y = y + (h + 5) * i;
            skills[i].w = w;
            skills[i].h = h;
            _ctxUi.font = "30px Arial";
            _ctxUi.fillStyle = 'rgb(0,0,0)';
            _ctxUi.fillText(skills[i].name, x, 25 + y + (h + 5) * i);
        }
    }

    drawItem(items, x, y, w, h) {
        let count = 0;
        _ctxUi.save();
        $.each(Object.keys(items), function(index, type) {
            if (type) {
                _ctxUi.fillStyle = 'rgb(255,255,255)';
                _ctxUi.globalAlpha = 0.8;
                _ctxUi.fillRect(x + (w * count), y, w, h);
                _ctxUi.globalAlpha = 1;
                _ctxUi.drawImage(items[type].getImage(), x + (w * count), 25, w, h);
                count++;
            }
        });
        _ctxUi.restore();
    }
    drawStat(stat, x, y, h, color) {
        let barSize = 0;
        let max = stat.max || stat.current;
        barSize = Math.floor(_ctxUi.canvas.width / 2) / max;
        _ctxUi.fillStyle = 'rgb(10,10,10)';
        _ctxUi.fillRect(x, y, Math.floor(_ctxUi.canvas.width / 2) - 2, h);
        for (let i = 0; i < max; i++) {
            if (stat.current >= i + 1) {
                _ctxUi.fillStyle = color;
                _ctxUi.fillRect(x + (barSize * i), y, barSize - 2, h);
            }
        }
    }
}
