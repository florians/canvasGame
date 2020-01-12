var showHitBox = false,
    // get game container and start game
    c = document.getElementById("gameCanvas"),
    ctx = c.getContext("2d"),

    c2 = document.getElementById("gameCanvas2"),
    ctx2 = c2.getContext("2d"),

    gameBaseUrl = "Resources/Images/Floor/",

    //game = null,
    floorLevel = 1,

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

// set fallback
window.requestAnimationFrame = myRequestAnimationFrame;

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

    this.tilesLayer = [];
    this.collisionLayer = [];
    this.init = function() {
        if (this.oldStageOffsetX == 0) {
            this.stageX = Math.floor((this.floorSettings.startX * this.partW) + this.partW / 2);
        } else {
            this.stageX = this.oldStageOffsetX;
        }
        if (this.oldStageOffsetY == 0) {
            this.stageY = Math.floor((this.floorSettings.startY * this.partH) + this.partH / 2);
        } else {
            this.stageY = this.oldStageOffsetY;
        }
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
        this.playerLeft = Math.floor((this.stageOffsetX - game.player.offsetLeft) / (this.partW / 2));
        this.playerRight = Math.floor((this.stageOffsetX + game.player.offsetRight - 1) / (this.partW / 2));
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
        this.playerTop = Math.floor((this.stageOffsetY - game.player.offsetTop) / (this.partH / 2));
        this.playerBottom = Math.floor((this.stageOffsetY + game.player.offsetBottom - 1) / (this.partH / 2));
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
        if (type, name, info) {
            return allTiles[type][name][info];
        } else if (type, name, !info) {
            return allTiles[type][name];
        } else if (type, !name, !info) {
            return allTiles[type];
        }
    }
    this.generateFloor = function() {
        var element = 0,
            allElements = 0,
            a = 0,
            b = 0;
        this.stageY = 0;
        this.stageX = 0;
        // first render and after resize
        if (this.tilesLayer.length == 0) { // || this.doFloorResize == 1) { not needed anymore?
            // prepare collision layer
            for (r = 0; r < this.floorSettings.height * 2; r++) {
                b = Math.floor(this.stageY + (this.partH / 2 * r));
                for (c = 0; c < this.floorSettings.width * 2; c++) {
                    a = Math.floor(this.stageX + (this.partW / 2 * c));
                    if (!this.collisionLayer[r]) {
                        this.collisionLayer[r] = [];
                    }
                    this.collisionLayer[r][c] = {
                        x: a,
                        y: b,
                        collision: false,
                        type: false,
                        w: this.partW / 2,
                        h: this.partH / 2
                    }
                }
            }
            // prepaer tiles layer
            for (r = 0; r < this.floorSettings.height; r++) {
                b = Math.floor(this.stageY + (this.partH * r));
                for (c = 0; c < this.floorSettings.width; c++) {
                    a = Math.floor(this.stageX + (this.partW * c));
                    if (!this.tilesLayer[r]) {
                        this.tilesLayer[r] = [];
                    }
                    var type = this.floorSettings.tiles[element].type,
                        name = this.floorSettings.tiles[element].name;
                    if (this.floorSettings.tiles[element] && type) {
                        this.tilesLayer[r][c] = {
                            x: a,
                            y: b,
                            render: true
                        }
                        this.tilesLayer[r][c] = Object.assign(this.tilesLayer[r][c], this.getTileInfo(type, name).settings);

                        var collision = this.tilesLayer[r][c].collision.split(",").map(Number);
                        this.tilesLayer[r][c].collision = collision;

                        this.tilesLayer[r][c].item = this.floorSettings.tiles[element].item;
                        this.tilesLayer[r][c].trap = this.floorSettings.tiles[element].trap;
                        this.tilesLayer[r][c].enemy = this.floorSettings.tiles[element].enemy;
                        this.changeCollisionLayer(r, c, this.tilesLayer[r][c]);
                    } else {
                        this.tilesLayer[r][c] = {
                            x: a,
                            y: b,
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
            for (r = 0; r < this.tilesLayer.length; r++) {
                for (c = 0; c < this.floorSettings.width; c++) {
                    if (this.isInView(this.tilesLayer[r][c].x, this.tilesLayer[r][c].y)) {
                        this.createBlocks(r, c);
                    }
                }
            }
        }
    }
    this.changeCollisionLayer = function(r, c, el) {
        var collisonArray = el.collision || [0, 0, 0, 0];
        var collisionNr = 0;
        var collisionRow = r * 2;
        var collisionCol = c * 2;

        for (r = 0; r < 2; r++) {
            for (c = 0; c < 2; c++) {
                this.collisionLayer[collisionRow + r][collisionCol + c].collision = el.collision[collisionNr];
                this.collisionLayer[collisionRow + r][collisionCol + c].type = el.type;
                this.collisionLayer[collisionRow + r][collisionCol + c].factor = el.collision == 1 ? 0 : el.factor;
                if (el.collision.length > 1) {
                    collisionNr++;
                }
            }
        }
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
        if (this.tilesLayer[r][c].render) {
            ctx.drawImage(
                this.getTileInfo(this.tilesLayer[r][c].type, this.tilesLayer[r][c].name, "image"),
                this.tilesLayer[r][c].x,
                this.tilesLayer[r][c].y,
                this.partW,
                this.partH
            );
            if (this.tilesLayer[r][c].item) {
                ctx.drawImage(
                    this.getTileInfo(this.tilesLayer[r][c].item.type, this.tilesLayer[r][c].item.name, "image"),
                    this.tilesLayer[r][c].x,
                    this.tilesLayer[r][c].y,
                    this.partW,
                    this.partH
                );
            }
            if (this.tilesLayer[r][c].trap) {
                ctx.drawImage(
                    this.getTileInfo(this.tilesLayer[r][c].trap.type, this.tilesLayer[r][c].trap.name, "image"),
                    this.tilesLayer[r][c].x,
                    this.tilesLayer[r][c].y,
                    this.partW,
                    this.partH
                );
            }
            if (this.tilesLayer[r][c].enemy) {
                ctx.drawImage(
                    this.getTileInfo(this.tilesLayer[r][c].enemy.type, this.tilesLayer[r][c].enemy.name, "image"),
                    this.tilesLayer[r][c].x,
                    this.tilesLayer[r][c].y,
                    this.partW,
                    this.partH
                );
            }
        }
        if (showHitBox) {
            for (a = 0; a < 2; a++) {
                for (b = 0; b < 2; b++) {
                    if (
                        this.tilesLayer[r][c].collision.length &&
                        this.collisionLayer[r * 2 + a][c * 2 + b].collision ||
                        this.tilesLayer[r][c].collision == 1
                    ) {
                        ctx.fillStyle = "rgb(0,255,0)";
                    } else {
                        ctx.fillStyle = "rgb(200,0,0,0)";
                    }
                    ctx.fillRect(
                        this.collisionLayer[r * 2 + a][c * 2 + b].x + 0.5,
                        this.collisionLayer[r * 2 + a][c * 2 + b].y + 0.5,
                        this.partW / 2 - 1,
                        this.partH / 2 - 1
                    );
                }
            }


            var collisionRow = r * 2;
            var collisionCol = c * 2;
            collisionDebug(this.collisionLayer[collisionRow][collisionCol]);
            collisionDebug(this.collisionLayer[collisionRow][collisionCol + 1]);
            collisionDebug(this.collisionLayer[collisionRow + 1][collisionCol]);
            collisionDebug(this.collisionLayer[collisionRow + 1][collisionCol + 1]);
        }
    }
    this.draw = function() {
        // generate floor
        this.generateFloor();
        // check on collisions
        this.collision(this.collisionLayer);
        // move canvas content
        stageOffsetXInt = Math.round(this.stageOffsetX);
        stageOffsetYInt = Math.round(this.stageOffsetY);
        ctx.translate(this.oldStageOffsetX - stageOffsetXInt, this.oldStageOffsetY - stageOffsetYInt);
        this.oldStageOffsetX = stageOffsetXInt;
        this.oldStageOffsetY = stageOffsetYInt;
    }
    this.collision = function() {
        // Player Center
        var playerY = Math.floor((this.stageOffsetY) / (this.partH / 2)),
            playerX = Math.floor((this.stageOffsetX) / (this.partW / 2)),
            oldPlayerTop = this.playerTop,
            oldPlayerBottom = this.playerBottom,
            oldPlayerLeft = this.playerLeft,
            oldPlayerRight = this.playerRight,
            type = this.collisionLayer[playerY][playerX].type || "default",
            factor = this.collisionLayer[playerY][playerX].factor || 1,
            step = this.steps * factor,
            dx = 0,
            dy = 0,
            elementTileLayer = this.tilesLayer[Math.floor(playerY / 2)][Math.floor(playerX / 2)];
        if (type == 'end') {
            game.newFloor(floorSettings.endLink);
        }
        if (elementTileLayer.item || elementTileLayer.trap || elementTileLayer.enemy) {
            var itemWasUsed = false;
            if (elementTileLayer.item && elementTileLayer.item.name == "hp") {
                if (game.player.stats.hp.current < game.player.stats.hp.max) {
                    game.player.stats.hp.current++;
                    itemWasUsed = true;
                }
            }
            if (elementTileLayer.item && elementTileLayer.item.name == "mp") {
                if (game.player.stats.mp.current < game.player.stats.mp.max) {
                    game.player.stats.mp.current++;
                    itemWasUsed = true;
                }
            }
            if (elementTileLayer.trap && elementTileLayer.trap.name == "trap") {
                if (game.player.stats.hp.current > 0) {
                    game.player.stats.hp.current--;
                    itemWasUsed = true;
                }
            }
            if (elementTileLayer.enemy && elementTileLayer.enemy.name == "enemy") {
                var loseHp = Math.round(Math.random());
                if (game.player.stats.hp.current > 0 && loseHp == 1) {
                    game.player.stats.hp.current--;
                    itemWasUsed = true;
                }else{
                    itemWasUsed = true;
                }
            }
            // remove item
            if (itemWasUsed == true) {
                elementTileLayer.item = "";
                elementTileLayer.enemy = "";
                elementTileLayer.trap = "";
            }
            if (game.player.stats.hp.current == 0) {
                game.player.resetStat("hp");
                game.newFloor(floorSettings.level);
            }
        }
        // if (elementTileLayer.trap) {
        //     var itemWasUsed = false;
        //     if (elementTileLayer.trap.name == "trap") {
        //         if (game.player.stats.hp.current > 0) {
        //             game.player.stats.hp.current--;
        //             itemWasUsed = true;
        //         }
        //         if (game.player.stats.hp.current == 0) {
        //             game.player.resetStat("hp");
        //             game.newFloor(floorSettings.level);
        //         }
        //     }
        //     // remove item
        //     if (itemWasUsed == true) {
        //         elementTileLayer.trap = "";
        //     }
        // }
        // if (elementTileLayer.enemy) {
        //     var itemWasUsed = false;
        //     if (elementTileLayer.enemy.name == "enemy") {
        //         var loseHp = Math.round(Math.random());
        //         if (loseHp) {
        //             game.player.stats.hp.current--;
        //             itemWasUsed = true;
        //         }
        //     }
        //     // remove item
        //     if (itemWasUsed == true) {
        //         elementTileLayer.enemy = "";
        //     }
        // }
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
        if (this.playerTop < 0 || this.playerLeft < 0 || this.playerRight >= this.floorSettings.width * 2 || this.playerBottom >= this.floorSettings.height * 2) {
            if (this.playerTop < 0) {
                //console.log('Field Top');
                this.setStageOffsetY(game.player.offsetTop);
            }
            if (this.playerBottom >= this.floorSettings.height * 2) {
                //console.log('Field Bottom');
                this.setStageOffsetY(this.partH * this.floorSettings.height - game.player.offsetBottom);
            }
            if (this.playerLeft < 0) {
                //console.log('Field Left');
                this.setStageOffsetX(game.player.offsetLeft);
            }
            if (this.playerRight >= this.floorSettings.width * 2) {
                //console.log('Field Right');
                this.setStageOffsetX(this.partW * this.floorSettings.width - game.player.offsetRight);
            }
            //console.log('topBox='+this.playerTop + ",topX="+(this.stageOffsetY + game.player.offsetTop)+" playerY="+ this.stageOffsetY);
            //console.log('bottomBox='+this.playerBottom + ",bottomX="+(this.stageOffsetY + game.player.offsetBottom)+",fiedl="+ (this.floorSettings.height * this.partH-1) + ", playerY="+ this.stageOffsetY);
        }
        //console.log('bottomBox='+this.playerBottom + ",bottomX="+(this.stageOffsetY + game.player.offsetBottom)+",fiedl="+ (this.floorSettings.height * this.partH-1) + ", playerY="+ this.stageOffsetY);
        //console.log(this.playerTop,this.playerBottom,this.playerLeft,this.playerRight);

        // smt is not right here
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
        if (
            this.collisionLayer[this.playerBottom][this.playerRight].collision ||
            this.collisionLayer[this.playerBottom][this.playerLeft].collision ||
            this.collisionLayer[this.playerTop][this.playerLeft].collision ||
            this.collisionLayer[this.playerTop][this.playerRight].collision
        ) {
            //console.log('collision set to old Values');
            this.setStageOffsetX(this.oldStageOffsetX);
            this.setStageOffsetY(this.oldStageOffsetY);
        }
    }
    this.collisionBox = function(oldBoxX, oldBoxY, newBoxX, newBoxY, playerCornerLeft, playerCornerTop, dx, dy) {
        if (!this.collisionLayer[newBoxY][newBoxX].collision) {
            return;
        }
        //console.log('collisionBox kolidierter Ecken:' + (playerCornerLeft ? 'Links' : 'Rechts') + ", " + (playerCornerTop ? 'Oben' : 'Unten'));
        var playerOffsetX = (game.player.w / 2) * (playerCornerLeft ? 1 : -1),
            playerOffsetY = (game.player.h / 2) * (playerCornerTop ? 1 : -1),

            // erster Pixel ausserhalb von Block
            // addBoxYPixel = playerCornerTop ? this.partH / 2 : -1,
            // addBoxXPixel = playerCornerLeft ? this.partW / 2 : -1,

            // FS floor canvas translate
            addBoxYPixel = playerCornerTop ? this.partH / 2 : 0,
            addBoxXPixel = playerCornerLeft ? this.partW / 2 : 0,

            kanteX = (this.partW / 2) * newBoxX + addBoxXPixel,
            kanteY = (this.partH / 2) * newBoxY + addBoxYPixel;

        if (oldBoxY == newBoxY) {
            this.setStageOffsetX(kanteX + playerOffsetX);
            //console.log('collisionBox Korrektur X: playerOffsetX=' + playerOffsetX + ", addBoxXPixel=" + addBoxXPixel + ", kanteX=" + kanteX);
        } else if (oldBoxX == newBoxX) {
            this.setStageOffsetY(kanteY + playerOffsetY);
            //console.log('collisionBox Korrektur Y: ');
        } else {
            //Kollision untere Kante?
            //console.log("oldBoxX=" + oldBoxX + ", oldBoxY=" + oldBoxY);
            if (!this.collisionLayer[oldBoxY][newBoxX].collision && this.collisionLayer[newBoxY][oldBoxX].collision) {
                this.setStageOffsetY(kanteY + playerOffsetY);
                //console.log('collisionBox Korrektur Y: ');
            } else if (!this.collisionLayer[newBoxY][oldBoxX].collision && this.collisionLayer[oldBoxY][newBoxX].collision) {
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

    this.stats = {
        hp: {
            max: 4,
            current: 4
        },
        mp: {
            max: 4,
            current: 1
        }
    }
    this.draw = function() {
        this.drawPlayer();
        this.drawHp();
        //this.drawMp();
    }
    this.resize = function() {
        this.x = Math.floor(this.ctx.canvas.width / 2 - this.w / 2);
        this.y = Math.floor(this.ctx.canvas.height / 2 - this.h / 2);
    }
    this.drawPlayer = function() {
        // save already rendered ctx to only change following obj
        this.ctx.save();
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
        // restore all saved ctx with new object
        this.ctx.restore();
    }
    this.resetStat = function(stat) {
        this.stats[stat].current = this.stats[stat].max;
    }
    this.drawHp = function() {
        this.drawBar(this.stats.hp, 0, "rgb(255,0,0)");
    }
    this.drawMp = function() {
        this.drawBar(this.stats.mp, 30, "rgb(0,0,255)");
    }
    this.drawBar = function(stat, y, color) {
        var barSize = (this.ctx.canvas.width / 2) / stat.max;
        for (i = 0; i < stat.max; i++) {
            if (stat.current >= i + 1) {
                this.ctx.fillStyle = color;
            } else {
                this.ctx.fillStyle = "rgb(10,10,10)";
            }
            this.ctx.fillRect(barSize * i, y, barSize - 5, 20);
        }
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
        // used to removed old translate
        myself.ctx.setTransform(1, 0, 0, 1, 0, 0);
        myself.ctx.clearRect(0, 0, myself.ctx.canvas.width, myself.ctx.canvas.height);
        myself.ctx.restore();
        myself.ctx2.save();
        // used to removed old translate
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
        if (typeof this.player != "undefined") {
            this.player = this.player;
        } else {
            this.player = new Player(this.ctx2);
        }
        this.floor = new Floor(this.ctx, this.allTiles, this.floorSettings);
        this.resize(true);
        this.animate();
    }
    this.draw = function() {
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
getAllTiles(floorLevel);

$(window).resize(function() {
    game.resize();
});
