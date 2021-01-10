class MouseHandler {
    constructor(parent) {
        this.parent = parent;
    }
    add(target, type, functionName, obj = null) {
        let el = '';
        if (target != document) {
            el = document.querySelectorAll(target);
        } else {
            el = document;
        }
        for (let i = 0; i < el.length; i++) {
            el[i].addEventListener(type, (event) => {
                event.stopPropagation();
                event.preventDefault();
                if (obj) {
                    obj[functionName](event);
                } else {
                    this.parent[functionName](event);
                }
            });
        }
    }
}
