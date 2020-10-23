class MouseHandler {
    constructor(parent) {
        this.parent = parent;
    }
    setParent(parent) {
        this.parent = parent;
    }
    add(target, type, functionName) {
        let el = document.querySelectorAll(target);
        for (let i = 0; i < el.length; i++) {
            el[i].addEventListener(type, (event) => {
                this.parent[functionName](event);
            });
        }
    }
}
