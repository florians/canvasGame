class UserInterface {
    constructor(parent) {
        this.parent = parent;
        this.parent.mousehandler.add('body', 'click', 'useSkill', this);
        this.repaint = false;
    }

    draw(callback) {
        _ctxUi.save();
        _ctxUi.setTransform(1, 0, 0, 1, 0, 0);
        _ctxUi.clearRect(0, 0, _ctxUi.canvas.width, _ctxUi.canvas.height);
        // draw player
        if (this.parent._player) {
            this.parent._player.drawPlayer();
        }
        // battle background
        if (this.parent.battle) {
            this.parent.battle.draw();
        } else {
            this.parent._player.draw();
        }
        _ctxUi.restore();
    }
    addStat(target, stat, val = 1) {
        this.repaint = true;
        if (target.stats[stat].max) {
            if (target.stats[stat].current < target.stats[stat].max) {
                target.stats[stat].current += val;
                // reset to max if heal to big
                if (target.stats[stat].current > target.stats[stat].max) {
                    target.stats[stat].current = target.stats[stat].max;
                }
                if (stat == 'exp' && target.stats[stat].max == target.stats[stat].current) {
                    target.levelUp();
                }
                return true;
            }
        } else {
            target.stats[stat].current++;
            return true;
        }
        return false;
    }
    removeStat(target, stat, val = 1) {
        this.repaint = true;
        let switchedStat = false;
        let current = target.stats[stat].current;
        if (stat == 'hp' && target.stats['es'].current > 0) {
            current = target.stats['es'].current;
            switchedStat = true;
        }
        let rest = val - current;
        if (current > 0) {
            current -= val;
            if (current <= 0) {
                current = 0;
            }
            if (switchedStat) {
                target.stats['es'].current = current;
            } else {
                target.stats[stat].current = current;
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
        let item = this.parent._assets.get(uid);
        target.items[type] = item;
    }
    removeItem(target, type, uid) {
        this.repaint = true;
        delete target.items[type];
    }
    resetStat(target, stat) {
        this.repaint = true;
        target.stats[stat].current = target.stats[stat].max || 0;
    }
    deathCheck(target) {
        if (target.stats.hp.current <= 0) {
            if (target instanceof Player) {
                this.resetStat(target, 'hp');
                this.resetStat(target, 'es');
                this.parent._floors.newFloor(this.parent._floors.floorLevel, true);
            } else {
                this.parent.stopGame = false;
                this.addStat(this.parent.battle.currentTarget(), 'exp');
                this.parent.battle.challengers._enemy.remove();
                this.parent.animate();
            }
            document.body.classList.remove('battle');
            delete this.parent.battle;
            this.draw();
        }
    }
    drawSkills(skills, x, y, w, h, i) {
        for (let i = 0; i < skills.length; i++) {
            skills[i].draw(x, y, w, h, i);
        }
    }

    drawItem(items, x, y, w, h) {
        let count = 0;
        _ctxUi.save();
        // $.each(Object.keys(items), function(index, type) {
        //     if (type) {
        //         _ctxUi.fillStyle = 'rgb(255,255,255)';
        //         _ctxUi.globalAlpha = 0.8;
        //         _ctxUi.fillRect(x + (w * count), y, w, h);
        //         _ctxUi.globalAlpha = 1;
        //         _ctxUi.drawImage(items[type].image, x + (w * count), 25, w, h);
        //         count++;
        //     }
        // });
        _ctxUi.restore();
    }
    /************************
     ***** Use Skill ********
     ************************/
    useSkill(event) {
        if (document.body.classList.contains('battle')) {
            var mPos = {
                x: event.clientX,
                y: event.clientY
            };
            if (this.parent.battle.turn == '_player') {
                for (var i = 0; i < this.parent._player.skills.length; i++) {
                    if (this.isColliding(mPos, this.parent._player.skills[i])) {
                        this.parent.battle.addAction(this.parent._player.skills[i]);
                        if (this.parent.battle) {
                            this.parent.battle.changeTarget();
                            this.parent.ui.draw();
                            if (this.parent.battle && this.parent.battle.currentTarget().stats.hp.current > 0) {
                                setTimeout(() => {
                                    this.parent.battle.current().attack(this.parent.battle.currentTarget());
                                    if (this.parent.battle) {
                                        this.parent.battle.changeTarget();
                                    }
                                }, 100);
                            }
                        }
                    }
                }
            }
        }
    }
    isColliding(obj1, obj2) {
        if (obj1.x > obj2.x && obj1.x < obj2.x + obj2.w && obj1.y > obj2.y && obj1.y < obj2.y + obj2.h) {
            return true;
        } else {
            return false;
        }
    }
    resize() {
        if (this.parent.battle) {
            this.parent.battle.resize();
        }
    }
}
