var showHitBox = false,
    // get game container and start game
    c = document.getElementById("gameCanvas"),
    ctx = c.getContext("2d"),

    c2 = document.getElementById("gameCanvas2"),
    ctx2 = c2.getContext("2d"),

    gameBaseUrl = "Resources/Images/Floor/",
    ajaxUrl = "Resources/PHP/ajax.php",

    allTiles = [],
    floorSettings = [],
    game = null,
    floorLevel = 1,

    keyPressed = {
        up: false,
        down: false,
        left: false,
        right: false
    },

    myRequestAnimationFrame = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback) {
        window.setTimeout(callback, 10);
    },
    cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;

window.requestAnimationFrame = myRequestAnimationFrame;

function getAllTiles() {
    return $.ajax({
        method: "POST",
        url: ajaxUrl,
        data: {
            type: "getAllTiles"
        },
        success: function(data) {
            data = JSON.parse(data);
            var tileAmount = data.length;
            for (i = 0; i < data.length; i++) {

                var image = new Image(100, 100);
                image.src = gameBaseUrl + data[i].type + "/" + data[i].source;
                image.onload = function() {
                    tileAmount--;
                    if (!tileAmount) {
                        getFloor(floorLevel);
                    }
                };
                if (!allTiles[data[i].type]) {
                    allTiles[data[i].type] = [];
                }
                allTiles[data[i].type][data[i].name] = {
                    image: image,
                    name: data[i].name,
                    type: data[i].type,
                    factor: data[i].factor,
                    subtype: data[i].subtype,
                    parts: parseInt(data[i].parts),
                    source: data[i].source,
                    collision: data[i].collision,
                    direction: data[i].direction
                };
            }
        },
        error: function(err) {
            console.log(err);
        }
    });
}

function getFloor(floorLevel) {
    return $.ajax({
        method: "POST",
        url: ajaxUrl,
        data: {
            type: "getFloor",
            level: floorLevel
        },
        success: function(data) {
            data = JSON.parse(data);
            if (data.result) {
                result = data.result[0];
                floorSettings = {
                    level: result.level,
                    startX: result.startX,
                    startY: result.startY,
                    endLink: result.endLink,
                    height: result.height,
                    width: result.width,
                    tiles: JSON.parse(result.tile_json),
                    //enemies: JSON.parse(data.enemy_json)
                }
            }
            if (game == null) {
                game = new Game(ctx, ctx2);
            }
            game.init(floorSettings, allTiles);
        },
        error: function(err) {
            console.log(err);
        }
    });
}



