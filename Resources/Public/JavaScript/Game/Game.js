function Game(ctx, ctx2, playerName) {
    this.ctx = ctx;
    this.ctx2 = ctx2;
    this.playerName = playerName;

    this.delta = 0;
    this.raF = 0;
    this.stopGame = false;

    this.lastTimestamp = 0;

    // this.animate freaks out otherwise
    var myself = this;
    this.animate = function() {
        var now = Date.now(),
            timeDelta = (now - (this.lastTimestamp || now)) / 1000; // in seconds
        myself.delta = timeDelta * 30; // meaning: 30px per second

        // clear both canvas
        myself.ctx.save();
        // used to removed old translate
        myself.ctx.setTransform(1, 0, 0, 1, 0, 0);
        myself.ctx.clearRect(0, 0, myself.ctx.canvas.width, myself.ctx.canvas.height);
        myself.ctx.restore();

        this.lastTimestamp = now;
        myself.draw();

        if (!myself.stopGame == true) {
            myself.raF = requestAnimationFrame(myself.animate);
        }
    }
    this.init = function(floorSettings, allTiles) {
        $('body').addClass('loading-done');
        this.stopGame = false;
        game.run(allTiles, floorSettings);
    }
    this.run = function(allTiles, floorSettings) {
        var hasPlayer = false;
        this.ui = new Ui(this.ctx2);
        if (typeof this.player != 'undefined') {
            this.player = this.player;
            hasPlayer = true;
        } else {
            this.player = new Player(this.ctx2);
            this.player.getPlayer(playerName);
            this.ui.repaint = true;
        }
        this.floor = new Floor(this.ctx, floorSettings);
        this.resize(true);
        if (hasPlayer == true) {
            this.animate();
        }
    }
    this.newFloor = function(newFloor, reset = false) {
        $('body').removeClass('loading-done');
        this.stopGame = true;
        if (!floorSettings[newFloor] || reset == true) {
            ajaxHandler(getFloor,
                data = {
                    type: 'getFloor',
                    level: newFloor
                });
        } else {
            // set delay higher if it doesn't work
            setTimeout(() => {
                this.init(floorSettings[newFloor], allTiles);
            }, 1);
        }
    }
    this.draw = function() {
        this.floor.draw();
        if (game.ui.repaint == true) {
            this.ui.draw();
        }
    }
    this.resize = function() {
        canvasBeforH = this.ctx.canvas.height;
        canvasBeforW = this.ctx.canvas.width;
        this.ctx.canvas.width = $('body').width();
        this.ctx.canvas.height = $('body').height();
        this.ctx2.canvas.width = $('body').width();
        this.ctx2.canvas.height = $('body').height();
        this.ui.repaint = true;
        this.floor.resize(canvasBeforH, canvasBeforW);
        this.player.resize();
        if (this.stopGame == true) {
            this.draw();
        }
    }
}

function getAllTiles(result, params = '') {
    var tileAmount = result.length;
    for (i = 0; i < result.length; i++) {
        var image = new Image(100, 100);
        image.src = gameBaseUrl + result[i].type + '/' + result[i].source;
        image.onload = function() {
            tileAmount--;
            $('.loaderbar').css('width', (100 / tileAmount) + '%');
            if (!tileAmount) {
                params.type = 'getFloor';
                ajaxHandler(getFloor, params);
            }
        };
        allTiles[result[i].uid] = {
            image: image,
            settings: result[i]
        };
    }
}

function getFloor(result, params = '') {
    if (result.result) {
        floorSettings[result.result.level] = {
            level: result.result.level,
            startX: result.result.startX,
            startY: result.result.startY,
            endLink: result.result.endLink,
            height: result.result.height,
            width: result.result.width,
            tiles: JSON.parse(result.result.tile_json)
        }
    }
    if (game == null) {
        var player = playerGet || prompt("Please enter your name");
        //var player = "fs";
        game = new Game(ctx, ctx2, player);
    }
    game.init(floorSettings[result.result.level], allTiles);
}
