class CraftingHandler {
    constructor(x, y, h, w, color, alpha, font, fontColor) {
        this.xArr = x;
        this.yArr = y;
        this.hArr = h;
        this.wArr = w;
        this.hasText = false;
        this.color = color || 'rgb(50,50,50)';
        this.alpha = alpha || 1;
        this.font = font || "30px Arial";
        this.fontColor = fontColor || "#999";
        this.recipes = [];

        // materials
        this.wood = 0;
        this.stone = 0;
    }
    use(recipe) {
        if (recipe.req.wood) {
            _game._player.items.getByTypeAndItem('material', 'wood').amount -= recipe.req.wood;
        }
        if (recipe.req.stone) {
            _game._player.items.getByTypeAndItem('material', 'stone').amount -= recipe.req.stone;
        }
        _game._player.items.addToCategory(recipe);
        this.reload();
        _game.ui.inventory.resize();
        _game.ui.draw();
    }
    reload() {
        this.wood = _game._player.items.getByTypeAndItem('material', 'wood').amount;
        this.stone = _game._player.items.getByTypeAndItem('material', 'stone').amount;
        
        // MORE MATERIALS HERE
        let show = 0;
        for (let i = 0; i < this.recipes.length; i++) {
            if (!this.recipes[i]) {
                continue;
            }
            this.recipes[i].show = false;
            show = 0;
            if (this.recipes[i].req != null) {
                // MORE MATERIAL CHECKS HERE
                if (this.recipes[i].req.wood && this.recipes[i].req.wood <= this.wood) {
                    show++;
                }
                if (this.recipes[i].req.stone && this.recipes[i].req.stone <= this.stone) {
                    show++;
                }
                if (show == Object.keys(this.recipes[i].req).length) {
                    this.recipes[i].show = true;
                }
            } else {
                // was true ???
                this.recipes[i].show = false;
            }
        }
    }
    draw() {
        let showCounter = 0;
        _ctxUi.fillStyle = this.color;
        _ctxUi.strokeRect(this.x, this.y, this.w, this.h);
        for (var i = 0; i < this.recipes.length; i++) {
            if (!this.recipes[i]) {
                continue;
            }
            if (this.recipes[i].show) {
                this.recipes[i].x = this.x + 5;
                this.recipes[i].y = this.y + +5 + (35 * showCounter);
                this.recipes[i].h = 40;
                this.recipes[i].w = 200;
                _ctxUi.strokeRect(this.recipes[i].x, this.recipes[i].y, this.recipes[i].w, this.recipes[i].h);
                this.drawText(this.recipes[i]);
                showCounter++;
            } else {
                this.recipes[i].x = 0;
                this.recipes[i].y = 0;
                this.recipes[i].h = 0;
                this.recipes[i].w = 0;
            }
        }
    }
    drawText(recipe) {
        _ctxUi.font = this.font;
        _ctxUi.fillStyle = this.fontColor;
        _ctxUi.fillText(recipe.name, recipe.x + 5, recipe.y + 30);
    }
}
