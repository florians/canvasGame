var reader = new FileReader();
var file = '';

function previewFile() {
    var preview = document.querySelector('img');
    file = document.querySelector('input[type=file]').files[0];

    reader.addEventListener('load', function() {
        preview.src = reader.result;
    }, false);

    if (file) {
        reader.readAsDataURL(file);
    }
}

function getInfo(type) {
    return $.ajax({
        method: 'POST',
        url: 'Resources/PHP/ajax.php',
        data: {
            type: type
        },
        success: function(data) {
            data = JSON.parse(data);
            var array = [];
            array.push('<option></option>');
            for (i = 0; i < data.length; i++) {
                array.push('<option>' + data[i].name + '</option>');
            }
            $('select.' + type).append(array.join(''));
        },
        error: function(err) {
            console.log(err)
        }
    });
}

getInfo('getTileType');

var tile = {
    name: '',
    source: '',
    collision: '',
    type: '',
    subtype: '',
    direction: ''
}

function showPath() {
    if ($('.pathType').html().length > 0 && $('.pathName').html().length > 0) {
        $('.path').addClass('active');
    } else {
        $('.path').removeClass('active');
    }
    getTileData();
}

$(document).on('change', '.getTileType', function() {
    if ($(this).val()) {
        $('.pathType').html($(this).val());
    } else {
        $('.pathType').html('');
    }
    showPath();
});

$('.tileName > input').change(function() {
    if ($(this).val()) {
        $('.pathName').html($(this).val());
    } else {
        $('.pathName').html('');
    }
    showPath();
});


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

    if ($('.missing').length == 0 && file != "") {
        var formData = new FormData();
        formData.append('type', 'saveTile');
        formData.append('json', JSON.stringify(tile));
        formData.append('file', file);
        $.ajax({
            method: 'POST',
            url: 'Resources/PHP/ajax.php',
            data: formData,
            processData: false,
            contentType: false,
            success: function(data) {
                data = JSON.parse(data);
                if (data.type && data.msg) {
                    showMsg(data.type, data.msg);
                }
            },
            error: function(err) {
                console.log(err)
            }
        });
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

function getTileData() {
    tile = {
        name: $('.tile-name').val(),
        source: $('.tile-name').val() + '.jpg',
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
