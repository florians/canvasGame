class MouseHandler {
    constructor(parent) {
        this.parent = parent;
    }
    add(target, type, functionName, obj = null) {
        let el = document.querySelectorAll(target);
        for (let i = 0; i < el.length; i++) {
            el[i].addEventListener(type, (event) => {
                if (obj) {
                    obj[functionName](event);
                } else {
                    this.parent[functionName](event);
                }
            });
        }
    }
}
