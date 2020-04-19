// get game container and start game
var c = document.getElementById('gameCanvas'),
    ctx = c.getContext('2d');

var floor = new Floor(ctx);

floor.setCanvasSize();
floor.setFloorSettingsDimensions();

function Floor(ctx) {
    this.floorSettings = {
        startX: 0,
        startY: 0,
        endX: 0,
        endY: 0,
        height: 0,
        width: 0,
        tiles: [],
    }
    this.canvasOffsetX = 0;
    this.canvasOffsetY = 0;
    this.brushSize = 1;
    this.zoom = 1;
    this.blockSize = 30 * this.zoom;
    this.mouseDown = false;
    this.allTiles = [];
    this.selectedEl = '';

    this.preloader = function() {
        getAllTiles().then(loadFloorSelects);
    }
    this.setBlockSize = function() {
        this.blockSize = 30 * this.zoom;
    }
    this.setCanvasSize = function() {
        ctx.canvas.width = Math.floor($('.canvasContainer').width());
        ctx.canvas.height = Math.floor($('body').height() - $('#gameCanvas').offset().top - 25);
    }
    this.setFloorSettings = function(type, val) {
        this.floorSettings[type] = val;
    }
    this.setFloorSettingsDimensions = function() {
        floor.setFloorSettings('height', $('input.dimension-h').val());
        floor.setFloorSettings('width', $('input.dimension-w').val());
    }
    this.generateGrid = function(load = false) {
        this.setFloorSettingsDimensions();
        var dimX = $('input.dimension-w').val(),
            dimY = $('input.dimension-h').val(),
            rx = 0,
            cy = 0,
            tile = '';

        // clear it
        if (load == false) {
            this.floorSettings.tiles = [];
        }
        if (load == true) {
            var oldFloorTiles = this.floorSettings.tiles;
            this.floorSettings.tiles = [];
        }
        for (r = 0; r < dimY; r++) {
            ry = this.blockSize * r;
            for (c = 0; c < dimX; c++) {
                cx = this.blockSize * c;
                if (load == true) {
                    if (!this.floorSettings.tiles[r]) {
                        this.floorSettings.tiles[r] = [];
                    }
                    if (!this.floorSettings.tiles[r][c]) {
                        this.floorSettings.tiles[r][c] = {};
                    }
                    this.floorSettings.tiles[r][c].x = cx;
                    this.floorSettings.tiles[r][c].y = ry;
                    this.floorSettings.tiles[r][c].posX = c;
                    this.floorSettings.tiles[r][c].posY = r;
                    if (oldFloorTiles[r] && oldFloorTiles[r][c]) {
                        this.floorSettings.tiles[r][c].type = oldFloorTiles[r][c].type;
                        this.floorSettings.tiles[r][c].name = oldFloorTiles[r][c].name;
                        this.floorSettings.tiles[r][c].item = oldFloorTiles[r][c].item;
                        this.floorSettings.tiles[r][c].trap = oldFloorTiles[r][c].trap;
                        this.floorSettings.tiles[r][c].enemy = oldFloorTiles[r][c].enemy;
                        if (oldFloorTiles[r][c].level) {
                            this.floorSettings.tiles[r][c].level = oldFloorTiles[r][c].level;
                        }
                    }
                } else {
                    tile = {
                        x: cx,
                        y: ry,
                        type: '',
                        name: '',
                        posX: c,
                        posY: r
                    }
                    if (!this.floorSettings.tiles[r]) {
                        this.floorSettings.tiles[r] = [];
                    }
                    this.floorSettings.tiles[r][c] = tile;
                }
            }
        }
        this.repaint();
    }
    this.fillCanvas = function(tiles, element) {
        if (element) {
            this.genBlock(element);
        } else {
            var cStart = Math.floor(-this.canvasOffsetX / this.blockSize);
            var rStart = Math.floor(-this.canvasOffsetY / this.blockSize);
            var cStop = Math.floor((ctx.canvas.width + this.blockSize * 2) / this.blockSize);
            var rStop = Math.floor((ctx.canvas.height + this.blockSize * 2) / this.blockSize);

            cStart = cStart > 0 ? cStart : 0;
            rStart = rStart > 0 ? rStart : 0;

            cStop = cStart + cStop < this.floorSettings.width ? cStart + cStop : this.floorSettings.width;
            rStop = rStart + rStop < this.floorSettings.height ? rStart + rStop : this.floorSettings.height;

            for (r = rStart; r < rStop; r++) {
                for (c = cStart; c < cStop; c++) {
                    this.genBlock(tiles[r][c]);
                }
            }
        }
    }
    this.repaint = function(element = '') {
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        if (element == '') {
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        }
        ctx.translate(this.canvasOffsetX, this.canvasOffsetY)
        this.fillCanvas(this.floorSettings.tiles, element);
        ctx.restore();
    }
    this.genBlock = function(tile) {
        var x = tile.x * this.zoom,
            y = tile.y * this.zoom,
            h = this.blockSize,
            w = this.blockSize;
        if (this.allTiles[tile.type]) {
            ctx.drawImage(this.allTiles[tile.type][tile.name], x, y, h, w);
            // item as overlay
            if (tile.item) {
                ctx.drawImage(this.allTiles[tile.item.type][tile.item.name], x, y, h, w);
            }
            if (tile.trap) {
                ctx.drawImage(this.allTiles[tile.trap.type][tile.trap.name], x, y, h, w);
            }
            if (tile.enemy) {
                ctx.drawImage(this.allTiles[tile.enemy.type][tile.enemy.name], x, y, h, w);
            }
        } else {
            ctx.fillStyle = 'rgb(255,255,255)';
            ctx.beginPath();
            ctx.rect(x, y, h, w);
            ctx.stroke();
        }
    }
    this.setRange = function() {
        $('input.dimension-w').val(this.floorSettings.width);
        $('input.dimension-h').val(this.floorSettings.height);
    }
    this.doZoom = function(reset = false) {
        if (reset) {
            this.zoom = 1;
            this.blockSize = 30 * this.zoom;
            this.repaint();
        } else {
            this.zoom = Math.round(this.zoom * 100) / 100;
            this.blockSize = 30 * this.zoom;
            this.repaint();
        }

    }
    this.setZoom = function(direction) {
        if (this.zoom < 20 && direction == '+') {
            this.zoom += 0.1;
        }
        if (this.zoom >= 0.2 && direction == '-') {
            this.zoom -= 0.1;
        }
        $('.zoomLevel').html(Math.round(this.zoom * 100));
    }
    this.setBrushSize = function(direction) {
        var brushSizes = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 49];
        if (this.brushSize <= 48 && direction == '+') {
            this.brushSize = brushSizes[brushSizes.indexOf(this.brushSize) + 1];
        }
        if (this.brushSize > 1 && direction == '-') {
            this.brushSize = brushSizes[brushSizes.indexOf(this.brushSize) - 1];
        }
        console.log(this.brushSize);
        $('.brushSize').html(this.brushSize);
    }

    this.addTile = function(offsetX, offsetY) {
        var ignoreBrushItems = ['start', 'end', 'trap', 'enemy', 'item'];
        var offsetX = Math.floor((offsetX - floor.canvasOffsetX) / floor.blockSize);
        var offsetY = Math.floor((offsetY - floor.canvasOffsetY) / floor.blockSize);
        if (floor.selectedEl.length > 0) {

            if (floor.brushSize > 1 && $.inArray(floor.selectedEl.attr('data-type'), ignoreBrushItems) === -1) {

                for (var r = offsetY - Math.floor(this.brushSize / 2); r < offsetY + Math.ceil(this.brushSize / 2); r++) {
                    for (var c = offsetX - Math.floor(this.brushSize / 2); c < offsetX + Math.ceil(this.brushSize / 2); c++) {
                        if (floor.floorSettings.tiles[r] && floor.floorSettings.tiles[r][c]) {
                            this.setTileInfo(floor.floorSettings.tiles[r][c]);
                        }
                    }
                }
            } else {
                if (floor.floorSettings.tiles[offsetY] && floor.floorSettings.tiles[offsetY][offsetX]) {
                    this.setTileInfo(floor.floorSettings.tiles[offsetY][offsetX]);
                }
            }
        } else {
            if (floor.floorSettings.tiles[offsetY] && floor.floorSettings.tiles[offsetY][offsetX]) {
                this.showCustomBox(floor.floorSettings.tiles[offsetY][offsetX].type, floor.floorSettings.tiles[offsetY][offsetX]);
            }
        }
    }
    this.showCustomBox = function(type, tile) {
        console.log();
        if (type == 'start' || type == 'end') {
            $('aside .custom').addClass('active');
            $('aside .custom label').html('Connect to Level');
            $('aside .custom .level').val(tile.level);
            $('aside .custom .custom-hidden').attr('data-x', tile.posX).attr('data-y', tile.posY);
        } else {
            $('aside .custom').removeClass('active');
        }
    }
    this.setTileInfo = function(tile) {
        var onlyOverlay = ['trap', 'enemy', 'item'];
        if ($.inArray(floor.selectedEl.attr('data-type'), onlyOverlay) === -1) {
            tile.type = floor.selectedEl.attr('data-type');
            tile.name = floor.selectedEl.attr('data-name');
            this.showCustomBox(this.selectedEl.attr('data-type'), tile);
        } else {
            if (floor.selectedEl.attr('data-type') == 'item' && tile.type != '') {
                if (tile.item) {
                    delete tile.item;
                } else {
                    delete tile.trap;
                    delete tile.enemy;
                    tile.item = {
                        type: floor.selectedEl.attr('data-type'),
                        name: floor.selectedEl.attr('data-name')
                    }
                }
            } else if (floor.selectedEl.attr('data-type') == 'trap' && tile.type != '') {
                if (tile.trap) {
                    delete tile.trap;
                } else {
                    delete tile.item;
                    delete tile.enemy;
                    tile.trap = {
                        type: floor.selectedEl.attr('data-type'),
                        name: floor.selectedEl.attr('data-name')
                    }
                }
            } else if (floor.selectedEl.attr('data-type') == 'enemy' && tile.type != '') {
                if (tile.enemy) {
                    delete tile.enemy;
                } else {
                    delete tile.item;
                    delete tile.trap;
                    tile.enemy = {
                        type: floor.selectedEl.attr('data-type'),
                        name: floor.selectedEl.attr('data-name')
                    }
                }
            }
        }
        this.repaint(tile);
    }
}

