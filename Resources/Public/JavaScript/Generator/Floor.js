class Floor {
    constructor(parent, result) {
        this.parent = parent;
        this.tiles = new Tiles(this.parent);
        this.mousehandler = new MouseHandler(this);
        this.keyboardHandler = new KeyboardHandler(this);

        this.tilesArray = [];
        this.isDrawing = false;
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
        this.zoom = 1;
        this.brushSize = 1;
        this.setSize(30);
        this.setZoomSize(this.getSize() * this.getZoom());
        this.setHeight(result.height);
        this.setWidth(result.width);
        this.setLevel(result.level);
        this.setStart('x', result.startX);
        this.setStart('y', result.startY);
        this.setTileJson(result.tilesJson);

        this.setCanvasSize();
        this.generateGrid();
        this.mousehandler.add('#world', 'click', 'addTile');
        this.mousehandler.add('.zoom', 'click', 'doZoom');
        this.mousehandler.add('.brush', 'click', 'changeBrush');
        this.mousehandler.add('.reset', 'click', 'resetForm');
        this.mousehandler.add('.dimension .sizeSubmit', 'click', 'setDimensions');
        this.mousehandler.add('.saveFloor', 'click', 'saveFloor');

        this.mousehandler.add('#world', 'mousedown', 'mousedown');
        this.mousehandler.add('#world', 'mouseup', 'mouseup');
        this.mousehandler.add('#world', 'mousemove', 'mousemove');
        // mousewheel
        this.mousehandler.add('#world', 'wheel', 'wheelZoom');
        // keyboard
        this.keyboardHandler.add(document, 'keydown', 'keydown');
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
    getTileJson() {
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
    }
    setStart(dir, val) {
        this.start[dir] = parseInt(val);
    }
    setTileJson(tilesJson) {
        this.tilesArray = JSON.parse(tilesJson);
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
    setZoom(direction) {
        if (this.getZoom() < 20 && direction == '+') {
            this.zoom += 0.1;
        }
        if (this.getZoom() >= 0.2 && direction == '-') {
            this.zoom -= 0.1;
        }
        $('.zoomLevel').html(Math.round(this.getZoom() * 100));
    }
    setBrushSize(direction) {
        let brushSizes = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 49];
        if (this.getBrushSize() <= 48 && direction == '+') {
            this.brushSize = brushSizes[brushSizes.indexOf(this.getBrushSize()) + 1];
        }
        if (this.getBrushSize() > 1 && direction == '-') {
            this.brushSize = brushSizes[brushSizes.indexOf(this.getBrushSize()) - 1];
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
            colX = 0;
        for (let row = 0; row < this.getHeight(); row++) {
            rowY = this.getZoomSize() * row;
            for (let col = 0; col < this.getWidth(); col++) {
                colX = this.getZoomSize() * col;
                if (!this.tilesArray[row]) {
                    this.tilesArray[row] = [];
                }
                if (!this.tilesArray[row][col]) {
                    this.tilesArray[row][col] = [];
                }
                this.tiles.add(this.tilesArray[row][col], row, col, rowY, colX);
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
                    // every single one
                    this.repaint(this.tiles.get(r, c));
                }

            }
        }
        // once all
        //this.repaint();
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
    saveFloor(event) {
        let tileArray = [];
        let info = '';
        let floor = {
            level: this.getLevel(),
            startX: this.getStart('x'),
            startY: this.getStart('y'),
            height: this.getHeight(),
            width: this.getWidth(),
            tileJson: []
        }
        for (let row = 0; row < this.getHeight(); row++) {
            for (let col = 0; col < this.getWidth(); col++) {
                if (this.tiles.get(row, col).isBlank) {
                    info = '';
                } else {
                    if (this.tiles.get(row, col).asset.getType() == 'portal') {
                        info = this.tiles.get(row, col).level + "|" + this.tiles.get(row, col).asset.getUid();
                    } else {
                        info = this.tiles.get(row, col).asset.getUid();
                    }
                }
                tileArray.push(info);
            }
        }
        floor.tiles = tileArray.join(',');
        console.log(JSON.stringify(floor));
    }
    resetForm() {
        $('.infoBox > span').removeClass('active');
        $('select.floorSelect').val([]);
        $('select.floorSelect option').prop('selected', false);
        $('.controls input.level').val('').prop('disabled', false);
        $('input.isLoded').val('0');
        $('input.dimension-w').val(20);
        $('input.dimension-h').val(20);
        $('aside .custom').removeClass('active');
        this.zoom = 1;
        this.setZoomSize(this.getSize() * this.getZoom());
        this.tilesArray = [];
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
}


class Floor2 {
    constructor() {
        this.floorSettings = {
            startX: 0,
            startY: 0,
            endX: 0,
            endY: 0,
            height: 0,
            width: 0,
            assets: [],
        }
        this.canvasOffsetX = 0;
        this.canvasOffsetY = 0;
        this.brushSize = 1;
        this.zoom = 1;
        this.getZoomSize() = 30 * this.zoom;
        this.mouseDown = false;
        this.allTilesGrouped = [];
        this.allTiles = [];
        this.selectedEl = '';
    }

    getFloor(result, params = "") {
        if (result) {
            floor.floorSettings = {
                level: parseInt(result.level),
                startX: parseInt(result.startX),
                startY: parseInt(result.startY),
                endX: parseInt(result.endX),
                endY: parseInt(result.endY),
                height: parseInt(result.height),
                width: parseInt(result.width),
                assets: JSON.parse(result.assetsJson)
            };
            $('.controls input.level').val(floor.floorSettings.level).prop('disabled', true);
            $('input.isLoded').val('1');
            floor.canvasOffsetX = 0;
            floor.canvasOffsetY = 0;
            floor.setRange();
            floor.generateGrid(true);
        } else {
            resetForm();
        }
    }

    setBlockSize() {
        this.getZoomSize() = 30 * this.zoom;
    }

    setFloorSettings(type, val) {
        this.floorSettings[type] = val;
    }
    setFloorSettingsDimensions() {
        floor.setFloorSettings('height', $('input.dimension-h').val());
        floor.setFloorSettings('width', $('input.dimension-w').val());
    }
    generateGrid(load = false) {
        this.setFloorSettingsDimensions();
        let dimX = $('input.dimension-w').val(),
            dimY = $('input.dimension-h').val(),
            ry = 0,
            cx = 0,
            asset = '',
            oldFloorTiles = [];
        // clear it
        if (load == false) {
            this.floorSettings.assets = [];
        }
        if (load == true) {

            oldFloorTiles = this.floorSettings.assets;
            this.floorSettings.assets = [];
        }
        for (let r = 0; r < dimY; r++) {
            ry = this.getZoomSize() * r;
            for (let c = 0; c < dimX; c++) {
                cx = this.getZoomSize() * c;
                if (load == true) {
                    if (!this.floorSettings.assets[r]) {
                        this.floorSettings.assets[r] = [];
                    }
                    if (!this.floorSettings.assets[r][c]) {
                        this.floorSettings.assets[r][c] = {};
                    }
                    if (oldFloorTiles && oldFloorTiles[r] && oldFloorTiles[r][c]) {
                        if (oldFloorTiles[r][c].uid) {
                            this.floorSettings.assets[r][c].uid = oldFloorTiles[r][c].uid;
                            this.floorSettings.assets[r][c].type = this.allTiles[oldFloorTiles[r][c].uid].settings.type;
                        }
                        if (oldFloorTiles[r][c].level) {
                            this.floorSettings.assets[r][c].level = oldFloorTiles[r][c].level;
                        }
                        if (oldFloorTiles[r][c].overlay) {
                            this.floorSettings.assets[r][c].overlay = oldFloorTiles[r][c].overlay;
                        }
                    }
                    this.floorSettings.assets[r][c].x = cx;
                    this.floorSettings.assets[r][c].y = ry;
                    this.floorSettings.assets[r][c].posX = c;
                    this.floorSettings.assets[r][c].posY = r;
                } else {
                    asset = {
                        x: cx,
                        y: ry,
                        type: '',
                        name: '',
                        posX: c,
                        posY: r
                    }
                    if (!this.floorSettings.assets[r]) {
                        this.floorSettings.assets[r] = [];
                    }
                    this.floorSettings.assets[r][c] = asset;
                }
            }
        }
        this.repaint();
    }
    fillCanvas(assets, element) {
        if (element) {
            this.genBlock(element);
        } else {
            let cStart = Math.floor(-this.canvasOffsetX / this.getZoomSize());
            let rStart = Math.floor(-this.canvasOffsetY / this.getZoomSize());
            let cStop = Math.floor((_ctx.canvas.width + this.getZoomSize() * 2) / this.getZoomSize());
            let rStop = Math.floor((_ctx.canvas.height + this.getZoomSize() * 2) / this.getZoomSize());

            cStart = cStart > 0 ? cStart : 0;
            rStart = rStart > 0 ? rStart : 0;

            cStop = cStart + cStop < this.floorSettings.width ? cStart + cStop : this.floorSettings.width;
            rStop = rStart + rStop < this.floorSettings.height ? rStart + rStop : this.floorSettings.height;

            for (let r = rStart; r < rStop; r++) {
                for (let c = cStart; c < cStop; c++) {
                    this.genBlock(assets[r][c]);
                }
            }
        }
    }
    repaint(element = '') {
        _ctx.save();
        _ctx.setTransform(1, 0, 0, 1, 0, 0);
        if (element == '') {
            _ctx.clearRect(0, 0, _ctx.canvas.width, _ctx.canvas.height);
        }
        _ctx.translate(this.canvasOffsetX, this.canvasOffsetY)
        this.fillCanvas(this.floorSettings.assets, element);
        _ctx.restore();
    }
    genBlock(asset) {
        let x = asset.x * this.zoom,
            y = asset.y * this.zoom,
            h = this.getZoomSize(),
            w = this.getZoomSize();
        if (asset.uid) {
            _ctx.drawImage(this.allTiles[asset.uid].img, x, y, h, w);
            // draw as overlay
            if (asset.overlay) {
                _ctx.drawImage(this.allTiles[asset.overlay].img, x, y, h, w);
            }
        } else {
            _ctx.fillStyle = 'rgb(255,255,255)';
            _ctx.beginPath();
            _ctx.rect(x, y, h, w);
            _ctx.stroke();
        }
    }
    setRange() {
        $('input.dimension-w').val(this.floorSettings.width);
        $('input.dimension-h').val(this.floorSettings.height);
    }
    doZoom(reset = false) {
        if (reset) {
            this.zoom = 1;
            this.getZoomSize() = 30 * this.zoom;
            $('.zoomLevel').html(Math.round(this.zoom * 100));
            this.repaint();
        } else {
            this.zoom = Math.round(this.zoom * 100) / 100;
            this.getZoomSize() = 30 * this.zoom;
            this.repaint();
        }

    }
    setZoom(direction) {
        if (this.zoom < 20 && direction == '+') {
            this.zoom += 0.1;
        }
        if (this.zoom >= 0.2 && direction == '-') {
            this.zoom -= 0.1;
        }
        $('.zoomLevel').html(Math.round(this.zoom * 100));
    }
    setBrushSize(direction) {
        let brushSizes = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 49];
        if (this.brushSize <= 48 && direction == '+') {
            this.brushSize = brushSizes[brushSizes.indexOf(this.brushSize) + 1];
        }
        if (this.brushSize > 1 && direction == '-') {
            this.brushSize = brushSizes[brushSizes.indexOf(this.brushSize) - 1];
        }
        $('.brushSize').html(this.brushSize);
    }

    addTile(oX, oY) {
        let ignoreBrushItems = ['start', 'portal', 'trap', 'enemy', 'item'];
        let offsetX = Math.floor((oX - floor.canvasOffsetX) / floor.blockSize);
        let offsetY = Math.floor((oY - floor.canvasOffsetY) / floor.blockSize);
        if (floor.selectedEl.length > 0) {
            if (floor.brushSize > 1 && $.inArray(floor.allTiles[floor.selectedEl.attr('data-uid')].settings.type, ignoreBrushItems) === -1) {
                for (let r = offsetY - Math.floor(this.brushSize / 2); r < offsetY + Math.ceil(this.brushSize / 2); r++) {
                    for (let c = offsetX - Math.floor(this.brushSize / 2); c < offsetX + Math.ceil(this.brushSize / 2); c++) {
                        if (floor.floorSettings.assets[r] && floor.floorSettings.assets[r][c]) {
                            this.setTileInfo(floor.floorSettings.assets[r][c]);
                        }
                    }
                }
            } else {
                if (floor.floorSettings.assets[offsetY] && floor.floorSettings.assets[offsetY][offsetX]) {
                    this.setTileInfo(floor.floorSettings.assets[offsetY][offsetX]);
                }
            }
        } else {
            if (floor.floorSettings.assets[offsetY] && floor.floorSettings.assets[offsetY][offsetX]) {
                this.showCustomBox(floor.floorSettings.assets[offsetY][offsetX].type, floor.floorSettings.assets[offsetY][offsetX]);
            }
        }
    }
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

function cleanUpSettings(exportFloorSettings) {
    let uid = 0;
    let level = 0;
    let overlay = "";
    for (r = 0; r < exportFloorSettings.height; r++) {
        for (c = 0; c < exportFloorSettings.width; c++) {
            uid = 0;
            level = 0;
            overlay = "";
            if (exportFloorSettings.assets[r][c].type == "portal") {
                level = exportFloorSettings.assets[r][c].level;
            }
            if (exportFloorSettings.assets[r][c].overlay) {
                overlay = exportFloorSettings.assets[r][c].overlay;
            }
            uid = exportFloorSettings.assets[r][c].uid;
            exportFloorSettings.assets[r][c] = {};
            if (level > 0) {
                exportFloorSettings.assets[r][c].level = level;
            }
            if (overlay) {
                exportFloorSettings.assets[r][c].overlay = overlay;
            }
            if (uid > 0) {
                exportFloorSettings.assets[r][c].uid = uid;
            }
        }
    }
    return exportFloorSettings;
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
 ********* change events ************
 ***********************************/
/* select field for floor selection */
$('.floorSelect').change(function() {
    showMsgReset();
    if ($('.floorSelect').val() > 0) {
        floor.doZoom(true);
        floor.loader.add('data', 'floor', {
            type: 'getFloor',
            level: $(this).val()
        });
        floor.loader.run();
    } else {
        resetForm();
    }
});

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

/* save with ajax */
// $('.saveFloor').click(function() {
//     showMsgReset();
//     if ($('input.level').val()) {
//         floor.floorSettings.level = $('input.level').val();
//     }
//     exportFloorSettings = JSON.parse(JSON.stringify(floor.floorSettings));
//     exportJson = JSON.stringify(cleanUpSettings(exportFloorSettings));
//     if ($('input.level').val()) {
//         ajaxHandler(saveFloor,
//             data = {
//                 type: 'saveFloor',
//                 json: exportJson,
//                 isLoaded: $('input.isLoded').val() || 0
//             });
//     }
// });
//
// function saveFloor(result, params = "") {
//     if (result.type && result.msg) {
//         showMsg(result.type, result.msg);
//     }
//     ajaxHandler(getAllFloorLevels,
//         data = {
//             type: 'getAllFloorLevels'
//         });
// }
