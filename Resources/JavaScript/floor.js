// get game container and start game
var c = document.getElementById("gameCanvas");
var ctx = c.getContext("2d");
var scaleWidth = ($(document).width() < $(document).height() ? $(document).width() : $(document).height()) - 150;

var floorSettings = {
    start: {
        x: 0,
        y: 0
    },
    end: {
        x: 0,
        y: 0
    },
    size: {
        height: 0,
        width: 0
    },
    parts: [],
};
var mouseDown = false;

ctx.canvas.width = scaleWidth;
ctx.canvas.height = scaleWidth;

$('span.range-x').html($('input.range-x').val());
$('span.range-y').html($('input.range-y').val());
floorSettings.size.height = $('input.range-y').val();
floorSettings.size.width = $('input.range-x').val();
generateGridCanvas();


function setRange() {
    $('input.range-x').val(floorSettings.size.width);
    $('input.range-y').val(floorSettings.size.height);
    $('span.range-x').html($('input.range-x').val());
    $('span.range-y').html($('input.range-y').val());
}

$('input').change(function() {
    $('span.' + $(this).attr('class')).html($(this).val());
    generateGridCanvas();
    $('textarea').val("");
    //$('textarea').val("var testFloor = " + JSON.stringify(setStartEnd(floorSettings)));
});
$('textarea').change(function() {
    if ($(this).val().length > 0) {
        floorSettings = {};
        floorSettings = JSON.parse($(this).val());
        setRange();
    }
    generateGridCanvas();
});


function generateGridCanvas() {
    var rangeX = $('input.range-x').val();
    var rangeY = $('input.range-y').val();
    var y = 0;
    var x = 0;
    var size = Math.floor(scaleWidth / rangeX);

    var part = "";
    var elements = 0;
    // fill in old
    var oldFloorSettings = floorSettings.parts;
    var resizeLength = floorSettings.size.width;

    // clear it
    floorSettings.parts = [];
    floorSettings.size.height = $('input.range-y').val();
    floorSettings.size.width = $('input.range-x').val();

    ctx.canvas.width = size * rangeX;
    ctx.canvas.height = size * rangeY;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.width);
    for (r = 0; r < rangeY; r++) {
        this.b = Math.floor(y + (size * r));
        for (c = 0; c < rangeX; c++) {
            this.a = Math.floor(x + (size * c));
            part = {
                x: this.a,
                y: this.b,
                size: size,
                color: "",
                type: "",
                posX: c,
                posY: r
            }
            if (oldFloorSettings[elements]) {
                part.color = oldFloorSettings[elements].color;
                part.type = oldFloorSettings[elements].type;
            }
            genBlock(part);
            floorSettings.parts.push(part);
            if (elements < resizeLength * (r + 1)) {
                elements++;
            }
        }
    }
}

function repaint() {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.width);
    for (i = 0; i < floorSettings.parts.length; i++) {
        genBlock(floorSettings.parts[i]);
    }
}

function genBlock(part) {
    if (part.color != "") {
        ctx.fillStyle = part.color;
        ctx.fillRect(
            part.x,
            part.y,
            part.size,
            part.size
        );
    } else {
        ctx.fillStyle = "rgb(255,255,255)";
        ctx.beginPath();
        ctx.rect(
            part.x,
            part.y,
            part.size,
            part.size
        );
        ctx.stroke();
    }
}

$("#gameCanvas").mouseup(function() {
        mouseDown = false;
        exportFloorSettings = JSON.parse(JSON.stringify(floorSettings));
        $('textarea').val("var testFloor = " + JSON.stringify(cleanUpSettings(exportFloorSettings)));
    })
    .mousedown(function() {
        mouseDown = true;
    });

function setStartEnd(exportFloorSettings) {
    for (i = 0; i < exportFloorSettings.parts.length; i++) {
        if (exportFloorSettings.parts[i].type == "start") {
            exportFloorSettings.start.x = exportFloorSettings.parts[i].posX;
            exportFloorSettings.start.y = exportFloorSettings.parts[i].posY;
        } else if (exportFloorSettings.parts[i].type == "end") {
            exportFloorSettings.end.x = exportFloorSettings.parts[i].posX;
            exportFloorSettings.end.y = exportFloorSettings.parts[i].posY;
        }
    }
    return exportFloorSettings;
}

function cleanUpSettings(exportFloorSettings) {
    setStartEnd(exportFloorSettings)
    for (i = 0; i < exportFloorSettings.parts.length; i++) {
        if (exportFloorSettings.parts[i].color == "") {
            delete exportFloorSettings.parts[i].color;
        }
        if (exportFloorSettings.parts[i].type == "") {
            delete exportFloorSettings.parts[i].type;
        }
        if (
            exportFloorSettings.parts[i].type != "start" ||
            exportFloorSettings.parts[i].type != "end"
        ) {
            delete exportFloorSettings.parts[i].posX;
            delete exportFloorSettings.parts[i].posY;
        }
        delete exportFloorSettings.parts[i].size;
        delete exportFloorSettings.parts[i].x;
        delete exportFloorSettings.parts[i].y;
    }
    return exportFloorSettings;
}

var partLimit = {
    start: 1,
    end: 1
};
var selectedEl = "";
$("#gameCanvas").mousemove(function(event) {
    if (mouseDown == true && $(".parts > div.isSelected").length > 0) {
        for (i = 0; i < floorSettings.parts.length; i++) {
            if (
                event.offsetX >= floorSettings.parts[i].x &&
                event.offsetX <= floorSettings.parts[i].x + floorSettings.parts[i].size &&
                event.offsetY >= floorSettings.parts[i].y &&
                event.offsetY <= floorSettings.parts[i].y + floorSettings.parts[i].size
            ) {
                floorSettings.parts[i].color = selectedEl.attr('data-color');
                floorSettings.parts[i].type = selectedEl.attr('data-type');
                floorSettings.parts[i].collision = selectedEl.attr('data-collision');
            }
        }
        repaint();
    }
});

$(".parts > div").click(function() {
    if (!$(this).hasClass('isSelected')) {
        $(".parts > div").removeClass('isSelected');
        selectedEl = $(this).addClass('isSelected');
    } else {
        $(".parts > div").removeClass('isSelected');
    }
});


$(window).resize(function() {
    scaleWidth = ($(document).width() < $(document).height() ? $(document).width() : $(document).height()) - 150;
    ctx.canvas.width = scaleWidth;
    ctx.canvas.height = scaleWidth;
    generateGridCanvas();
});