function cleanUpSettings(exportFloorSettings) {
    for (r = 0; r < exportFloorSettings.height; r++) {
        for (c = 0; c < exportFloorSettings.width; c++) {
            if (exportFloorSettings.tiles[r][c].type == 'start') {
                exportFloorSettings.startX = exportFloorSettings.tiles[r][c].posX;
                exportFloorSettings.startY = exportFloorSettings.tiles[r][c].posY;
            } else if (exportFloorSettings.tiles[r][c].type == 'end') {
                exportFloorSettings.endX = exportFloorSettings.tiles[r][c].posX;
                exportFloorSettings.endY = exportFloorSettings.tiles[r][c].posY;
            }
            if (exportFloorSettings.tiles[r][c].type == '') {
                delete exportFloorSettings.tiles[r][c].type;
            }
            if (exportFloorSettings.tiles[r][c].name == '') {
                delete exportFloorSettings.tiles[r][c].name;
            }
            delete exportFloorSettings.tiles[r][c].posX;
            delete exportFloorSettings.tiles[r][c].posY;
            delete exportFloorSettings.tiles[r][c].x;
            delete exportFloorSettings.tiles[r][c].y;
            delete exportFloorSettings.tiles[r][c].repaint;

        }
    }
    return exportFloorSettings;
}

