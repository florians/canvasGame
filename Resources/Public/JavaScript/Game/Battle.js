class Battle {
    constructor() {
        this.turn = 'player';
        _game.enemy = new Enemy();
        // show on battle end
        $('#mobileControls').hide();
        $('body').addClass('battle');
    }

    drawBackground() {
        _ctxUi.globalAlpha = 0.8;
        _ctxUi.fillStyle = 'rgb(0,0,0)';
        _ctxUi.fillRect(0, 0, _ctxUi.canvas.width, _ctxUi.canvas.height);
        _ctxUi.globalAlpha = 1;
    }
    draw() {
        _ctxUi.fillStyle = 'rgb(50,50,50)';
        _ctxUi.fillRect(0, _ctxUi.canvas.height / 2, _ctxUi.canvas.width, _ctxUi.canvas.height / 2);
    }
}


$(document).on('click', 'body.battle', function(e) {
    //console.log(e.clientX);
    var mPos = {
        x: e.clientX,
        y: e.clientY
    };
    for (var i = 0; i < _game._player.skills.length; i++) {
        if (isColliding(mPos, _game._player.skills[i])) {
            _game.ui.removeStat('enemy', 'hp', _game._player.skills[i].value);
            _game.ui.draw();
            if (_game.enemy.stats.hp.current > 0) {
                setTimeout(() => {
                    _game.enemy.attack();
                }, 100);
            }
        }
    }
});

function isColliding(obj1, obj2) {
    if (obj1.x > obj2.x && obj1.x < obj2.x + obj2.w && obj1.y > obj2.y && obj1.y < obj2.y + obj2.h) {
        return true;
    } else {
        return false;
    }
}
