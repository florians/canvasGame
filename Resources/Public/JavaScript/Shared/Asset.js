class Asset {
    constructor(parent, result) {
        this.parent = parent;
        this.factor = result.factor;
        this.name = result.name;
        this.sorting = result.sorting;
        this.source = result.source;
        this.type = result.type;
        this.image = result.image;
        this.setUid(result.uid);
        this.setCollision(result.collision);
        this.loadImage();
    }
    /************************
     ****** Add Image *******
     ************************/
    loadImage() {
        let image = new Image(100, 100);
        image.src = gameBaseUrl + this.type + '/' + this.source;
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
        this.collision = collision.split(',').map(Number);
    }
}
