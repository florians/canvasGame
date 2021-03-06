class Asset {
    constructor(parent, result) {
        this.parent = parent;
        this.factor = parseFloat(result.factor);
        this.name = result.name;
        this.layer = result.layer;
        this.sorting = parseInt(result.sorting);
        this.source = result.source;
        this.type = result.type;
        this.typeuid = parseInt(result.typeuid);
        this.image = result.image;
        this.layer = result.layer;
        this.req = result.req;
        this.pos = {
            row: parseInt(result.pos.split(',')[0]),
            col: parseInt(result.pos.split(',')[1])
        }
        this.h = 100;
        this.w = 100;

        this.setUid(result.uid);
        this.setCollision(result.collision);
        this.loadImage();
    }
    /************************
     ****** Add Image *******
     ************************/
    loadImage() {
        let image = new Image(100, 100);
        if (this.parent.spriteSheet) {
            if (this.pos) {
                _ctxLoader.clearRect(0, 0, this.w, this.h);
                _ctxLoader.drawImage(
                    this.parent.spriteSheet,
                    this.pos.col * this.w,
                    this.pos.row * this.h,
                    this.w,
                    this.h,
                    0,
                    0,
                    this.w,
                    this.h
                );
                let imgDataUrl = document.getElementById('loader').toDataURL('image/webp', 1);
                image.src = imgDataUrl;
            }
        } else {
            image.src = gameBaseUrl + this.type + '/' + this.source;
        }
        image.onload = () => {
            this.parent.loader.addStep();
        };
        this.image = image;
    }
    /************************
     ******** Setter ********
     ************************/
    setUid(uid) {
        this.uid = parseInt(uid);
    }
    setCollision(collision) {
        let c = collision.split(',').map(Number);
        if (c.length == 1) {
            this.collision = false;
        } else {
            this.collision = collision.split(',').map(Number);
        }
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
}
