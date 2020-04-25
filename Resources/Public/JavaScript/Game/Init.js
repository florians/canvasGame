var showHitBox = false,
    // get game container and start game
    c = document.getElementById('gameCanvas'),
    ctx = c.getContext('2d'),
    // static game container
    c2 = document.getElementById('gameCanvas2'),
    ctx2 = c2.getContext('2d'),

    gameBaseUrl = 'Resources/Public/Images/Floor/',
    // default start level
    floorLevel = 1,
    allowedKeys = [38, 87, 40, 83, 37, 65, 39, 68, 13, 70];

    keyPressed = {
        up: false,
        down: false,
        left: false,
        right: false
    },
    allTiles = [],
    floorSettings = [],
    game = null,
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


// preloading data + start the game
ajaxHandler(getAllTiles,
    data = {
        type: 'getAllTiles',
        level: floorLevel
    });

$(window).resize(function() {
    game.resize();
});
