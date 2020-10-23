class Items {
    constructor() {
        this.items = [];
    }
    /************************
     ***** Loader init ******
     ************************/
    init(result) {
        for (let i = 0; i < result.length; i++) {
            this.items[result[i].uid] = this.add(result[i]);
        }
        return this;
    }
    /************************
     ******** Getter ********
     ************************/
    get(id) {
        return this.items[id];
    }
    /************************
     ***** Add Items ********
     ************************/
    add(result) {
        return new Item(result);
    }

    // garbage collection
    // remove(id){
    // }
}
