class Enemy extends Tile {
    constructor(parent, id) {
        super(parent);
        super.set(id);
        this.name = "ENEMY";
        this.level = 1;
        this.stats = {};
        this.actions = new Actions(this);
        this.bars = new Bars(this);
        // values type, x, y, h, w, color
        // y = [50, -20] 50% - 20
        this.bars.add('hp', [50, 2], [50, -20], 20, 50, 'rgb(255,0,0)');
        this.bars.add('es', [50, 2], [50, -10], 10, 50, 'rgb(0,0,255)');
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
    draw() {
        var x = Math.floor(_ctxUi.canvas.width / 2) + 2;
        var y = Math.floor(_ctxUi.canvas.height / 2);
        this.bars.draw();
    }
    attack(target) {
        var loseHp = Math.random();
        //if (loseHp >= 0.3) {
        _game.ui.removeStat(target, 'hp', 5);
        //}
        _game.ui.draw();
    }
    trap() {
        _game.ui.removeStat(this.parent._player, 'hp', 1);
        super.del();
    }
    enemy() {
        _game.stopGame = true;
        this.setStats();
        _game.battle = new Battle(this.parent, this);
        _game.ui.draw();
    }
    resize() {
        this.bars.resize();
    }
    delete() {
        super.del();
    }
}
