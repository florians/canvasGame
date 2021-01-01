class Battle {
    constructor(enemy) {
        this.turn = '_player';
        this.target = '_enemy';
        this.challengers = {
            _player: _game._player,
            _enemy: enemy
        }
        this.win = false;
        this.resize();
        document.body.classList.add('battle');
    }

    drawBackground() {
        _ctxUi.globalAlpha = 0.8;
        _ctxUi.fillStyle = 'rgb(0,0,0)';
        _ctxUi.fillRect(0, 0, _ctxUi.canvas.width, _ctxUi.canvas.height);
        _ctxUi.globalAlpha = 1;
    }
    draw() {
        this.drawBackground();
        this.challengers._enemy.draw();
        this.challengers._player.draw();
    }
    current() {
        return this.challengers[this.turn];
    }
    currentTarget() {
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
        this.current().actions.use();
    }
    addAction(skill) {
        // hot and heal to self else to enemy
        if (skill.type == 2 || skill.type == 3) {
            this.current().actions.trigger(skill);
        } else {
            this.currentTarget().actions.add(skill);
        }
    }
    resize() {
        this.challengers._enemy.resize();
    }
}
