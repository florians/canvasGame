class Joystick {
    constructor(parent) {
        this.parent = parent;
        this.mousehandler = new MouseHandler(this);

        this.joystickOffset = 25;
        this.joystick = new VirtualJoystick({
            container: document.getElementById('mobileControls'),
            mouseSupport: true,
            limitStickTravel: true,
            stickRadius: this.joystickOffset * 2,
            strokeStyle: '#868686'
        });
        this.joystickInterval = null;
        this.isTouched = false;
        this.disableJoystick = false;

        this.mousehandler.add('#mobileControls', 'touchstart', 'joyDown');
        this.mousehandler.add('#mobileControls', 'mousedown', 'joyDown');
        this.mousehandler.add('#mobileControls', 'touchend', 'joyUp');
        this.mousehandler.add('#mobileControls', 'mouseup', 'joyUp');
    }
    joyDown(e) {
        e.preventDefault();
        this.isTouched = true;
        this.joystickInterval = this.virtualJoystickInterval();
    }
    joyUp(e) {
        e.preventDefault();
        clearInterval(this.joystickInterval);
        this.isTouched = false;
        this.parent.keyboardHandler.reset();
    }
    virtualJoystickInterval() {
        return setInterval(() => {
            if (this.isTouched) {
                if (this.joystick.deltaY() < -this.joystickOffset && (this.joystick.deltaX() > -this.joystickOffset || this.joystick.deltaX() < this.joystickOffset)) {
                    this.parent.keyboardHandler.set('up');
                } else if (this.joystick.deltaY() > this.joystickOffset && (this.joystick.deltaX() > -this.joystickOffset || this.joystick.deltaX() < this.joystickOffset)) {
                    this.parent.keyboardHandler.set('down');
                    this.parent.keyboardHandler.set('up', false);
                } else {
                    this.parent.keyboardHandler.set('up', false);
                    this.parent.keyboardHandler.set('down', false);
                }
                if (this.joystick.deltaX() < -this.joystickOffset && (this.joystick.deltaY() > -this.joystickOffset || this.joystick.deltaY() < this.joystickOffset)) {
                    this.parent.keyboardHandler.set('left');
                    this.parent.keyboardHandler.set('right', false);
                } else if (this.joystick.deltaX() > this.joystickOffset && (this.joystick.deltaY() > -this.joystickOffset || this.joystick.deltaY() < this.joystickOffset)) {
                    this.parent.keyboardHandler.set('right');
                    this.parent.keyboardHandler.set('left', false);
                } else {
                    this.parent.keyboardHandler.set('right', false);
                    this.parent.keyboardHandler.set('left', false);
                }
            }
        }, 1000 / 60);
    }
}
