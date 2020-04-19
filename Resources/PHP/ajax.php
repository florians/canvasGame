<?php

include_once 'db.php';

// '[>]joinTable' => ['selectCol.col' => 'col'] | LEFT JOIN joinTable ON selectCol.col = joinTable.col
// 'table.name(name2)' | table.name AS name2

switch ($_POST['type']) {
    // load
    case 'getFloor':
        getFloor($database, $_POST['level']);
        break;
    case 'getAllTiles':
        getAllTiles($database);
        break;
    case 'getTile':
        getTile($database, $_POST['name']);
        break;
    case 'getAllFloorLevels':
        getAllFloorLevels($database);
        break;
    case 'getTileType':
        getTileType($database);
        break;
    case 'getTileSubtype':
        getTileSubtype($database);
        break;
    case 'getTileDirection':
        getTileDirection($database);
        break;

    // save
    case 'saveFloor':
        saveFloor($database, $_POST['json']);
        break;
    case 'saveTile':
        saveTile($database, $_POST['json'], $_FILES['file']);
        break;
    case 'delTile':
        delTile($database, $_POST['name']);
        break;
    default:
        // code...
        break;
}

function getTileType($db)
{
    $result = $db->select('tile_type', '*', ['deleted' => 0]);
    echo json_encode($result);
}
function getTileSubtype($db)
{
    $result = $db->select('tile_subtype', '*', ['deleted' => 0]);
    echo json_encode($result);
}
function getTileDirection($db)
{
    $result = $db->select('tile_direction', '*', ['deleted' => 0]);
    echo json_encode($result);
}

function getFloor($db, $level)
{
    $result = $db->select('floor', '*', ['deleted' => 0, 'level' => $level]);
    $type = 'success';
    $msg = 'Floor Level ' . $level . ' successfully loaded';
    echo json_encode(['type' => $type, 'msg' => $msg, 'result' => $result]);
}
function getAllFloorLevels($db)
{
    echo json_encode($db->select('floor', 'level', ['deleted' => 0, 'ORDER' => 'level']));
}

function saveFloor($db, $json)
{
    $jsonObj = json_decode($json);
    $isLoaded = $_POST['isLoaded'];
    $level = $jsonObj->{'level'};
    $endLink = $jsonObj->{'endLink'} ?? '';
    $startX = $jsonObj->{'startX'};
    $startY = $jsonObj->{'startY'};
    $height = $jsonObj->{'height'};
    $width = $jsonObj->{'width'};
    $tile_json = json_encode($jsonObj->{'tiles'});
    $enemy_json = ''; //json_encode($jsonObj->{'enemies'}) ?? '';

    $freeLevelCheck = $db->select('floor', 'uid', ['deleted' => 0, 'level' => $level]);
    // update
    if (count($freeLevelCheck) > 0 && $isLoaded == 1) {
        $db->update('floor', [
            'level' => $level,
            'startX' => $startX,
            'startY' => $startY,
            'height' => $height,
            'width' => $width,
            'endLink' => $endLink,
            'tile_json' => $tile_json,
            'enemy_json' => $enemy_json,
        ], [
            'uid' => $freeLevelCheck,
        ]);
        $type = 'success';
        $msg = 'Floor Level ' . $level . ' updated!';
        //echo $db->id().' updated!';
    } else if (count($freeLevelCheck) > 0 && $isLoaded == 0) {
        //echo 'floorUsed';
        $type = 'error';
        $msg = 'Floor ' . $level . ' is already in use!';
    } else if ($isLoaded == 0) {
        // insert
        if (isset($level) && isset($startX) && isset($startY) && isset($height) && isset($width) && isset($tile_json)) {
            $db->insert('floor', [
                'level' => $level,
                'startX' => $startX,
                'startY' => $startY,
                'height' => $height,
                'width' => $width,
                'endLink' => $endLink,
                'tile_json' => $tile_json,
                'enemy_json' => $enemy_json,
            ]);
            //echo $db->id().' is a new entry!';
            $type = 'success';
            $msg = 'Floor Level ' . $level . ' was saved!';
        } else {
            // echo $level;
            // echo 'smt failed';
            $type = 'info';
            $msg = 'smt failed';
        }
    }
    echo json_encode(['type' => $type, 'msg' => $msg]);
}

function saveTile($db, $json, $file)
{
    $allowedTypes = array(IMAGETYPE_PNG, IMAGETYPE_JPEG, IMAGETYPE_GIF);
    $jsonObj = json_decode($json);

    $name = $jsonObj->{'name'};
    $source = $jsonObj->{'source'};
    $collision = $jsonObj->{'collision'};
    $type = $jsonObj->{'type'};

    $dbTypeUid = $db->select('tile_type', 'uid', ['deleted' => 0, 'name' => $type]);

    $selectByNameUid = $db->select('tile', 'uid', ['deleted' => 0, 'name' => $name]);

    if ($dbTypeUid[0] && $selectByNameUid[0] == '') {
        $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
        $target_file = '../Images/Floor/' . $type . '/' . $source . '.' . $ext;
        if (!in_array(exif_imagetype($file['tmp_name']), $allowedTypes)) {
            $type = 'error';
            $msg = mime_content_type($file['tmp_name']) . ' format is not allowed';
        } else {
            $db->insert('tile', [
                'name' => $name,
                'source' => $source . '.' . $ext,
                'collision' => $collision,
                'type' => $dbTypeUid[0],
            ]);
            move_uploaded_file($file["tmp_name"], $target_file);
            $type = 'success';
            $msg = 'Tile ' . $name . ' was saved!';
        }
    }
    // if already in db
    if ($dbTypeUid[0] && $selectByNameUid[0] != '') {
        if ($file && in_array(exif_imagetype($file['tmp_name']), $allowedTypes)) {
            $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
            $target_file = '../Images/Floor/' . $type . '/' . $source . '.' . $ext;
            move_uploaded_file($file["tmp_name"], $target_file);
            if ($ext) {
                $source = $name . '.' . $ext;
            }
        }
        $db->update('tile', [
            'name' => $name,
            'source' => $source,
            'collision' => $collision,
            'type' => $dbTypeUid[0],
        ], [
            'uid' => $selectByNameUid[0],
        ]);
    }
    echo json_encode(['type' => $type, 'msg' => $msg]);
}

function getAllTiles($db)
{
    $allTiles = $db->select('tile',
        [
            '[>]tile_type' => ['tile.type' => 'uid'],
        ],
        [
            'tile.sorting',
            'tile.name',
            'tile.source',
            'tile.collision',
            'tile_type.name(type)',
            'tile_type.factor(factor)',
        ],
        [
            'tile.deleted' => 0,
            'ORDER' => [
                'tile.sorting',
                'tile_type.name',
            ],
        ]
    );
    echo json_encode($allTiles);

}
function getTile($db, $name)
{
    $tile = $db->select('tile',
        [
            '[>]tile_type' => ['tile.type' => 'uid'],
        ],
        [
            'tile.name',
            'tile.source',
            'tile.collision',
            'tile_type.name(type)',
            'tile_type.factor(factor)',
        ],
        [
            'AND' => [
                'tile.name' => $name,
                'tile.deleted' => 0,
            ],
        ]
    );
    echo json_encode($tile);
}
function delTile($db, $name)
{
    $db->update('tile',
        ['deleted' => 1],
        [
            'name' => $name
        ]
    );
    $type = 'success';
    $msg = 'Tile removed';
    echo json_encode(['type' => $type, 'msg' => $msg]);
}
