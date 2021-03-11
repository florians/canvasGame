class Bars {
    constructor(parent) {
        this.parent = parent;
        this.bars = [];
    }
    add(type, x, y, h, w, color) {
        this.bars.push(new Bar(type, x, y, h, w, color));
    }
    draw() {
        for (let i = 0; i < this.bars.length; i++) {
            this.bars[i].draw(this.parent);
        }
    }
    resize() {
        for (let i = 0; i < this.bars.length; i++) {
            this.bars[i].resize();
        }
    }
}
