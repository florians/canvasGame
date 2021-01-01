const gameBaseUrl = 'Resources/Public/Images/Floor/',
    _ctxWorld = document.getElementById('world').getContext('2d', {
        desynchronized: true,
        alpha: false
    }),
    _ctxUi = document.getElementById('ui').getContext('2d', {
        desynchronized: true
    }),
    playerName = playerGet || prompt("Please enter your name");

let showHitBox = false,
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

// start the game
_game.preloader();

// set fallback
window.requestAnimationFrame = myRequestAnimationFrame;

function debounce(func) {
    var timer;

    return function(event) {
        document.body.classList.remove('loading-done');
        if (timer) clearTimeout(timer);
        timer = setTimeout(func, 100, event);
    };
}
window.addEventListener("resize", debounce(function(e) {
    document.body.classList.add('loading-done');
    _game.resize();
}));
