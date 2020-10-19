class Player {
    constructor(player) {
        this.w = 50;
        this.h = 50
        this.offsetTop = Math.round(this.h / 2);
        this.offsetBottom = Math.round(this.h / 2);;
        this.offsetLeft = Math.round(this.w / 2);
        this.offsetRight = Math.round(this.w / 2);
        this.x = 0;
        this.y = 0;
        this.items = [];
        this.skills = [];
        this.stats = {};
        this.init(player);

    }
    init(player) {
        this.name = player.name;
        this.level = parseInt(player.level);
        this.stats = JSON.parse(player.stats);
        this.stats.hp.current = this.stats.hp.max;
        this.stats.es.current = 0;
        return this;
    }
    // save player tp DB
    savePlayer() {
        _game.loader.add('data', '', {
            type: 'savePlayer',
            name: this.name,
            level: this.level,
            stats: JSON.stringify(this.stats)
        });
    }
    draw() {
        // player stuff
        _game.ui.drawStat(this.stats.hp, 0, 0, 20, 'rgb(255,0,0)');
        if (this.stats.es.current > 0) {
            _game.ui.drawStat(this.stats.es, 0, 10, 10, 'rgb(0,0,255)');
        }
        if (this.stats.exp.current > 0) {
            _game.ui.drawStat(this.stats.exp, 0, 20, 5, 'rgb(0,255,0)');
        }
        if (this.items) {
            _game.ui.drawItem(this.items, 0, 25, 50, 50);
        }
        if (_game.battle) {
            _game.ui.drawSkills(this.skills, 5, (_ctxUi.canvas.height / 2) + 5, 150, 30);
        }
        _game.ui.repaint = false;
    }
    resize() {
        //this.resize = function() {
        this.x = Math.floor(_ctxUi.canvas.width / 2 - this.w / 2);
        this.y = Math.floor(_ctxUi.canvas.height / 2 - this.h / 2);
    }
    drawPlayer() {
        //this.drawPlayer = function() {
        // save already rendered ctx to only translate player
        _ctxUi.save();
        _ctxUi.translate(this.x + this.w / 2, this.y + this.h / 2);
        _ctxUi.arc(0, 0, this.w / 2, 0, Math.PI * 2, true);
        _ctxUi.fillStyle = 'rgb(255,0,0)';
        _ctxUi.fill();
        // restore all saved ctx with new object
        _ctxUi.restore();
    }
    levelUp() {
        //this.levelUp = function() {
        this.level += 1;
        this.stats.hp.max += 1;
        this.stats.hp.current = this.stats.hp.max;
        this.stats.exp.max += 1;
        this.stats.exp.current = 0;
    }
}

// function getPlayer(r, params = '') {
//     let result = r.result;
//     // no db result = default player
//     let name = 'No name';
//     if (result == null) {
//         _game._player.name = params.name;
//         _game._player.level = 1;
//         _game._player.stats = {
//             hp: {
//                 max: 4,
//                 current: 4
//             },
//             es: {
//                 current: 0
//             },
//             mp: {
//                 max: 4,
//                 current: 1
//             },
//             exp: {
//                 max: 3,
//                 current: 0
//             }
//         }
//
//         name = params.name;
//     } else {
//         _game._player.name = result.name;
//         _game._player.level = parseInt(result.level);
//         _game._player.stats = JSON.parse(result.stats);
//         _game._player.stats.hp.current = _game._player.stats.hp.max;
//         _game._player.stats.es.current = 0;
//         name = result.name;
//     }
//     ajaxHandler(getSkills,
//         data = {
//             type: 'getSkills',
//             name: name
//         });
// }
//
// function getSkills(result, params = '') {
//     if (result.length > 0) {
//         _game._player.skills = result;
//     } else {
//         _game._player.skills[0] = {
//             cost: '3',
//             level: '2',
//             name: 'Hit',
//             text: 'hit text',
//             turns: '0',
//             type: '4',
//             value: '2',
//         };
//     }
//     // start the game when player is loaded / set
//     _game.animate();
// }
