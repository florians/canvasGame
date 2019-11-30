// get game container and start game
var c = document.getElementById("gameCanvas");
var ctx = c.getContext("2d");

var c2 = document.getElementById("gameCanvas2");
var ctx2 = c2.getContext("2d");

var gameBaseUrl = "Resources/Images/";
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
                image.src = 'Resources/Images/Floor/' + data[i].source;
                image.onload = function() {
                    tileAmount--;
                    if (!tileAmount) {
                        getFloor(floorLevel);
                    }
                };
                allTiles[data[i].type] = {
                    image: image,
                    type: data[i].type,
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
    this.getTileInfo = function(type, info) {
        return allTiles[type][info];
    }
    this.generateFloor = function() {
        element = 0;
        // first render and after resize
        if (this.floorElements.length == 0 || this.doFloorResize == 1) {
            for (r = 0; r < this.floorSettings.height; r++) {
                this.b = Math.floor(this.stageY + (this.partH * r));
                for (c = 0; c < this.floorSettings.width; c++) {
                    this.a = Math.floor(this.stageX + (this.partW * c));

                    if (this.floorSettings.tiles[element] && this.floorSettings.tiles[element].type) {
                        this.floorElements[element] = {
                            x: this.a,
                            y: this.b,
                            w: this.partW,
                            h: this.partH,
                            collision: this.getTileInfo(this.floorSettings.tiles[element].type, "collision"),
                            type: this.getTileInfo(this.floorSettings.tiles[element].type, "type") || "empty",
                            offsetTop: this.getTileInfo(this.floorSettings.tiles[element].type, "offsetTop"),
                            offsetBottom: this.getTileInfo(this.floorSettings.tiles[element].type, "offsetBottom"),
                            offsetLeft: this.getTileInfo(this.floorSettings.tiles[element].type, "offsetLeft"),
                            offsetRight: this.getTileInfo(this.floorSettings.tiles[element].type, "offsetRight")
                        }
                    } else {
                        this.floorElements[element] = {
                            x: this.a,
                            y: this.b,
                            w: this.partW,
                            h: this.partH,
                            collision: true
                        }
                    }
                    this.createBlocks(element);
                    element++;
                }
            }
            this.doFloorResize = 0;
        } else {
            // every other run
            for (r = 0; r < this.floorElements.length; r++) {
                this.createBlocks(r);
            }
        }
    }
    this.createBlocks = function(counter) {
        if (allTiles[this.floorElements[counter].type]) {
            ctx.drawImage(
                this.getTileInfo(this.floorElements[counter].type, "image"),
                this.floorElements[counter].x,
                this.floorElements[counter].y,
                this.floorElements[counter].h,
                this.floorElements[counter].w
            );
        } else {
            ctx.fillStyle = "rgb(0,0,0)";
            ctx.fillRect(
                this.floorElements[counter].x,
                this.floorElements[counter].y,
                this.floorElements[counter].h,
                this.floorElements[counter].w
            );
        }
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
        collision = {};
        for (i = 0; i < el.length; i++) {

            var right = -this.stageOffsetX + game.player.x + game.player.w;
            var left = -this.stageOffsetX + game.player.x;
            var top = -this.stageOffsetY + game.player.y + game.player.h;
            var bottom = -this.stageOffsetY + game.player.y;

            // e = element
            if (el[i] && el[i].collision == true || el[i].type == "end") {
                eRight = el[i].x - this.stageX + (el[i].offsetRight || 0);
                eLeft = el[i].x - this.stageX + this.partW - (el[i].offsetLeft || 0);
                eTop = el[i].y - this.stageY + (el[i].offsetTop || 0);
                eBottom = el[i].y - this.stageY + this.partH - (el[i].offsetBottom || 0);
                if (right >= eRight && left <= eLeft && top >= eTop && bottom <= eBottom) {
                    cOffsetLeftRight = bottom + 0.1 <= eBottom && top - 0.1 >= eTop;
                    cOffsetBottomTop = right - 0.1 >= eRight && left + 0.1 <= eLeft;

                    if (el[i].type == "end") {
                        //this.changeLevel();
                        game.newFloor(floorSettings.endLink);
                    } else {

                        if (keyPressed.right && right == eRight && cOffsetLeftRight) {
                            collision.right = true;
                        }
                        if (keyPressed.left && left == eLeft && cOffsetLeftRight) {
                            collision.left = true;
                        }
                        if (keyPressed.down && top == eTop && cOffsetBottomTop) {
                            collision.top = true;
                        }
                        if (keyPressed.up && bottom == eBottom && cOffsetBottomTop) {
                            collision.bottom = true;
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

        var stageEndRight = this.stageX + (this.floorSettings.startX * this.partW) - this.stageWidth + this.playerOffsetX + game.player.w;
        var stageEndLeft = this.stageX + (this.floorSettings.startX * this.partW) + this.playerOffsetX;
        var stageEndTop = this.stageY + (this.floorSettings.startY * this.partH) - this.stageHeight + this.playerOffsetY + game.player.h;
        var stageEndBottom = this.stageY + (this.floorSettings.startY * this.partH) + this.playerOffsetY;

        // up / down
        if (keyPressed.up && !keyPressed.down) {
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

        this.ctx.save();
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        //myself.ctx2.clearRect(0, 0, myself.ctx.canvas.width, myself.ctx.canvas.height);

        //this.ctx.drawImage(this.player.image, this.x, this.y, this.floor.image.width, this.floor.image.height);

        ctx.fillStyle = "rgb(255,0,0)";


        //ctx.translate(this.x + this.w / 2, this.y + this.h / 2);
        ctx.translate(this.x + this.w / 2, this.y + this.h / 2);
        if (keyPressed.up && keyPressed.right) {
            ctx.rotate(45 * Math.PI / 180);
        }
        if (keyPressed.up && keyPressed.left) {
            ctx.rotate(315 * Math.PI / 180);
        }
        if (keyPressed.down && keyPressed.right) {
            ctx.rotate(135 * Math.PI / 180);
        }
        if (keyPressed.down && keyPressed.left) {
            ctx.rotate(225 * Math.PI / 180);
        }
        ctx.fillRect(-this.h / 2, -this.w / 2, this.h, this.w);
        //ctx.fillRect(this.x, this.y, this.h, this.w);
        // if (keyPressed.up && keyPressed.left) {
        //     ctx.rotate(45 * Math.PI / 180);
        // }
        ctx.translate(100, 100);
        this.ctx.restore();


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

        // clear the whole stage
        myself.ctx.save();
        myself.ctx.setTransform(1, 0, 0, 1, 0, 0);
        myself.ctx.clearRect(0, 0, myself.ctx.canvas.width, myself.ctx.canvas.height);
        //myself.ctx2.clearRect(0, 0, myself.ctx.canvas.width, myself.ctx.canvas.height);
        myself.ctx.restore();

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


if (is_touch_device() === true) {
    $('html').addClass('isTouch');
    $('.mobileControls > div').on('touchstart', function() {
        if ($(this).attr('class') == "up") {
            keyPressed.up = true;
        }
        if ($(this).attr('class') == "down") {
            keyPressed.down = true;
        }
        if ($(this).attr('class') == "left") {
            keyPressed.left = true;
        }
        if ($(this).attr('class') == "right") {
            keyPressed.right = true;
        }
    }).on('touchend', function() {
        if ($(this).attr('class') == "up") {
            keyPressed.up = false;
        }
        if ($(this).attr('class') == "down") {
            keyPressed.down = false;
        }
        if ($(this).attr('class') == "left") {
            keyPressed.left = false;
        }
        if ($(this).attr('class') == "right") {
            keyPressed.right = false;
        }
    });
}
$('.fullscreen').on('click', function() {
    game.handleFullscreen();
});

getAllTiles();

$(window).resize(function() {
    game.resize();
});
