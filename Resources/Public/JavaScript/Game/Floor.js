class Floor {
    constructor(result) {
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

        this.collisionLayer = [];
        this.collisionLayerSize = 2;

        this.setHeight(result.height);
        this.setWidth(result.width);
        this.setLevel(result.level);
        this.setStart('x', result.startX);
        this.setStart('y', result.startY);
        this.setTileJson(result.tileJson);
        this.tilesLayer = this.getTileJson();

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
    getTileJson() {
        return this.tileJson;
    }
    getStart(dir) {
        return this.start[dir];
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
    setTileJson(tileJson) {
        this.tileJson = JSON.parse(tileJson);
    }
    setStart(dir, val) {
        this.start[dir] = parseInt(val);
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
            this.setSage('x', this.getOldStageOffset('x'));
        }
        if (this.getOldStageOffset('y') == 0) {
            this.resetStageY();
        } else {
            this.setSage('y', this.getOldStageOffset('y'));
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
        _ctxWorld.translate(this.oldStageOffsetX - stageOffsetXInt, this.oldStageOffsetY - stageOffsetYInt);
        this.oldStageOffsetX = stageOffsetXInt;
        this.oldStageOffsetY = stageOffsetYInt;
    }
    resize(h, w) {
        this.init();
        this.doFloorResize = 1;
    }
    generateFloor() {
        let a = 0,
            b = 0;
        this.stageY = 0;
        this.stageX = 0;
        // first render and after resize
        if (this.collisionLayer.length === 0) {
            // prepare collision layer
            for (let r = 0; r < this.getHeight() * this.collisionLayerSize; r++) {
                b = Math.floor(this.stageY + (this.partH / this.collisionLayerSize * r));
                for (let c = 0; c < this.getWidth() * this.collisionLayerSize; c++) {
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
            for (let r = 0; r < this.getHeight(); r++) {
                b = Math.floor(this.stageY + (this.partH * r));
                for (let c = 0; c < this.getWidth(); c++) {
                    a = Math.floor(this.stageX + (this.partW * c));
                    if (this.tilesLayer[r][c].uid) {
                        this.tilesLayer[r][c].x = a;
                        this.tilesLayer[r][c].y = b;
                        this.tilesLayer[r][c].render = true;
                        let tile = _game._tiles.get(this.tilesLayer[r][c].uid);
                        //let settings = _game._allTiles[this.tilesLayer[r][c].uid].settings;
                        // this.tilesLayer[r][c].collision = settings.collision.split(',').map(Number);
                        // this.tilesLayer[r][c].type = settings.type;
                        // this.tilesLayer[r][c].factor = settings.factor;
                        this.tilesLayer[r][c].collision = tile.getCollision();
                        this.tilesLayer[r][c].type = tile.getType();
                        this.tilesLayer[r][c].factor = tile.getFactor();
                        this.tilesLayer[r][c].posX = c;
                        this.tilesLayer[r][c].posY = r;
                        this.changeCollisionLayer(r, c, this.tilesLayer[r][c]);
                    } else {
                        this.tilesLayer[r][c] = {
                            x: a,
                            y: b,
                            collision: [1],
                            render: false,
                            posX: c,
                            posY: r
                        }
                        this.changeCollisionLayer(r, c, this.tilesLayer[r][c]);
                    }
                    if (this.isInView(a, b)) {
                        this.createBlocks(r, c);
                    }
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
            for (let r = rStart; r < rStop; r++) {
                for (let c = cStart; c < cStop; c++) {
                    this.createBlocks(r, c);
                }
            }
        }
    }
    changeCollisionLayer(r, c, el) {
        let collisionNr = 0;
        let collisionRow = r * this.collisionLayerSize;
        let collisionCol = c * this.collisionLayerSize;

        for (let r = 0; r < this.collisionLayerSize; r++) {
            for (let c = 0; c < this.collisionLayerSize; c++) {
                this.collisionLayer[collisionRow + r][collisionCol + c].collision = el.collision[collisionNr];
                this.collisionLayer[collisionRow + r][collisionCol + c].type = el.type || 'default';
                this.collisionLayer[collisionRow + r][collisionCol + c].factor = el.collision == 1 ? 0 : el.factor;
                if (el.collision.length > 1) {
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
    createBlocks(r, c) {
        if (this.tilesLayer[r][c].render) {
            _ctxWorld.drawImage(
                _game._tiles.get(this.tilesLayer[r][c].uid).getImage(),
                this.tilesLayer[r][c].x,
                this.tilesLayer[r][c].y,
                this.partW,
                this.partH
            );
            if (this.tilesLayer[r][c].overlay) {
                _ctxWorld.drawImage(
                    _game._tiles.get(this.tilesLayer[r][c].overlay).getImage(),
                    this.tilesLayer[r][c].x,
                    this.tilesLayer[r][c].y,
                    this.partW,
                    this.partH
                );
                if (_game._tiles.get(this.tilesLayer[r][c].overlay).getName() == 'lock') {
                    this.tilesLayer[r][c].collision = [0, 1, 0, 1];
                    this.changeCollisionLayer(r, c, this.tilesLayer[r][c]);
                }
            }
        }
        if (showHitBox) {
            let hitBoxCounter = 0;
            for (let a = 0; a < this.collisionLayerSize; a++) {
                for (let b = 0; b < this.collisionLayerSize; b++) {
                    if (
                        this.tilesLayer[r][c].collision.length > 1 &&
                        this.tilesLayer[r][c].collision[hitBoxCounter] == 1
                    ) {
                        _ctxWorld.fillStyle = 'rgb(0,255,0)';
                        _ctxWorld.fillRect(
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

    handleOverlay(elementTileLayer) {
        let overlay = elementTileLayer.overlay;
        let itemWasUsed = false;
        if (_game._tiles.get(overlay).getName() == 'hp' || _game._tiles.get(overlay).getName() == 'es') {
            itemWasUsed = _game.ui.addStat('_player', _game._tiles.get(overlay).getName());
        }
        if (_game._tiles.get(overlay).getName() == 'key') {
            if (!_game._player.items['key']) {
                _game.ui.addItem('_player', 'key', overlay);
                itemWasUsed = true;
            }
        }
        if (_game._tiles.get(overlay).getName() == 'lock') {
            if (_game._player.items['key']) {
                elementTileLayer.collision = [0];
                this.changeCollisionLayer(elementTileLayer.posY, elementTileLayer.posX, elementTileLayer);
                //_game.ui.removeItem('_player', 'key');
                itemWasUsed = true;
            }
        }
        if (_game._tiles.get(overlay).getName() == 'trap') {
            _game.ui.removeStat('_player', 'hp');
            itemWasUsed = true;
        }
        if (_game._tiles.get(overlay).getName() == 'enemy') {
            _game.stopGame = true;
            _game.battle = new Battle();
            _game.ui.draw();
            itemWasUsed = true;
        }
        // remove overlay
        if (itemWasUsed == true) {
            elementTileLayer.overlay = '';
        }
    }
    collision() {
        // Player Center
        let playerY = Math.floor((this.getStageOffset('y')) / (this.partH / 2)),
            playerX = Math.floor((this.getStageOffset('x')) / (this.partW / 2)),
            oldPlayerTop = this.getPlayer('top'),
            oldPlayerBottom = this.getPlayer('bottom'),
            oldPlayerLeft = this.getPlayer('left'),
            oldPlayerRight = this.getPlayer('right'),
            type = this.collisionLayer[playerY][playerX].type || 'default',
            factor = this.collisionLayer[playerY][playerX].factor || 1,
            dx = 0,
            dy = 0,
            step = this.steps * factor,
            elementTileLayer = this.tilesLayer[Math.floor(playerY / this.collisionLayerSize)][Math.floor(playerX / this.collisionLayerSize)];

        if (type == 'portal') {
            if (elementTileLayer.level) {
                _game._player.savePlayer();
                _game._floors.newFloor(elementTileLayer.level);
                _game.loader.run();
            }
        }
        if (elementTileLayer.overlay) {
            this.handleOverlay(elementTileLayer);
        }
        if (keyboardHandler.get('up') && !keyboardHandler.get('down')) {
            dy = Math.floor(-step * _game.delta * 100) / 100;
        } else if (!keyboardHandler.get('up') && keyboardHandler.get('down')) {
            dy = Math.floor(step * _game.delta * 100) / 100;
        } else {
            dy = 0;
        }
        if (keyboardHandler.get('left') && !keyboardHandler.get('right')) {
            dx = Math.floor(-step * _game.delta * 100) / 100;
        } else if (!keyboardHandler.get('left') && keyboardHandler.get('right')) {
            dx = Math.floor(step * _game.delta * 100) / 100;
        } else {
            dx = 0;
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
        if (
            this.collisionLayer[this.getPlayer('bottom')][this.getPlayer('right')].collision ||
            this.collisionLayer[this.getPlayer('bottom')][this.getPlayer('left')].collision ||
            this.collisionLayer[this.getPlayer('top')][this.getPlayer('left')].collision ||
            this.collisionLayer[this.getPlayer('top')][this.getPlayer('right')].collision
        ) {
            //console.log('collision set to old Values');
            this.setStageOffsetX(this.oldStageOffsetX);
            this.setStageOffsetY(this.oldStageOffsetY);
        }
    }
    collisionBox(oldBoxX, oldBoxY, newBoxX, newBoxY, playerCornerLeft, playerCornerTop) {
        if (typeof this.collisionLayer[newBoxY][newBoxX] == "undefined") {
            return;
        }
        if (!this.collisionLayer[newBoxY][newBoxX].collision) {
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
