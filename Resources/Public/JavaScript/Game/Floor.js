class Floor {
    constructor(game, result) {
        this.dataHandler = new DataHandler(this);
        this.tiles = new Tiles(_game);
        this.collectibles = new Collectibles(_game);
        this.interactions = new Interactions(_game);
        this.collisionLayer = new Tiles(_game);
        // set part size
        this.partW = 100;
        this.partH = 100;
        // speed
        this.steps = 20;

        // start position
        this.start = {
            x: 0,
            y: 0
        }
        // stage position
        this.stage = {
            x: 0,
            y: 0
        }
        // stage positon offset
        this.stageOffset = {
            x: 0,
            y: 0
        }
        this.oldStageOffset = {
            x: 0,
            y: 0
        }
        // player direction
        this.player = {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0
        }

        this.collisionLayerSize = 2;

        this.setHeight(result.height);
        this.setWidth(result.width);
        this.setLevel(result.level);
        this.setStart('x', result.startX);
        this.setStart('y', result.startY);
        if (result.tiles) {
            this.setTilesArray(result.tiles);
        }
        if (result.interactions) {
            this.setInteractionsArray(result.interactions);
        }
        if (result.collectibles) {
            this.setCollectiblesArray(result.collectibles);
        }

        // reset the val of stageX/Y
        this.resetStageX();
        this.resetStageY();
    }
    /************************
     ******** Setter ********
     ************************/
    setHeight(height) {
        this.height = parseInt(height);
    }
    setWidth(width) {
        this.width = parseInt(width);
    }
    setLevel(level) {
        this.level = parseInt(level);
    }
    setStart(dir, val) {
        this.start[dir] = parseInt(val);
    }
    setStage(dir, val) {
        this.stage[dir] = val;
    }
    setTilesArray(tiles) {
        this.tilesArray = this.dataHandler.extract(tiles);
    }
    setCollectiblesArray(collectibles) {
        this.collectiblesArray = this.dataHandler.extract(collectibles);
    }
    setInteractionsArray(interactions) {
        this.interactionsArray = this.dataHandler.extract(interactions);
    }
    setStageCenter() {
        _ctxWorld.translate(Math.floor(_ctxWorld.canvas.width / 2 - this.stage.x), Math.floor(_ctxWorld.canvas.height / 2 - this.stage.y));
    }
    setStageOffsetX(stageOffsetX, force = 0) {
        this.stageOffset.x = stageOffsetX;
        this.player.left = Math.floor((this.stageOffset.x - _game._player.offsetLeft) / (this.partW / this.collisionLayerSize));
        this.player.right = Math.floor((this.stageOffset.x + _game._player.offsetRight - 1) / (this.partW / this.collisionLayerSize));
        if (force) {
            return;
        }
        if (this.player.left < 0) {
            this.player.left = 0;
        }
        if (this.player.right >= (this.width * this.collisionLayerSize)) {
            this.player.right = (this.width * this.collisionLayerSize) - 1;
        }
    }
    setStageOffsetY(stageOffsetY, force = 0) {
        this.stageOffset.y = stageOffsetY;
        this.player.top = Math.floor((this.stageOffset.y - _game._player.offsetTop) / (this.partH / this.collisionLayerSize));
        this.player.bottom = Math.floor((this.stageOffset.y + _game._player.offsetBottom - 1) / (this.partH / this.collisionLayerSize));
        if (force) {
            return;
        }
        if (this.player.top < 0) {
            this.player.top = 0;
        }
        if (this.player.bottom >= (this.height * this.collisionLayerSize)) {
            this.player.bottom = (this.height * this.collisionLayerSize) - 1;
        }
    }
    /************************
     *** Reset to Default ***
     ************************/
    resetStageX() {
        this.stage.x = Math.floor((this.start.x * this.partW) + this.partW / 2);
    }
    resetStageY() {
        this.stage.y = Math.floor((this.start.y * this.partH) + this.partH / 2);
    }
    resetOffset() {
        this.stageOffset.x = this.stage.x;
        this.stageOffset.y = this.stage.y;
        this.oldStageOffset.x = this.stageOffset.x;
        this.oldStageOffset.y = this.stageOffset.y;
    }
    resetStart() {
        this.oldStageOffset.x = 0;
        this.oldStageOffset.y = 0;
    }
    /************************
     ***** Loader init ******
     ************************/
    init() {
        if (this.oldStageOffset.x == 0) {
            this.resetStageX();
        } else {
            this.stage.x = this.oldStageOffset.x;
        }
        if (this.oldStageOffset.y == 0) {
            this.resetStageY();
        } else {
            this.stage.y = this.oldStageOffset.y;
        }
        this.setStageCenter();
        this.resetOffset()
    }
    /************************
     **** Canvas changes ****
     ************************/
    draw() {
        // generate floor
        this.generateFloor();
        // check on collisions
        this.collision(this.collisionLayer);
        // move canvas content
        let stageOffsetXInt = Math.round(this.stageOffset.x);
        let stageOffsetYInt = Math.round(this.stageOffset.y);
        _ctxWorld.translate(this.oldStageOffset.x - stageOffsetXInt, this.oldStageOffset.y - stageOffsetYInt);
        this.oldStageOffset.x = stageOffsetXInt;
        this.oldStageOffset.y = stageOffsetYInt;
    }
    resize(h, w) {
        this.init();
        //this.doFloorResize = 1;
    }
    generateFloor() {
        let rowY = 0,
            colX = 0,
            a, b,
            counter = 0;

        this.setStage('x', 0);
        this.setStage('y', 0);
        // first render and after resize
        if (this.collisionLayer.tiles.length == 0) {
            for (let row = 0; row < this.height; row++) {
                rowY = Math.floor(this.stage.y + (this.partH * row));
                for (let col = 0; col < this.width; col++) {
                    colX = Math.floor(this.stage.x + (this.partW * col));
                    this.tiles.add(this.tilesArray[counter], row, col, rowY, colX, this.partH, this.partW);
                    this.interactions.add(this.interactionsArray[counter], row, col, rowY, colX, this.partH, this.partW);
                    this.collectibles.add(this.collectiblesArray[counter], row, col, rowY, colX, this.partH, this.partW);
                    this.addCollisionLayer(row, col, rowY, colX, this.tiles.get(row, col));
                    if (this.isInView(colX, rowY)) {
                        this.tiles.get(row, col).draw();
                        this.collectibles.get(row, col).draw();
                        this.interactions.get(row, col).draw();
                    }
                    counter++;
                }
            }
            //this.doFloorResize = 0;
        } else {
            let cStart = Math.floor((-_game._player.x - this.partW + this.stageOffset.x) / this.partW),
                rStart = Math.floor((-_game._player.y - this.partW + this.stageOffset.y) / this.partH),
                cStop = Math.floor((_ctxWorld.canvas.width + this.partW * 3) / this.partW),
                rStop = Math.floor((_ctxWorld.canvas.height + this.partH * 3) / this.partH);

            cStart = cStart > 0 ? cStart : 0;
            rStart = rStart > 0 ? rStart : 0;

            cStop = cStart + cStop < this.width ? cStart + cStop : this.width;
            rStop = rStart + rStop < this.height ? rStart + rStop : this.height;

            // every other run
            for (let row = rStart; row < rStop; row++) {
                for (let col = cStart; col < cStop; col++) {
                    this.tiles.get(row, col).draw();
                    this.collectibles.get(row, col).draw();
                    this.interactions.get(row, col).draw();
                }
            }
        }
    }
    addCollisionLayer(row, col, rowY, colX, el) {
        let collision = el.asset.collision;
        let orig = el.asset;
        let reqEl = null;
        // if it has requirments > set collision
        if (this.tiles.get(row, col).req.length || this.collectibles.get(row, col).req.length || this.interactions.get(row, col).req.length) {
            collision = [1, 1, 1, 1];
            if (this.tiles.get(row, col).req.length) {
                orig = this.tiles.get(row, col);
            }
            if (this.collectibles.get(row, col).req.length) {
                orig = this.collectibles.get(row, col);
            }
            if (this.interactions.get(row, col).req.length) {
                orig = this.interactions.get(row, col);
            }
        }
        let collisionNr = 0;
        for (let a = 0; a < this.collisionLayerSize; a++) {
            let cLayerRowY = rowY + (this.partH / this.collisionLayerSize * a);
            for (let b = 0; b < this.collisionLayerSize; b++) {
                let cLayerColX = colX + (this.partW / this.collisionLayerSize * b);
                let newRow = row * this.collisionLayerSize + a;
                let newCol = col * this.collisionLayerSize + b;
                this.collisionLayer.add('', newRow, newCol, cLayerRowY, cLayerColX);

                this.collisionLayer.get(newRow, newCol).collision = collision[collisionNr];
                this.collisionLayer.get(newRow, newCol).orig = orig;
                if (el.asset.collision.length > 1) {
                    collisionNr++;
                }
            }
        }
    }
    removeCollisionFromLayer(row, col) {
        for (let a = 0; a < this.collisionLayerSize; a++) {
            for (let b = 0; b < this.collisionLayerSize; b++) {
                let newRow = row * this.collisionLayerSize + a;
                let newCol = col * this.collisionLayerSize + b;
                this.collisionLayer.get(newRow, newCol).collision = 0;
            }
        }
    }
    isInView(x, y) {
        if (
            x >= -_game._player.x - this.partW * 2 + this.stageOffset.x &&
            x <= _game._player.x + this.partW * 2 + this.stageOffset.x &&
            y >= -_game._player.y - this.partH * 2 + this.stageOffset.y &&
            y <= _game._player.y + this.partH * 2 + this.stageOffset.y
        ) {
            return true;
        }
    }
    collision() {
        // Player Center
        let playerY = Math.floor((this.stageOffset.y) / (this.partH / 2)),
            playerX = Math.floor((this.stageOffset.x) / (this.partW / 2)),
            oldPlayerTop = this.player.top,
            oldPlayerBottom = this.player.bottom,
            oldPlayerLeft = this.player.left,
            oldPlayerRight = this.player.right,
            type = this.collisionLayer.get(playerY, playerX).orig.type || 'default',
            factor = this.collisionLayer.get(playerY, playerX).orig.factor || 1,
            dx = 0,
            dy = 0,
            step = this.steps * factor,
            collisionTile = this.tiles.get(Math.floor(playerY / this.collisionLayerSize), Math.floor(playerX / this.collisionLayerSize)),
            collisionInteraction = this.interactions.get(Math.floor(playerY / this.collisionLayerSize), Math.floor(playerX / this.collisionLayerSize)),
            collisionCollectible = this.collectibles.get(Math.floor(playerY / this.collisionLayerSize), Math.floor(playerX / this.collisionLayerSize));

        collisionTile.hit(type);
        collisionInteraction.hit(type);
        collisionCollectible.hit(type);

        if (!this.stopGame == true) {
            if (_game.keyboardHandler.get('up') && !_game.keyboardHandler.get('down')) {
                dy = Math.floor(-step * _game.delta * 100) / 100;
            } else if (!_game.keyboardHandler.get('up') && _game.keyboardHandler.get('down')) {
                dy = Math.floor(step * _game.delta * 100) / 100;
            } else {
                dy = 0;
            }
            if (_game.keyboardHandler.get('left') && !_game.keyboardHandler.get('right')) {
                dx = Math.floor(-step * _game.delta * 100) / 100;
            } else if (!_game.keyboardHandler.get('left') && _game.keyboardHandler.get('right')) {
                dx = Math.floor(step * _game.delta * 100) / 100;
            } else {
                dx = 0;
            }
        }
        this.setStageOffsetX(this.stageOffset.x + dx, 1);
        this.setStageOffsetY(this.stageOffset.y + dy, 1);

        // stage collision
        if (this.player.top < 0 || this.player.left < 0 || this.player.right >= this.width * this.collisionLayerSize || this.player.bottom >= this.height * this.collisionLayerSize) {
            if (this.player.top < 0) {
                //console.log('Field Top');
                this.setStageOffsetY(_game._player.offsetTop);
            }
            if (this.player.bottom >= this.height * this.collisionLayerSize) {
                //console.log('Field Bottom');
                this.setStageOffsetY(this.partH * this.height - _game._player.offsetBottom);
            }
            if (this.player.left < 0) {
                //console.log('Field Left');
                this.setStageOffsetX(_game._player.offsetLeft);
            }
            if (this.player.right >= this.width * this.collisionLayerSize) {
                //console.log('Field Right');
                this.setStageOffsetX(this.partW * this.width - _game._player.offsetRight);
            }
            //console.log('topBox='+this.player.top + ',topX='+(this.stageOffset.y + _game._player.offsetTop)+' playerY='+ this.stageOffset.y);
            //console.log('bottomBox='+this.player.bottom + ',bottomX='+(this.stageOffset.y + _game._player.offsetBottom)+',fiedl='+ (this.height * this.partH-1) + ', playerY='+ this.stageOffset.y);
        }
        //console.log('bottomBox='+this.player.bottom + ',bottomX='+(this.stageOffset.y + _game._player.offsetBottom)+',field='+ (this.height * this.partH-1) + ', playerY='+ this.stageOffset.y);
        //console.log(this.player.top,this.player.bottom,this.player.left,this.player.right);

        if (dx > 0) {
            if (dy > 0) {
                this.collisionBox(oldPlayerRight, oldPlayerBottom, this.player.right, this.player.bottom, 0, 0);
                this.collisionBox(oldPlayerRight, oldPlayerTop, this.player.right, this.player.top, 0, 1);
                this.collisionBox(oldPlayerLeft, oldPlayerBottom, this.player.left, this.player.bottom, 1, 0);
                this.collisionBox(oldPlayerLeft, oldPlayerTop, this.player.left, this.player.top, 1, 1);
            } else {
                this.collisionBox(oldPlayerLeft, oldPlayerTop, this.player.left, this.player.top, 1, 1);
                this.collisionBox(oldPlayerLeft, oldPlayerBottom, this.player.left, this.player.bottom, 1, 0);
                this.collisionBox(oldPlayerRight, oldPlayerTop, this.player.right, this.player.top, 0, 1);
                this.collisionBox(oldPlayerRight, oldPlayerBottom, this.player.right, this.player.bottom, 0, 0);
            }
        } else {
            if (dy > 0) {
                this.collisionBox(oldPlayerRight, oldPlayerBottom, this.player.right, this.player.bottom, 0, 0);
                this.collisionBox(oldPlayerRight, oldPlayerTop, this.player.right, this.player.top, 0, 1);
                this.collisionBox(oldPlayerLeft, oldPlayerBottom, this.player.left, this.player.bottom, 1, 0);
                this.collisionBox(oldPlayerLeft, oldPlayerTop, this.player.left, this.player.top, 1, 1);
            } else {
                this.collisionBox(oldPlayerLeft, oldPlayerTop, this.player.left, this.player.top, 1, 1);
                this.collisionBox(oldPlayerLeft, oldPlayerBottom, this.player.left, this.player.bottom, 1, 0);
                this.collisionBox(oldPlayerRight, oldPlayerTop, this.player.right, this.player.top, 0, 1);
                this.collisionBox(oldPlayerRight, oldPlayerBottom, this.player.right, this.player.bottom, 0, 0);
            }
        }
        // console.log(this.player.bottom, this.player.left);
        // console.log(this.collisionLayer);
        // console.log(this.collisionLayer.get(this.player.bottom, this.player.left));
        if (
            this.collisionLayer.get(this.player.bottom, this.player.right).collision ||
            this.collisionLayer.get(this.player.bottom, this.player.left).collision ||
            this.collisionLayer.get(this.player.top, this.player.left).collision ||
            this.collisionLayer.get(this.player.top, this.player.right).collision
        ) {
            //console.log('collision set to old Values');
            this.setStageOffsetX(this.oldStageOffset.x);
            this.setStageOffsetY(this.oldStageOffset.y);
        }
    }
    collisionBox(oldBoxX, oldBoxY, newBoxX, newBoxY, playerCornerLeft, playerCornerTop) {
        if (typeof this.collisionLayer.get(newBoxY, newBoxX) == "undefined") {
            return;
        }
        if (!this.collisionLayer.get(newBoxY, newBoxX).collision) {
            return;
        }
        // collision with field that has requirments
        if (this.collisionLayer.get(newBoxY, newBoxX).orig.req.length > 0 && this.collisionLayer.get(newBoxY, newBoxX).orig.requirementsMet == false) {
            this.collisionLayer.get(newBoxY, newBoxX).orig.showInfo();
        } else if (this.collisionLayer.get(newBoxY, newBoxX).orig.req.length > 0 && this.collisionLayer.get(newBoxY, newBoxX).orig.requirementsMet == true) {
            this.collisionLayer.get(newBoxY, newBoxX).orig.use();
        }
        //console.log('collisionBox kolidierter Ecken:' + (playerCornerLeft ? 'Links' : 'Rechts') + ', ' + (playerCornerTop ? 'Oben' : 'Unten'));
        let playerOffsetX = (_game._player.w / 2) * (playerCornerLeft ? 1 : -1),
            playerOffsetY = (_game._player.h / 2) * (playerCornerTop ? 1 : -1),

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
            if (!this.collisionLayer.get(oldBoxY, newBoxX).collision && this.collisionLayer.get(newBoxY, oldBoxX).collision) {
                this.setStageOffsetY(kanteY + playerOffsetY);
                //console.log('collisionBox Korrektur Y: ');
            } else if (!this.collisionLayer.get(newBoxY, oldBoxX).collision && this.collisionLayer.get(oldBoxY, newBoxX).collision) {
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
