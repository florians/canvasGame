class Item {
    constructor(item) {
        this.asset = item;
        this.amount = 0;
    }
    draw() {
        if (this.asset.image && this.amount > 0) {
            _ctxUi.drawImage(this.asset.image, this.x, this.y, this.h, this.w);
            _ctxUi.fillStyle = this.color;
            _ctxUi.strokeRect(this.x, this.y, this.w, this.h);
            _ctxUi.font = this.font;
            _ctxUi.fillStyle = this.fontColor;
            _ctxUi.fillText(this.amount, this.x + 5, this.y + this.h - 5);
        }
    }
}
