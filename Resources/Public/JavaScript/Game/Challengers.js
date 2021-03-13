class Challengers {
    constructor() {
        this.player = null;
        this.enemy = null;
    }
    init() {
        this.setTargets();
        this.addActions();
    }
    addActions() {
        this.player.actions = new Actions(this.player);
        this.enemy.actions = new Actions(this.enemy);
    }
    setTargets() {
        this.player.target = this.enemy;
        this.enemy.target = this.player;
    }
    draw() {
        this.player.draw();
        this.enemy.draw();
    }
    resize() {
        this.player.resize();
        this.enemy.resize();
    }
    remove() {
        this.enemy.remove();
    }
    deathCheck(target) {
        if (target.stats.hp.current <= 0) {
            if (target instanceof Player) {
                this.playerDeath();
            } else {
                this.enemyDeath();
            }
            delete _game.battle;
            //_game.ui.repaint = true;
            //_game.start();
        }
    }
    playerDeath() {
        this.player.stats.reset();
        _game._floors.newFloor(_game._floors.floorLevel, true);
    }
    enemyDeath() {
        this.player.stats.addStat('exp');
        _game.battle.challengers.remove();
        _game._player.savePlayer(); // > runs game init
        //_game.start();
    }
}
