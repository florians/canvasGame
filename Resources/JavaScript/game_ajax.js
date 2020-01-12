var ajaxUrl = "Resources/PHP/ajax.php",
    allTiles = [],
    floorSettings = [],
    game = null;

function getAllTiles(floorLevel) {
    return $.ajax({
        method: "POST",
        url: ajaxUrl,
        data: {
            type: "getAllTiles"
        },
        success: function(data) {
            var resultData = JSON.parse(data),
                tileAmount = resultData.length;
            for (i = 0; i < resultData.length; i++) {
                var image = new Image(100, 100);
                image.src = gameBaseUrl + resultData[i].type + "/" + resultData[i].source;
                image.onload = function() {
                    tileAmount--;
                    $('.loaderbar').css('width', (100 / tileAmount) + "%");
                    if (!tileAmount) {
                        getFloor(floorLevel);
                    }
                };
                if (!allTiles[resultData[i].type]) {
                    allTiles[resultData[i].type] = [];
                }
                allTiles[resultData[i].type][resultData[i].name] = {
                    image: image,
                    settings: resultData[i]
                };
            }
        },
        error: function(err) {
            console.log(err);
        }
    });
}

function getFloor(floorLevel) {
    return $.ajax({
        method: "POST",
        url: ajaxUrl,
        data: {
            type: "getFloor",
            level: floorLevel
        },
        success: function(data) {
            var resultData = JSON.parse(data);
            if (resultData.result) {
                result = resultData.result[0];
                floorSettings = {
                    level: result.level,
                    startX: result.startX,
                    startY: result.startY,
                    endLink: result.endLink,
                    height: result.height,
                    width: result.width,
                    tiles: JSON.parse(result.tile_json),
                    //enemies: JSON.parse(data.enemy_json)
                }
            }
            if (game == null) {
                game = new Game(ctx, ctx2);
            }
            game.init(floorSettings, allTiles);
        },
        error: function(err) {
            console.log(err);
        }
    });
}
