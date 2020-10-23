class Floor {
    constructor() {
        this.loader = new Loader(this);
        this.preloader();
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
        this.blockSize = 30 * this.zoom;
        this.mouseDown = false;
        this.allTilesGrouped = [];
        this.allTiles = [];
        this.selectedEl = '';
    }
    preloader() {
        this.loader.add('data', 'assets', {
            type: 'getAllAssets'
        });
        this.loader.add('data', 'floorLevels', {
            type: 'getAllFloorLevels'
        });
        // calls floor.preloaderResult
        this.loader.run();
    }
    preloaderResult(result) {
        for (let i = 0; i < result.length; i++) {
            if (result[i].name == "assets") {
                this.getAllTiles(result[i].data.result);
            }
            if (result[i].name == "floor") {
                this.getFloor(result[i].data.result);
            }
            if (result[i].name == "floorLevels") {
                this.getAllFloorLevels(result[i].data.result);
            }
        }
    }

    getAllTiles(result = "", params = "") {
        let arrLength = 0;
        let assetAmount = result.length;
        for (let i = 0; i < result.length; i++) {
            let image = new Image();
            image.src = 'Resources/Public/Images/Floor/' + result[i].type + '/' + result[i].source;
            image.onload = () => {
                assetAmount--;
                if (!assetAmount) {
                    floor.generateGrid();
                    fillTilesHtml();
                }
            };
            floor.allTiles[result[i].uid] = {
                settings: result[i],
                img: image
            };

            if (!floor.allTilesGrouped[result[i].type]) {
                floor.allTilesGrouped[result[i].type] = [];
            }
            floor.allTilesGrouped[result[i].type][result[i].name] = {
                uid: result[i].uid,
                img: image
            }
        }
    }

    getAllFloorLevels(result = "", params = "") {
        $('.floorSelect').html('<option></option>');
        for (let i = 0; i < result.length; i++) {
            $('.floorSelect').append('<option value="' + result[i] + '">Level ' + result[i] + '</option>');
        }
        $('select.floorSelect').val(floor.floorSettings.level);
        $('.controls input.level').val(floor.floorSettings.level);
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
        this.blockSize = 30 * this.zoom;
    }
    setCanvasSize() {
        _ctx.canvas.width = Math.floor($('.canvasContainer').width());
        _ctx.canvas.height = Math.floor($('body').height() - $('#world').offset().top - 25);
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
            ry = this.blockSize * r;
            for (let c = 0; c < dimX; c++) {
                cx = this.blockSize * c;
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
            let cStart = Math.floor(-this.canvasOffsetX / this.blockSize);
            let rStart = Math.floor(-this.canvasOffsetY / this.blockSize);
            let cStop = Math.floor((_ctx.canvas.width + this.blockSize * 2) / this.blockSize);
            let rStop = Math.floor((_ctx.canvas.height + this.blockSize * 2) / this.blockSize);

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
            h = this.blockSize,
            w = this.blockSize;
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
            this.blockSize = 30 * this.zoom;
            $('.zoomLevel').html(Math.round(this.zoom * 100));
            this.repaint();
        } else {
            this.zoom = Math.round(this.zoom * 100) / 100;
            this.blockSize = 30 * this.zoom;
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

// get game container and start game
const _ctx = document.getElementById('world').getContext('2d');
let floor = new Floor();

floor.setCanvasSize();
floor.setFloorSettingsDimensions();

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

function resetForm() {
    showMsgReset();
    $('select.floorSelect').val([]);
    $('select.floorSelect option').prop('selected', false);
    $('.controls input.level').val('').prop('disabled', false);
    $('input.isLoded').val('0');
    $('input.dimension-w').val(20);
    $('input.dimension-h').val(20);
    $('aside .custom').removeClass('active');
    floor.floorSettings.assets = [];
    floor.setFloorSettingsDimensions();
    floor.generateGrid();
}
/***********************************
 ********* change events ************
 ***********************************/
/* range slider */
$('.dimension .sizeSubmit').click(function() {
    let h = $('input.dimension-h').val();
    let w = $('input.dimension-w').val();
    if (h <= 0 || w <= 0) {
        showMsg('error', 'Dimension can\'t be 0!');
    } else if (h > 500 || w > 500) {
        showMsg('error', 'Dimension are limited to max 500!');
    } else {
        floor.doZoom(true);
        floor.repaint();
        floor.setFloorSettingsDimensions();
        floor.generateGrid(true);
    }
});
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
 ********** mouse events ***********
 ***********************************/
$('#world').mouseup(function() {
        floor.mouseDown = false;
    })
    .mousedown(function() {
        floor.mouseDown = true;
    });
/***********************************
 ********** mouse painting *********
 ***********************************/
$('#world').mousemove(function(event) {
    if (floor.mouseDown == true) {
        floor.addTile(event.offsetX, event.offsetY);
    }
});
$('#world').click(function(event) {
    floor.addTile(event.offsetX, event.offsetY);
});

/***********************************
 ********** key down events ********
 ***********************************/
$(document).keydown(function(e) {
    let repaint = false;
    // a / left
    if ((e.keyCode == 37 || e.keyCode == 65) && floor.canvasOffsetX < floor.blockSize) {
        floor.canvasOffsetX += floor.blockSize;
        repaint = true;
    }
    // d / right
    if ((e.keyCode == 39 || e.keyCode == 68) && floor.canvasOffsetX > -(floor.floorSettings.width * floor.blockSize - ctx.canvas.width + floor.blockSize)) {
        floor.canvasOffsetX -= floor.blockSize;
        repaint = true;
    }
    // w / up
    if ((e.keyCode == 38 || e.keyCode == 87) && floor.canvasOffsetY < floor.blockSize) {
        floor.canvasOffsetY += floor.blockSize;
        repaint = true;
    }
    // s / down
    if ((e.keyCode == 40 || e.keyCode == 83) && floor.canvasOffsetY > -(floor.floorSettings.height * floor.blockSize - ctx.canvas.height + floor.blockSize)) {
        floor.canvasOffsetY -= floor.blockSize;
        repaint = true;
    }
    if (repaint) {
        floor.repaint();
    }
});

/***********************************
 ********* click events *************
 ***********************************/
$('.reset').click(function(event) {
    resetForm();
});
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
$('.saveFloor').click(function() {
    showMsgReset();
    if ($('input.level').val()) {
        floor.floorSettings.level = $('input.level').val();
    }
    exportFloorSettings = JSON.parse(JSON.stringify(floor.floorSettings));
    exportJson = JSON.stringify(cleanUpSettings(exportFloorSettings));
    if ($('input.level').val()) {
        ajaxHandler(saveFloor,
            data = {
                type: 'saveFloor',
                json: exportJson,
                isLoaded: $('input.isLoded').val() || 0
            });
    }
});

function saveFloor(result, params = "") {
    if (result.type && result.msg) {
        showMsg(result.type, result.msg);
    }
    ajaxHandler(getAllFloorLevels,
        data = {
            type: 'getAllFloorLevels'
        });
}

function showMsg(type, msg) {
    showMsgReset();
    $('.infoBox .' + type).html(msg).addClass('active');
}

function showMsgReset() {
    $('.infoBox > span').removeClass('active')
}


/***********************************
 ********* brush size *************
 ***********************************/
$('.brush').click(function(event) {
    floor.setBrushSize($(this).data('change'));
});
/***********************************
 ********* zoom events *************
 ***********************************/
$('.zoom').click(function(event) {
    floor.setZoom($(this).data('change'));
    floor.doZoom();
});

$('.canvasContainer').bind('mousewheel', function(e) {
    floor.setZoom(e.originalEvent.wheelDelta / 120 > 0 ? '+' : '-');
    floor.doZoom();
});
/***********************************
 ************* resize ***************
 ***********************************/
$(window).resize(function() {
    floor.setCanvasSize();
    floor.repaint();
});
