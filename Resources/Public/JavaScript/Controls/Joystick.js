class Joystick {
    constructor() {
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
        _game.keyboardHandler.reset();
    }
    virtualJoystickInterval() {
        return setInterval(() => {
            if (this.isTouched && !document.body.classList.contains('suspended')) {
                if (this.joystick.deltaY() < -this.joystickOffset && (this.joystick.deltaX() > -this.joystickOffset || this.joystick.deltaX() < this.joystickOffset)) {
                    _game.keyboardHandler.set('up');
                } else if (this.joystick.deltaY() > this.joystickOffset && (this.joystick.deltaX() > -this.joystickOffset || this.joystick.deltaX() < this.joystickOffset)) {
                    _game.keyboardHandler.set('down');
                    _game.keyboardHandler.set('up', false);
                } else {
                    _game.keyboardHandler.set('up', false);
                    _game.keyboardHandler.set('down', false);
                }
                if (this.joystick.deltaX() < -this.joystickOffset && (this.joystick.deltaY() > -this.joystickOffset || this.joystick.deltaY() < this.joystickOffset)) {
                    _game.keyboardHandler.set('left');
                    _game.keyboardHandler.set('right', false);
                } else if (this.joystick.deltaX() > this.joystickOffset && (this.joystick.deltaY() > -this.joystickOffset || this.joystick.deltaY() < this.joystickOffset)) {
                    _game.keyboardHandler.set('right');
                    _game.keyboardHandler.set('left', false);
                } else {
                    _game.keyboardHandler.set('right', false);
                    _game.keyboardHandler.set('left', false);
                }
            }
        }, 1000 / 60);
    }
}
