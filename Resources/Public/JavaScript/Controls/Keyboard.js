class KeyboardHandler {
    constructor() {
        this.allowedKeys = [38, 87, 40, 83, 37, 65, 39, 68, 13, 70];
        this.keyPressed = {
            up: false,
            down: false,
            left: false,
            right: false
        }
    }
    get(direction) {
        return this.keyPressed[direction]
    }

    set(direction, state = true) {
        this.keyPressed[direction] = state;
    }
    reset() {
        this.keyPressed.up = false;
        this.keyPressed.down = false;
        this.keyPressed.left = false;
        this.keyPressed.right = false;
    }

}
let keyboardHandler = new KeyboardHandler();

$(document).keydown(function(e) {
    if ($.inArray(e.keyCode, keyboardHandler.allowedKeys) !== -1 && !$('body').hasClass('battle')) {
        e.preventDefault();
        // w / up
        if (e.keyCode == 38 || e.keyCode == 87) {
            keyboardHandler.set('up');
        }
        // s / down
        if (e.keyCode == 40 || e.keyCode == 83) {
            keyboardHandler.set('down');
        }
        // a / left
        if (e.keyCode == 37 || e.keyCode == 65) {
            keyboardHandler.set('left');
        }
        // d / right
        if (e.keyCode == 39 || e.keyCode == 68) {
            keyboardHandler.set('right');
        }
        if (e.keyCode == 70) {
            fullscreen.toggle();
        }
    } else {
        keyboardHandler.reset();
    }
}).keyup(function(e) {
    if (e.keyCode == 38 || e.keyCode == 87) {
        keyboardHandler.set('up', false);
    }
    // s / down
    if (e.keyCode == 40 || e.keyCode == 83) {
        keyboardHandler.set('down', false);
    }
    // a / left
    if (e.keyCode == 37 || e.keyCode == 65) {
        keyboardHandler.set('left', false);
    }
    // d / right
    if (e.keyCode == 39 || e.keyCode == 68) {
        keyboardHandler.set('right', false);
    }
});
