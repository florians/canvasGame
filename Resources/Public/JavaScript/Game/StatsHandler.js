class StatsHandler {
    constructor(stats) {
        this.hp = stats.hp;
        this.mp = stats.mp;
        this.es = stats.es;
        this.exp = stats.exp;
    }
    get(stat) {
        return this[stat];
    }
    fill(){
        this.hp.current = this.hp.max;
        //this.mp.current = this.mp.max;
    }
    reset(){
        this.hp.current = this.hp.max;
        this.es.current = 0;
    }
    addStat(stat, val = 1) {
        if (this[stat].max) {
            if (this[stat].current < this[stat].max) {
                this[stat].current += val;
                // reset to max if heal to big
                if (this[stat].current > this[stat].max) {
                    this[stat].current = this[stat].max;
                }
                if (stat == 'exp' && this[stat].max <= this[stat].current) {
                    this.levelUp();
                }
                return true;
            }
        } else {
            this[stat].current++;
            return true;
        }
        return false;
    }
    levelUp() {
        _game._player.levelUp();
    }
    removeStat(stat, val = 1) {
        if (stat == 'hp') {
            this.removeHp(val);
        } else {
            this[stat] -= val;
        }
    }
    removeHp(damage) {
        if (this.es.current > 0) {
            if (this.es.current >= damage) {
                this.es.current -= damage;
            } else {
                damage -= this.es.current;
                this.removeHp(damage);
            }
        } else {
            this.hp.current -= damage;
        }
    }

}
