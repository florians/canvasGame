// get game container and start game
var c = document.getElementById("gameCanvas");
var ctx = c.getContext("2d");

var gameBaseUrl = "Resources/Images/";
var assets = [
    floor = {
        group: "floor",
        src: "Floor/floor.jpg"
    }
];

var floorSettings = testFloor;
var moveDirection = {
    up: false,
    down: false,
    left: false,
    right: false
}

function Floor(ctx, floor) {
    this.ctx = ctx;
    this.partW = 200;
    this.partH = 200;
    this.steps = 50;
    this.floorSettings = floorSettings;
    this.stageHeight = this.floorSettings.size.height * this.partH;
    this.stageWidth = this.floorSettings.size.width * this.partW;
    this.x = Math.floor(ctx.canvas.width / 2 - game.player.w / 2 - (this.floorSettings.start.x * this.partW) - this.partW / 2 + game.player.w / 2);
    this.y = Math.floor(ctx.canvas.height / 2 - game.player.h / 2 - (this.floorSettings.start.y * this.partH) - this.partH / 2 + game.player.h / 2);

    this.floorElements = [];


    this.draw = function() {
        if (this.floorSettings) {
            element = 0;
            for (r = 0; r < this.floorSettings.size.height; r++) {
                this.b = Math.floor(this.y + (this.partH * r));
                for (c = 0; c < this.floorSettings.size.width; c++) {
                    this.a = Math.floor(this.x + (this.partW * c));
                    if (this.floorSettings.parts[element] && this.floorSettings.parts[element].color) {
                        ctx.fillStyle = this.floorSettings.parts[element].color;
                    } else {
                        ctx.fillStyle = "rgb(0,0,0)";
                    }

                    this.floorElements[element] = {
                        x: this.a,
                        y: this.b,
                        w: this.partW,
                        h: this.partH,
                        collision: parseInt(this.floorSettings.parts[element].collision) == 1 ? true : false,
                        type: this.floorSettings.parts[element].type
                    }
                    ctx.fillRect(
                        this.a,
                        this.b,
                        this.partW,
                        this.partH
                    );
                    if (this.floorElements[element] && this.floorElements[element].collision == true) {
                        this.collision(this.floorElements[element]);
                    }
                    element++;
                }
            }
        }
        this.stageCollision();
    }
    this.resize = function() {
        this.floor = resizeImageToPageHeight(floor);
        this.scale = this.floor.image.width / this.floor.origImage.width;
    }
    this.smallestPositive = function(b) {
        var min = [];
        $.each(b, function(i, l) {
            min.push(Math.abs(l));
        });
        return Math.min(...min);
    }
    this.collision = function(el) {
        if (
            game.player.x + game.player.w >= el.x &&
            game.player.x <= el.x + el.w &&
            game.player.y + game.player.h >= el.y &&
            game.player.y <= el.y + el.h
        ) {
            var b = {
                t: el.y - game.player.y - 1,
                b: el.y + el.h - game.player.y + 1,
                l: el.x - game.player.x - 1,
                r: el.x + el.w - game.player.x + 1
            }
            if (moveDirection.down) {
                this.y = this.y + game.player.h - b.t;
            }
            if (moveDirection.up) {
                this.y = this.y - b.b;
            }
            if (moveDirection.right) {
                this.x = this.x + game.player.w - b.l;
            }
            if (moveDirection.left) {
                this.x = this.x - b.r;
            }
        }
    }
    this.stageCollision = function() {
        var stage = {
            t: this.y + this.stageHeight - game.player.y - game.player.h,
            b: this.y - game.player.y,
            l: this.x - game.player.x,
            r: this.x + this.stageWidth - game.player.x - game.player.w
        }
        if (moveDirection.down && stage.t <= 0) {
            this.y = this.y - stage.t + 1;
        }
        if (moveDirection.up && stage.b >= 0) {
            this.y = this.y - stage.b - 1;
        }
        if (moveDirection.right && stage.r <= 0) {
            this.x = this.x - stage.r + 1;
        }
        if (moveDirection.left && stage.l >= 0) {
            this.x = this.x - stage.l - 1;
        }
    }
    this.move = function(direction, delta) {
        var step = (this.steps * delta);
        moveDirection.up = false;
        moveDirection.down = false;
        moveDirection.left = false;
        moveDirection.right = false;
        if (direction == "up") {
            this.y += step;
            moveDirection.up = true;
        }
        if (direction == "down") {
            this.y -= step;
            moveDirection.down = true;
        }
        if (direction == "left") {
            this.x += step;
            moveDirection.left = true;
        }
        if (direction == "right") {
            this.x -= step;
            moveDirection.right = true;
        }
    }
}

function Player(ctx) {
    this.ctx = ctx;
    this.w = 50;
    this.h = 50;
    this.x = Math.floor(this.ctx.canvas.width / 2 - this.w / 2);
    this.y = Math.floor(this.ctx.canvas.height / 2 - this.h / 2);
    this.draw = function() {
        //this.ctx.drawImage(this.player.image, this.x, this.y, this.floor.image.width, this.floor.image.height);
        ctx.fillStyle = "rgb(255,0,0)";
        ctx.fillRect(this.x, this.y, this.w, this.h);
    }
}


function Game(ctx) {
    this.ctx = ctx;
    this.ctx.canvas.width = $('body').width();
    this.ctx.canvas.height = $('body').height();
    this.allowedKeys = [38, 87, 40, 83, 37, 65, 39, 68, 13, 70];
    var lastTimestamp = 0;
    this.delta = 0;

    var myself = this;
    this.animate = function(timestampNow) {
        var now = Date.now(),
            timeDelta = (now - (lastTimestamp || now)) / 1000; // in seconds
        myself.delta = timeDelta * 30; // meaning: 30px per second

        myself.ctx.clearRect(0, 0, myself.ctx.canvas.width, myself.ctx.canvas.height);

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
        this.player = new Player(this.ctx);
        this.floor = new Floor(this.ctx, this.assets.floor);
        //this.player = new Player(this.ctx);
        this.resize();
        this.animate();
    }
    this.draw = function() {
        this.floor.draw();
        this.player.draw();
    }

    this.handleInput = function(input, delta) {
        // w / up
        if (input == 38 || input == 87 || input == "up") {
            this.floor.move("up", this.delta);
        }
        // s / down
        if (input == 40 || input == 83 || input == "down") {
            this.floor.move("down", this.delta);
        }
        // a / left
        if (input == 37 || input == 65 || input == "left") {
            this.floor.move("left", this.delta);
        }
        // d / right
        if (input == 39 || input == 68 || input == "right") {
            this.floor.move("right", this.delta);
        }
        if (input == 70) {
            this.handleFullscreen();
        }
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
        this.floor.resize();
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
        game.handleInput(e.keyCode);
    }
});

var game = new Game(ctx);
game.init();
$(window).resize(function() {
    game.resize();
});
