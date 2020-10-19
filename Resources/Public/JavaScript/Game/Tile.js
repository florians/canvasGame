class Tile {
    constructor(result) {
        this.uid = result.uid;
        this.collision = result.collision;
        this.factor = result.factor;
        this.name = result.name;
        this.sorting = result.sorting;
        this.source = result.source;
        this.type = result.type;
        this.loadImage();
    }
    loadImage() {
        let image = new Image(100, 100);
        image.src = gameBaseUrl + this.type + '/' + this.source;
        image.onload = () => {
            _game.loader.addStep();
        };
        this.image = image;
    }
    getUid() {
        return this.uid;
    }
    getCollision() {
        return this.collision.split(',').map(Number);
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
}