function Floor(ctx, allTiles, floorSettings) {
    this.ctx = ctx;
    this.partW = 100;
    this.partH = 100;
    this.steps = 5;
    this.x = 0;
    this.y = 0;
    this.stageX = 0;
    this.stageY = 0;
    this.stageOffsetX = 0;
    this.stageOffsetY = 0;
    this.oldStageOffsetX = 0;
    this.oldStageOffsetY = 0;

    this.floorSettings = floorSettings;
    this.stageHeight = this.floorSettings.height * this.partH;
    this.stageWidth = this.floorSettings.width * this.partW;
    this.playerLeft = 0;
    this.playerRight = 0;
    this.playerTop = 0;
    this.playerBottom = 0;

    this.floorElements = [];
    this.init = function() {
        this.stageX = Math.floor((this.floorSettings.startX * this.partW) + this.partW / 2);
        this.stageY = Math.floor((this.floorSettings.startY * this.partH) + this.partH / 2);
        ctx.translate(Math.floor(ctx.canvas.width / 2 - this.stageX), Math.floor(ctx.canvas.height / 2 - this.stageY));
        this.stageOffsetX = this.stageX;
        this.stageOffsetY = this.stageY;
        this.oldStageOffsetX = this.stageOffsetX;
        this.oldStageOffsetY = this.stageOffsetY;
    }

    this.resize = function(h, w) {
        this.init();
        this.doFloorResize = 1;
    }
    this.setStageOffsetX = function(stageOffsetX, force = 0) {
        this.stageOffsetX = stageOffsetX;
        this.playerLeft = Math.floor((this.stageOffsetX - game.player.offsetLeft) / this.partW);
        this.playerRight = Math.floor((this.stageOffsetX + game.player.offsetRight - 1) / this.partW);
        if (force) {
            return;
        }
        if (this.playerLeft < 0) {
            this.playerLeft = 0;
        }
        if (this.playerRight >= this.floorSettings.width) {
            this.playerRight = this.floorSettings.width - 1;
        }
    }
    this.setStageOffsetY = function(stageOffsetY, force = 0) {
        this.stageOffsetY = stageOffsetY;
        this.playerTop = Math.floor((this.stageOffsetY - game.player.offsetTop) / this.partH);
        this.playerBottom = Math.floor((this.stageOffsetY + game.player.offsetBottom - 1) / this.partH);
        if (force) {
            return;
        }
        if (this.playerTop < 0) {
            this.playerTop = 0;
        }
        if (this.playerBottom >= this.floorSettings.height) {
            this.playerBottom = this.floorSettings.height - 1;
        }
    }
    this.getTileInfo = function(type, name, info) {
        return allTiles[type][name][info];
    }
    this.generateFloor = function() {
        var element = 0,
            allElements = 0,
            a = 0,
            b = 0;
        this.stageY = 0;
        this.stageX = 0;
        // first render and after resize
        if (this.floorElements.length == 0 || this.doFloorResize == 1) {
            for (r = 0; r < this.floorSettings.height; r++) {
                b = Math.floor(this.stageY + (this.partH * r));
                for (c = 0; c < this.floorSettings.width; c++) {
                    a = Math.floor(this.stageX + (this.partW * c));
                    if (!this.floorElements[r]) {
                        this.floorElements[r] = [];
                    }
                    if (this.floorSettings.tiles[element] && this.floorSettings.tiles[element].type) {
                        // use new Tile instead >>
                        this.floorElements[r][c] = {
                            x: a,
                            y: b,
                            w: this.partW,
                            h: this.partH,
                            name: this.getTileInfo(this.floorSettings.tiles[element].type, this.floorSettings.tiles[element].name, "name"),
                            type: this.getTileInfo(this.floorSettings.tiles[element].type, this.floorSettings.tiles[element].name, "type"),
                            factor: this.getTileInfo(this.floorSettings.tiles[element].type, this.floorSettings.tiles[element].name, "factor"),
                            subtype: this.getTileInfo(this.floorSettings.tiles[element].type, this.floorSettings.tiles[element].name, "subtype"),
                            parts: this.getTileInfo(this.floorSettings.tiles[element].type, this.floorSettings.tiles[element].name, "parts"),
                            collision: this.getTileInfo(this.floorSettings.tiles[element].type, this.floorSettings.tiles[element].name, "collision"),
                            direction: this.getTileInfo(this.floorSettings.tiles[element].type, this.floorSettings.tiles[element].name, "direction"),
                            render: true
                        }
                        if (this.floorElements[r][c].subtype != "default") {
                            // needs fixing
                            //allElements = this.subtype(r, c);
                        } else {
                            this.floorElements[r][c].collision = parseInt(this.floorElements[r][c].collision);
                        }
                    } else {
                        this.floorElements[r][c] = {
                            x: a,
                            y: b,
                            w: this.partW,
                            h: this.partH,
                            collision: true,
                            render: false
                        }
                    }
                    if (this.isInView(a, b)) {
                        this.createBlocks(r, c);
                    }
                    allElements++;
                    element++;
                }
            }
            this.doFloorResize = 0;
        } else {
            // every other run
            for (r = 0; r < this.floorElements.length; r++) {
                for (c = 0; c < this.floorSettings.width; c++) {
                    if (this.isInView(this.floorElements[r][c].x, this.floorElements[r][c].y)) {
                        this.createBlocks(r, c);
                    }
                }
            }
        }
    }
    this.subtype = function(r, c) {
        var counter = 0;
        parts = this.floorElements[r][c].parts;
        subtype = this.floorElements[r][c].subtype;
        direction = this.floorElements[r][c].direction;
        collision = this.floorElements[r][c].collision.split(",");
        el = this.floorElements[r][c];
        this.floorElements[r][c].collision = false;
        if (subtype == "divided" && direction == "vertical") {
            for (i = 0; i < parts; i++) {
                counter++;
                this.floorElements[r][c] = {
                    x: el.x + ((this.partW / parts) * i),
                    y: el.y,
                    w: this.partW / parts,
                    h: this.partH,
                    collision: parseInt(collision[i]) > 0 ? 1 : 0,
                    render: false
                }
            }
        }
        if (subtype == "divided" && direction == "horizontal") {
            for (i = 0; i < parts; i++) {
                counter++;
                this.floorElements[r][c] = {
                    x: el.x,
                    y: el.y + ((this.partW / parts) * i),
                    w: this.partW,
                    h: this.partH / parts,
                    collision: parseInt(collision[i]) > 0 ? 1 : 0,
                    render: false
                }
            }
        }
        if (subtype == "edge" && direction == "cube") {
            partCount = 0;
            cubeParts = parts / 2;
            for (er = 0; er < cubeParts; er++) {
                for (ec = 0; ec < cubeParts; ec++) {
                    counter++;
                    this.floorElements[r][c] = {
                        x: el.x + ((this.partW / cubeParts) * ec),
                        y: el.y + ((this.partH / cubeParts) * er),
                        w: this.partW / cubeParts,
                        h: this.partH / cubeParts,
                        collision: parseInt(collision[partCount]) > 0 ? true : false,
                        render: false
                    }
                    partCount++;
                }
            }
        }
        return counter;
    }
    this.isInView = function(x, y) {
        if (
            x >= -game.player.x - this.partW * 2 + this.stageOffsetX &&
            x <= game.player.x + this.partW * 2 + this.stageOffsetX &&
            y >= -game.player.y - this.partH * 2 + this.stageOffsetY &&
            y <= game.player.y + this.partH * 2 + this.stageOffsetY
        ) {
            return true;
        }
    }
    this.createBlocks = function(r, c) {
        if (this.floorElements[r][c].render) {
            ctx.drawImage(
                this.getTileInfo(this.floorElements[r][c].type, this.floorElements[r][c].name, "image"),
                this.floorElements[r][c].x,
                this.floorElements[r][c].y,
                this.floorElements[r][c].w,
                this.floorElements[r][c].h
            );
        }
        if (showHitBox) {
            collisionDebug(this.floorElements[r][c]);
        }
    }
    this.draw = function() {
        // generate floor
        this.generateFloor();
        // check on collisions
        this.collision(this.floorElements);
        // move canvas content
        stageOffsetXInt = Math.round(this.stageOffsetX);
        stageOffsetYInt = Math.round(this.stageOffsetY);
        ctx.translate(this.oldStageOffsetX - stageOffsetXInt, this.oldStageOffsetY - stageOffsetYInt);
        this.oldStageOffsetX = stageOffsetXInt;
        this.oldStageOffsetY = stageOffsetYInt;
    }
    this.collision = function(el) {
        // Player Center
        var playerY = Math.floor((this.stageOffsetY) / this.partH),
            playerX = Math.floor((this.stageOffsetX) / this.partW),
            oldPlayerTop = this.playerTop,
            oldPlayerBottom = this.playerBottom,
            oldPlayerLeft = this.playerLeft,
            oldPlayerRight = this.playerRight,
            type = this.floorElements[playerY][playerX].type,
            factor = this.floorElements[playerY][playerX].factor,
            step = this.steps * factor,
            dx = 0,
            dy = 0;
        if (type == 'end') {
            game.newFloor(floorSettings.endLink);
        }
        if (keyPressed.up && !keyPressed.down) {
            dy = -step;
        } else if (!keyPressed.up && keyPressed.down) {
            dy = step;
        } else {
            dy = 0;
        }
        if (keyPressed.left && !keyPressed.right) {
            dx = -step;
        } else if (!keyPressed.left && keyPressed.right) {
            dx = step;
        } else {
            dx = 0;
        }
        this.setStageOffsetX(this.stageOffsetX + dx, 1);
        this.setStageOffsetY(this.stageOffsetY + dy, 1);

        // stage collision
        if (this.playerTop < 0 || this.playerLeft < 0 || this.playerRight >= this.floorSettings.width || this.playerBottom >= this.floorSettings.height) {
            if (this.playerTop < 0) {
                //console.log('Field Top');
                this.setStageOffsetY(game.player.offsetTop);
            }
            if (this.playerBottom >= this.floorSettings.height) {
                //console.log('Field Bottom');
                this.setStageOffsetY(this.partH * this.floorSettings.height - game.player.offsetBottom);
            }
            if (this.playerLeft < 0) {
                //console.log('Field Left');
                this.setStageOffsetX(game.player.offsetLeft);
            }
            if (this.playerRight >= this.floorSettings.width) {
                //console.log('Field Right');
                this.setStageOffsetX(this.partW * this.floorSettings.width - game.player.offsetRight);
            }
            //console.log('topBox='+this.playerTop + ",topX="+(this.stageOffsetY + game.player.offsetTop)+" playerY="+ this.stageOffsetY);
            //console.log('bottomBox='+this.playerBottom + ",bottomX="+(this.stageOffsetY + game.player.offsetBottom)+",fiedl="+ (this.floorSettings.height * this.partH-1) + ", playerY="+ this.stageOffsetY);
        }
        //console.log('bottomBox='+this.playerBottom + ",bottomX="+(this.stageOffsetY + game.player.offsetBottom)+",fiedl="+ (this.floorSettings.height * this.partH-1) + ", playerY="+ this.stageOffsetY);
        //console.log(this.playerTop,this.playerBottom,this.playerLeft,this.playerRight);
        if (dx > 0) {
            if (dy > 0) {
                this.collisionBox(oldPlayerRight, oldPlayerBottom, this.playerRight, this.playerBottom, 0, 0, dx, dy);
                this.collisionBox(oldPlayerRight, oldPlayerTop, this.playerRight, this.playerTop, 0, 1, dx, dy);
                this.collisionBox(oldPlayerLeft, oldPlayerBottom, this.playerLeft, this.playerBottom, 1, 0, dx, dy);
                this.collisionBox(oldPlayerLeft, oldPlayerTop, this.playerLeft, this.playerTop, 1, 1, dx, dy);

            } else {
                this.collisionBox(oldPlayerLeft, oldPlayerTop, this.playerLeft, this.playerTop, 1, 1, dx, dy);
                this.collisionBox(oldPlayerLeft, oldPlayerBottom, this.playerLeft, this.playerBottom, 1, 0, dx, dy);
                this.collisionBox(oldPlayerRight, oldPlayerTop, this.playerRight, this.playerTop, 0, 1, dx, dy);
                this.collisionBox(oldPlayerRight, oldPlayerBottom, this.playerRight, this.playerBottom, 0, 0, dx, dy);

            }

        } else {
            if (dy > 0) {
                this.collisionBox(oldPlayerRight, oldPlayerBottom, this.playerRight, this.playerBottom, 0, 0, dx, dy);
                this.collisionBox(oldPlayerRight, oldPlayerTop, this.playerRight, this.playerTop, 0, 1, dx, dy);
                this.collisionBox(oldPlayerLeft, oldPlayerBottom, this.playerLeft, this.playerBottom, 1, 0, dx, dy);
                this.collisionBox(oldPlayerLeft, oldPlayerTop, this.playerLeft, this.playerTop, 1, 1, dx, dy);

            } else {
                this.collisionBox(oldPlayerLeft, oldPlayerTop, this.playerLeft, this.playerTop, 1, 1, dx, dy);
                this.collisionBox(oldPlayerLeft, oldPlayerBottom, this.playerLeft, this.playerBottom, 1, 0, dx, dy);
                this.collisionBox(oldPlayerRight, oldPlayerTop, this.playerRight, this.playerTop, 0, 1, dx, dy);
                this.collisionBox(oldPlayerRight, oldPlayerBottom, this.playerRight, this.playerBottom, 0, 0, dx, dy);

            }
        }

        if (this.floorElements[this.playerBottom][this.playerRight].collision || this.floorElements[this.playerBottom][this.playerLeft].collision || this.floorElements[this.playerTop][this.playerLeft].collision || this.floorElements[this.playerTop][this.playerRight].collision) {
            //console.log('collision set to old Values');
            this.setStageOffsetX(this.oldStageOffsetX);
            this.setStageOffsetY(this.oldStageOffsetY);
        }
    }
    this.collisionBox = function(oldBoxX, oldBoxY, newBoxX, newBoxY, playerCornerLeft, playerCornerTop, dx, dy) {
        if (!this.floorElements[newBoxY][newBoxX].collision) {
            return;
        }
        //console.log('collisionBox kolidierter Ecken:' + (playerCornerLeft ? 'Links' : 'Rechts') + ", " + (playerCornerTop ? 'Oben' : 'Unten'));
        var playerOffsetX = (game.player.w / 2) * (playerCornerLeft ? 1 : -1),
            playerOffsetY = (game.player.h / 2) * (playerCornerTop ? 1 : -1),

            // erster Pixel ausserhalb von Block
            //var addBoxYPixel = playerCornerTop ? this.partH : -1;
            //var addBoxXPixel = playerCornerLeft ? this.partW : -1;

            // FS floor canvas translate
            addBoxYPixel = playerCornerTop ? this.partH : 0,
            addBoxXPixel = playerCornerLeft ? this.partW : 0,

            kanteX = this.partW * newBoxX + addBoxXPixel,
            kanteY = this.partH * newBoxY + addBoxYPixel;

        if (oldBoxY == newBoxY) {
            this.setStageOffsetX(kanteX + playerOffsetX);
            //console.log('collisionBox Korrektur X: playerOffsetX=' + playerOffsetX + ", addBoxXPixel=" + addBoxXPixel + ", kanteX=" + kanteX);
        } else if (oldBoxX == newBoxX) {
            this.setStageOffsetY(kanteY + playerOffsetY);
            //console.log('collisionBox Korrektur Y: ');
        } else {
            //Kollision untere Kante?
            //console.log("oldBoxX=" + oldBoxX + ", oldBoxY=" + oldBoxY);
            if (!this.floorElements[oldBoxY][newBoxX].collision && this.floorElements[newBoxY][oldBoxX].collision) {
                this.setStageOffsetY(kanteY + playerOffsetY);
                //console.log('collisionBox Korrektur Y: ');
            } else if (!this.floorElements[newBoxY][oldBoxX].collision && this.floorElements[oldBoxY][newBoxX].collision) {
                this.setStageOffsetX(kanteX + playerOffsetX);
                //console.log('collisionBox Korrektur X: ');
            } else {
                //console.log('collisionBox Korrektur X + Y: ');
                this.setStageOffsetX(kanteX + playerOffsetX);
                this.setStageOffsetY(kanteY + playerOffsetY);
            }
        }
    }
}