function fillTilesHtml() {
    $.each(Object.keys(floor.allTiles), function(index, type) {
        var array = [];
        array.push('<div class="tileGroup accordion padding-lr-m padding-tb-m block flex-m">');
        array.push('<div class="title">' + type + '</div>');
        $.each(Object.keys(floor.allTiles[type]), function(index, name) {
            array.push('<div class="tile" data-name="' + name + '" data-type="' + type + '"><img src="' + floor.allTiles[type][name].src + '" /></div>');
        });
        array.push('</div>');
        $('aside .accordion-container').append(array.join(''));
    });
}

function resetForm() {
    showMsgReset();
    $('select.floorSelect').val([]);
    $('select.floorSelect option').prop('selected', false);
    $('select.endLink').val([]);
    $('select.endLink option').prop('selected', false);
    $('.controls input.level').val('').prop('disabled', false);
    $('input.isLoded').val('0');

    $('input.dimension-w').val(20);
    $('input.dimension-h').val(20);
    floor.floorSettings.tiles = [];
    floor.setFloorSettingsDimensions();
    floor.generateGrid();
}

/***********************************
 ********* ajax events ************
 ***********************************/
function loadFloorSelects() {
    return $.ajax({
        method: 'POST',
        url: 'Resources/PHP/ajax.php',
        data: {
            type: 'getAllFloorLevels'
        },
        success: function(data) {
            data = JSON.parse(data);
            $('.floorSelect').html('<option></option>');
            $('.endLink').html('<option></option>');
            for (i = 0; i < data.length; i++) {
                $('.floorSelect').append('<option value="' + data[i] + '">Level ' + data[i] + '</option>');
            }
            for (i = 0; i < data.length; i++) {
                $('.endLink').append('<option value="' + data[i] + '">Level ' + data[i] + '</option>');
            }
            $('select.endLink').val(floor.floorSettings.endLink);
            $('select.floorSelect').val(floor.floorSettings.level);
            $('.controls input.level').val(floor.floorSettings.level);
        },
        error: function(err) {
            console.log(err);
        }
    });
}

