var reader = new FileReader();
var file = '';

var tile = {
    name: '',
    source: '',
    collision: '',
    type: '',
    subtype: '',
    direction: '',
    extension: ''
}

function previewFile() {
    var preview = document.querySelector('img');
    file = document.querySelector('input[type=file]').files[0];

    reader.addEventListener('load', function() {
        preview.src = reader.result;
        tile.extension = file.name.split('.').pop().toLowerCase();
        $('.extension').html('.' + tile.extension);
    }, false);

    if (file) {
        reader.readAsDataURL(file);
    }
}

function getInfo(type, addGroup = 0) {
    ajaxHandler(setInfo,
        data = {
            type: type,
            addGroup: addGroup
        });
}

function setInfo(result, params = "") {
    $('select.' + params.type).children().remove();
    $('select.' + params.type).append(fillSelect(result, params.addGroup));
}

function getTile(type, name) {
    ajaxHandler(setTile,
        data = {
            type: type,
            name: name
        });
}

function setTile(result, params = "") {
    setTileData(result[0]);
}

function delTile(type, name) {
    ajaxHandler(delTileReturn,
        data = {
            type: type,
            name: name
        });
}

function delTileReturn(result, params = "") {
    if (result.type && result.msg) {
        showMsg(result.type, result.msg);
    }
    getInfo('getAllTiles', 1);
}

function fillSelect(data, addGroup) {
    var array = [];
    var type = '';
    var oldType = '';
    array.push('<option></option>');
    for (i = 0; i < data.length; i++) {
        type = data[i].type;
        if (addGroup == 1 && type != oldType) {
            if (i >= 1) {
                array.push('</optgroup>');
            }
            array.push('<optgroup label=' + type + '>');
        }
        array.push('<option value="' + data[i].name + '">' + data[i].name + '</option>');
        oldType = data[i].type;
    }
    return array.join('');
}

getInfo('getAllTiles', 1);
getInfo('getTileType');



$(document).on('change', '.getAllTiles', function() {
    getTile('getTile', $(this).val());
});

$(document).on('change', '.getTileType', function() {
    changePath($(this).val(), 'pathType');
    getTileData();
});

$('.tileName > input').change(function() {
    changePath($(this).val(), 'pathName');
    getTileData();
});

function changePath(val, elClass) {
    if (val) {
        $('.' + elClass).html(val);
    } else {
        $('.' + elClass).html('');
    }
}


$('.collision > div').click(function() {
    $(this).toggleClass('selected');
    setCollision();
});

$('.saveTile').click(function() {
    getTileData();
    $('.missing').removeClass('missing');
    if (tile.name == '' || tile.source == '') {
        $('.tile-name').addClass('missing');
    }
    if (tile.collision == '') {
        tile.collision = 0;
    }
    if (tile.type == '') {
        $('.tile-type').addClass('missing')
    }

    if ($('.missing').length == 0 && (file != '' || tile.source != '')) {
        var formData = new FormData();
        formData.append('type', 'saveTile');
        formData.append('json', JSON.stringify(tile));
        formData.append('file', file);
        ajaxHandlerFile(saveTile, formData);
    }
});

function saveTile(result, params = "") {
    if (result.type && result.msg) {
        showMsg(result.type, result.msg);
    }
    getInfo('getAllTiles', 1);
}

$('.deleteTile').click(function() {
    var tile = $('.getAllTiles').val();
    if (tile) {
        var r = confirm("Delete: " + tile);
        if (r == true) {
            delTile('delTile', tile);
        }
    }
});


function setCollision() {
    var selected = $('.collision').find('.selected').parent().children();
    var collision = '';
    for (i = 0; i < selected.length; i++) {
        if ($(selected[i]).hasClass('selected')) {
            collision += '1,';
        } else {
            collision += '0,';
        }
    }
    return collision.slice(0, -1) || 0;
}


function setTileData(data) {
    tile = {
        name: data.name,
        source: data.source,
        collision: data.collision,
        type: data.type,
        factor: data.factor
    }
    $('.tile-name').val(tile.name);
    $('.tile-type').val(tile.type);
    $('.tile-factor').val(tile.factor);
    $('.imgContainer img').attr('src', 'Resources/Public/Images/Floor/' + tile.type + '/' + tile.source);
    // set collision
    $('.collision').children().removeClass();
    if (tile.collision) {
        var collision = tile.collision.split(',');
        $('.collision').children().each(function(index, el) {
            if (collision[index] == 1) {
                $(el).addClass('selected');
            }
        });
    }
    changePath(tile.type, 'pathType');
    changePath(tile.source, 'pathName');
}

function getTileData() {
    tile = {
        name: $('.tile-name').val(),
        source: $('.tile-name').val(),
        collision: setCollision(),
        type: $('.tile-type').val(),
        subtype: $('.tile-subtype').val(),
        direction: $('.tile-direction').val()
    }
}

function showMsg(type, msg) {
    showMsgReset();
    $('.infoBox .' + type).html(msg).addClass('active');
}

function showMsgReset() {
    $('.infoBox > span').removeClass('active')
}
