// get game container and start game
var c = document.getElementById('gameCanvas');
var ctx = c.getContext('2d');
// var scaleWidth = ($('main').width() < $('main').height() ? $('main').width() : $('main').height());

var mouseDown = false;

var allTiles = [];

var selectedEl = '';

// ctx.canvas.width = scaleWidth;
// ctx.canvas.height = scaleWidth;
setCanvasSize();

var floorSettings = {
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
    height: 0,
    width: 0,
    tiles: [],
};

floorSettings.height = $('input.dimension-h').val();
floorSettings.width = $('input.dimension-w').val();

function setCanvasSize() {
    ctx.canvas.width = $('main').width();
    ctx.canvas.height = $('main').width();
}

function setRange() {
    $('input.dimension-w').val(floorSettings.width);
    $('input.dimension-h').val(floorSettings.height);
}

function generateGridCanvas(allTiles) {
    var rangeX = $('input.dimension-w').val();
    var rangeY = $('input.dimension-h').val();
    var y = 0;
    var x = 0;
    var size = Math.floor(ctx.canvas.width / rangeX);

    var tile = '';
    var elements = 0;
    // fill in old
    var oldFloorSettings = floorSettings.tiles;
    var resizeLength = floorSettings.width;

    // clear it
    floorSettings.tiles = [];
    floorSettings.height = $('input.dimension-h').val();
    floorSettings.width = $('input.dimension-w').val();

    ctx.canvas.width = size * rangeX;
    ctx.canvas.height = size * rangeY;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.width);
    for (r = 0; r < rangeY; r++) {
        this.b = Math.floor(y + (size * r));
        for (c = 0; c < rangeX; c++) {
            this.a = Math.floor(x + (size * c));
            tile = {
                x: this.a,
                y: this.b,
                size: size,
                type: '',
                name: '',
                posX: c,
                posY: r
            }
            if (oldFloorSettings[elements]) {
                tile.type = oldFloorSettings[elements].type;
                tile.name = oldFloorSettings[elements].name;
            }
            genBlock(tile, allTiles);
            floorSettings.tiles.push(tile);
            if (elements < resizeLength * (r + 1)) {
                elements++;
            }
        }
    }
}

function repaint() {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    for (i = 0; i < floorSettings.tiles.length; i++) {
        genBlock(floorSettings.tiles[i], allTiles);
    }
}

function genBlock(tile, allTiles) {
    if (allTiles[tile.type]) {
        ctx.drawImage(
            allTiles[tile.type][tile.name],
            tile.x,
            tile.y,
            tile.size,
            tile.size
        );
    } else {
        ctx.fillStyle = 'rgb(255,255,255)';
        ctx.beginPath();
        ctx.rect(
            tile.x,
            tile.y,
            tile.size,
            tile.size
        );
        ctx.stroke();
    }
}


function setStartEnd(exportFloorSettings) {
    for (i = 0; i < exportFloorSettings.tiles.length; i++) {
        if (exportFloorSettings.tiles[i].type == 'start') {
            exportFloorSettings.startX = exportFloorSettings.tiles[i].posX;
            exportFloorSettings.startY = exportFloorSettings.tiles[i].posY;
        } else if (exportFloorSettings.tiles[i].type == 'end') {
            exportFloorSettings.endX = exportFloorSettings.tiles[i].posX;
            exportFloorSettings.endY = exportFloorSettings.tiles[i].posY;
        }
    }
    return exportFloorSettings;
}

function cleanUpSettings(exportFloorSettings) {
    setStartEnd(exportFloorSettings);
    for (i = 0; i < exportFloorSettings.tiles.length; i++) {
        if (exportFloorSettings.tiles[i].type == '') {
            delete exportFloorSettings.tiles[i].type;
        }
        if (exportFloorSettings.tiles[i].name == '') {
            delete exportFloorSettings.tiles[i].name;
        }
        if (
            exportFloorSettings.tiles[i].type != 'start' ||
            exportFloorSettings.tiles[i].type != 'end'
        ) {
            delete exportFloorSettings.tiles[i].posX;
            delete exportFloorSettings.tiles[i].posY;
        }
        delete exportFloorSettings.tiles[i].size;
        delete exportFloorSettings.tiles[i].x;
        delete exportFloorSettings.tiles[i].y;
    }
    return exportFloorSettings;
}

