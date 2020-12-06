class Assets {
    constructor(parent) {
        this.parent = parent;
        this.assets = [];
        this.assetsType = [];
    }
    /************************
     **** Setup Loader ******
     ************************/
    load() {
        this.parent.loader.add('data', 'assets', {
            type: 'getAllAssets'
        });
        this.parent.loader.add('data', 'assetsType', {
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
    initType(result) {
        for (let i = 0; i < result.length; i++) {
            this.assetsType.push(result[i].name);
        }
    }
    /************************
     ******** Getter ********
     ************************/
    getTypes() {
        return this.assetsType;
    }
    getTypeGroups(type) {
        return this.typeGroups[type];
    }
    getByType(type) {
        let assetArray = [];
        for (var i = 0; i < this.assets.length; i++) {
            if (this.assets[i] && this.assets[i].type == type) {
                assetArray.push(this.assets[i]);
            }
        }
        return assetArray;
    }
    get(id) {
        return this.assets[id];
    }
    /************************
     ****** Add Tile ********
     ************************/
    add(result) {
        return new Asset(this.parent, result);
    }

    // garbage collection
    // remove(){
    // }
}
