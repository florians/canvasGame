function Battle() {
    this.ctx = ctx2;
    this.enemy = new Enemy(this.ctx);
    this.drawBackground = function() {
        this.ctx.globalAlpha = 0.8;
        this.ctx.fillStyle = 'rgb(0,0,0)';
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.globalAlpha = 1;
    }
    this.draw = function() {
        this.ctx.fillStyle = 'rgb(50,50,50)';
        this.ctx.fillRect(0, this.ctx.canvas.height / 2, this.ctx.canvas.width, this.ctx.canvas.height / 2);
    }
}