function getAllTiles() {
    var arrLength = 0;
    return $.ajax({
        method: 'POST',
        url: 'Resources/PHP/ajax.php',
        data: {
            type: 'getAllTiles'
        },
        success: function(data) {
            data = JSON.parse(data);
            var tileAmount = data.length;
            for (i = 0; i < data.length; i++) {
                var image = new Image();
                image.src = 'Resources/Images/Floor/' + data[i].type + '/' + data[i].source;
                image.onload = function() {
                    tileAmount--;
                    if (!tileAmount) {
                        floor.generateGrid();
                        fillTilesHtml();
                    }
                };
                if (!floor.allTiles[data[i].type]) {
                    floor.allTiles[data[i].type] = [];
                }
                floor.allTiles[data[i].type][data[i].name] = image;
            }
        },
        error: function(err) {
            console.log(err)
        }
    });
}
/***********************************
 ********* change events ************
 ***********************************/
/* range slider */
$('.dimension .sizeSubmit').click(function() {
    var h = $('input.dimension-h').val();
    var w = $('input.dimension-w').val();
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
        $.ajax({
            method: 'POST',
            url: 'Resources/PHP/ajax.php',
            data: {
                type: 'getFloor',
                level: $(this).val(),
            },
            success: function(data) {
                data = JSON.parse(data);
                if (data.type && data.msg) {
                    showMsg(data.type, data.msg);
                }
                if (data.result) {
                    result = data.result[0];
                    floor.floorSettings = {
                        level: parseInt(result.level),
                        startX: parseInt(result.startX),
                        startY: parseInt(result.startY),
                        endX: parseInt(result.endX),
                        endY: parseInt(result.endY),
                        height: parseInt(result.height),
                        width: parseInt(result.width),
                        endLink: parseInt(result.endLink),
                        tiles: JSON.parse(result.tile_json)
                    };
                    $('select.endLink').val(floor.floorSettings.endLink);
                    $('.controls input.level').val(floor.floorSettings.level).prop('disabled', true);
                    $('input.isLoded').val('1');
                    floor.canvasOffsetX = 0;
                    floor.canvasOffsetY = 0;
                    floor.setRange();
                    floor.generateGrid(true);
                } else {
                    resetForm();
                }

            },
            error: function(err) {
                console.log(err);
            }
        });
    } else {
        resetForm();
    }
});

/***********************************
 ********** mouse events ***********
 ***********************************/
$('#gameCanvas').mouseup(function() {
        floor.mouseDown = false;
    })
    .mousedown(function() {
        floor.mouseDown = true;
    });
/***********************************
 ********** mouse painting *********
 ***********************************/
$('#gameCanvas').mousemove(function(event) {
    if (floor.mouseDown == true) {
        floor.addTile(event.offsetX, event.offsetY);
    }
});
$('#gameCanvas').click(function(event) {
    floor.addTile(event.offsetX, event.offsetY);
});

/***********************************
 ********** key down events ********
 ***********************************/
$(document).keydown(function(e) {
    var repaint = false;
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
    var x = $('aside .custom .custom-hidden').attr('data-x');
    var y = $('aside .custom .custom-hidden').attr('data-y');
    var level = $('aside .custom .level').val();
    if (y != '' && x != '' && level != '') {
        floor.floorSettings.tiles[y][x].level = level;
        showMsg('success', 'Level has been set');
        $('aside .custom').removeClass('active');
    }
});

/* select tile  */
$(document).on('click', 'aside .tile', function() {
    if (!$(this).hasClass('isSelected')) {
        $('aside .tile').removeClass('isSelected');
        floor.selectedEl = $(this).addClass('isSelected');
        $('body').toggleClass('open');
    } else {
        $('aside .tile').removeClass('isSelected');
    }
});
$(document).on('click', '.tileGroup', function() {
    $('.tileGroup.show').removeClass('show');
    $(this).addClass('show');
});


$('.tilesButton').click(function() {
    $('body').toggleClass('open');
});

/* save with ajax */
$('.saveFloor').click(function() {
    showMsgReset();
    if ($('input.level').val()) {
        floor.floorSettings.level = $('input.level').val();
    }
    //floor.floorSettings.endLink = $('select.endLink').val() || 0;
    exportFloorSettings = JSON.parse(JSON.stringify(floor.floorSettings));
    exportJson = JSON.stringify(cleanUpSettings(exportFloorSettings));
    if ($('input.level').val()) {
        $.ajax({
            method: 'POST',
            url: 'Resources/PHP/ajax.php',
            data: {
                type: 'saveFloor',
                json: exportJson,
                isLoaded: $('input.isLoded').val() || 0
            },
            success: function(data) {
                data = JSON.parse(data);
                if (data.type && data.msg) {
                    showMsg(data.type, data.msg);
                }
                loadFloorSelects();
            },
            error: function(err) {}
        });
    }
});

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
 ********* start script ************
 ***********************************/
floor.preloader();

/***********************************
 ************* resize ***************
 ***********************************/
$(window).resize(function() {
    floor.setCanvasSize();
    floor.repaint();
});
