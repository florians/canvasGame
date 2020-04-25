function Ui(ctx) {
    this.ctx = ctx;
    this.repaint = false;

    this.draw = function(callback) {
        this.ctx.save();
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        // draw player
        if (game.player) {
            game.player.drawPlayer();
        }
        // battle background
        if (game.battle) {
            game.battle.drawBackground();
            game.battle.draw();
            game.battle.enemy.draw();
        }
        // palyer info
        if (game.player) {
            game.player.draw();
        }
        this.ctx.restore();
    }
    this.drawSkills = function(skills, x, y, w, h) {
        for (var i = 0; i < skills.length; i++) {
            this.ctx.fillStyle = 'rgb(0,255,255)';
            this.ctx.fillRect(x, y + (h + 5) * i, w, h);
            this.ctx.font = "30px Arial";
            this.ctx.fillStyle = 'rgb(0,0,0)';
            this.ctx.fillText(skills[i].name, x, 25 + y + (h + 5) * i);
        }
    }

    this.drawItem = function(items, x, y, w, h) {
        var ctx = this.ctx;
        var count = 0;
        ctx.save();
        $.each(Object.keys(items), function(index, type) {
            if (type) {
                ctx.fillStyle = 'rgb(255,255,255)';
                ctx.globalAlpha = 0.8;
                ctx.fillRect(x + (w * count), y, w, h);
                ctx.globalAlpha = 1;
                ctx.drawImage(items[type].image, x + (w * count), 25, w, h);
                count++;
            }
        });
        ctx.restore();
    }
    this.drawStat = function(stat, x, y, h, color) {
        var barSize = 0;
        var max = stat.max || stat.current;
        barSize = Math.floor(this.ctx.canvas.width / 2) / max;
        this.ctx.fillStyle = 'rgb(10,10,10)';
        this.ctx.fillRect(x, y, Math.floor(this.ctx.canvas.width / 2) - 2, h);
        for (var i = 0; i < max; i++) {
            if (stat.current >= i + 1) {
                this.ctx.fillStyle = color;
                this.ctx.fillRect(x + (barSize * i), y, barSize - 2, h);
            }
        }
    }
}
