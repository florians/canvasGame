class Grid {
    // %  x, y, h, w
    constructor(x, y, h, w, color, alpha, font, fontColor) {
        this.xArr = x;
        this.yArr = y;
        this.hArr = h;
        this.wArr = w;
        this.content = [];
        this.items = [];
        this.hasText = false;
        this.color = color || 'rgb(50,50,50)';
        this.alpha = alpha || 1;
        this.font = font || "30px Arial";
        this.fontColor = fontColor || "#999";
    }
    setGrid(spacing = 5, h = 30, w = 30, color = '#020') {
        this.grid = {
            h: h,
            w: w,
            spacing: spacing,
            color: color
        }
    }
    setText(font = '', color = '') {
        this.hasText = true;
        if (font) {
            this.font = font;
        }
        if (color) {
            this.fontColor = color;
        }
    }
    generateContent() {
        let maxCols = Math.floor(this.w / (this.grid.w + this.grid.spacing * 1.1)) || 1;
        let maxRows = Math.floor(this.h / (this.grid.h + this.grid.spacing * 1.1)) || 1;

        let rowCounter = 0;
        let itemCounter = 0;

        let inventoryItems = [];
        if (this.items instanceof Items && this.items.types.length > 0) {
            this.content = [];
            for (let typeCouter = 0; typeCouter < this.items.types.length; typeCouter++) {
                let subTypes = _game._player.items.getTypeKeys(this.items.types[typeCouter]);
                for (let i = 0; i < subTypes.length; i++) {
                    this.content.push(this.items.items[this.items.types[typeCouter]][subTypes[i]]);
                }
            }
        }
        for (let i = 0; i < this.content.length; i++) {
            if (this.content[i].amount == 0) {
                continue;
            }
            this.content[i].x = this.x + (itemCounter % maxCols * this.grid.w) + (this.grid.spacing * (itemCounter % maxCols));
            this.content[i].y = this.y + (rowCounter * this.grid.h) + (this.grid.spacing * rowCounter);
            this.content[i].h = this.grid.h;
            this.content[i].w = this.grid.w;
            this.content[i].color = this.grid.color;
            this.content[i].font = this.font;
            this.content[i].fontColor = this.fontColor;
            if (i % maxCols == maxCols - 1) {
                rowCounter++;
            }
            itemCounter++;
        }
    }
    draw() {
        for (let i = 0; i < this.content.length; i++) {
            this.content[i].draw();
            if (this.hasText) {
                this.content[i].drawText();
            }
            _ctxUi.fillStyle = this.color;
        }
    }
    resize() {
        this.generateContent();
    }
}
