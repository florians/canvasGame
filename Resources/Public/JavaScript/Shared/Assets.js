
class Assets {
    constructor(parent) {
        this.parent = parent;
        this.assets = [];
        this.assetsType = [];
        this.assetLayers = [];
        this.parent.spriteSheet = null;
        this.generateSpriteSheet();
    }
    generateSpriteSheet() {
        let image = new Image();
        image.src = gameBaseUrl + 'SpriteSheet.webp';
        image.onload = () => {
            this.parent.preloader();
        };
        this.parent.spriteSheet = image;

    }
    /************************
     **** Setup Loader ******
     ************************/
    load() {
        this.parent.loader.add('data', 'assets', {
            type: 'getAllAssets'
        });
        this.parent.loader.add('data', 'initAssetLayerTypes', {
            type: 'getAssetsType'
        });
    }
    /************************
     ***** Loader init ******
     ************************/
    init(result) {
        this.parent.loader.reset();
        this.parent.loader.addMax(result.length);
        this.parent.loader.addText('Loading assets...');
        for (let i = 0; i < result.length; i++) {
            this.assets[result[i].uid] = this.add(result[i]);
        }
        return this;
    }
    initAssetLayerTypes(result) {
        for (let i = 0; i < result.length; i++) {
            if (!this.assetLayers[result[i].layer]) {
                this.assetLayers[result[i].layer] = [];
            }
            this.assetLayers[result[i].layer].push(result[i].name);
        }
    }
    /************************
     ******** Getter ********
     ************************/
    getTypes(type) {
        return this.assetLayers[type];
    }
    // getTypeGroups(type) {
    //     return this.typeGroups[type];
    // }
    getByType(type) {
        let assetArray = [];
        for (var i = 0; i < this.assets.length; i++) {
            if (this.assets[i] && this.assets[i].type == type) {
                assetArray.push(this.assets[i]);
            }
        }
        return assetArray;
    }
    getByLayer(type) {
        let assetArray = [];
        for (var i = 0; i < this.assets.length; i++) {
            if (this.assets[i] && this.assets[i].layer == type) {
                assetArray.push(this.assets[i]);
            }
        }
        return assetArray;
    }
    get(id) {
        return this.assets[id];
    }
    count() {
        return this.assets.length;
    }
    /************************
     ****** Add Asset ********
     ************************/
    add(result) {
        return new Asset(this.parent, result);
    }

    // garbage collection
    // remove(){
    // }
}