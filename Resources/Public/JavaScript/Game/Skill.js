class Skill {
    constructor(result) {
        this.cost = result.cost;
        this.deleted = result.deleted;
        this.level = result.level;
        this.name = result.name;
        this.text = result.text;
        this.turns = result.turns;
        this.type = result.type;
        this.uid = result.uid;
        this.value = result.value;
    }
    draw(x, y, w, h, i) {
        _ctxUi.fillStyle = 'rgb(0,255,255)';
        _ctxUi.fillRect(x, y + (h + 5) * i, w, h);
        this.x = x;
        this.y = y + (h + 5) * i;
        this.w = w;
        this.h = h;
        _ctxUi.font = "30px Arial";
        _ctxUi.fillStyle = 'rgb(0,0,0)';
        _ctxUi.fillText(this.name, x, 25 + y + (h + 5) * i);
    }
}
