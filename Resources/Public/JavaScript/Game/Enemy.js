function Enemy(ctx) {
    this.ctx = ctx;
    this.name = "BLA";
    this.level = 1;
    this.stats = {
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
    this.draw = function() {
        var x = Math.floor(this.ctx.canvas.width / 2) + 2;
        var y = Math.floor(this.ctx.canvas.height / 2);
        game.ui.drawStat(this.stats.hp, x, y - 20, 20, 'rgb(255,0,0)');
        this.stats.es.current = 1;
        if (this.stats.es.current > 0) {
            game.ui.drawStat(this.stats.hp, x, y - 10, 10, 'rgb(0,0,255)');
        }
    }
}
