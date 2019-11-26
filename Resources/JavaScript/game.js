// get game container and start game
var c = document.getElementById("gameCanvas");
var ctx = c.getContext("2d");

var c2 = document.getElementById("gameCanvas2");
var ctx2 = c2.getContext("2d");

var gameBaseUrl = "Resources/Images/";
var assets = [
    floor = {
        group: "floor",
        src: "Floor/floor.jpg"
    }
];

var floorSettings = testFloor;
var blockMovement = {
    up: false,
    down: false,
    left: false,
    right: false
}

var keyPressed = {
    up: false,
    down: false,
    left: false,
    right: false
}

var player = {
    w: 50,
    h: 50
}

function Floor(ctx, floor) {
    this.ctx = ctx;
    this.partW = 250;
    this.partH = 250;
    this.steps = 5;
    this.x,
        this.y,
        this.playerOffsetX,
        this.playerOffsetY,
        this.stageX,
        this.stageY,
        this.stageOffsetX,
        this.stageOffsetY = 0;

    this.floorSettings = floorSettings;
    this.stageHeight = this.floorSettings.size.height * this.partH;
    this.stageWidth = this.floorSettings.size.width * this.partW;

    this.floorElements = [];

    this.resize = function() {
        this.playerOffsetX = Math.floor(this.partW / 2 - player.w / 2);
        this.playerOffsetY = Math.floor(this.partH / 2 - player.h / 2);
        this.stageX = Math.floor(ctx.canvas.width / 2 - (this.floorSettings.start.x * this.partW) - player.w / 2 - this.playerOffsetX);
        this.stageY = Math.floor(ctx.canvas.height / 2 - (this.floorSettings.start.y * this.partH) - this.partH + player.h / 2 + this.playerOffsetY);
        this.stageOffsetX = this.stageX;
        this.stageOffsetY = this.stageY;
        this.doFloorResize = 1;
    }

    this.generateFloor = function() {
        element = 0;
        // first render and after resize
        if (this.floorElements.length == 0 || this.doFloorResize == 1) {
            for (r = 0; r < this.floorSettings.size.height; r++) {
                this.b = Math.floor(this.stageY + (this.partH * r));
                for (c = 0; c < this.floorSettings.size.width; c++) {
                    this.a = Math.floor(this.stageX + (this.partW * c));
                    this.floorElements[element] = {
                        x: this.a,
                        y: this.b,
                        w: this.partW,
                        h: this.partH,
                        collision: parseInt(this.floorSettings.parts[element].collision) == 1 ? true : false,
                        type: this.floorSettings.parts[element].type || "empty",
                        color: this.setFloorColor(this.floorSettings.parts[element].color || "")
                    }
                    if (this.floorElements[element].type == "empty") {
                        //this.floorElements[element].collision = true;
                    }
                    ctx.fillStyle = this.floorElements[element].color;
                    ctx.fillRect(
                        this.a,
                        this.b,
                        this.partW,
                        this.partH
                    );
                    element++;
                }
            }
            this.doFloorResize = 0;
        } else {
            // every other run
            for (r = 0; r < this.floorElements.length; r++) {
                ctx.fillStyle = this.floorElements[r].color;
                ctx.fillRect(
                    this.floorElements[r].x,
                    this.floorElements[r].y,
                    this.floorElements[r].h,
                    this.floorElements[r].w
                );
            }
        }
    }
    this.setFloorColor = function(color) {
        return color != "" ? color : "rgb(0,0,0)";
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

        // stop moving
        if (!keyPressed.up && !keyPressed.down) {
            this.y = 0;
        }
        if (!keyPressed.left && !keyPressed.right) {
            this.x = 0;
        }
    }
    this.collision = function(el) {
        for (i = 0; i < el.length; i++) {

            var right = -this.stageOffsetX + game.player.x + game.player.w;
            //-this.stageOffsetX + (this.floorSettings.start.x * this.partW) + this.stageX + game.player.w / 2;
            //-this.stageOffsetX + (this.floorSettings.start.x * this.partW) + this.stageX + game.player.w / 2;

            var left = -this.stageOffsetX + game.player.x;
            //-this.stageOffsetX + (this.floorSettings.start.x * this.partW) + this.stageX - this.partW * 2 - game.player.w / 2;
            //-this.stageOffsetX + (this.floorSettings.start.x * this.partW) + this.stageX - game.player.w / 2;

            var down = -this.stageOffsetY + game.player.y + game.player.h;
            //-this.stageOffsetY + this.stageY - this.playerOffsetY + this.partW * 2 + (this.floorSettings.start.x * this.partW) + game.player.h / 2;
            //-this.stageOffsetY + (this.floorSettings.start.y * this.partH) + this.stageY + this.playerOffsetY * 2 - game.player.h / 2;

            var up = -this.stageOffsetY + game.player.y;
            //-this.stageOffsetY + this.stageY - this.playerOffsetY + (this.floorSettings.start.x * this.partW) - game.player.h / 2;
            //-this.stageOffsetY + (this.floorSettings.start.y * this.partH) + this.stageY + this.playerOffsetY + game.player.h / 2;

            if (el[i] && el[i].collision == true) {

                // if (keyPressed.right) {
                //     console.log("r " + right, el[i].x - this.stageX);
                // }
                // if (keyPressed.left) {
                //     console.log("l " + left, el[i].x - this.stageX + this.partW);
                // }
                // if (keyPressed.down) {
                //     console.log("d " + down, el[i].y - this.stageY);
                // }
                // if (keyPressed.up) {
                //     console.log("u " + up, el[i].y - this.stageY + this.partH);
                // }
                // if (
                //     right >= el[i].x - this.stageX &&
                //     left <= el[i].x - this.stageX + this.partW
                // ) {
                //     //console.log(el[i]);
                // }
                // if (
                //     down >= el[i].y - this.stageY &&
                //     up <= el[i].y - this.stageY + this.partH
                // ) {
                //     //console.log(el[i]);
                // }




                if (
                    right >= el[i].x - this.stageX &&
                    left <= el[i].x - this.stageX + this.partW &&
                    down >= el[i].y - this.stageY &&
                    up <= el[i].y - this.stageY + this.partH
                ) {
                    return true;
                }
            }
        }
        return false;
    }
    this.stageMoveCollision = function(collision) {
        var step = this.steps;

        // up / down
        if (keyPressed.up && !keyPressed.down && this.stageOffsetY < this.stageY + (this.floorSettings.start.y * this.partH) + this.playerOffsetY) {
            if (collision == false || blockMovement.down) {
                this.y = step;
                this.stageOffsetY += step;
                blockMovement.down = false;
            } else {
                this.y = 0;
                this.stageOffsetY += 0;
                blockMovement.up = true;
            }
        } else if (keyPressed.down && !keyPressed.up && this.stageOffsetY > this.stageY - this.stageHeight + (this.floorSettings.start.y * this.partH) + this.playerOffsetY + game.player.h) {
            if (collision == false || blockMovement.up) {
                this.stageOffsetY -= step;
                this.y = -step;
                blockMovement.up = false;
            } else {
                this.y = 0;
                this.stageOffsetY += 0;
                blockMovement.down = true;
            }
        } else {
            this.y = 0;
        }

        // left / right
        if (keyPressed.left && !keyPressed.right && this.stageOffsetX < this.stageX + (this.floorSettings.start.x * this.partW) + this.playerOffsetX) {
            if (collision == false || blockMovement.right) {
                this.x = step;
                this.stageOffsetX += step;
                blockMovement.right = false;
            } else {
                this.x = 0;
                this.stageOffsetX += 0;
                blockMovement.left = true;
            }
        } else if (keyPressed.right && !keyPressed.left && this.stageOffsetX > this.stageX + (this.floorSettings.start.x * this.partW) - this.stageWidth + this.playerOffsetX + game.player.w) {
            if (collision == false || blockMovement.left) {
                this.x = -step;
                this.stageOffsetX -= step;
                blockMovement.left = false;
            } else {
                this.x = 0;
                this.stageOffsetX += 0;
                blockMovement.right = true;
            }
        } else {
            this.x = 0;

        }
    }
}

