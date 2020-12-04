class Enemy extends Tile {
    constructor(parent, id) {
        super(parent);
        super.setTile(id);
        this.name = "BLA";
        this.level = 1;
        this.stats = {};
    }
    hit(type) {
        if (this.isEmpty == false) {
            console.log("Enemy Hit");
            if (this[this.asset.name] instanceof Function) {
                this[this.asset.name]();
            }
            _game.ui.draw();
            this.del();
        }
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
        _game.ui.drawStat(this.stats.hp, x, y - 20, 20, 'rgb(255,0,0)');
        if (this.stats.es.current > 0) {
            _game.ui.drawStat(this.stats.es, x, y - 10, 10, 'rgb(0,0,255)');
        }
    }
    attack(target) {
        var loseHp = Math.random();
        if (loseHp >= 0.3) {
            _game.ui.removeStat(target, 'hp');
        }
        _game.ui.draw();
    }
    trap() {
        _game.ui.removeStat(this.parent._player, 'hp', 1);
    }
    enemy() {
        _game.stopGame = true;
        this.setStats();
        _game.battle = new Battle(this.parent, this);
    }
}
