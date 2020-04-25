var showHitBox = false,
    // get game container and start game
    c = document.getElementById('gameCanvas'),
    ctx = c.getContext('2d'),

    c2 = document.getElementById('gameCanvas2'),
    ctx2 = c2.getContext('2d'),

    gameBaseUrl = 'Resources/Public/Images/Floor/',

    //game = null,
    floorLevel = 1,

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

function Floor(ctx, allTiles, floorSettings) {
    this.ctx = ctx;
    this.allTiles = allTiles;
    this.partW = 100;
    this.partH = 100;
    this.steps = 20;
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
    this.collisionLayerSize = 2;
    this.leftStartZone = false;
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
        this.playerLeft = Math.floor((this.stageOffsetX - game.player.offsetLeft) / (this.partW / this.collisionLayerSize));
        this.playerRight = Math.floor((this.stageOffsetX + game.player.offsetRight - 1) / (this.partW / this.collisionLayerSize));
        if (force) {
            return;
        }
        if (this.playerLeft < 0) {
            this.playerLeft = 0;
        }
        if (this.playerRight >= (this.floorSettings.width * this.collisionLayerSize)) {
            this.playerRight = (this.floorSettings.width * this.collisionLayerSize) - 1;
        }
    }
    this.setStageOffsetY = function(stageOffsetY, force = 0) {
        this.stageOffsetY = stageOffsetY;
        this.playerTop = Math.floor((this.stageOffsetY - game.player.offsetTop) / (this.partH / this.collisionLayerSize));
        this.playerBottom = Math.floor((this.stageOffsetY + game.player.offsetBottom - 1) / (this.partH / this.collisionLayerSize));

        if (force) {
            return;
        }
        if (this.playerTop < 0) {
            this.playerTop = 0;
        }
        if (this.playerBottom >= (this.floorSettings.height * this.collisionLayerSize)) {
            this.playerBottom = (this.floorSettings.height * this.collisionLayerSize) - 1;
        }
    }
    this.generateFloor = function() {
        var a = 0,
            b = 0;
        this.stageY = 0;
        this.stageX = 0;
        // first render and after resize
        if (this.collisionLayer.length === 0) {
            // prepare collision layer
            for (r = 0; r < this.floorSettings.height * this.collisionLayerSize; r++) {
                b = Math.floor(this.stageY + (this.partH / this.collisionLayerSize * r));
                for (c = 0; c < this.floorSettings.width * this.collisionLayerSize; c++) {
                    a = Math.floor(this.stageX + (this.partW / this.collisionLayerSize * c));
                    if (!this.collisionLayer[r]) {
                        this.collisionLayer[r] = [];
                    }
                    this.collisionLayer[r][c] = {
                        x: a,
                        y: b,
                        collision: false,
                        type: false,
                        w: this.partW / this.collisionLayerSize,
                        h: this.partH / this.collisionLayerSize
                    }
                }
            }
            // prepare tiles layer
            for (r = 0; r < this.floorSettings.height; r++) {
                b = Math.floor(this.stageY + (this.partH * r));
                for (c = 0; c < this.floorSettings.width; c++) {
                    a = Math.floor(this.stageX + (this.partW * c));
                    if (this.floorSettings.tiles[r][c].uid) {
                        this.floorSettings.tiles[r][c].x = a;
                        this.floorSettings.tiles[r][c].y = b;
                        this.floorSettings.tiles[r][c].render = true;
                        var settings = this.allTiles[this.floorSettings.tiles[r][c].uid].settings;
                        this.floorSettings.tiles[r][c].collision = settings.collision.split(',').map(Number);
                        this.floorSettings.tiles[r][c].type = settings.type;
                        this.floorSettings.tiles[r][c].factor = settings.factor;
                        this.floorSettings.tiles[r][c].posX = c;
                        this.floorSettings.tiles[r][c].posY = r;
                        this.changeCollisionLayer(r, c, this.floorSettings.tiles[r][c]);
                    } else {
                        this.floorSettings.tiles[r][c] = {
                            x: a,
                            y: b,
                            collision: [1],
                            render: false,
                            posX: c,
                            posY: r
                        }
                        this.changeCollisionLayer(r, c, this.floorSettings.tiles[r][c]);
                    }
                    if (this.isInView(a, b)) {
                        this.createBlocks(r, c);
                    }
                }
            }
            this.doFloorResize = 0;
        } else {
            var cStart = Math.floor((-game.player.x - this.partW + this.stageOffsetX) / this.partW),
                rStart = Math.floor((-game.player.y - this.partW + this.stageOffsetY) / this.partH),
                cStop = Math.floor((ctx.canvas.width + this.partW * 3) / this.partW),
                rStop = Math.floor((ctx.canvas.height + this.partH * 3) / this.partH);

            cStart = cStart > 0 ? cStart : 0;
            rStart = rStart > 0 ? rStart : 0;

            cStop = cStart + cStop < this.floorSettings.width ? cStart + cStop : this.floorSettings.width;
            rStop = rStart + rStop < this.floorSettings.height ? rStart + rStop : this.floorSettings.height;

            // every other run
            for (r = rStart; r < rStop; r++) {
                for (c = cStart; c < cStop; c++) {
                    this.createBlocks(r, c);
                }
            }
        }
    }
    this.changeCollisionLayer = function(r, c, el) {
        var collisionNr = 0;
        var collisionRow = r * this.collisionLayerSize;
        var collisionCol = c * this.collisionLayerSize;

        for (r = 0; r < this.collisionLayerSize; r++) {
            for (c = 0; c < this.collisionLayerSize; c++) {
                this.collisionLayer[collisionRow + r][collisionCol + c].collision = el.collision[collisionNr];
                this.collisionLayer[collisionRow + r][collisionCol + c].type = el.type || 'default';
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
        if (this.floorSettings.tiles[r][c].render) {
            ctx.drawImage(
                this.allTiles[this.floorSettings.tiles[r][c].uid].image,
                this.floorSettings.tiles[r][c].x,
                this.floorSettings.tiles[r][c].y,
                this.partW,
                this.partH
            );
            if (this.floorSettings.tiles[r][c].overlay) {
                ctx.drawImage(
                    this.allTiles[this.floorSettings.tiles[r][c].overlay].image,
                    this.floorSettings.tiles[r][c].x,
                    this.floorSettings.tiles[r][c].y,
                    this.partW,
                    this.partH
                );
                if (this.allTiles[this.floorSettings.tiles[r][c].overlay].settings.name == 'lock') {
                    this.floorSettings.tiles[r][c].collision = [0, 1, 0, 1];
                    this.changeCollisionLayer(r, c, this.floorSettings.tiles[r][c]);
                }
            }
        }
        if (showHitBox) {
            var hitBoxCounter = 0;
            for (var a = 0; a < this.collisionLayerSize; a++) {
                for (var b = 0; b < this.collisionLayerSize; b++) {
                    if (
                        this.floorSettings.tiles[r][c].collision.length > 1 &&
                        this.floorSettings.tiles[r][c].collision[hitBoxCounter] == 1
                    ) {
                        ctx.fillStyle = 'rgb(0,255,0)';
                        ctx.fillRect(
                            this.collisionLayer[r * this.collisionLayerSize + a][c * this.collisionLayerSize + b].x + 0.5,
                            this.collisionLayer[r * this.collisionLayerSize + a][c * this.collisionLayerSize + b].y + 0.5,
                            this.partW / this.collisionLayerSize - 1,
                            this.partH / this.collisionLayerSize - 1
                        );
                    }
                    hitBoxCounter++;
                }
            }
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
    this.handleOverlay = function(elementTileLayer) {
        var overlay = elementTileLayer.overlay;
        var itemWasUsed = false;
        if (this.allTiles[overlay].settings.name == 'hp' || this.allTiles[overlay].settings.name == 'es') {
            itemWasUsed = game.player.addStat(this.allTiles[overlay].settings.name);
        }
        if (this.allTiles[overlay].settings.name == 'key') {
            if (!game.player.items['key']) {
                game.player.addItem('key', overlay);
                itemWasUsed = true;
            }
        }
        if (this.allTiles[overlay].settings.name == 'lock') {
            if (game.player.items['key']) {
                elementTileLayer.collision = [0];
                this.changeCollisionLayer(elementTileLayer.posY, elementTileLayer.posX, elementTileLayer);
                game.player.removeItem('key');
                itemWasUsed = true;
            }
        }
        if (this.allTiles[overlay].settings.name == 'trap') {
            itemWasUsed = game.player.removeStat('es');
            if (itemWasUsed == false) {
                itemWasUsed = game.player.removeStat('hp');
            }

        }
        if (this.allTiles[overlay].settings.name == 'enemy') {
            console.log("start fight screen");
            var loseHp = Math.round(Math.random());
            if (loseHp == 1) {
                itemWasUsed = game.player.removeStat('es');
                if (itemWasUsed == false) {
                    itemWasUsed = game.player.removeStat('hp');
                }
            }
            game.player.addStat('exp');
            itemWasUsed = true;
        }
        // remove overlay
        if (itemWasUsed == true) {
            elementTileLayer.overlay = '';
        }
    }
    this.collision = function() {
        // Player Center
        var playerY = Math.floor((this.stageOffsetY) / (this.partH / 2)),
            playerX = Math.floor((this.stageOffsetX) / (this.partW / 2)),
            oldPlayerTop = this.playerTop,
            oldPlayerBottom = this.playerBottom,
            oldPlayerLeft = this.playerLeft,
            oldPlayerRight = this.playerRight,
            type = this.collisionLayer[playerY][playerX].type || 'default',
            factor = this.collisionLayer[playerY][playerX].factor || 1,
            dx = 0,
            dy = 0,
            step = this.steps * factor,
            elementTileLayer = this.floorSettings.tiles[Math.floor(playerY / this.collisionLayerSize)][Math.floor(playerX / this.collisionLayerSize)];

        if (type == 'portal') {
            if (elementTileLayer.level) {
                game.player.savePlayer();
                game.newFloor(elementTileLayer.level);
            }
        }
        if (elementTileLayer.overlay) {
            this.handleOverlay(elementTileLayer);
        }
        if (keyPressed.up && !keyPressed.down) {
            dy = Math.floor(-step * game.delta * 100) / 100;
        } else if (!keyPressed.up && keyPressed.down) {
            dy = Math.floor(step * game.delta * 100) / 100;
        } else {
            dy = 0;
        }
        if (keyPressed.left && !keyPressed.right) {
            dx = Math.floor(-step * game.delta * 100) / 100;
        } else if (!keyPressed.left && keyPressed.right) {
            dx = Math.floor(step * game.delta * 100) / 100;
        } else {
            dx = 0;
        }
        this.setStageOffsetX(this.stageOffsetX + dx, 1);
        this.setStageOffsetY(this.stageOffsetY + dy, 1);

        // stage collision
        if (this.playerTop < 0 || this.playerLeft < 0 || this.playerRight >= this.floorSettings.width * this.collisionLayerSize || this.playerBottom >= this.floorSettings.height * this.collisionLayerSize) {
            if (this.playerTop < 0) {
                //console.log('Field Top');
                this.setStageOffsetY(game.player.offsetTop);
            }
            if (this.playerBottom >= this.floorSettings.height * this.collisionLayerSize) {
                //console.log('Field Bottom');
                this.setStageOffsetY(this.partH * this.floorSettings.height - game.player.offsetBottom);
            }
            if (this.playerLeft < 0) {
                //console.log('Field Left');
                this.setStageOffsetX(game.player.offsetLeft);
            }
            if (this.playerRight >= this.floorSettings.width * this.collisionLayerSize) {
                //console.log('Field Right');
                this.setStageOffsetX(this.partW * this.floorSettings.width - game.player.offsetRight);
            }
            //console.log('topBox='+this.playerTop + ',topX='+(this.stageOffsetY + game.player.offsetTop)+' playerY='+ this.stageOffsetY);
            //console.log('bottomBox='+this.playerBottom + ',bottomX='+(this.stageOffsetY + game.player.offsetBottom)+',fiedl='+ (this.floorSettings.height * this.partH-1) + ', playerY='+ this.stageOffsetY);
        }
        //console.log('bottomBox='+this.playerBottom + ',bottomX='+(this.stageOffsetY + game.player.offsetBottom)+',field='+ (this.floorSettings.height * this.partH-1) + ', playerY='+ this.stageOffsetY);
        //console.log(this.playerTop,this.playerBottom,this.playerLeft,this.playerRight);

        if (dx > 0) {
            if (dy > 0) {
                this.collisionBox(oldPlayerRight, oldPlayerBottom, this.playerRight, this.playerBottom, 0, 0);
                this.collisionBox(oldPlayerRight, oldPlayerTop, this.playerRight, this.playerTop, 0, 1);
                this.collisionBox(oldPlayerLeft, oldPlayerBottom, this.playerLeft, this.playerBottom, 1, 0);
                this.collisionBox(oldPlayerLeft, oldPlayerTop, this.playerLeft, this.playerTop, 1, 1);
            } else {
                this.collisionBox(oldPlayerLeft, oldPlayerTop, this.playerLeft, this.playerTop, 1, 1);
                this.collisionBox(oldPlayerLeft, oldPlayerBottom, this.playerLeft, this.playerBottom, 1, 0);
                this.collisionBox(oldPlayerRight, oldPlayerTop, this.playerRight, this.playerTop, 0, 1);
                this.collisionBox(oldPlayerRight, oldPlayerBottom, this.playerRight, this.playerBottom, 0, 0);
            }
        } else {
            if (dy > 0) {
                this.collisionBox(oldPlayerRight, oldPlayerBottom, this.playerRight, this.playerBottom, 0, 0);
                this.collisionBox(oldPlayerRight, oldPlayerTop, this.playerRight, this.playerTop, 0, 1);
                this.collisionBox(oldPlayerLeft, oldPlayerBottom, this.playerLeft, this.playerBottom, 1, 0);
                this.collisionBox(oldPlayerLeft, oldPlayerTop, this.playerLeft, this.playerTop, 1, 1);
            } else {
                this.collisionBox(oldPlayerLeft, oldPlayerTop, this.playerLeft, this.playerTop, 1, 1);
                this.collisionBox(oldPlayerLeft, oldPlayerBottom, this.playerLeft, this.playerBottom, 1, 0);
                this.collisionBox(oldPlayerRight, oldPlayerTop, this.playerRight, this.playerTop, 0, 1);
                this.collisionBox(oldPlayerRight, oldPlayerBottom, this.playerRight, this.playerBottom, 0, 0);
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
    this.collisionBox = function(oldBoxX, oldBoxY, newBoxX, newBoxY, playerCornerLeft, playerCornerTop) {
        if (!this.collisionLayer[newBoxY][newBoxX].collision) {
            return;
        }
        //console.log('collisionBox kolidierter Ecken:' + (playerCornerLeft ? 'Links' : 'Rechts') + ', ' + (playerCornerTop ? 'Oben' : 'Unten'));
        var playerOffsetX = (game.player.w / 2) * (playerCornerLeft ? 1 : -1),
            playerOffsetY = (game.player.h / 2) * (playerCornerTop ? 1 : -1),

            // erster Pixel ausserhalb von Block
            addBoxYPixel = playerCornerTop ? this.partH / this.collisionLayerSize : 0,
            addBoxXPixel = playerCornerLeft ? this.partW / this.collisionLayerSize : 0,

            kanteX = (this.partW / this.collisionLayerSize) * newBoxX + addBoxXPixel,
            kanteY = (this.partH / this.collisionLayerSize) * newBoxY + addBoxYPixel;

        if (oldBoxY == newBoxY) {
            this.setStageOffsetX(kanteX + playerOffsetX);
            //console.log('collisionBox Korrektur X: playerOffsetX=' + playerOffsetX + ', addBoxXPixel=' + addBoxXPixel + ', kanteX=' + kanteX);
        } else if (oldBoxX == newBoxX) {
            this.setStageOffsetY(kanteY + playerOffsetY);
            //console.log('collisionBox Korrektur Y: ');
        } else {
            //Kollision untere Kante?
            //console.log('oldBoxX=' + oldBoxX + ', oldBoxY=' + oldBoxY);
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
    this.repaint = false;
    this.items = [];
    this.level = 1;

    this.getPlayer = function(name) {
        ajaxHandler(getPlayer,
            data = {
                type: 'getPlayer',
                name: name
            });
    }
    this.savePlayer = function() {
        ajaxHandler('',
            data = {
                type: 'savePlayer',
                name: this.name,
                level: this.level,
                stats: JSON.stringify(this.stats)
            });
    }

    this.draw = function() {
        // used to removed old translate
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.restore();
        this.drawPlayer();
        this.drawStat('hp', 0, 20, 'rgb(255,0,0)');
        if (this.stats.es.current > 0) {
            this.drawStat('es', 10, 10, 'rgb(0,0,255)');
        }
        if (this.stats.exp.current > 0) {
            this.drawStat('exp', 20, 5, 'rgb(0,255,0)');
        }
        this.drawItem(this.items);
        this.repaint = false;
    }
    this.resize = function() {
        this.x = Math.floor(this.ctx.canvas.width / 2 - this.w / 2);
        this.y = Math.floor(this.ctx.canvas.height / 2 - this.h / 2);
    }
    this.drawPlayer = function() {
        // save already rendered ctx to only translate player
        this.ctx.save();
        this.ctx.translate(this.x + this.w / 2, this.y + this.h / 2);
        this.ctx.arc(0, 0, this.w / 2, 0, Math.PI * 2, true);
        this.ctx.fillStyle = 'rgb(255,0,0)';
        this.ctx.fill();
        // restore all saved ctx with new object
        this.ctx.restore();
    }
    this.deathCheck = function() {
        if (this.stats.hp.current == 0) {
            this.resetStat('hp');
            this.resetStat('es');
            game.newFloor(floorLevel, true);
        }
    }
    this.levelUp = function() {
        this.level += 1;
        this.stats.hp.max += 1;
        this.stats.hp.current = this.stats.hp.max;
        this.stats.exp.max += 1;
        this.stats.exp.current = 0;
    }
    this.addStat = function(stat) {
        this.repaint = true;
        if (this.stats[stat].max) {
            if (this.stats[stat].current < this.stats[stat].max) {
                this.stats[stat].current++;
                if (stat == 'exp' && this.stats[stat].max == this.stats[stat].current) {
                    this.levelUp();
                }
                return true;
            }
        } else {
            this.stats[stat].current++;
            return true;
        }
        return false;
    }
    this.removeStat = function(stat) {
        this.repaint = true;
        if (this.stats[stat].current > 0) {
            this.stats[stat].current--;
            this.deathCheck();
            return true;
        }
        return false;
    }
    this.addItem = function(type, uid) {
        this.repaint = true;
        var item = allTiles[uid];
        this.items[type] = item;
    }
    this.removeItem = function(type, uid) {
        this.repaint = true;
        delete this.items[type];
    }
    this.resetStat = function(stat) {
        this.repaint = true;
        this.stats[stat].current = this.stats[stat].max;
    }
    this.drawItem = function() {
        var items = this.items;
        var ctx = this.ctx;
        var count = 0;
        var size = 50;
        ctx.save();
        $.each(Object.keys(items), function(index, type) {
            if (type) {
                ctx.fillStyle = 'rgb(255,255,255)';
                ctx.globalAlpha = 0.8;
                ctx.fillRect(size * count, 25, 50, 50);
                ctx.globalAlpha = 1;
                ctx.drawImage(items[type].image, size * count, 25, size, size);
                count++;
            }
        });
        ctx.restore();
    }
    this.drawStat = function(stat, y, h, color) {
        var barSize = 0;
        var max = this.stats[stat].max || this.stats[stat].current;
        barSize = Math.floor(this.ctx.canvas.width / 2) / max;
        this.ctx.fillStyle = 'rgb(10,10,10)';
        this.ctx.fillRect(0, y, Math.floor(this.ctx.canvas.width / 2) - 2, h);
        for (i = 0; i < max; i++) {
            if (this.stats[stat].current >= i + 1) {
                this.ctx.fillStyle = color;
                this.ctx.fillRect(barSize * i, y, barSize - 2, h);
            }
        }
    }
}


function Game(ctx, ctx2, playerName) {
    this.ctx = ctx;
    this.ctx2 = ctx2;
    this.playerName = playerName;
    this.allowedKeys = [38, 87, 40, 83, 37, 65, 39, 68, 13, 70];

    this.delta = 0;
    this.raF = 0;
    this.stopGame = false;
    this.gameIsRunnging = false;
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
    this.run = function(allTiles, floorSettings) {
        var hasPlayer = false;
        this.allTiles = allTiles;
        this.floorSettings = floorSettings;
        if (typeof this.player != 'undefined') {
            this.player = this.player;
            hasPlayer = true;
        } else {
            this.player = new Player(this.ctx2);
            this.player.getPlayer(playerName);
            this.player.repaint = true;
        }
        this.floor = new Floor(this.ctx, this.allTiles, this.floorSettings);
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
        if (this.player.repaint == true) {
            this.player.draw();
        }
    }
    this.resize = function() {
        canvasBeforH = this.ctx.canvas.height;
        canvasBeforW = this.ctx.canvas.width;
        this.ctx.canvas.width = $('body').width();
        this.ctx.canvas.height = $('body').height();
        this.ctx2.canvas.width = $('body').width();
        this.ctx2.canvas.height = $('body').height();
        this.player.repaint = true;
        this.floor.resize(canvasBeforH, canvasBeforW);
        this.player.resize();
    }
}
$(document).keydown(function(e) {
    if ($.inArray(e.keyCode, game.allowedKeys) !== -1) {
        e.preventDefault();
        // w / up
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
            handleFullscreen();
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
    handleFullscreen();
});

// virtual joystick
var joystickOffset = 25,
    joystick = new VirtualJoystick({
        container: document.getElementById('mobileControls'),
        mouseSupport: true,
        limitStickTravel: true,
        stickRadius: joystickOffset * 2,
        strokeStyle: '#868686'
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

function handleFullscreen() {
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
        var player = prompt("Please enter your name");
        //var player = "fs";
        game = new Game(ctx, ctx2, player);
    }
    game.init(floorSettings[result.result.level], allTiles);
}

function getPlayer(result, params = '') {
    // no db result = default player
    if (result == null) {
        game.player.name = params.name;
        game.player.stats = {
            hp: {
                max: 4,
                current: 4
            },
            es: {
                current: 0
            },
            mp: {
                max: 4,
                current: 1
            },
            exp: {
                max: 3,
                current: 0
            }
        }
    } else {
        game.player.name = result.name;
        game.player.level = parseInt(result.level);
        game.player.stats = JSON.parse(result.stats);
        game.player.stats.hp.current = game.player.stats.hp.max;
        game.player.stats.es.current = 0;
    }
    // start the game when player is loaded / set
    game.animate();
}
// preloading data + start the game
ajaxHandler(getAllTiles,
    data = {
        type: 'getAllTiles',
        level: floorLevel
    });
//getAllTiles(floorLevel, bla);

$(window).resize(function() {
    game.resize();
});
