// get game container and start game
var c = document.getElementById("gameCanvas");
var ctx = c.getContext("2d");

var c2 = document.getElementById("gameCanvas2");
var ctx2 = c2.getContext("2d");

var gameBaseUrl = "Resources/Images/Floor/";
var ajaxUrl = "Resources/PHP/ajax.php";

var allTiles = [];
var floorSettings = [];
var game = null;
var floorLevel = 1;

var keyPressed = {
    up: false,
    down: false,
    left: false,
    right: false
}

var myRequestAnimationFrame = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback) {
        window.setTimeout(callback, 10);
    };
var cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;

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
                    type: data[i].type,
                    name: data[i].name,
                    color: data[i].color,
                    source: data[i].source,
                    collision: parseInt(data[i].collision) ? true : false,
                    offsetTop: parseInt(data[i].offsetTop),
                    offsetRight: parseInt(data[i].offsetRight),
                    offsetLeft: parseInt(data[i].offsetLeft),
                    offsetBottom: parseInt(data[i].offsetBottom)
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
            data = JSON.parse(data)[0];
            floorSettings = {
                startX: data.startX,
                startY: data.startY,
                endX: data.endX,
                endY: data.endY,
                height: data.height,
                width: data.width,
                level: data.level,
                startLink: data.startLink,
                endLink: data.endLink,
                tiles: JSON.parse(data.tile_json)
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
    this.collisionBoundary = 10;
    this.x = 0;
    this.y = 0;
    this.stageX = 0;
    this.stageY = 0;
    this.stageOffsetX = 0;
    this.stageOffsetY = 0;

    this.playerOffsetX = Math.floor(this.partW / 2 - game.player.w / 2);
    this.playerOffsetY = Math.floor(this.partH / 2 - game.player.h / 2);
    this.floorSettings = floorSettings;
    this.stageHeight = this.floorSettings.height * this.partH;
    this.stageWidth = this.floorSettings.width * this.partW;

    this.floorElements = [];

    this.resize = function(h, w) {
        this.stageX = Math.floor(ctx.canvas.width / 2 - (this.floorSettings.startX * this.partW) - game.player.w / 2 - this.playerOffsetX);
        this.stageY = Math.floor(ctx.canvas.height / 2 - (this.floorSettings.startY * this.partH) - this.partH + game.player.h / 2 + this.playerOffsetY);
        this.stageOffsetX = this.stageX;
        this.stageOffsetY = this.stageY;
        this.doFloorResize = 1;
    }
    this.getTileInfo = function(type, name, info) {
        return allTiles[type][name][info];
    }
    this.generateFloor = function() {
        var element = 0;
        var a = 0;
        var b = 0;
        // first render and after resize
        if (this.floorElements.length == 0 || this.doFloorResize == 1) {
            for (r = 0; r < this.floorSettings.height; r++) {
                b = Math.floor(this.stageY + (this.partH * r));
                for (c = 0; c < this.floorSettings.width; c++) {
                    a = Math.floor(this.stageX + (this.partW * c));
                    if (this.floorSettings.tiles[element] && this.floorSettings.tiles[element].type) {
                        this.floorElements[element] = {
                            x: a,
                            y: b,
                            w: this.partW,
                            h: this.partH,
                            collision: this.getTileInfo(this.floorSettings.tiles[element].type, this.floorSettings.tiles[element].name, "collision"),
                            type: this.getTileInfo(this.floorSettings.tiles[element].type, this.floorSettings.tiles[element].name, "type"),
                            name: this.getTileInfo(this.floorSettings.tiles[element].type, this.floorSettings.tiles[element].name, "name"),
                            offsetTop: this.getTileInfo(this.floorSettings.tiles[element].type, this.floorSettings.tiles[element].name, "offsetTop"),
                            offsetBottom: this.getTileInfo(this.floorSettings.tiles[element].type, this.floorSettings.tiles[element].name, "offsetBottom"),
                            offsetLeft: this.getTileInfo(this.floorSettings.tiles[element].type, this.floorSettings.tiles[element].name, "offsetLeft"),
                            offsetRight: this.getTileInfo(this.floorSettings.tiles[element].type, this.floorSettings.tiles[element].name, "offsetRight")
                        }
                    } else {
                        this.floorElements[element] = {
                            x: a,
                            y: b,
                            w: this.partW,
                            h: this.partH,
                            collision: true,
                            offsetTop: 0,
                            offsetBottom: 0,
                            offsetLeft: 0,
                            offsetRight: 0
                        }
                    }
                    if (this.isInView(a, b)) {
                        this.createBlocks(element);
                    }
                    element++;
                }
            }
            this.doFloorResize = 0;
        } else {
            // every other run
            for (r = 0; r < this.floorElements.length; r++) {
                if (this.isInView(this.floorElements[r].x, this.floorElements[r].y)) {
                    this.createBlocks(r);
                }
            }
        }
    }
    this.isInView = function(x, y) {
        if (
            -this.stageOffsetX + this.stageX - this.partW < x &&
            -this.stageOffsetX + this.stageX + ctx.canvas.width + this.partW > x &&
            -this.stageOffsetY + this.stageY - this.partH < y &&
            -this.stageOffsetY + this.stageY + ctx.canvas.height + this.partH > y
        ) {
            return true;
        }
    }
    this.createBlocks = function(counter, draw) {
        if (allTiles[this.floorElements[counter].type]) {
            ctx.drawImage(
                this.getTileInfo(this.floorElements[counter].type, this.floorElements[counter].name, "image"),
                this.floorElements[counter].x,
                this.floorElements[counter].y,
                this.floorElements[counter].h,
                this.floorElements[counter].w
            );
        }
        // else if (!allTiles[this.floorElements[counter].type] && draw == true) {
        //     ctx.fillStyle = "rgb(255,0,0)";
        //     ctx.fillRect(
        //         this.floorElements[counter].x,
        //         this.floorElements[counter].y,
        //         this.floorElements[counter].h,
        //         this.floorElements[counter].w
        //     );
        // }
    }
    this.draw = function() {
        // move canvas content
        ctx.translate(this.x, this.y);
        // generate floor
        this.generateFloor();
        // check on collisions
        collision = this.collision(this.floorElements);
        // check border collision
        this.stageMoveCollision(collision);
    }
    this.collision = function(el) {
        var collision = {};
        var pRight = 0;
        var pLeft = 0;
        var pTop = 0;
        var pBottom = 0;
        var eRight = 0;
        var eLeft = 0;
        var eTop = 0;
        var eBottom = 0;
        for (i = 0; i < el.length; i++) {
            // e = element
            if (el[i] && el[i].collision == true) {
                pRight = -this.stageOffsetX + game.player.x + game.player.w;
                eLeft = el[i].x - this.stageX + el[i].offsetLeft;

                if (pRight + this.collisionBoundary >= eLeft) {
                    pLeft = -this.stageOffsetX + game.player.x;
                    eRight = el[i].x - this.stageX + this.partW - el[i].offsetRight;

                    if (pLeft - this.collisionBoundary <= eRight) {
                        pBottom = -this.stageOffsetY + game.player.y + game.player.h;
                        eTop = el[i].y - this.stageY + el[i].offsetTop;

                        if (pBottom + this.collisionBoundary >= eTop) {
                            pTop = -this.stageOffsetY + game.player.y;
                            eBottom = el[i].y - this.stageY + this.partH - el[i].offsetBottom;
                            if (pTop - this.collisionBoundary <= eBottom) {
                                if (pRight >= eLeft && pLeft <= eRight && pBottom >= eTop && pTop <= eBottom) {
                                    cOffsetLeftRight = pTop + 0.1 <= eBottom && pBottom - 0.1 >= eTop;
                                    cOffsetBottomTop = pRight - 0.1 >= eLeft && pLeft + 0.1 <= eRight;

                                    if (el[i].type == "end") {
                                        game.newFloor(floorSettings.endLink);
                                    } else {

                                        if (keyPressed.right && pRight == eLeft && cOffsetLeftRight) {
                                            collision.right = true;
                                        }
                                        if (keyPressed.left && pLeft == eRight && cOffsetLeftRight) {
                                            collision.left = true;
                                        }
                                        if (keyPressed.down && pBottom == eTop && cOffsetBottomTop) {
                                            collision.top = true;
                                        }
                                        if (keyPressed.up && pTop == eBottom && cOffsetBottomTop) {
                                            collision.bottom = true;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        if (collision) {
            return collision;
        } else {
            return false;
        }
    }
    this.stageMoveCollision = function(collision) {
        var step = this.steps;
        var stuck = false;
        var stageEndRight = 0;
        var stageEndLeft = 0;
        var stageEndTop = 0;
        var stageEndBottom = 0;

        // up / down
        if (keyPressed.up && !keyPressed.down) {
            stageEndBottom = this.stageY + (this.floorSettings.startY * this.partH) + this.playerOffsetY;
            stuck = false;
            if (this.stageOffsetY == stageEndBottom || collision.bottom) {
                this.y = 0;
                this.stageOffsetY += 0;
                stuck = true;
            }
            if (!stuck && this.stageOffsetY < stageEndBottom && !collision.bottom) {
                this.y = step;
                this.stageOffsetY += step;
            }
        } else if (keyPressed.down && !keyPressed.up) {
            stageEndTop = this.stageY + (this.floorSettings.startY * this.partH) - this.stageHeight + this.playerOffsetY + game.player.h;
            stuck = false;
            if (this.stageOffsetY == stageEndTop || collision.top) {
                this.y = 0;
                this.stageOffsetY -= 0;
                stuck = true;
            }
            if (!stuck && this.stageOffsetY > stageEndTop && !collision.top) {
                this.y = -step;
                this.stageOffsetY -= step;
            }
        } else {
            this.y = 0;
            this.stageOffsetY += 0;
        }
        // left / right
        if (keyPressed.left && !keyPressed.right) {
            stageEndLeft = this.stageX + (this.floorSettings.startX * this.partW) + this.playerOffsetX;
            stuck = false;
            if (this.stageOffsetX == stageEndLeft || collision.left) {
                this.x = 0;
                this.stageOffsetX += 0;
                stuck = true;
            }
            if (!stuck && this.stageOffsetX < stageEndLeft && !collision.left) {
                this.x = step;
                this.stageOffsetX += step;
            }
        } else if (keyPressed.right && !keyPressed.left) {
            stageEndRight = this.stageX + (this.floorSettings.startX * this.partW) - this.stageWidth + this.playerOffsetX + game.player.w;
            stuck = false;
            if (this.stageOffsetX == stageEndRight || collision.right) {
                this.x = 0;
                this.stageOffsetX += 0;
                stuck = true;
            }
            if (!stuck && this.stageOffsetX > stageEndRight && !collision.right) {
                this.x = -step;
                this.stageOffsetX -= step;
            }
        } else {
            this.x = 0;
            this.stageOffsetX += 0;
        }
    }
}


function Player(ctx) {
    this.ctx = ctx;
    this.w = 50;
    this.h = 50

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
        this.ctx.fillRect(-this.h / 2, -this.w / 2, this.h, this.w);
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
    var lastTimestamp = 0;
    this.delta = 0;
    this.raF = 0;
    this.stopGame = false;

    var myself = this;
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
        var doc = window.document;
        var docEl = doc.documentElement;

        var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
        var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

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
var joystickOffset = 25;
var joystick = new VirtualJoystick({
    container: document.getElementById('mobileControls'),
    mouseSupport: true,
    limitStickTravel: true,
    stickRadius: joystickOffset * 2,
    strokeStyle: "#008000"
});
var joystickInterval = null;
var isTouched = false;


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
