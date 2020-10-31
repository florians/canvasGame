class Floor {
    constructor(parent, result) {
        this.parent = parent;
        this.dataHandler = new DataHandler(this);
        this.tiles = new Tiles(this.parent);
        this.items = new Tiles(this.parent);
        this.enemies = new Tiles(this.parent);
        this.collisionLayer = new Tiles(this.parent);
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
        if (result.enemies) {
            this.setEnemiesArray(result.enemies);
        }
        if (result.items) {
            this.setItemsArray(result.items);
        }

        // reset the val of stageX/Y
        this.resetStageX();
        this.resetStageY();
    }
    /************************
     ******** Getter ********
     ************************/

    getHeight() {
        return this.height;
    }
    getWidth() {
        return this.width;
    }
    getLevel() {
        return this.level;
    }
    getStart(dir) {
        return this.start[dir];
    }
    getTilesJson() {
        return this.tilesJson;
    }
    getStage(dir) {
        return this.stage[dir];
    }
    getStageOffset(dir) {
        return this.stageOffset[dir];
    }
    getOldStageOffset(dir) {
        return this.oldStageOffset[dir];
    }
    getPlayer(dir) {
        return this.player[dir];
    }
    getTilesArray() {
        return this.tilesArray;
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
    setTilesJson(tilesJson) {
        this.tilesJson = tilesJson;
    }
    setStage(dir, val) {
        this.stage[dir] = val;
    }
    setStageOffset(dir, val) {
        this.stageOffset[dir] = val;
    }
    setOldStageOffset(dir, val) {
        this.oldStageOffset[dir] = val;
    }
    setPlayer(dir, val) {
        this.player[dir] = val;
    }
    setTilesArray(tiles) {
        this.tilesArray = this.dataHandler.extract(tiles);
    }
    setItemsArray(items) {
        this.itemsArray = this.dataHandler.extract(items);
    }
    setEnemiesArray(enemies) {
        this.enemiesArray = this.dataHandler.extract(enemies);
    }
    setStageCenter() {
        _ctxWorld.translate(Math.floor(_ctxWorld.canvas.width / 2 - this.getStage('x')), Math.floor(_ctxWorld.canvas.height / 2 - this.getStage('y')));
    }
    setStageOffsetX(stageOffsetX, force = 0) {
        this.setStageOffset('x', stageOffsetX);
        this.setPlayer('left', Math.floor((this.getStageOffset('x') - _game._player.offsetLeft) / (this.partW / this.collisionLayerSize)));
        this.setPlayer('right', Math.floor((this.getStageOffset('x') + _game._player.offsetRight - 1) / (this.partW / this.collisionLayerSize)));
        if (force) {
            return;
        }
        if (this.getPlayer('left') < 0) {
            this.setPlayer('left', 0);
        }
        if (this.getPlayer('right') >= (this.getWidth() * this.collisionLayerSize)) {
            this.setPlayer('right', (this.getWidth() * this.collisionLayerSize) - 1);
        }
    }
    setStageOffsetY(stageOffsetY, force = 0) {
        this.setStageOffset('y', stageOffsetY);
        this.setPlayer('top', Math.floor((this.getStageOffset('y') - _game._player.offsetTop) / (this.partH / this.collisionLayerSize)));
        this.setPlayer('bottom', Math.floor((this.getStageOffset('y') + _game._player.offsetBottom - 1) / (this.partH / this.collisionLayerSize)));

        if (force) {
            return;
        }
        if (this.getPlayer('top') < 0) {
            this.setPlayer('top', 0);
        }
        if (this.getPlayer('bottom') >= (this.getHeight() * this.collisionLayerSize)) {
            this.setPlayer('bottom', (this.getHeight() * this.collisionLayerSize) - 1);
        }
    }
    /************************
     *** Reset to Default ***
     ************************/
    resetStageX() {
        this.setStage('x', Math.floor((this.getStart('x') * this.partW) + this.partW / 2));
    }
    resetStageY() {
        this.setStage('y', Math.floor((this.getStart('y') * this.partH) + this.partH / 2));
    }
    resetOffset() {
        this.setStageOffset('x', this.getStage('x'));
        this.setStageOffset('y', this.getStage('y'));
        this.setOldStageOffset('x', this.getStageOffset('x'));
        this.setOldStageOffset('y', this.getStageOffset('y'));
    }
    resetStart() {
        this.setOldStageOffset('x', 0);
        this.setOldStageOffset('y', 0);
    }
    /************************
     ***** Loader init ******
     ************************/
    init() {
        if (this.getOldStageOffset('x') == 0) {
            this.resetStageX();
        } else {
            this.setStage('x', this.getOldStageOffset('x'));
        }
        if (this.getOldStageOffset('y') == 0) {
            this.resetStageY();
        } else {
            this.setStage('y', this.getOldStageOffset('y'));
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
        let stageOffsetXInt = Math.round(this.getStageOffset('x'));
        let stageOffsetYInt = Math.round(this.getStageOffset('y'));
        _ctxWorld.translate(this.getOldStageOffset('x') - stageOffsetXInt, this.getOldStageOffset('y') - stageOffsetYInt);
        this.setOldStageOffset('x', stageOffsetXInt);
        this.setOldStageOffset('y', stageOffsetYInt);
    }
    resize(h, w) {
        this.init();
        this.doFloorResize = 1;
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
            for (let row = 0; row < this.getHeight(); row++) {
                rowY = Math.floor(this.getStage('y') + (this.partH * row));
                for (let col = 0; col < this.getWidth(); col++) {
                    colX = Math.floor(this.getStage('x') + (this.partW * col));
                    if (this.tilesArray) {
                        this.tiles.add(this.tilesArray[counter], row, col, rowY, colX);
                    }
                    if (this.enemiesArray) {
                        this.enemies.add(this.enemiesArray[counter], row, col, rowY, colX);
                    } else {
                        this.enemies.add('', row, col, rowY, colX);
                    }
                    if (this.itemsArray) {
                        this.items.add(this.itemsArray[counter], row, col, rowY, colX);
                    } else {
                        this.items.add('', row, col, rowY, colX);
                    }
                    this.addCollisionLayer(row, col, rowY, colX, this.tiles.get(row, col));
                    if (this.isInView(colX, rowY)) {
                        this.drawAsset(this.tiles.get(row, col));
                        this.drawAsset(this.items.get(row, col));
                        this.drawAsset(this.enemies.get(row, col));
                    }
                    counter++;
                }
            }
            this.doFloorResize = 0;
        } else {
            let cStart = Math.floor((-_game._player.x - this.partW + this.getStageOffset('x')) / this.partW),
                rStart = Math.floor((-_game._player.y - this.partW + this.getStageOffset('y')) / this.partH),
                cStop = Math.floor((_ctxWorld.canvas.width + this.partW * 3) / this.partW),
                rStop = Math.floor((_ctxWorld.canvas.height + this.partH * 3) / this.partH);

            cStart = cStart > 0 ? cStart : 0;
            rStart = rStart > 0 ? rStart : 0;

            cStop = cStart + cStop < this.getWidth() ? cStart + cStop : this.getWidth();
            rStop = rStart + rStop < this.getHeight() ? rStart + rStop : this.getHeight();

            // every other run
            for (let row = rStart; row < rStop; row++) {
                for (let col = cStart; col < cStop; col++) {
                    this.drawAsset(this.tiles.get(row, col));
                    this.drawAsset(this.items.get(row, col));
                    this.drawAsset(this.enemies.get(row, col));
                }
            }
        }
    }
    addCollisionLayer(row, col, rowY, colX, el) {
        let collisionNr = 0;
        for (let a = 0; a < this.collisionLayerSize; a++) {
            let cLayerRowY = rowY + (this.partH / this.collisionLayerSize * a);
            for (let b = 0; b < this.collisionLayerSize; b++) {
                let cLayerColX = colX + (this.partW / this.collisionLayerSize * b);
                let newRow = row * this.collisionLayerSize + a;
                let newCol = col * this.collisionLayerSize + b;
                this.collisionLayer.add('', newRow, newCol, cLayerRowY, cLayerColX);
                this.collisionLayer.get(newRow, newCol).setCollision(el.asset.collision[collisionNr]);
                this.collisionLayer.get(newRow, newCol).setOrig(el.asset);
                if (el.asset.collision.length > 1) {
                    collisionNr++;
                }
            }
        }
    }
    isInView(x, y) {
        if (
            x >= -_game._player.x - this.partW * 2 + this.getStageOffset('x') &&
            x <= _game._player.x + this.partW * 2 + this.getStageOffset('x') &&
            y >= -_game._player.y - this.partH * 2 + this.getStageOffset('y') &&
            y <= _game._player.y + this.partH * 2 + this.getStageOffset('y')
        ) {
            return true;
        }
    }
    drawAsset(element) {
        if (element.asset.image) {
            _ctxWorld.drawImage(element.asset.getImage(), element.getX(), element.getY(), this.partH, this.partW);
        }
        if (showHitBox) {
            if (element.asset.getCollision().length > 1) {
                for (let a = 0; a < this.collisionLayerSize; a++) {
                    for (let b = 0; b < this.collisionLayerSize; b++) {
                        let newRow = element.row * this.collisionLayerSize + a;
                        let newCol = element.col * this.collisionLayerSize + b;
                        _ctxWorld.fillStyle = 'rgba(0,255,0,0.2)';
                        _ctxWorld.fillRect(
                            this.collisionLayer.get(newRow, newCol).getX() + 0.5,
                            this.collisionLayer.get(newRow, newCol).getY() + 0.5,
                            this.partW / this.collisionLayerSize - 1,
                            this.partH / this.collisionLayerSize - 1
                        );
                    }
                }
            }
        }
    }
    createBlocks(row, col) {
        // if (this.tiles.get(row, col).asset.image) {
        //     _ctxWorld.drawImage(
        //         this.tiles.get(row, col).asset.getImage(),
        //         this.tiles.get(row, col).getX(),
        //         this.tiles.get(row, col).getY(),
        //         this.partW,
        //         this.partH
        //     );
        // }
        // if (showHitBox) {
        //     if (this.tiles.get(row, col).asset.getCollision().length > 1) {
        //         for (let a = 0; a < this.collisionLayerSize; a++) {
        //             for (let b = 0; b < this.collisionLayerSize; b++) {
        //                 let newRow = row * this.collisionLayerSize + a;
        //                 let newCol = col * this.collisionLayerSize + b;
        //                 _ctxWorld.fillStyle = 'rgba(0,255,0,0.2)';
        //                 _ctxWorld.fillRect(
        //                     this.collisionLayer.get(newRow, newCol).getX() + 0.5,
        //                     this.collisionLayer.get(newRow, newCol).getY() + 0.5,
        //                     this.partW / this.collisionLayerSize - 1,
        //                     this.partH / this.collisionLayerSize - 1
        //                 );
        //             }
        //         }
        //     }
        // }
    }

    // handleOverlay(elementAssetsLayer) {
    //     let overlay = elementAssetsLayer.overlay;
    //     let itemWasUsed = false;
    //     if (_game._assets.get(overlay).getName() == 'hp' || _game._assets.get(overlay).getName() == 'es') {
    //         itemWasUsed = _game.ui.addStat('_player', _game._assets.get(overlay).getName());
    //     }
    //     if (_game._assets.get(overlay).getName() == 'key') {
    //         if (!_game._player.items['key']) {
    //             _game.ui.addItem('_player', 'key', overlay);
    //             itemWasUsed = true;
    //         }
    //     }
    //     if (_game._assets.get(overlay).getName() == 'lock') {
    //         if (_game._player.items['key']) {
    //             elementAssetsLayer.collision = [0];
    //             this.changeCollisionLayer(elementAssetsLayer.posY, elementAssetsLayer.posX, elementAssetsLayer);
    //             //_game.ui.removeItem('_player', 'key');
    //             itemWasUsed = true;
    //         }
    //     }
    //     if (_game._assets.get(overlay).getName() == 'trap') {
    //         _game.ui.removeStat('_player', 'hp');
    //         itemWasUsed = true;
    //     }
    //     if (_game._assets.get(overlay).getName() == 'enemy') {
    //         _game.stopGame = true;
    //         _game.battle = new Battle();
    //         _game.ui.draw();
    //         itemWasUsed = true;
    //     }
    //     // remove overlay
    //     if (itemWasUsed == true) {
    //         elementAssetsLayer.overlay = '';
    //     }
    // }
    collision() {
        // Player Center
        let playerY = Math.floor((this.getStageOffset('y')) / (this.partH / 2)),
            playerX = Math.floor((this.getStageOffset('x')) / (this.partW / 2)),
            oldPlayerTop = this.getPlayer('top'),
            oldPlayerBottom = this.getPlayer('bottom'),
            oldPlayerLeft = this.getPlayer('left'),
            oldPlayerRight = this.getPlayer('right'),
            type = this.collisionLayer.get(playerY, playerX).getOrig().getType() || 'default',
            factor = this.collisionLayer.get(playerY, playerX).getOrig().getFactor() || 1,
            dx = 0,
            dy = 0,
            step = this.steps * factor,
            elementAssetsLayer = this.tiles.get(Math.floor(playerY / this.collisionLayerSize), Math.floor(playerX / this.collisionLayerSize));

        if (type == 'portal') {
            if (elementAssetsLayer.level) {
                _game.keyboardHandler.reset();
                _game._player.savePlayer();
                _game._floors.newFloor(elementAssetsLayer.level);
                _game.loader.run();
            }
        }
        // if (elementAssetsLayer.overlay) {
        //     this.handleOverlay(elementAssetsLayer);
        // }
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
        this.setStageOffsetX(this.getStageOffset('x') + dx, 1);
        this.setStageOffsetY(this.getStageOffset('y') + dy, 1);

        // stage collision
        if (this.getPlayer('top') < 0 || this.getPlayer('left') < 0 || this.getPlayer('right') >= this.getWidth() * this.collisionLayerSize || this.getPlayer('bottom') >= this.getHeight() * this.collisionLayerSize) {
            if (this.getPlayer('top') < 0) {
                //console.log('Field Top');
                this.setStageOffsetY(_game._player.offsetTop);
            }
            if (this.getPlayer('bottom') >= this.getHeight() * this.collisionLayerSize) {
                //console.log('Field Bottom');
                this.setStageOffsetY(this.partH * this.getHeight() - _game._player.offsetBottom);
            }
            if (this.getPlayer('left') < 0) {
                //console.log('Field Left');
                this.setStageOffsetX(_game._player.offsetLeft);
            }
            if (this.getPlayer('right') >= this.getWidth() * this.collisionLayerSize) {
                //console.log('Field Right');
                this.setStageOffsetX(this.partW * this.getWidth() - _game._player.offsetRight);
            }
            //console.log('topBox='+this.getPlayer('top') + ',topX='+(this.getStageOffset('y') + _game._player.offsetTop)+' playerY='+ this.getStageOffset('y'));
            //console.log('bottomBox='+this.getPlayer('bottom') + ',bottomX='+(this.getStageOffset('y') + _game._player.offsetBottom)+',fiedl='+ (this.getHeight() * this.partH-1) + ', playerY='+ this.getStageOffset('y'));
        }
        //console.log('bottomBox='+this.getPlayer('bottom') + ',bottomX='+(this.getStageOffset('y') + _game._player.offsetBottom)+',field='+ (this.getHeight() * this.partH-1) + ', playerY='+ this.getStageOffset('y'));
        //console.log(this.getPlayer('top'),this.getPlayer('bottom'),this.getPlayer('left'),this.getPlayer('right'));

        if (dx > 0) {
            if (dy > 0) {
                this.collisionBox(oldPlayerRight, oldPlayerBottom, this.getPlayer('right'), this.getPlayer('bottom'), 0, 0);
                this.collisionBox(oldPlayerRight, oldPlayerTop, this.getPlayer('right'), this.getPlayer('top'), 0, 1);
                this.collisionBox(oldPlayerLeft, oldPlayerBottom, this.getPlayer('left'), this.getPlayer('bottom'), 1, 0);
                this.collisionBox(oldPlayerLeft, oldPlayerTop, this.getPlayer('left'), this.getPlayer('top'), 1, 1);
            } else {
                this.collisionBox(oldPlayerLeft, oldPlayerTop, this.getPlayer('left'), this.getPlayer('top'), 1, 1);
                this.collisionBox(oldPlayerLeft, oldPlayerBottom, this.getPlayer('left'), this.getPlayer('bottom'), 1, 0);
                this.collisionBox(oldPlayerRight, oldPlayerTop, this.getPlayer('right'), this.getPlayer('top'), 0, 1);
                this.collisionBox(oldPlayerRight, oldPlayerBottom, this.getPlayer('right'), this.getPlayer('bottom'), 0, 0);
            }
        } else {
            if (dy > 0) {
                this.collisionBox(oldPlayerRight, oldPlayerBottom, this.getPlayer('right'), this.getPlayer('bottom'), 0, 0);
                this.collisionBox(oldPlayerRight, oldPlayerTop, this.getPlayer('right'), this.getPlayer('top'), 0, 1);
                this.collisionBox(oldPlayerLeft, oldPlayerBottom, this.getPlayer('left'), this.getPlayer('bottom'), 1, 0);
                this.collisionBox(oldPlayerLeft, oldPlayerTop, this.getPlayer('left'), this.getPlayer('top'), 1, 1);
            } else {
                this.collisionBox(oldPlayerLeft, oldPlayerTop, this.getPlayer('left'), this.getPlayer('top'), 1, 1);
                this.collisionBox(oldPlayerLeft, oldPlayerBottom, this.getPlayer('left'), this.getPlayer('bottom'), 1, 0);
                this.collisionBox(oldPlayerRight, oldPlayerTop, this.getPlayer('right'), this.getPlayer('top'), 0, 1);
                this.collisionBox(oldPlayerRight, oldPlayerBottom, this.getPlayer('right'), this.getPlayer('bottom'), 0, 0);
            }
        }
        // console.log(this.getPlayer('bottom'), this.getPlayer('left'));
        // console.log(this.collisionLayer);
        // console.log(this.collisionLayer.get(this.getPlayer('bottom'), this.getPlayer('left')));
        if (
            this.collisionLayer.get(this.getPlayer('bottom'), this.getPlayer('right')).getCollision() ||
            this.collisionLayer.get(this.getPlayer('bottom'), this.getPlayer('left')).getCollision() ||
            this.collisionLayer.get(this.getPlayer('top'), this.getPlayer('left')).getCollision() ||
            this.collisionLayer.get(this.getPlayer('top'), this.getPlayer('right')).getCollision()
        ) {
            //console.log('collision set to old Values');
            this.setStageOffsetX(this.getOldStageOffset('x'));
            this.setStageOffsetY(this.getOldStageOffset('y'));
        }
    }
    collisionBox(oldBoxX, oldBoxY, newBoxX, newBoxY, playerCornerLeft, playerCornerTop) {
        if (typeof this.collisionLayer.get(newBoxY, newBoxX) == "undefined") {
            return;
        }
        if (!this.collisionLayer.get(newBoxY, newBoxX).getCollision()) {
            return;
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
            if (!this.collisionLayer.get(oldBoxY, newBoxX).getCollision() && this.collisionLayer.get(newBoxY, oldBoxX).getCollision()) {
                this.setStageOffsetY(kanteY + playerOffsetY);
                //console.log('collisionBox Korrektur Y: ');
            } else if (!this.collisionLayer.get(newBoxY, oldBoxX).getCollision() && this.collisionLayer.get(oldBoxY, newBoxX).getCollision()) {
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
