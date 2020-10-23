// virtual joystick
var joystickOffset = 25,
    joystick = new VirtualJoystick({
        container: document.getElementById('mobileControls'),
        mouseSupport: true,
        limitStickTravel: true,
        stickRadius: joystickOffset * 2,
        strokeStyle: '#868686'
    }),
    joystickInterval = null,
    isTouched = false,
    disableJoystick = false;

$('#mobileControls').on('touchstart mousedown', function(e) {
    e.preventDefault();
    isTouched = true;
    joystickInterval = virtualJoystickInterval();
}).on('touchend mouseup', function(e) {
    e.preventDefault();
    clearInterval(joystickInterval);
    isTouched = false;
    keyboardHandler.reset();
});


function virtualJoystickInterval() {
    return setInterval(function() {
        if (isTouched) {
            if (joystick.deltaY() < -joystickOffset && (joystick.deltaX() > -joystickOffset || joystick.deltaX() < joystickOffset)) {
                keyboardHandler.set('up');
            } else if (joystick.deltaY() > joystickOffset && (joystick.deltaX() > -joystickOffset || joystick.deltaX() < joystickOffset)) {
                keyboardHandler.set('down');
                keyboardHandler.set('up', false);
            } else {
                keyboardHandler.set('up', false);
                keyboardHandler.set('down', false);
            }
            if (joystick.deltaX() < -joystickOffset && (joystick.deltaY() > -joystickOffset || joystick.deltaY() < joystickOffset)) {
                keyboardHandler.set('left');
                keyboardHandler.set('right', false);
            } else if (joystick.deltaX() > joystickOffset && (joystick.deltaY() > -joystickOffset || joystick.deltaY() < joystickOffset)) {
                keyboardHandler.set('right');
                keyboardHandler.set('left', false);
            } else {
                keyboardHandler.set('right', false);
                keyboardHandler.set('left', false);
            }
        }
    }, 1000 / 60);
}
