class Battle {
    constructor(enemy) {
        this.turn = 'player';
        this.target = 'enemy';
        this.challengers = this.setChallengers(enemy);

        this.isOver = false;
        this.resize();
        document.body.classList.add('battle');
    }
    setChallengers(enemy) {
        let challengers = new Challengers();
        challengers.player = _game._player;
        challengers.enemy = enemy;
        challengers.init();
        return challengers;
    }
    drawBackground() {
        _ctxUi.globalAlpha = 0.8;
        _ctxUi.fillStyle = 'rgb(0,0,0)';
        _ctxUi.fillRect(0, 0, _ctxUi.canvas.width, _ctxUi.canvas.height);
        _ctxUi.globalAlpha = 1;
    }
    draw() {
        this.drawBackground();
        this.challengers.draw();
    }
    current() {
        return this.challengers[this.turn];
    }
    currentTarget() {
        return this.challengers[this.target];
    }
    changeTarget() {
        this.target = this.target == 'player' ? 'enemy' : 'player';
        this.turn = this.turn == 'enemy' ? 'player' : 'enemy';
        this.triggerActions();
        if (this.turn == 'enemy') {
            setTimeout(() => {
                this.addAction(this.current().retaliate());
            }, 200);
        }
    }
    triggerActions() {
        this.current().actions.use();
    }
    addAction(skill) {
        // hot and heal to self else to enemy
        if (skill.type == 2 || skill.type == 3) {
            this.current().actions.trigger(skill);
        } else {
            this.currentTarget().actions.add(skill);
        }
        this.changeTarget();
        _game.ui.draw();
    }
    resize() {
        this.challengers.resize();
    }
}
