const gameBaseUrl = 'Resources/Public/Images/Floor/',
    _ctxWorld = document.getElementById('world').getContext('2d'),
    _ctxUi = document.getElementById('ui').getContext('2d'),
    playerName = playerGet || prompt("Please enter your name");

let showHitBox = false,
    // default start level
    floorLevel = 1,
    _game = new Game(),

    keyPressed = {
        up: false,
        down: false,
        left: false,
        right: false
    },
    // animationframe fallbacks for diff browser
    myRequestAnimationFrame = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback) {
        window.setTimeout(callback, 10);
    },
    cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;

// set fallback
window.requestAnimationFrame = myRequestAnimationFrame;

$(window).resize(function() {
    _game.resize();
});
