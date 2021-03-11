class Items {
    constructor() {
        this.types = [];
        this.items = [];
    }
    addType(type) {
        this.types.push(type);
    }
    addToCategory(item, amount = 1) {
        if (!this.items[item.type]) {
            this.addType(item.type);
            this.items[item.type] = [];
        }
        if (!this.items[item.type][item.name]) {
            this.items[item.type][item.name] = new Item(item);
        }
        this.items[item.type][item.name].amount += amount;
    }
    getByType(type) {
        if (this.items[type]) {
            return this.items[type];
        }
        return false;
    }
    getTypeKeys(type) {
        return Object.keys(this.getByType(type));
    }
    getByTypeAndItem(type, item) {
        if (this.items[type] && this.items[type][item]) {
            if (this.items[type][item].amount > 0) {
                return this.items[type][item];
            }
        }
        return 0;
    }
}
