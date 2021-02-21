class Floor {
    constructor(parent, result) {
        this.parent = parent;
        this.tiles = new Tiles(this.parent);
        this.collectibles = new Collectibles(this.parent);
        this.interactions = new Interactions(this.parent);
        this.dataHandler = new DataHandler(this);
        this.requirements = new Requirements(parent);
        this.mousehandler = new MouseHandler(this);
        this.keyboardHandler = new KeyboardHandler(this);

        this.tilesArray = [];
        this.isDrawing = false;
        // when it was loaded
        this.defaultWidth = result.width;
        this.selectedLayer = 'all';
        this.selectedAsset = 0;
        this.startIsSet = false;
        // start position
        this.start = {
            x: 0,
            y: 0
        }
        // stage positon offset
        this.stageOffset = {
            x: 0,
            y: 0
        }
        // click
        this.mousehandler.add('#world', 'click', 'addTile');
        this.mousehandler.add('#world', 'contextmenu', 'removeTile');
        this.mousehandler.add('.zoom', 'click', 'doZoom');
        this.mousehandler.add('.brush', 'click', 'changeBrush');
        this.mousehandler.add('.reset', 'click', 'resetForm');
        this.mousehandler.add('.dimension .sizeSubmit', 'click', 'setDimensions');
        this.mousehandler.add('.saveFloor', 'click', 'save');
        this.mousehandler.add('.layer', 'click', 'changeLayer');
        // this.mousehandler.add('aside .custom .save-to-element', 'click', 'saveToElement')
        this.mousehandler.add('aside .custom .close', 'click', 'hideCustomBox')

        // mouse event
        this.mousehandler.add('#world', 'mousedown', 'mousedown');
        this.mousehandler.add('#world', 'mouseup', 'mouseup');
        this.mousehandler.add('#world', 'mousemove', 'mousemove');
        // mousewheel
        this.mousehandler.add('#world', 'wheel', 'wheelZoom');

        // change
        this.mousehandler.add('.floorSelect', 'change', 'changeFloor');

        // keyboard
        this.keyboardHandler.add(document, 'keydown', 'keydown', [38, 87, 40, 83, 37, 65, 39, 68]);
        this.listAssets();
        this.init(result);
    }
    init(result) {
        this.setZoom('reset');
        this.setBrushSize('reset');
        this.size = 30;
        this.zoomSize = this.size * this.zoom;
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

        this.setCanvasSize();
        this.generateGrid();
        this.requirements.clear();
        this.requirements.load();
    }
    /************************
     ******** Setter ********
     ************************/
    setHeight(height) {
        this.height = parseInt(height);
        $('input.dimension-h').val(this.height);
    }
    setWidth(width) {
        this.width = parseInt(width);
        $('input.dimension-w').val(this.width);
    }
    setLevel(level) {
        this.level = parseInt(level);
        $('.level').val(this.level);
    }
    setStart(dir, val) {
        this.start[dir] = parseInt(val);
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
    setStageOffset(dir, val) {
        this.stageOffset[dir] = val;
    }
    setZoom(task) {
        if (task == 'reset') {
            this.zoom = 1;
        } else {
            if (this.zoom < 20 && task == '+') {
                this.zoom += 0.1;
            }
            if (this.zoom >= 0.2 && task == '-') {
                this.zoom -= 0.1;
            }
        }
        $('.zoomLevel').html(Math.round(this.zoom * 100));
    }
    setBrushSize(task) {
        if (task == 'reset') {
            this.brushSize = 1;
        } else {
            let brushSizes = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 49];
            if (this.brushSize <= 48 && task == '+') {
                this.brushSize = brushSizes[brushSizes.indexOf(this.brushSize) + 1];
            }
            if (this.brushSize > 1 && task == '-') {
                this.brushSize = brushSizes[brushSizes.indexOf(this.brushSize) - 1];
            }
        }
        $('.brushSize').html(this.brushSize);
    }
    setCanvasSize() {
        _ctxWorld.canvas.width = Math.floor($('.canvasContainer').width());
        _ctxWorld.canvas.height = Math.floor($('body').height() - $('#world').offset().top - 25);
    }
    /************************
     **** Canvas changes ****
     ************************/
    generateGrid() {
        let rowY = 0,
            colX = 0,
            counter = 0;
        for (let row = 0; row < this.height; row++) {
            rowY = this.zoomSize * row;
            for (let col = 0; col < this.width; col++) {
                colX = this.zoomSize * col;
                // scale up
                if (this.defaultWidth > 0 && col >= this.defaultWidth) {
                    this.tiles.add('', row, col, rowY, colX);
                    this.interactions.add('', row, col, rowY, colX);
                    this.collectibles.add('', row, col, rowY, colX);
                } else if (this.defaultWidth > this.width) {
                    counter++;
                } else {
                    if (this.tilesArray) {
                        this.tiles.add(this.tilesArray[counter], row, col, rowY, colX);
                    }
                    if (this.interactionsArray) {
                        this.interactions.add(this.interactionsArray[counter], row, col, rowY, colX);
                    } else {
                        this.interactions.add('', row, col, rowY, colX);
                    }
                    if (this.collectiblesArray) {
                        this.collectibles.add(this.collectiblesArray[counter], row, col, rowY, colX);
                    } else {
                        this.collectibles.add('', row, col, rowY, colX);
                    }
                    counter++;
                }
            }
        }
        this.startIsSet = this.tiles.startIsSet;
        this.repaint();
    }
    repaint(element = '') {
        _ctxWorld.save();
        _ctxWorld.setTransform(1, 0, 0, 1, 0, 0);
        if (element == '') {
            _ctxWorld.fillStyle = '#e5e5e5';
            _ctxWorld.fillRect(0, 0, _ctxWorld.canvas.width, _ctxWorld.canvas.height);
            //_ctxWorld.clearRect(0, 0, _ctxWorld.canvas.width, _ctxWorld.canvas.height);
        }
        _ctxWorld.translate(this.stageOffset.x, this.stageOffset.y)
        this.fillCanvas(element);
        _ctxWorld.restore();
    }
    fillCanvas(element) {
        if (element) {
            this.drawAsset(this.tiles.get(element.row, element.col), true);
            this.drawAsset(this.collectibles.get(element.row, element.col));
            this.drawAsset(this.interactions.get(element.row, element.col));
            this.addGrid(element);
        } else {
            let cStart = Math.floor(-this.stageOffset.x / this.zoomSize);
            let rStart = Math.floor(-this.stageOffset.y / this.zoomSize);
            let cStop = Math.floor((_ctxWorld.canvas.width + this.zoomSize * 2) / this.zoomSize);
            let rStop = Math.floor((_ctxWorld.canvas.height + this.zoomSize * 2) / this.zoomSize);

            cStart = cStart > 0 ? cStart : 0;
            rStart = rStart > 0 ? rStart : 0;

            cStop = cStart + cStop < this.width ? cStart + cStop : this.width;
            rStop = rStart + rStop < this.height ? rStart + rStop : this.height;
            for (let row = rStart; row < rStop; row++) {
                for (let col = cStart; col < cStop; col++) {
                    if ($('.layer[data-change="tiles"].active').length > 0 || $('.layer[data-change="all"].active').length > 0) {
                        this.drawAsset(this.tiles.get(row, col));
                    }
                    if ($('.layer[data-change="collectibles"].active').length > 0 || $('.layer[data-change="all"].active').length > 0) {
                        this.drawAsset(this.collectibles.get(row, col));
                    }
                    if ($('.layer[data-change="interactions"].active').length > 0 || $('.layer[data-change="all"].active').length > 0) {
                        this.drawAsset(this.interactions.get(row, col));
                    }
                    this.addGrid(this.tiles.get(row, col));
                }
            }
        }
    }
    drawAsset(element, clear = false) {
        let x = element.x * this.zoom,
            y = element.y * this.zoom,
            h = this.zoomSize,
            w = this.zoomSize;
        if (element.asset.image) {
            _ctxWorld.drawImage(element.asset.image, x, y, h, w);
        }
        if (element.req.length > 0) {
            _ctxWorld.fillStyle = '#e5e5e5';
            _ctxWorld.fillRect(x + w - Math.floor(w / 5) * 1.2, y + h - Math.floor(h / 5) * 1.2, Math.floor(w / 5), Math.floor(h / 5))
        }
        if (!element.asset.image && clear) {
            _ctxWorld.fillStyle = '#e5e5e5';
            _ctxWorld.fillRect(x, y, h, w);
        }
    }
    addGrid(element) {
        _ctxWorld.beginPath();
        _ctxWorld.strokeStyle = 'rgb(0,0,0)';
        _ctxWorld.rect(element.x * this.zoom, element.y * this.zoom, this.zoomSize, this.zoomSize);
        _ctxWorld.stroke();
    }
    resize() {
        this.setCanvasSize();
        this.repaint();
    }
    addTile(event) {
        if (this.selectedLayer == 'all') return;
        let ignoreBrushTiles = ['start', 'portal', 'trap', 'enemy', 'item'];
        let col = Math.floor((event.offsetX - this.stageOffset.x) / this.zoomSize);
        let row = Math.floor((event.offsetY - this.stageOffset.y) / this.zoomSize);
        if (row >= 0 && row < this.height && col >= 0 && col < this.width) {
            if (this.selectedAsset) {
                if (ignoreBrushTiles.includes(this.parent._assets.get(this.selectedAsset).type)) {
                    this.checkIfStart(this[this.selectedLayer].get(row, col));
                    if (this.parent._assets.get(this.selectedAsset).type == 'start' && this.startIsSet == false) {
                        this.startIsSet = true;
                        this.setStart('x', col);
                        this.setStart('y', row);
                        this[this.selectedLayer].get(row, col).set(this.selectedAsset);
                        this.repaint(this[this.selectedLayer].get(row, col));
                    }
                    if (this.parent._assets.get(this.selectedAsset).type == 'portal') {
                        this.showCustomBox(this[this.selectedLayer].get(row, col));
                    }
                    if (this.parent._assets.get(this.selectedAsset).type != 'start') {
                        this[this.selectedLayer].get(row, col).set(this.selectedAsset);
                        this.repaint(this[this.selectedLayer].get(row, col));
                    }
                } else {
                    for (let r = row - Math.floor(this.brushSize / 2); r < row + Math.ceil(this.brushSize / 2); r++) {
                        for (let c = col - Math.floor(this.brushSize / 2); c < col + Math.ceil(this.brushSize / 2); c++) {
                            if (c < 0 || r < 0) {
                                continue;
                            }
                            if (r >= 0 && r < this.height && c >= 0 && c < this.width) {
                                this.checkIfStart(this[this.selectedLayer].get(r, c));

                                if (c < this.width && r < this.height) {
                                    this[this.selectedLayer].get(r, c).set(this.selectedAsset);
                                    this.repaint(this[this.selectedLayer].get(r, c));
                                }
                            }
                        }
                    }
                }
            } else {
                if (this[this.selectedLayer].get(row, col) && this[this.selectedLayer].get(row, col).isEmpty == false) {
                    this.showCustomBox(this[this.selectedLayer].get(row, col));
                }
            }
        }
    }
    removeTile(event) {
        event.preventDefault();
        let col = Math.floor((event.offsetX - this.stageOffset.x) / this.zoomSize);
        let row = Math.floor((event.offsetY - this.stageOffset.y) / this.zoomSize);
        if (row >= 0 && row < this.height && col >= 0 && col < this.width) {
            if (this[this.selectedLayer].get(row, col).asset.type == 'start') {
                this.startIsSet = false;
            }
            this[this.selectedLayer].get(row, col).set(0);
            this.repaint(this[this.selectedLayer].get(row, col));
        }
    }
    checkIfStart(el) {
        if (!el.isEmpty && el.asset.type == 'start') {
            this.startIsSet = false;
            this.setStart('x', 0);
            this.setStart('y', 0);
        }
    }
    /************************
     *** Mouse & Keyboard ***
     ************************/
    mousedown(event) {
        this.isDrawing = true;
    }
    mouseup(event) {
        this.isDrawing = false;
    }
    mousemove(event) {
        if (this.isDrawing === true) {
            this.addTile(event);
        }
    }
    doZoom(event) {
        if (event) {
            this.setZoom(event.target.dataset.change);
        } else {
            this.zoom = 1;
        }
        this.zoomSize = this.size * this.zoom;
        this.setStageOffset('x', 0);
        this.setStageOffset('y', 0);
        this.repaint();
    }
    wheelZoom(event) {
        if (event.deltaY > 0) {
            this.setZoom('-');
        } else {
            this.setZoom('+');
        }
        this.zoomSize = this.size * this.zoom;
        this.setStageOffset('x', 0);
        this.setStageOffset('y', 0);
        this.repaint();
    }
    changeBrush(event) {
        this.setBrushSize(event.target.dataset.change);
    }
    changeLayer(event) {
        $('.layer.active').removeClass('active');
        $(event.target).addClass('active');
        this.selectedLayer = $(event.target).data('change');
        // change assets
        $('.asset-layer').removeClass('active');
        $('.asset-layer.layer-' + this.selectedLayer).addClass('active');
        $('aside .asset-layer.active .assetGroup .title').first().click();
        this.repaint();
    }
    changeAsset(event) {
        $('.asset.active').removeClass('active');
        $(event.target).parent().toggleClass('active');
        this.selectedAsset = $(event.target).parent().data('uid');
    }
    changeAssetGroup(event) {
        $('.asset.active').removeClass('active');
        this.selectedAsset = 0;
        $('.assetGroup.show').removeClass('show');
        $(event.target).parent().addClass('show');
    }
    keydown(e) {
        let repaint = false;
        if (e.keyCode == 37 || e.keyCode == 65) {
            this.setStageOffset('x', this.stageOffset.x - this.zoomSize);
            repaint = true;
        }
        if (e.keyCode == 39 || e.keyCode == 68) {
            this.setStageOffset('x', this.stageOffset.x + this.zoomSize);
            repaint = true;
        }
        if (e.keyCode == 38 || e.keyCode == 87) {
            this.setStageOffset('y', this.stageOffset.y - this.zoomSize);
            repaint = true;
        }
        if (e.keyCode == 40 || e.keyCode == 83) {
            this.setStageOffset('y', this.stageOffset.y + this.zoomSize);
            repaint = true;
        }
        if (repaint) {
            this.repaint();
        }
    }
    preloaderResult(result) {
        if (result.length == 1) {
            this.parent.msg(result[0].data.type, result[0].data.msg);
        }
        for (let i = 0; i < result.length; i++) {
            if (result[i].name == "floors") {
                this.defaultWidth = result[i].data.result.width;
                this.init(result[i].data.result);
            }
        }
    }
    changeFloor(event) {
        this.hideCustomBox();
        if (event.target.value) {
            this.parent.loader.clear();
            this.parent.loader.setObj(this);
            this.parent._floors.load(event.target.value);
            this.parent.loader.run();
        }
    }
    save(event) {
        this.setLevel($('input.level').val());
        let floor = {
            level: this.level,
            startX: this.start.x,
            startY: this.start.y,
            height: this.height,
            width: this.width,
            tiles: []
        }
        if (this.tiles.getCount()) {
            floor.tiles = this.dataHandler.compress(this.tiles);
        }
        if (this.collectibles.getCount()) {
            floor.collectibles = this.dataHandler.compress(this.collectibles);
        }
        if (this.interactions.getCount()) {
            floor.interactions = this.dataHandler.compress(this.interactions);
        }
        if (this.level > 0) {
            this.parent.loader.add('data', 'assets', {
                type: 'saveFloor',
                json: JSON.stringify(floor)
            });
            this.parent.loader.run();
        }
    }
    resetForm() {
        this.setHeight(20);
        this.setWidth(20);
        this.setLevel(0);
        this.setZoom('reset');
        this.setBrushSize('reset');
        this.setStageOffset('x', 0);
        this.setStageOffset('y', 0);

        $('input.dimension-w').val(this.height);
        $('input.dimension-h').val(this.width);


        this.parent.msgReset();
        $('select.floorSelect').val([]);
        $('select.floorSelect option').prop('selected', false);
        $('.controls input.level').val('').prop('disabled', false);

        $('aside .custom').removeClass('active');

        this.selectedAsset = 0;
        this.selectedLayer = 'all';
        this.tilesArray = [];
        this.collectiblesArray = [];
        this.interactionsArray = [];
        this.tiles.clear();
        this.collectibles.clear();
        this.interactions.clear();
        this.generateGrid();
    }
    setDimensions(event) {
        this.setStageOffset('x', 0);
        this.setStageOffset('y', 0);
        if ($('input.dimension-h').val() <= 0 || $('input.dimension-w').val() <= 0) {
            this.parent.msg('error', 'Dimension can\'t be 0!');
            $('input.dimension-h').val(20);
            $('input.dimension-w').val(20);
        } else if ($('input.dimension-h').val() > 500 || $('input.dimension-w').val() <= 0 > 500) {
            this.parent.msg('error', 'Dimension are limited to max 500!');
            $('input.dimension-h').val(20);
            $('input.dimension-w').val(20);
        } else {
            this.setHeight($('input.dimension-h').val());
            this.setWidth($('input.dimension-w').val());
            this.zoom = 1;
            this.zoomSize = this.size * this.zoom;
            this.generateGrid();
        }
    }
    /************************
     ***** HTML changes *****
     ************************/
    showCustomBox(element) {
        $('.custom-container').show();
        if (element.asset.name == 'portal') {
            $('.is-portal').show();
            $('.custom-container').hide();
        } else {
            $('.is-portal').hide();
        }
        this.requirements.element = element;
        //$('aside .custom').addClass('active');
        $('aside .custom .portal-to').val(element.level);
        $('aside .custom .custom-hidden').attr('data-col', element.col).attr('data-row', element.row);
        this.requirements.show();
    }
    hideCustomBox() {
        this.requirements.hide();
    }
    listAssets() {
        let htmlArray = [];
        let typeArray = [{
                key: 'tiles',
                items: this.parent._assets.getTypes('tiles')
            },
            {
                key: 'collectibles',
                items: this.parent._assets.getTypes('collectibles')
            },
            {
                key: 'interactions',
                items: this.parent._assets.getTypes('interactions')
            }
        ];
        for (let layerI = 0; layerI < typeArray.length; layerI++) {
            htmlArray.push('<div class="asset-layer layer-' + typeArray[layerI].key + '">');
            for (let typeI = 0; typeI < typeArray[layerI].items.length; typeI++) {
                htmlArray.push('<div class="assetGroup accordion padding-lr-m padding-tb-m block flex-m">');
                htmlArray.push('<div class="title">' + typeArray[layerI].items[typeI] + '</div>');
                let assets = this.parent._assets.getByType(typeArray[layerI].items[typeI]);
                if (assets) {
                    for (let assetI = 0; assetI < assets.length; assetI++) {
                        htmlArray.push('<div class="asset" data-uid="' + assets[assetI].uid + '"><img src="' + assets[assetI].image.src + '" /></div>');
                    }
                }
                htmlArray.push('</div>');
            }
            htmlArray.push('</div>');
        }
        $('aside .accordion-container').append(htmlArray.join(''));
        this.mousehandler.add('.assetGroup .title', 'click', 'changeAssetGroup');
        $('aside .asset-layer.active .assetGroup .title').first().click();
        this.mousehandler.add('aside .asset', 'click', 'changeAsset');
    }
}
