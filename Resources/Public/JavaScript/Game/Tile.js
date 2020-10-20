class Tile {
    constructor(result) {
        this.setUid(result.uid);
        this.setCollision(result.collision);
        this.setFactor(result.factor);
        this.setName(result.name);
        this.setSorting(result.sorting);
        this.setSource(result.source);
        this.setType(result.type);
        this.setImage(result.image);
        this.loadImage();
    }
    /************************
     ****** Add Image *******
     ************************/
    loadImage() {
        let image = new Image(100, 100);
        image.src = gameBaseUrl + this.getType() + '/' + this.getSource();
        image.onload = () => {
            _game.loader.addStep();
        };
        this.image = image;
    }
    /************************
     ******** Getter ********
     ************************/
    getUid() {
        return this.uid;
    }
    getCollision() {
        return this.collision;
    }
    getFactor() {
        return this.factor;
    }
    getName() {
        return this.name;
    }
    getSorting() {
        return this.sorting;
    }
    getSource() {
        return this.source;
    }
    getType() {
        return this.type;
    }
    getImage() {
        return this.image;
    }
    /************************
     ******** Setter ********
     ************************/
    setUid(uid) {
        this.uid = uid;
    }
    setCollision(collision) {
        this.collision = collision.split(',').map(Number);
    }
    setFactor(factor) {
        this.factor = factor;
    }
    setName(name) {
        this.name = name;
    }
    setSorting(sorting) {
        this.sorting = sorting;
    }
    setSource(source) {
        this.source = source;
    }
    setType(type) {
        this.type = type;
    }
    setImage(image) {
        this.image = image;
    }
}
