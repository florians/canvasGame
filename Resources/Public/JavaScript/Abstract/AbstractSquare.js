class AbstractSquare {
    constructor(parent, result) {
        this.parent = parent;
        this.x = 0;
        this.y = 0;
        this.col = 0;
        this.row = 0;
        this.level = 0;
        this.isEmpty = false;
        this.asset = [];
        this.collision = [];
        this.orig = '';
        this.isLooted = false;
        this.req = [];
        this.requirementsMet = false;
    }
    /************************
     ***** Hit action *******
     ************************/
    hit(type) {
        this.del = false;
        if (this.isEmpty == false) {
            if (this[this.asset.name] instanceof Function) {
                this[this.asset.name]();
            } else {
                if (this instanceof Collectible) {
                    this.newItem();
                }
            }
        }
    }
    draw() {
        if (this.asset.image) {
            _ctxWorld.drawImage(this.asset.image, this.x, this.y, this.w, this.h);
            if (this.req.length > 0) {
                this.testRequirements();
                if (this.requirementsMet == false) {
                    _ctxWorld.fillStyle = '#ff0000';
                } else {
                    _ctxWorld.fillStyle = '#008000';
                }
                _ctxWorld.fillRect(this.x + this.w - Math.floor(this.w / 5) * 1.2, this.y + this.h - Math.floor(this.h / 5) * 1.2, Math.floor(this.w / 5), Math.floor(this.h / 5))
            }
        }
    }
    set(id) {
        if (id && this.parent._assets.get(id)) {
            this.isEmpty = false;
            this.asset = this.parent._assets.get(id);
        } else {
            this.isEmpty = true;
            this.asset = {
                collision: false,
                factor: 0
            }
        }
    }
    newItem() {
        _game._player.items.getByTypeAndItem('material', 'stone');
        _game._player.items.addToCategory(this.asset);
        this.remove();
        _game.ui.inventory.resize();
    }
    remove() {
        this.set(0);
        this.collision = false;
        _game.ui.repaint = true;
    }
    getRequirements(name) {
        for (let i = 0; i < this.req.length; i++) {
            if (this.req[i].asset.name == name) {
                return this.req[i];
            }
        }
        return false;
    }
    addRequirements(uid) {
        let newReq = {
            asset: this.parent._assets.get(uid),
            amount: 1
        }
        let reqExsists = this.getRequirements(newReq.asset.name);
        if (reqExsists) {
            reqExsists.amount += 1;
        } else {
            this.req.push(newReq);
        }
    }
    removeRequirements(uid) {
        let reqExsists = this.getRequirements(this.parent._assets.get(uid).name);
        if (reqExsists) {
            reqExsists.amount -= 1;
            if (reqExsists.amount <= 0) {
                reqExsists.amount = 0;
            }
        }
    }
    setRequirements() {
        let requirements = [];
        let reqParts = [];
        if (this.req.includes(',')) {
            reqParts = this.req.split(',');
        } else {
            reqParts.push(this.req);
        }
        let newReq = {};
        for (let i = 0; i < reqParts.length; i++) {
            let parts = [];
            if (reqParts[i].includes('*')) {
                parts = reqParts[i].split('*')
            } else {
                parts = reqParts[i];
            }
            newReq = {
                asset: this.parent._assets.get(parts[1]),
                amount: parseInt(parts[0])
            }
            requirements.push(newReq);
        }
        this.req = requirements;
    }
    testRequirements() {
        this.requirementsMet = false;
        let itemCat = ['material', 'craftable'];
        for (let reqI = 0; reqI < this.req.length; reqI++) {
            let elName = this.req[reqI].asset.name;
            let amount = this.req[reqI].amount;
            for (let i = 0; i < itemCat.length; i++) {
                let itemTypes = Object.keys(_game._player.items.getByType(itemCat[i]));
                if (itemTypes.length > 0) {
                    if (
                        itemTypes.includes(elName) &&
                        amount <= _game._player.items.getByTypeAndItem(itemCat[i], itemTypes[itemTypes.indexOf(elName)]).amount
                    ) {
                        this.requirementsMet = true;
                    }
                }
            }
        }
    }
}
