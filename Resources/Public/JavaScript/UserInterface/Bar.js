class Bar {
    constructor(type, x, y, h, w, color) {
        this.type = type;
        this.xArr = x;
        this.yArr = y;
        this.wArr = w;
        this.h = h;
        this.color = color;
        this.setVar('x', this.xArr, _ctxUi.canvas.width);
        this.setVar('y', this.yArr, _ctxUi.canvas.height);
        this.setVar('w', this.wArr, _ctxUi.canvas.width);
    }
    setVar(v, val, side) {
        if (Array.isArray(val)) {
            this[v] = Math.floor(side / (100 / val[0])) + val[1];
        } else {
            this[v] = Math.floor(side / (100 / val));
        }
    }
    draw(target) {
        this.current = target.stats[this.type].current;
        this.max = target.stats[this.type].max || this.current;
        if (this.current > 0) {
            let barSize = this.w / this.max;
            _ctxUi.fillStyle = 'rgb(10,10,10)';
            _ctxUi.fillRect(this.x, this.y, this.w - 2, this.h);
            for (let i = 0; i < this.max; i++) {
                if (this.current >= i + 1) {
                    _ctxUi.fillStyle = this.color;
                    _ctxUi.fillRect(this.x + (barSize * i), this.y, barSize - 2, this.h);
                }
            }
        }
    }
    resize() {
        this.setVar('x', this.xArr, _ctxUi.canvas.width);
        this.setVar('y', this.yArr, _ctxUi.canvas.height);
        this.setVar('w', this.wArr, _ctxUi.canvas.width);
    }
}
