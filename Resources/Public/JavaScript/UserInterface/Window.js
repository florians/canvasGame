class Window {
    // %  x, y, h, w
    constructor(x, y, h, w, color, alpha) {
        this.xArr = x;
        this.yArr = y;
        this.hArr = h;
        this.wArr = w;
        this.color = color || 'rgb(50,50,50)';
        this.alpha = alpha || 1;
    }
    draw() {
        _ctxUi.fillStyle = this.color;
        _ctxUi.fillRect(this.x, this.y, this.w, this.h);
    }
}
