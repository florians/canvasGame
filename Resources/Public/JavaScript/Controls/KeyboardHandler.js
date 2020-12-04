class KeyboardHandler {
    constructor(parent) {
        this.parent = parent;
        this.allowedKeys = [38, 87, 40, 83, 37, 65, 39, 68, 13, 70];
        this.keyPressed = {
            up: false,
            down: false,
            left: false,
            right: false
        }
        this.add(document, 'keydown', 'defaultKeydown', this);
        this.add(document, 'keyup', 'defaultKeyup', this);
    }
    get(direction) {
        return this.keyPressed[direction]
    }
    getAll() {
        return this.keyPressed;
    }
    set(direction, state = true) {
        this.keyPressed[direction] = state;
    }
    setParent(parent) {
        this.parent = parent;
    }
    reset() {
        this.keyPressed.up = false;
        this.keyPressed.down = false;
        this.keyPressed.left = false;
        this.keyPressed.right = false;
    }
    add(target, type, functionName, obj = null) {
        let el = '';
        if (target != document) {
            el = document.querySelector(target);
        } else {
            el = document;
        }
        el.addEventListener(type, (event) => {
            if (obj) {
                this[functionName](event);
            } else {
                this.parent[functionName](event);
            }
        });
    }
    defaultKeydown(e) {
        if (this.allowedKeys.includes(e.keyCode)) {
            e.preventDefault();
            // w / up
            if (e.keyCode == 38 || e.keyCode == 87) {
                this.set('up');
            }
            // s / down
            if (e.keyCode == 40 || e.keyCode == 83) {
                this.set('down');
            }
            // a / left
            if (e.keyCode == 37 || e.keyCode == 65) {
                this.set('left');
            }
            // d / right
            if (e.keyCode == 39 || e.keyCode == 68) {
                this.set('right');
            }
        } else {
            this.reset();
        }

    }
    defaultKeyup(e) {
        if (e.keyCode == 38 || e.keyCode == 87) {
            this.set('up', false);
        }
        // s / down
        if (e.keyCode == 40 || e.keyCode == 83) {
            this.set('down', false);
        }
        // a / left
        if (e.keyCode == 37 || e.keyCode == 65) {
            this.set('left', false);
        }
        // d / right
        if (e.keyCode == 39 || e.keyCode == 68) {
            this.set('right', false);
        }
    }

}
