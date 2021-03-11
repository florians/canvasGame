class UserInterface {
    constructor() {
        _game.mousehandler.add('body', 'click', 'useSkill', this);
        _game.mousehandler.add('body', 'touchstart', 'useSkill', this);
        this.repaint = false;

        // Skill Book
        this.skillBook = new Windows(this, this.generateSkillBook());
        // Inventory
        this.inventory = new Windows(this, this.generateInventory());
        this.buttonBar = ["SkillBook", "Inventory"];
        this.buttons = [];
        this.generateButtons();
        this.resize();
    }

    draw() {
        this.repaint = false;
        _ctxUi.save();
        _ctxUi.setTransform(1, 0, 0, 1, 0, 0);
        _ctxUi.clearRect(0, 0, _ctxUi.canvas.width, _ctxUi.canvas.height);

        // draw player
        if (_game._player) {
            _game._player.drawPlayer();
        }
        // battle background
        if (_game.battle) {
            _game.battle.draw();
        } else {
            _game._player.draw();
        }
        if (this.skillBook.isVisible || _game.battle) {
            this.skillBook.draw();
        }
        if (this.inventory.isVisible) {
            this.inventory.draw();
        }
        if (!_game.battle) {
            this.drawButtons();
        }
        _ctxUi.restore();
    }
    /************************
     ****** Skillbook *******
     ************************/
    generateSkillBook() {
        _game.keyboardHandler.add(document, 'keydown', 'showSkillBook', [80], this);
        let layers = [],
            background = null,
            skillGrid = null;

        // x,y,h,w in %
        background = new Window(0, 50, 51, 100);
        // % +- px
        skillGrid = new Grid([0, 10], [50, 10], [50, -20], [100, -20]);
        skillGrid.content = _game._player.skills;
        skillGrid.hasText = true;
        skillGrid.setGrid(5, 40, 150);

        layers.push(background, skillGrid);

        return layers;
    }
    showSkillBook(event) {
        if (!_game.battle) {
            if (_game.stopGame == true) {
                this.inventory.hide();
            }
            this.skillBook.toggle();
        }
    }
    /************************
     ****** Inventory *******
     ************************/
    generateInventory() {
        _game.keyboardHandler.add(document, 'keydown', 'showInventory', [73], this);
        let layers = [],
            background = null,
            inventory = null,
            craftingStation = null;

        // x,y,h,w in %
        background = new Window(0, 50, 51, 100);
        // % +- px
        inventory = new Grid([0, 10], [50, 10], [50, -10], [50, -10]);
        inventory.items = _game._player.items;
        // skillGrid.hasText = true;
        inventory.setGrid(5, 100, 100);

        this.craftingStation = new CraftingHandler([50, 10], [50, 10], [50, -20], [50, -20]);
        this.craftingStation.recipes = _game._assets.assets;

        layers.push(background, inventory, this.craftingStation);

        return layers;
    }
    showInventory(event) {
        if (!_game.battle) {
            if (_game.stopGame == true) {
                this.skillBook.hide();
            }
            this.inventory.resize();
            this.inventory.toggle();
        }
    }

    /************************
     ****** Buttons *******
     ************************/
    generateButtons() {
        this.buttons = [];
        for (let i = 0; i < this.buttonBar.length; i++) {
            let button = {
                name: this.buttonBar[i],
                el: this[this.buttonBar[i].charAt(0).toLowerCase() + this.buttonBar[i].substring(1)],
                x: (150 * i) + (i * 5),
                y: _ctxUi.canvas.height - 40,
                w: 150,
                h: 40,
            }
            this.buttons.push(button);
        }
    }
    drawButtons() {
        for (let i = 0; i < this.buttons.length; i++) {
            _ctxUi.fillStyle = '#00F';
            _ctxUi.fillRect(this.buttons[i].x, this.buttons[i].y, this.buttons[i].w, this.buttons[i].h);
            _ctxUi.font = '30px Arial';
            _ctxUi.fillStyle = '#000';
            _ctxUi.fillText(this.buttons[i].name, this.buttons[i].x + 5, this.buttons[i].y + 30);
        }
    }
    addItem(target, type, uid) {
        this.repaint = true;
        let item = _game._assets.get(uid);
        target.items[type] = item;
    }
    removeItem(target, type, uid) {
        this.repaint = true;
        delete target.items[type];
    }
    resetStat(target, stat) {
        this.repaint = true;
        target.stats[stat].current = target.stats[stat].max || 0;
    }
    drawSkills(skills, x, y, w, h, i) {
        for (let i = 0; i < skills.length; i++) {
            skills[i].draw(x, y, w, h, i);
        }
    }
    /************************
     ***** Use Skill ********
     ************************/
    useSkill(event) {
        var mPos = {
            x: event.clientX,
            y: event.clientY
        };
        if (document.body.classList.contains('suspended')) {
            if (_game.battle && _game.battle.turn == 'player') {
                for (let i = 0; i < _game._player.skills.length; i++) {
                    if (this.isColliding(mPos, _game._player.skills[i])) {
                        _game.battle.addAction(_game._player.skills[i]);
                        break;
                    }
                }
            }
            if (!_game.battle && _game.ui.inventory.show) {
                for (let i = 0; i < this.craftingStation.recipes.length; i++) {
                    if (!this.craftingStation.recipes[i]) {
                        continue;
                    }
                    if (this.isColliding(mPos, this.craftingStation.recipes[i])) {

                        this.craftingStation.use(this.craftingStation.recipes[i]);
                        break;
                    }
                }
            }
        }
        // buttons
        if (!_game.battle) {
            for (let i = 0; i < this.buttons.length; i++) {
                if (this.isColliding(mPos, this.buttons[i])) {
                    // ugly
                    if (this.buttons[i].name == 'Inventory') {
                        this.showInventory();
                    }
                    if (this.buttons[i].name == 'SkillBook') {
                        this.showSkillBook();
                    }
                }
            }
        }
    }
    isColliding(obj1, obj2) {
        if (obj1.x > obj2.x && obj1.x < obj2.x + obj2.w && obj1.y > obj2.y && obj1.y < obj2.y + obj2.h) {
            return true;
        } else {
            return false;
        }
    }
    resize() {
        this.repaint = true;
        if (_game.battle) {
            _game.battle.resize();
        }
        this.generateButtons();
        this.skillBook.resize();
        this.inventory.resize();
    }
}