function Player(ctx) {
    this.ctx = ctx;
    this.w = player.w;
    this.h = player.h;

    this.x = 0;
    this.y = 0;
    this.draw = function() {
        //this.ctx.drawImage(this.player.image, this.x, this.y, this.floor.image.width, this.floor.image.height);
        ctx.fillStyle = "rgb(255,0,0)";
        ctx.fillRect(this.x, this.y, this.w, this.h);
    }
    this.resize = function() {
        this.x = Math.floor(this.ctx.canvas.width / 2 - this.w / 2);
        this.y = Math.floor(this.ctx.canvas.height / 2 - this.h / 2);
    }
}


function Game(ctx, ctx2) {
    this.ctx = ctx;
    this.ctx2 = ctx2;
    //this.ctx.canvas.width = $('body').width();
    //this.ctx.canvas.height = $('body').height();
    this.allowedKeys = [38, 87, 40, 83, 37, 65, 39, 68, 13, 70];
    var lastTimestamp = 0;
    this.delta = 0;

    var myself = this;
    this.animate = function(timestampNow) {
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
        finish = myself.draw();
        if (!finish) {
            requestAnimationFrame(myself.animate);
        }
    }
    this.init = function() {
        preLoadAssets(assets);;
    }
    this.run = function(assets) {
        this.assets = assets;
        this.floor = new Floor(this.ctx, this.assets.floor);
        this.player = new Player(this.ctx2);
        this.resize();
        this.animate();
    }
    this.draw = function() {
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
            requestFullScreen.call(docEl);
        } else {
            cancelFullScreen.call(doc);
        }
    }
    this.resize = function() {
        this.ctx.canvas.width = $('body').width();
        this.ctx.canvas.height = $('body').height();
        this.ctx2.canvas.width = $('body').width();
        this.ctx2.canvas.height = $('body').height();
        this.floor.resize();
        this.player.resize();
    }
}