function fillTilesHtml(allTiles) {
    $.each(Object.keys(allTiles), function(index, type) {
        var array = [];
        array.push('<div class="tileGroup accordion padding-lr-m padding-tb-m block flex-m">');
        array.push('<div class="title">' + type + '</div>');
        $.each(Object.keys(allTiles[type]), function(index, name) {
            array.push('<div class="tile" data-name="' + name + '" data-type="' + type + '"><img src="' + allTiles[type][name].src + '" /></div>');
        });
        array.push('</div>');
        $('aside').append(array.join(''));
    });
}

function addTile(offsetX, offsetY) {
    if ($('aside .tile.isSelected').length > 0) {
        for (i = 0; i < floorSettings.tiles.length; i++) {
            if (
                event.offsetX >= floorSettings.tiles[i].x &&
                event.offsetX <= floorSettings.tiles[i].x + floorSettings.tiles[i].size &&
                event.offsetY >= floorSettings.tiles[i].y &&
                event.offsetY <= floorSettings.tiles[i].y + floorSettings.tiles[i].size
            ) {
                floorSettings.tiles[i].type = selectedEl.attr('data-type');
                floorSettings.tiles[i].name = selectedEl.attr('data-name');
            }
        }
        repaint();
    }
}

function resetForm() {
    showMsgReset();
    $('select.floorSelect').val([]);
    $('select.floorSelect option').prop('selected', false);
    $('select.endLink').val([]);
    $('select.endLink option').prop('selected', false);
    $('input.level').val('').prop('disabled', false);
    $('input.isLoded').val('0');
    floorSettings.tiles = [];
    generateGridCanvas(allTiles);
}

function preloader() {
    getAllTiles().then(loadFloorSelects);
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
            $('select.endLink').val(floorSettings.endLink);
            $('select.floorSelect').val(floorSettings.level);
            $('input.level').val(floorSettings.level);
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
                        generateGridCanvas(allTiles);
                        fillTilesHtml(allTiles);
                    }
                };
                if (!allTiles[data[i].type]) {
                    allTiles[data[i].type] = [];
                }
                allTiles[data[i].type][data[i].name] = image;
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
    } else if (h > 50 || w > 50) {
        showMsg('error', 'Dimension are limited to max 50!');
    } else {
        floorSettings.height = $('input.dimension-h').val();
        floorSettings.width = $('input.dimension-w').val();
        generateGridCanvas(allTiles);
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
                    floorSettings = {
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
                    $('select.endLink').val(floorSettings.endLink);
                    $('input.level').val(floorSettings.level).prop('disabled', true);
                    $('input.isLoded').val('1');
                    setRange();
                    generateGridCanvas(allTiles);
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
        mouseDown = false;
    })
    .mousedown(function() {
        mouseDown = true;
    });
// start painting
$('#gameCanvas').mousemove(function(event) {
    if (mouseDown == true) {
        addTile(event.offsetX, event.offsetY);
    }
});

/***********************************
 ********* click events *************
 ***********************************/
// start painting
$('#gameCanvas').click(function(event) {
    addTile(event.offsetX, event.offsetY);
});

$('.reset').click(function(event) {
    resetForm();
});
/* select tile  */
$(document).on('click', 'aside .tile', function() {
    if (!$(this).hasClass('isSelected')) {
        $('aside .tile').removeClass('isSelected');
        selectedEl = $(this).addClass('isSelected');
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
$('.save .saveFloor').click(function() {
    showMsgReset();
    if ($('input.level').val()) {
        floorSettings.level = $('input.level').val();
    }
    floorSettings.endLink = $('select.endLink').val() || 0;
    exportFloorSettings = JSON.parse(JSON.stringify(floorSettings));
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
 ********* start script ************
 ***********************************/
preloader();

/***********************************
 ************* resize ***************
 ***********************************/
$(window).resize(function() {
    // scaleWidth = ($('main').width() < $('main').height() ? $('main').width() : $('main').height());
    // ctx.canvas.width = scaleWidth;
    // ctx.canvas.height = scaleWidth;
    setCanvasSize();
    generateGridCanvas(allTiles);
});
