class Interaction extends AbstractSquare {
    constructor(parent, id) {
        super(parent);
        this.set(id);
        this.name = "ENEMY";
        this.level = 1;
        this.stats = {};

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
        this.parent.ui.removeStat(target, 'hp', 5);
        //}
        this.parent.ui.draw();
    }
    trap() {
        this.parent.ui.removeStat(this.parent._player, 'hp', 1);
        this.remove();
    }
    enemy() {
        this.parent.stop();
        this.setStats();
        this.actions = new Actions(this);
        this.bars = new Bars(this);
        // values type, x, y, h, w, color
        // y = [50, -20] 50% - 20
        this.bars.add('hp', [50, 2], [50, -20], 20, 50, 'rgb(255,0,0)');
        this.bars.add('es', [50, 2], [50, -10], 10, 50, 'rgb(0,0,255)');
        this.parent.battle = new Battle(this);
        this.parent.ui.draw();
    }
    resize() {
        this.bars.resize();
    }
    // delete() {
    //     //console.log(Object.getOwnPropertyNames(this));
    //     this.remove();
    // }
}
