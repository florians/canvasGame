class Assets {
    constructor(parent) {
        this.parent = parent;
        this.assets = [];
    }
    /************************
     **** Setup Loader ******
     ************************/
    load() {
        this.parent.loader.add('data', 'assets', {
            type: 'getAllAssets'
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
    /************************
     ******** Getter ********
     ************************/
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
