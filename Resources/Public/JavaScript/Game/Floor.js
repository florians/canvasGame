function Floor(ctx, floorSettings) {
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
            // game.stopGame = true;
            // game.battle = new Battle();
            // game.ui.draw();

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