// Image Load function
function preLoadAssets(items) {
    var assets = {
        floor: []
    };
    var numberOfAssetsToPreload = items.length;

    for (var i = 0; i < items.length; i++) {
        var image = new Image();
        var item = items[i];
        image.src = gameBaseUrl + item.src;
        image.onload = function() {
            numberOfAssetsToPreload--;
            if (!numberOfAssetsToPreload) {
                game.run(assets);
                $('body').addClass('loading-done');
            };
        }
        item.origImage = image;
        item.image = image;
        if (item.group == 'player' || item.group == 'messages') {
            assets[item.group][item.state] = item;
        } else if (item.group == 'floor') {
            assets[item.group] = item;
        } else {
            assets[item.group].push(item);
        }
    };
}

function resizeImageToPageHeight(item) {
    pageHeight = $(document).height() > $(window).height() ? $(document).height() : $(window).height();
    scaleToBg = 1;
    scale = Math.floor(100 / item.origImage.height * pageHeight) / 100;
    scaledW = Math.floor(item.origImage.width * scale * scaleToBg);
    scaledH = Math.floor(item.origImage.height * scale * scaleToBg);
    // creating scaled version and save correct it to buffer
    item.image = new Image(scaledW, scaledH);
    item.image.src = item.origImage.src;
    return item;
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
        //game.floor.move(keyPressed);
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
    //game.floor.move(keyPressed);
});

var game = new Game(ctx, ctx2);
game.init();
$(window).resize(function() {
    game.resize();
});
