class UserInterface {
    constructor() {
        _game.mousehandler.add('body', 'click', 'useSkill', this);
        this.repaint = false;

        // Skill Book
        this.skillBook = new Windows(this.generateSkillBook());

        _game.keyboardHandler.add(document, 'keydown', 'showSkillBook', [80], this);
        this.resize();
    }

    draw() {
        _ctxUi.save();
        _ctxUi.setTransform(1, 0, 0, 1, 0, 0);
        _ctxUi.clearRect(0, 0, _ctxUi.canvas.width, _ctxUi.canvas.height);

        // draw player
        if (_game._player) {
            _game._player.drawPlayer();
        }
        // battle background
        if (_game.battle) {
            _game.battle.draw();
        } else {
            _game._player.draw();
        }
        if (this.skillBook.isVisible || _game.battle) {
            this.skillBook.draw();
        }
        _ctxUi.restore();
        this.repaint = false;
    }
    /************************
     ****** Skillbook *******
     ************************/
    generateSkillBook() {
        let layers = [],
            background = null,
            skillGrid = null;

        // x,y,h,w in %
        background = new Window(0, 50, 51, 100);
        // % +- px
        skillGrid = new Grid([0, 10], [50, 10], [50, -20], [100, -20]);
        skillGrid.content = _game._player.skills;
        skillGrid.hasText = true;
        skillGrid.setGrid(5, 40, 150);

        layers.push(background, skillGrid);

        return layers;
    }
    showSkillBook(event) {
        if (!_game.battle) {
            this.skillBook.toggle();
        }
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
        let item = _game._assets.get(uid);
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
                _game._floors.newFloor(_game._floors.floorLevel, true);
            } else {
                this.addStat(_game.battle.currentTarget(), 'exp');
                _game.battle.challengers._enemy.remove();
                _game._player.savePlayer();
                _game.start();
            }
            delete _game.battle;
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
        if (document.body.classList.contains('suspended')) {
            var mPos = {
                x: event.clientX,
                y: event.clientY
            };
            if (_game.battle.turn == '_player') {
                for (var i = 0; i < _game._player.skills.length; i++) {
                    if (this.isColliding(mPos, _game._player.skills[i])) {
                        _game.battle.addAction(_game._player.skills[i]);
                        if (_game.battle) {
                            _game.battle.changeTarget();
                            _game.ui.draw();
                            if (_game.battle && _game.battle.currentTarget().stats.hp.current > 0) {
                                setTimeout(() => {
                                    _game.battle.current().attack(_game.battle.currentTarget());
                                    if (_game.battle) {
                                        _game.battle.changeTarget();
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
        this.repaint = true;
        if (_game.battle) {
            _game.battle.resize();
        }
        this.skillBook.resize();
    }
}
