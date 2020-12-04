class Battle {
    constructor(parent, enemy) {
        this.parent = parent;
        this.turn = '_player';
        this.target = '_enemy';
        this.challengers = {
            _player: this.parent._player,
            _enemy: enemy
        }
        this.win = false;
        document.body.classList.add('battle');
    }

    drawBackground() {
        _ctxUi.globalAlpha = 0.8;
        _ctxUi.fillStyle = 'rgb(0,0,0)';
        _ctxUi.fillRect(0, 0, _ctxUi.canvas.width, _ctxUi.canvas.height);
        _ctxUi.globalAlpha = 1;
    }
    draw() {
        _ctxUi.fillStyle = 'rgb(50,50,50)';
        _ctxUi.fillRect(0, _ctxUi.canvas.height / 2, _ctxUi.canvas.width, _ctxUi.canvas.height / 2);
    }
    current(){
        return this.challengers[this.turn];
    }
    currentTarget(){
        return this.challengers[this.target];
    }
    changeTarget() {
        if (this.target == '_enemy') {
            this.target = '_player';
            this.turn = '_enemy';
        } else {
            this.target = '_enemy';
            this.turn = '_player';
        }
    }
}