function Player(ctx) {
    this.ctx = ctx;
    this.w = 50;
    this.h = 50

    this.offsetTop = Math.round(this.h / 2);
    this.offsetBottom = Math.round(this.h / 2);;
    this.offsetLeft = Math.round(this.w / 2);
    this.offsetRight = Math.round(this.w / 2);

    this.x = 0;
    this.y = 0;
    this.draw = function() {
        // idk why i need that
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.fillStyle = "rgb(255,0,0)";
        this.ctx.translate(this.x + this.w / 2, this.y + this.h / 2);
        if (keyPressed.up && keyPressed.right) {
            this.ctx.rotate(45 * Math.PI / 180);
        }
        if (keyPressed.up && keyPressed.left) {
            this.ctx.rotate(315 * Math.PI / 180);
        }
        if (keyPressed.down && keyPressed.right) {
            this.ctx.rotate(135 * Math.PI / 180);
        }
        if (keyPressed.down && keyPressed.left) {
            this.ctx.rotate(225 * Math.PI / 180);
        }
        this.ctx.fillRect(-this.h / 2, -this.w / 2, this.w, this.h);
    }
    this.resize = function() {
        this.x = Math.floor(this.ctx.canvas.width / 2 - this.w / 2);
        this.y = Math.floor(this.ctx.canvas.height / 2 - this.h / 2);

    }

}


