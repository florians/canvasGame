class Floor {
    constructor(parent, result) {
        this.parent = parent;
        this.tiles = new Tiles(this.parent);
        this.dataHandler = new DataHandler(this);
        this.mousehandler = new MouseHandler(this);
        this.keyboardHandler = new KeyboardHandler(this);

        this.tilesArray = [];
        this.isDrawing = false;
        // when it was loaded
        this.defaultWidth = result.width;
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

        this.init(result);
    }

    init(result) {
        this.setZoom('reset');
        this.setBrushSize('reset');
        this.setSize(30);
        this.setZoomSize(this.getSize() * this.getZoom());
        this.setHeight(result.height);
        this.setWidth(result.width);
        this.setLevel(result.level);
        this.setStart('x', result.startX);
        this.setStart('y', result.startY);
        this.setTilesArray(result.tiles);

        this.setCanvasSize();
        this.generateGrid();
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
    getTilesArray() {
        return this.tilesArray;
    }
    getStageOffset(dir) {
        return this.stageOffset[dir];
    }
    getSize() {
        return this.size;
    }
    getZoomSize() {
        return this.zoomSize;
    }
    getZoom() {
        return this.zoom;
    }
    getBrushSize() {
        return this.brushSize;
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
    setStageOffset(dir, val) {
        this.stageOffset[dir] = val;
    }
    setSize(size) {
        this.size = size;
    }
    setZoomSize(zoomSize) {
        this.zoomSize = zoomSize;
    }
    setZoom(task) {
        if (task == 'reset') {
            this.zoom = 1;
        } else {
            if (this.getZoom() < 20 && task == '+') {
                this.zoom += 0.1;
            }
            if (this.getZoom() >= 0.2 && task == '-') {
                this.zoom -= 0.1;
            }
        }
        $('.zoomLevel').html(Math.round(this.getZoom() * 100));
    }
    setBrushSize(task) {
        if (task == 'reset') {
            this.brushSize = 1;
        } else {
            let brushSizes = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 49];
            if (this.getBrushSize() <= 48 && task == '+') {
                this.brushSize = brushSizes[brushSizes.indexOf(this.getBrushSize()) + 1];
            }
            if (this.getBrushSize() > 1 && task == '-') {
                this.brushSize = brushSizes[brushSizes.indexOf(this.getBrushSize()) - 1];
            }
        }
        $('.brushSize').html(this.getBrushSize());
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
        for (let row = 0; row < this.getHeight(); row++) {
            rowY = this.getZoomSize() * row;
            for (let col = 0; col < this.getWidth(); col++) {
                colX = this.getZoomSize() * col;
                // scale up
                if (this.defaultWidth > 0 && col >= this.defaultWidth) {
                    this.tiles.add('', row, col, rowY, colX);
                } else if (this.defaultWidth > this.getWidth()) {
                    counter++;
                } else {
                    this.tiles.add(this.tilesArray[counter], row, col, rowY, colX);
                    counter++;
                }
            }
        }
        this.repaint();
    }
    repaint(element = '') {
        _ctx.save();
        _ctx.setTransform(1, 0, 0, 1, 0, 0);
        if (element == '') {
            _ctx.clearRect(0, 0, _ctx.canvas.width, _ctx.canvas.height);
        }
        _ctx.translate(this.getStageOffset('x'), this.getStageOffset('y'))
        this.fillCanvas(element);
        _ctx.restore();
    }
    fillCanvas(element) {
        if (element) {
            this.drawTile(element);
        } else {
            let cStart = Math.floor(this.getStageOffset('x') / this.getZoomSize());
            let rStart = Math.floor(this.getStageOffset('y') / this.getZoomSize());
            let cStop = Math.floor((_ctx.canvas.width + this.getZoomSize() * 2) / this.getZoomSize());
            let rStop = Math.floor((_ctx.canvas.height + this.getZoomSize() * 2) / this.getZoomSize());

            cStart = cStart > 0 ? cStart : 0;
            rStart = rStart > 0 ? rStart : 0;

            cStop = cStart + cStop < this.getWidth() ? cStart + cStop : this.getWidth();
            rStop = rStart + rStop < this.getHeight() ? rStart + rStop : this.getHeight();

            for (let row = 0; row < rStop; row++) {
                for (let col = 0; col < cStop; col++) {
                    this.drawTile(this.tiles.get(row, col));
                }
            }
        }
    }
    drawTile(tile) {
        let x = tile.getX() * this.zoom,
            y = tile.getY() * this.zoom,
            h = this.getZoomSize(),
            w = this.getZoomSize();
        if (tile.asset.image) {
            _ctx.drawImage(tile.asset.getImage(), x, y, h, w);
        } else {
            _ctx.fillStyle = 'rgb(255,255,255)';
            _ctx.beginPath();
            _ctx.rect(x, y, h, w);
            _ctx.stroke();
        }
    }
    resize() {
        this.setCanvasSize();
        this.repaint();
    }
    addTile(event) {
        // index of smt
        let ignoreBrushItems = ['start', 'portal', 'trap', 'enemy', 'item'];
        let col = Math.floor((event.offsetX - this.getStageOffset('x')) / this.getZoomSize());
        let row = Math.floor((event.offsetY - this.getStageOffset('y')) / this.getZoomSize());

        for (let r = row - Math.floor(this.brushSize / 2); r < row + Math.ceil(this.brushSize / 2); r++) {
            for (let c = col - Math.floor(this.brushSize / 2); c < col + Math.ceil(this.brushSize / 2); c++) {
                if (c < 0 || r < 0) {
                    continue;
                }
                if (c < this.getWidth() && r < this.getHeight()) {
                    this.tiles.get(r, c).setTile(3);
                    this.repaint(this.tiles.get(r, c));
                }

            }
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
        this.setZoomSize(this.getSize() * this.getZoom());
        this.repaint();
    }
    wheelZoom(event) {
        if (event.deltaY > 0) {
            this.setZoom('-');
        } else {
            this.setZoom('+');
        }
        this.setZoomSize(this.getSize() * this.getZoom());
        this.repaint();

    }
    changeBrush(event) {
        this.setBrushSize(event.target.dataset.change);
    }
    keydown() {
        let repaint = false;
        if (this.keyboardHandler.get('left')) {
            this.setStageOffset('x', this.getStageOffset('x') - this.getZoomSize());
            repaint = true;
        }
        if (this.keyboardHandler.get('right')) {
            this.setStageOffset('x', this.getStageOffset('x') + this.getZoomSize());
            repaint = true;
        }
        if (this.keyboardHandler.get('up')) {
            this.setStageOffset('y', this.getStageOffset('y') - this.getZoomSize());
            repaint = true;
        }
        if (this.keyboardHandler.get('down')) {
            this.setStageOffset('y', this.getStageOffset('y') + this.getZoomSize());
            repaint = true;
        }
        if (repaint) {
            this.repaint();
        }
    }
    preloaderResult(result) {
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
            level: this.getLevel(),
            startX: this.getStart('x'),
            startY: this.getStart('y'),
            height: this.getHeight(),
            width: this.getWidth(),
            tiles: []
        }
        floor.tiles = this.dataHandler.compress(this.tiles);
        if (this.getLevel() > 0) {
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

        $('input.dimension-w').val(this.getHeight());
        $('input.dimension-h').val(this.getWidth());


        $('.infoBox > span').removeClass('active');
        $('select.floorSelect').val([]);
        $('select.floorSelect option').prop('selected', false);
        $('.controls input.level').val('').prop('disabled', false);

        $('aside .custom').removeClass('active');

        this.tilesArray = [];
        this.tiles.clear();
        this.generateGrid();
    }
    setDimensions(event) {
        this.setHeight($('input.dimension-h').val());
        this.setWidth($('input.dimension-w').val());
        if (this.getHeight() <= 0 || this.getWidth() <= 0) {
            this.showMsg('error', 'Dimension can\'t be 0!');
        } else if (this.getHeight() > 500 || this.getWidth() <= 0 > 500) {
            this.showMsg('error', 'Dimension are limited to max 500!');
        } else {
            this.zoom = 1;
            this.setZoomSize(this.getSize() * this.getZoom());
            this.generateGrid();
        }
    }
    showMsg(type, msg) {
        this.showMsgReset();
        $('.infoBox .' + type).html(msg).addClass('active');
    }

    showMsgReset() {
        $('.infoBox > span').removeClass('active')
    }

    /************************
     ******* Data prep ******
     ************************/
    // compress() {
    //     let tileArray = [],
    //         counter = 0,
    //         empty = false,
    //         info = '';
    //     for (let row = 0; row < this.getHeight(); row++) {
    //         for (let col = 0; col < this.getWidth(); col++) {
    //             if (this.tiles.get(row, col).getIsEmpty()) {
    //                 counter++;
    //                 info = '';
    //             } else {
    //                 if (this.tiles.get(row, col).asset.getType() == 'portal') {
    //                     info = this.tiles.get(row, col).asset.getUid() + "|" + this.tiles.get(row, col).level;
    //                 } else {
    //                     info = this.tiles.get(row, col).asset.getUid();
    //                 }
    //             }
    //             if (info) {
    //                 if (counter > 0) {
    //                     tileArray.push("#" + counter);
    //                     counter = 0;
    //                 }
    //                 tileArray.push(info);
    //             }
    //         }
    //     }
    //     if (counter > 0) {
    //         tileArray.push("#" + counter);
    //         counter = 0;
    //     }
    //     return tileArray.join(',');
    // }
    // extract(data) {
    //     let decompressedData = [],
    //         counter = 0,
    //         amount = 0;
    //     data = data.split(',');
    //     for (let i = 0; i < data.length; i++) {
    //         // add emtpy fields when #number
    //         if (data[i].includes('#')) {
    //             amount = data[i].slice(1);
    //             for (let includes = 0; includes < amount; includes++) {
    //                 decompressedData[counter] = '';
    //                 counter++;
    //             }
    //         } else {
    //             // split on | when more data
    //             if (data[i].includes('|')) {
    //                 decompressedData[counter] = data[i].split('|');
    //             } else {
    //                 decompressedData[counter] = data[i];
    //             }
    //             counter++;
    //         }
    //     }
    //     return decompressedData;
    // }
}


class Floor2 {
    showCustomBox(type, asset) {
        if (type == 'portal') {
            $('aside .custom').addClass('active');
            $('aside .custom .level').val(asset.level);
            $('aside .custom .custom-hidden').attr('data-x', asset.posX).attr('data-y', asset.posY);
        } else {
            $('aside .custom').removeClass('active');
        }
    }
    setTileInfo(asset) {
        let onlyOverlay = ['trap', 'enemy', 'item'],
            newUid = floor.selectedEl.attr('data-uid'),
            newTile = {
                uid: asset.uid || newUid,
                x: asset.x,
                y: asset.y,
                posX: asset.posX,
                posY: asset.posY,
            };
        this.showCustomBox(floor.allTiles[newUid].settings.type, asset);
        if ($.inArray(floor.allTiles[newUid].settings.type, onlyOverlay) === -1) {
            if (floor.allTiles[newUid].settings.type == 'start') {
                floor.floorSettings.startX = asset.posX;
                floor.floorSettings.startY = asset.posY;
            }
            floor.floorSettings.assets[asset.posY][asset.posX] = Object.assign(newTile, floor.allTiles[newUid].settings);
        } else {
            if (asset.uid) {
                floor.floorSettings.assets[asset.posY][asset.posX] = Object.assign(newTile, floor.allTiles[asset.uid].settings);
                floor.floorSettings.assets[asset.posY][asset.posX].overlay = floor.allTiles[newUid].settings.uid;
            }
        }
        this.repaint(floor.floorSettings.assets[asset.posY][asset.posX]);
    }
}

function fillTilesHtml() {
    $.each(Object.keys(floor.allTilesGrouped), function(index, type) {
        let array = [];
        array.push('<div class="assetGroup accordion padding-lr-m padding-tb-m block flex-m">');
        array.push('<div class="title">' + type + '</div>');
        $.each(Object.keys(floor.allTilesGrouped[type]), function(index, el) {
            array.push('<div class="asset" data-uid="' + floor.allTilesGrouped[type][el].uid + '"><img src="' + floor.allTilesGrouped[type][el].img.src + '" /></div>');
        });
        array.push('</div>');
        $('aside .accordion-container').append(array.join(''));
    });
}

/***********************************
 ********* click events *************
 ***********************************/
// add custom config to start / end elements
$('aside .custom .save-to-element').click(function() {
    let x = $('aside .custom .custom-hidden').attr('data-x');
    let y = $('aside .custom .custom-hidden').attr('data-y');
    let level = $('aside .custom .level').val();
    if (y != '' && x != '' && level != '') {
        floor.floorSettings.assets[y][x].level = level;
        showMsg('success', 'Level has been set');
        $('aside .custom').removeClass('active');
    }
});

/* select asset  */
$(document).on('click', 'aside .asset', function() {
    if (!$(this).hasClass('isSelected')) {
        $('aside .asset').removeClass('isSelected');
        // FS only deliver uid
        floor.selectedEl = $(this).addClass('isSelected');
        $('body').toggleClass('open');
    } else {
        $('aside .asset').removeClass('isSelected');
        floor.selectedEl = '';
    }
});
$(document).on('click', '.assetGroup', function() {
    $('.assetGroup.show').removeClass('show');
    $(this).addClass('show');
});
$('.assetsButton').click(function() {
    $('body').toggleClass('open');
});
