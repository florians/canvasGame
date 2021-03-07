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
                    _ctxWorld.drawImage(this.parent._assets.get(53).image, this.x + (this.w * 0.5), this.y + (this.h * 0.5), this.h * 0.5, this.w * 0.5);
                } else {
                    _ctxWorld.drawImage(this.parent._assets.get(68).image, this.x + (this.w * 0.5), this.y + (this.h * 0.5), this.h * 0.5, this.w * 0.5);
                }
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
        if (this.req.includes('/')) {
            reqParts = this.req.split('/');
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
        let requirementsMet = 0;
        this.requirementsMet = false;
        let itemCat = ['material', 'craftable', 'keys'];
        for (let reqI = 0; reqI < this.req.length; reqI++) {
            if (!this.req[reqI].asset) return;
            let elName = this.req[reqI].asset.name;
            let amount = this.req[reqI].amount;
            for (let i = 0; i < itemCat.length; i++) {
                let itemTypes = Object.keys(_game._player.items.getByType(itemCat[i]));
                if (itemTypes.length > 0) {
                    if (
                        itemTypes.includes(elName) &&
                        amount <= _game._player.items.getByTypeAndItem(itemCat[i], itemTypes[itemTypes.indexOf(elName)]).amount
                    ) {
                        requirementsMet++;
                    }
                }
            }
        }
        if(requirementsMet == this.req.length){
            this.requirementsMet = true;
        }
    }
    use() {
        for (let reqI = 0; reqI < this.req.length; reqI++) {
            let amount = this.req[reqI].amount;
            let asset = this.req[reqI].asset;
            if (_game._player.items.getByTypeAndItem(asset.type, asset.name)) {
                _game._player.items.getByType(asset.type)[asset.name].amount -= amount;
            }
        }
        this.req = [];
        _game.ui.inventory.resize();
        _game._floors.getCurrent().removeCollisionFromLayer(this.row, this.col);
        if (this.asset.layer != 'tiles') {
            this.remove();
        }
    }
    showInfo() {
        let maxInCol = 2;
        let reqAmount = this.req.length;
        let rows = Math.ceil(reqAmount / maxInCol);
        let cols = maxInCol > reqAmount ? reqAmount : maxInCol;

        let h = (this.h * 0.5) * rows + (rows + 1) * 5;
        let w = (this.h * 0.5) * cols + (cols + 1) * 5;
        let x = this.x + (this.w / 2) - (w / 2);
        let y = this.y + (this.h / 2) - (h / 2);

        _ctxWorld.fillStyle = '#3e3e3e';
        _ctxWorld.fillRect(x, y, w, h);
        let listRow = 0;
        let listCol = 0;
        for (let i = 0; i < this.req.length; i++) {
            let assetX = Math.floor(x + 5 + (listCol * 5) + (listCol * this.w * 0.5));
            let assetY = Math.floor(y + 5 + (listRow * 5) + (listRow * this.h * 0.5));
            _ctxWorld.drawImage(this.req[i].asset.image, assetX, assetY, this.h * 0.5, this.w * 0.5);
            _ctxWorld.fillStyle = '#b3b3b3';
            _ctxWorld.strokeRect(assetX, assetY, this.h * 0.5, this.w * 0.5);
            _ctxWorld.font = '20px Arial';
            _ctxWorld.fillStyle = '#FFF';
            _ctxWorld.fillText(this.req[i].amount, assetX + 5, assetY + this.h * 0.5 - 5);
            if (listCol < maxInCol - 1) {
                listCol++;
            } else {
                listCol = 0;
                listRow++;
            }
        }
    }
}
