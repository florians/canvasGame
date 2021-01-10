class Windows {
    constructor(objs = null) {
        this.layer = [];
        this.isVisible = false;
        if(objs){
            this.addMultiple(objs);
        }
    }
    add(obj) {
        this.layer.push(obj);
    }
    addMultiple(objs) {
        for (let i = 0; i < objs.length; i++) {
            this.layer.push(objs[i]);
        }
    }
    draw() {
        for (let i = 0; i < this.layer.length; i++) {
            this.layer[i].draw();
        }
    }
    toggle() {
        if (this.isVisible == false) {
            this.show();
        } else {
            this.hide();
        }
    }
    show() {
        _game.stop();
        this.draw();
        this.isVisible = true;
    }
    hide() {
        this.isVisible = false;
        _game.start();
    }
    setSize(obj) {
        obj.h = this.calcSize(_ctxUi.canvas.height, obj.hArr);
        obj.w = this.calcSize(_ctxUi.canvas.width, obj.wArr);
        obj.x = this.calcSize(_ctxUi.canvas.width, obj.xArr);
        obj.y = this.calcSize(_ctxUi.canvas.height, obj.yArr);
    }
    calcSize(nr, percent) {
        if (Array.isArray(percent)) {
            return Math.floor((nr / 100) * percent[0]) + percent[1];
        } else {
            return Math.floor((nr / 100) * percent);
        }
    }
    resize() {
        for (let i = 0; i < this.layer.length; i++) {
            this.setSize(this.layer[i]);
            if (this.layer[i] instanceof Grid) {
                this.layer[i].resize();
            }
            if (this.layer[i] instanceof CraftingHandler) {
                this.layer[i].reload();
            }
        }
    }
}
