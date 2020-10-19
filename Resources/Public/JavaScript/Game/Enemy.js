class Enemy {
    constructor() {
        this.name = "BLA";
        this.level = 1;
        this.stats = {
            hp: {
                max: 4,
                current: 4
            },
            es: {
                current: 1
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
    }
    draw() {
        var x = Math.floor(_ctxUi.canvas.width / 2) + 2;
        var y = Math.floor(_ctxUi.canvas.height / 2);
        _game.ui.drawStat(this.stats.hp, x, y - 20, 20, 'rgb(255,0,0)');
        if (this.stats.es.current >= 0) {
            _game.ui.drawStat(this.stats.es, x, y - 10, 10, 'rgb(0,0,255)');
        }
    }
    attack() {
        var loseHp = Math.random();
        if (loseHp >= 0.3) {
            _game.ui.removeStat('_player', 'hp');
        }
        _game.ui.draw();
    }
}