function Game(ctx, ctx2) {
    this.ctx = ctx;
    this.ctx2 = ctx2;
    this.allowedKeys = [38, 87, 40, 83, 37, 65, 39, 68, 13, 70];

    this.delta = 0;
    this.raF = 0;
    this.stopGame = false;
    var lastTimestamp = 0,
        myself = this;
    this.animate = function() {
        var now = Date.now(),
            timeDelta = (now - (lastTimestamp || now)) / 1000; // in seconds
        myself.delta = timeDelta * 30; // meaning: 30px per second

        // clear both canvas
        myself.ctx.save();
        myself.ctx.setTransform(1, 0, 0, 1, 0, 0);
        myself.ctx.clearRect(0, 0, myself.ctx.canvas.width, myself.ctx.canvas.height);
        myself.ctx.restore();
        myself.ctx2.save();
        myself.ctx2.setTransform(1, 0, 0, 1, 0, 0);
        myself.ctx2.clearRect(0, 0, myself.ctx2.canvas.width, myself.ctx2.canvas.height);
        myself.ctx2.restore();

        lastTimestamp = now;
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
    this.newFloor = function(newFloor) {
        $('body').removeClass('loading-done');
        this.stopGame = true;
        getFloor(newFloor);
    }
    this.run = function(allTiles, floorSettings) {
        this.allTiles = allTiles;
        this.floorSettings = floorSettings;
        this.player = new Player(this.ctx2);
        this.floor = new Floor(this.ctx, this.allTiles, this.floorSettings);
        this.resize(true);
        this.animate();
    }
    this.draw = function(stop) {
        this.floor.draw();
        this.player.draw();
    }
    this.handleFullscreen = function() {
        // The page is not in an iframe
        var doc = window.document,
            docEl = doc.documentElement,
            requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen,
            cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

        if (!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
            if (!$('body').hasClass('isFullscreen')) {
                requestFullScreen.call(docEl);
                $('body').addClass('isFullscreen');
            }
        } else {
            if ($('body').hasClass('isFullscreen')) {
                cancelFullScreen.call(doc);
                $('body').removeClass('isFullscreen');
            }
        }
    }
    this.resize = function() {
        canvasBeforH = this.ctx.canvas.height;
        canvasBeforW = this.ctx.canvas.width;
        this.ctx.canvas.width = $('body').width();
        this.ctx.canvas.height = $('body').height();
        this.ctx2.canvas.width = $('body').width();
        this.ctx2.canvas.height = $('body').height();
        this.floor.resize(canvasBeforH, canvasBeforW);
        this.player.resize();
    }
}
$(document).keydown(function(e) {
    if ($.inArray(e.keyCode, game.allowedKeys) !== -1) {
        e.preventDefault();
        // s / up
        if (e.keyCode == 38 || e.keyCode == 87) {
            keyPressed.up = true;
        }
        // s / down
        if (e.keyCode == 40 || e.keyCode == 83) {
            keyPressed.down = true;
        }
        // a / left
        if (e.keyCode == 37 || e.keyCode == 65) {
            keyPressed.left = true;
        }
        // d / right
        if (e.keyCode == 39 || e.keyCode == 68) {
            keyPressed.right = true;
        }
        if (e.keyCode == 70) {
            game.handleFullscreen();
        }
    } else {
        keyPressed.up = false;
        keyPressed.down = false;
        keyPressed.left = false
        keyPressed.right = false;
    }
}).keyup(function(e) {
    if (e.keyCode == 38 || e.keyCode == 87) {
        keyPressed.up = false;
    }
    // s / down
    if (e.keyCode == 40 || e.keyCode == 83) {
        keyPressed.down = false;
    }
    // a / left
    if (e.keyCode == 37 || e.keyCode == 65) {
        keyPressed.left = false;
    }
    // d / right
    if (e.keyCode == 39 || e.keyCode == 68) {
        keyPressed.right = false;
    }
});
$('.fullscreen').on('click', function() {
    game.handleFullscreen();
});

// virtual joystick
var joystickOffset = 25,
    joystick = new VirtualJoystick({
        container: document.getElementById('mobileControls'),
        mouseSupport: true,
        limitStickTravel: true,
        stickRadius: joystickOffset * 2,
        strokeStyle: "#008000"
    }),
    joystickInterval = null,
    isTouched = false;


$('#mobileControls').on('touchstart mousedown', function(e) {
    e.preventDefault();
    isTouched = true;
    joystickInterval = virtualJoystickInterval();
}).on('touchend mouseup', function(e) {
    e.preventDefault();
    clearInterval(joystickInterval);
    isTouched = false;
    keyPressed.up = false;
    keyPressed.down = false;
    keyPressed.right = false;
    keyPressed.left = false;
});

function virtualJoystickInterval() {
    return setInterval(function() {
        if (isTouched) {
            if (joystick.deltaY() < -joystickOffset && (joystick.deltaX() > -joystickOffset || joystick.deltaX() < joystickOffset)) {
                keyPressed.up = true;
            } else if (joystick.deltaY() > joystickOffset && (joystick.deltaX() > -joystickOffset || joystick.deltaX() < joystickOffset)) {
                keyPressed.down = true;
                keyPressed.up = false;
            } else {
                keyPressed.up = false;
                keyPressed.down = false;
            }
            if (joystick.deltaX() < -joystickOffset && (joystick.deltaY() > -joystickOffset || joystick.deltaY() < joystickOffset)) {
                keyPressed.left = true;
                keyPressed.right = false;
            } else if (joystick.deltaX() > joystickOffset && (joystick.deltaY() > -joystickOffset || joystick.deltaY() < joystickOffset)) {
                keyPressed.right = true;
                keyPressed.left = false;
            } else {
                keyPressed.right = false;
                keyPressed.left = false;
            }
        }
    }, 1000 / 60);
}


// preloading data + start the game
getAllTiles();

$(window).resize(function() {
    game.resize();
});
