class Floor {
    constructor(parent, result) {
        this.parent = parent;
        this.tiles = new Squares(this.parent);
        this.items = new Items(this.parent);
        this.enemies = new Enemies(this.parent);
        this.dataHandler = new DataHandler(this);
        this.mousehandler = new MouseHandler(this);
        this.keyboardHandler = new KeyboardHandler(this);

        this.tilesArray = [];
        this.isDrawing = false;
        // when it was loaded
        this.defaultWidth = result.width;
        this.selectedLayer = 'tiles';
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
        this.mousehandler.add('.zoom', 'click', 'doZoom');
        this.mousehandler.add('.brush', 'click', 'changeBrush');
        this.mousehandler.add('.reset', 'click', 'resetForm');
        this.mousehandler.add('.dimension .sizeSubmit', 'click', 'setDimensions');
        this.mousehandler.add('.saveFloor', 'click', 'save');
        this.mousehandler.add('.layer', 'click', 'changeLayer');
        this.mousehandler.add('aside .custom .save-to-element', 'click', 'saveToElement')

        // mouse event
        this.mousehandler.add('#world', 'mousedown', 'mousedown');
        this.mousehandler.add('#world', 'mouseup', 'mouseup');
        this.mousehandler.add('#world', 'mousemove', 'mousemove');
        // mousewheel
        this.mousehandler.add('#world', 'wheel', 'wheelZoom');

        // change
        this.mousehandler.add('.floorSelect', 'change', 'changeFloor');

        // keyboard
        this.keyboardHandler.add(document, 'keydown', 'keydown');
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
        if (result.enemies) {
            this.setEnemiesArray(result.enemies);
        }
        if (result.items) {
            this.setItemsArray(result.items);
        }

        this.setCanvasSize();
        this.generateGrid();
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
    setItemsArray(items) {
        this.itemsArray = this.dataHandler.extract(items);
    }
    setEnemiesArray(enemies) {
        this.enemiesArray = this.dataHandler.extract(enemies);
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
        _ctx.canvas.width = Math.floor($('.canvasContainer').width());
        _ctx.canvas.height = Math.floor($('body').height() - $('#world').offset().top - 25);
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
                    this.enemies.add('', row, col, rowY, colX);
                    this.items.add('', row, col, rowY, colX);
                } else if (this.defaultWidth > this.width) {
                    counter++;
                } else {
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
                    counter++;
                }
            }
        }
        this.startIsSet = this.tiles.startIsSet;
        this.repaint();
    }
    repaint(element = '') {
        _ctx.save();
        _ctx.setTransform(1, 0, 0, 1, 0, 0);
        if (element == '') {
            _ctx.fillStyle = '#e5e5e5';
            _ctx.fillRect(0, 0, _ctx.canvas.width, _ctx.canvas.height);
            //_ctx.clearRect(0, 0, _ctx.canvas.width, _ctx.canvas.height);
        }
        _ctx.translate(this.stageOffset.x, this.stageOffset.y)
        this.fillCanvas(element);
        _ctx.restore();
    }
    fillCanvas(element) {
        if (element) {
            this.drawAsset(this.tiles.get(element.row, element.col));
            this.drawAsset(this.items.get(element.row, element.col));
            this.drawAsset(this.enemies.get(element.row, element.col));
            this.addGrid(element);
        } else {
            let cStart = Math.floor(-this.stageOffset.x / this.zoomSize);
            let rStart = Math.floor(-this.stageOffset.y / this.zoomSize);
            let cStop = Math.floor((_ctx.canvas.width + this.zoomSize * 2) / this.zoomSize);
            let rStop = Math.floor((_ctx.canvas.height + this.zoomSize * 2) / this.zoomSize);

            cStart = cStart > 0 ? cStart : 0;
            rStart = rStart > 0 ? rStart : 0;

            cStop = cStart + cStop < this.width ? cStart + cStop : this.width;
            rStop = rStart + rStop < this.height ? rStart + rStop : this.height;
            for (let row = rStart; row < rStop; row++) {
                for (let col = cStart; col < cStop; col++) {
                    this.drawAsset(this.tiles.get(row, col));
                    this.drawAsset(this.items.get(row, col));
                    this.drawAsset(this.enemies.get(row, col));
                    this.addGrid(this.tiles.get(row, col));
                }
            }
        }
    }
    drawAsset(element) {
        let x = element.x * this.zoom,
            y = element.y * this.zoom,
            h = this.zoomSize,
            w = this.zoomSize;
        if (element.asset.image) {
            _ctx.drawImage(element.asset.image, x, y, h, w);
        }
    }
    addGrid(element) {
        _ctx.beginPath();
        _ctx.strokeStyle = 'rgb(0,0,0)';
        _ctx.rect(element.x * this.zoom, element.y * this.zoom, this.zoomSize, this.zoomSize);
        _ctx.stroke();
    }
    resize() {
        this.setCanvasSize();
        this.repaint();
    }
    addTile(event) {
        let ignoreBrushItems = ['start', 'portal', 'trap', 'enemy', 'item'];
        let col = Math.floor((event.offsetX - this.stageOffset.x) / this.zoomSize);
        let row = Math.floor((event.offsetY - this.stageOffset.y) / this.zoomSize);
        if (this.selectedAsset && row >= 0 && row < this.height && col >= 0 && col < this.width) {
            if (ignoreBrushItems.includes(this.parent._assets.get(this.selectedAsset).type)) {
                this.checkIfStart(this[this.selectedLayer].get(row, col));
                if (this.parent._assets.get(this.selectedAsset).type == 'start' && this.startIsSet == false) {
                    this.startIsSet = true;
                    this.setStart('x', col);
                    this.setStart('y', row);
                    this[this.selectedLayer].get(row, col).setTile(this.selectedAsset);
                    this.repaint(this[this.selectedLayer].get(row, col));
                }
                if (this.parent._assets.get(this.selectedAsset).type == 'portal') {
                    this.showCustomBox(this[this.selectedLayer].get(row, col));
                }
                if (this.parent._assets.get(this.selectedAsset).type != 'start') {
                    this[this.selectedLayer].get(row, col).setTile(this.selectedAsset);
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
                                this[this.selectedLayer].get(r, c).setTile(this.selectedAsset);
                                this.repaint(this[this.selectedLayer].get(r, c));
                            }
                        }
                    }
                }
            }
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
    }
    changeAsset(event) {
        $('.asset.active').removeClass('active');
        $(event.target).parent().addClass('active');
        this.selectedAsset = $(event.target).parent().data('uid');
    }
    changeAssetGroup(event) {
        $('.asset.active').removeClass('active');
        this.selectedAsset = 0;
        $('.assetGroup.show').removeClass('show');
        $(event.target).parent().addClass('show');
    }
    keydown() {
        let repaint = false;
        if (this.keyboardHandler.get('left')) {
            this.setStageOffset('x', this.stageOffset.x - this.zoomSize);
            repaint = true;
        }
        if (this.keyboardHandler.get('right')) {
            this.setStageOffset('x', this.stageOffset.x + this.zoomSize);
            repaint = true;
        }
        if (this.keyboardHandler.get('up')) {
            this.setStageOffset('y', this.stageOffset.y - this.zoomSize);
            repaint = true;
        }
        if (this.keyboardHandler.get('down')) {
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
        if (this.items.getCount()) {
            floor.items = this.dataHandler.compress(this.items);
        }
        if (this.enemies.getCount()) {
            floor.enemies = this.dataHandler.compress(this.enemies);
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
        this.selectedLayer = 'tiles';
        this.tilesArray = [];
        this.itemsArray = [];
        this.enemiesArray = [];
        this.tiles.clear();
        this.items.clear();
        this.enemies.clear();
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
    saveToElement() {
        let row = $('aside .custom .custom-hidden').attr('data-row'),
            col = $('aside .custom .custom-hidden').attr('data-col'),
            level = $('aside .custom .level').val();
        this.tiles.get(row, col).setLevel(level);
        this.parent.msg('success', 'Level ' + level + ' has been set');
        $('aside .custom').removeClass('active');
    }
    /************************
     ***** HTML changes *****
     ************************/
    showCustomBox(asset) {
        $('aside .custom').addClass('active');
        $('aside .custom .level').val(asset.level);
        $('aside .custom .custom-hidden').attr('data-col', asset.col).attr('data-row', asset.row);
    }
    listAssets() {
        let types = this.parent._assets.getTypes();
        let htmlArray = [];
        htmlArray.push('<div class="asset-layer active layer-tiles">');
        for (let i = 0; i < types.length; i++) {
            if (types[i] == 'item') {
                htmlArray.push('</div><div class="asset-layer layer-items">');
            }
            if (types[i] == 'trap') {
                htmlArray.push('</div><div class="asset-layer layer-enemies">');
            }

            htmlArray.push('<div class="assetGroup accordion padding-lr-m padding-tb-m block flex-m">');
            htmlArray.push('<div class="title">' + types[i] + '</div>');
            let typeAssets = this.parent._assets.getByType(types[i]);
            if (typeAssets) {
                for (let i = 0; i < typeAssets.length; i++) {
                    htmlArray.push('<div class="asset" data-uid="' + typeAssets[i].uid + '"><img src="' + typeAssets[i].image.src + '" /></div>');
                }
            }
            htmlArray.push('</div>');
        }
        // closes last open div
        htmlArray.push('</div>');
        $('aside .accordion-container').append(htmlArray.join(''));
        this.mousehandler.add('.assetGroup .title', 'click', 'changeAssetGroup');
        $('aside .asset-layer.active .assetGroup .title').first().click();
        this.mousehandler.add('aside .asset', 'click', 'changeAsset');
    }
}
