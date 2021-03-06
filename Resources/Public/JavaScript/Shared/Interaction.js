class Interaction extends AbstractSquare {
    constructor(parent, id) {
        super(parent);
        this.set(id);
        this.name = "ENEMY";
        this.level = 1;
        this.stats = {};
        this.skills = [];
    }
    setStats() {
        this.level = this.parent._player.level;
        this.stats = {
            es: {
                current: this.parent._player.stats.es.current
            },
            hp: {
                max: this.parent._player.stats.hp.max,
                current: this.parent._player.stats.hp.max
            },
            mp: {
                max: this.parent._player.stats.mp.max,
                current: this.parent._player.stats.mp.max
            }
        }
    }
    setSkills() {
        let skills = _game._skills.getAll();
        for (let i = 0; i < skills.length; i++) {
            // remove the heals
            if (skills[i] && skills[i].type != 2 && skills[i].type != 3) {
                this.skills.push(skills[i]);
            }
        }
    }
    portal() {
        _game.keyboardHandler.reset();
        _game._player.savePlayer();
        _game._floors.newFloor(this.level);
        _game.loader.run();
    }
    draw() {
        super.draw();
        if (this.bars) {
            this.bars.draw();
        }
    }
    trap() {
        let hasWood = false;
        for (let i = 0; i < _game._player.items.length; i++) {
            if (_game._player.items[i].asset.name == "woodplank") {
                hasWood = true;
                _game._player.items.splice(i, 1);
                break;
            }
        }
        if (!hasWood) {
            _game._player.stats.removeHp(1);
        }
        this.remove();
    }
    enemy() {
        this.parent.stop();
        this.setStats();
        this.stats = new StatsHandler(this.stats);
        this.setSkills();
        //this.actions = new Actions(this);
        this.bars = new Bars(this);
        // values type, x, y, h, w, color
        // y = [50, -20] 50% - 20
        this.bars.add('hp', [50, 2], [50, -20], 20, 50, 'rgb(255,0,0)');
        this.bars.add('es', [50, 2], [50, -10], 10, 50, 'rgb(0,0,255)');
        this.parent.battle = new Battle(this);
        _game.ui.repaint = true;
    }
    lock() {
        if (_game._player.items.getByTypeAndItem('collectible', 'key')) {
            // sets collision layer to 0
            _game._floors.getCurrent().removeCollisionFromLayer(this.row, this.col);
            // removes items
            _game._player.items.getByType('collectible')['key'].amount--;
            // inventory has to be recalculated
            _game.ui.inventory.resize();
            // removes lock itself
            this.remove();
        }
    }
    resize() {
        this.bars.resize();
    }

    // Battle Stuff
    retaliate() {
        return this.skills[Math.floor(Math.random() * this.skills.length)];
    }
}
