<?php

include_once 'Db.php';

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
    case 'getPlayer':
        getPlayer($database, $_POST['name']);
        break;
    case 'getPlayer':
        getPlayer($database, $_POST['name']);
        break;
    case 'getSkills':
        getSkills($database, $_POST['name']);
        break;
    case 'getAllSkills':
        getAllSkills($database);
        break;
    case 'getSkillTypes':
        getSkillTypes($database);
        break;
    case 'savePlayer':
        savePlayer($database, $_POST['name'], $_POST['level'], $_POST['stats']);
        break;

    // save
    case 'saveFloor':
        saveFloor($database, $_POST['json']);
        break;
    case 'saveTile':
        saveTile($database, $_POST['json'], $_FILES['file']);
        break;
    // delete
    case 'delTile':
        delTile($database, $_POST['name']);
        break;
    default:
        print_r($_POST);
        // code...
        break;
}

function getFloor($db, $level)
{
    $result = $db->select('floor', '*', ['deleted' => 0, 'level' => $level]);
    $target_file = '../../Private/Floor/level_uid_' . $result[0]['uid'] . '.json';
    if (file_exists($target_file)) {
        $file = file_get_contents($target_file);
        $result[0]['tile_json'] = $file;
        $msg = 'Floor Level ' . $level . ' successfully loaded';
    } else {
        $type = false;
        $msg = 'Floor Level ' . $level . ' not available';
    }
    returnJson($msg, $result[0], $type);

    //echo json_encode(['type' => $type, 'msg' => $msg, 'result' => $result[0]]);
}
function getAllTiles($db)
{
    $result = $db->select('tile',
        [
            '[>]tile_type' => ['tile.type' => 'uid'],
        ],
        [
            'tile.uid',
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
    if (count($result)) {
        $msg = 'Tiles loaded';
    } else {
        $success = false;
        $msg = 'no Tiles found';
    }
    returnJson($msg, $result, $success);
    //echo json_encode(['type' => $success, 'msg' => $msg, 'result' => $result]);

}
function getTile($db, $name)
{
    $result = $db->select('tile',
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
    //returnJson($msg, $result,$type);
    echo json_encode($result);
}
function getAllFloorLevels($db)
{
    echo json_encode($db->select('floor', 'level', ['deleted' => 0, 'ORDER' => 'level']));
}
function getTileType($db)
{
    $result = $db->select('tile_type', '*', ['deleted' => 0]);
    echo json_encode($result);
}
function getPlayer($db, $name)
{
    $result = $db->select('player', '*', ['AND' => ['deleted' => 0, 'name' => $name]]);
    if (count($result)) {
        $msg = 'Player loaded';
        $r = $result[0];
    } else {
        // new player
        $target_file = '../../Private/Player/DefaultPlayer.json';
        if (file_exists($target_file)) {
            $r = json_decode(file_get_contents($target_file));
        }
        $msg = 'New Player';
    }
    returnJson($msg, $r, $success);
    //echo json_encode($result[0]);
}
function getSkills($db, $name)
{
    $result = $db->select('player',
        [
            '[>]player_skills' => ['player.uid' => 'player_uid'],
            '[>]skills' => ['player_skills.skills_uid' => 'uid'],
        ],
        [
            'skills.name',
            'skills.text',
            'skills.level',
            'skills.type ',
            'skills.cost',
            'skills.value',
            'skills.turns',
        ],
        [
            'AND' => [
                'player.name' => $name,
                'player.deleted' => 0,
                'skills.deleted' => 0,
            ],
        ]
    );
    if (count($result)) {
        $msg = 'Skills loaded';
    } else {
        $target_file = '../../Private/Player/DefaultSkill.json';
        if (file_exists($target_file)) {
            $result = json_decode(file_get_contents($target_file));
        }
        $msg = 'Default Skill for new Player';
    }
    returnJson($msg, $result, $success);
    //echo json_encode($result);
}
function getAllSkills($db)
{
    $result = $db->select('skills', '*', ['deleted' => 0]);
    if (count($result)) {
        $msg = 'Skills loaded';
    } else {
        $success = false;
        $msg = 'No Skill found';
    }
    returnJson($msg, $result, $success);
}
function getSkillTypes($db)
{
    $result = $db->select('skills_type', '*', ['deleted' => 0]);
    echo json_encode($result);
}
function savePlayer($db, $name, $level, $stats)
{

    $resultUid = $db->select('player', 'uid', ['AND' => ['deleted' => 0, 'name' => $name]]);
    if ($resultUid[0]) {
        $db->update('player', [
            'level' => $level,
            'stats' => $stats,
        ], [
            'uid' => $resultUid[0],
        ]);
        $type = 'success';
        $msg = 'Player: ' . $name . ' updated!';
    } else {
        $db->insert('player', [
            'name' => $name,
            'level' => $level,
            'stats' => $stats,
        ]);
        $type = 'success';
        $msg = 'Player: ' . $name . ' added!';
    }
    echo json_encode(['type' => $type, 'msg' => $msg]);
}

function saveFloor($db, $json)
{
    $jsonObj = json_decode($json);
    $isLoaded = $_POST['isLoaded'];
    $level = $jsonObj->{'level'};
    $startX = $jsonObj->{'startX'};
    $startY = $jsonObj->{'startY'};
    $height = $jsonObj->{'height'};
    $width = $jsonObj->{'width'};
    $tile_json = json_encode($jsonObj->{'tiles'});

    $freeLevelCheck = $db->select('floor', 'uid', ['deleted' => 0, 'level' => $level]);
    // update
    if (count($freeLevelCheck) > 0 && $isLoaded == 1) {
        $db->update('floor', [
            'level' => $level,
            'startX' => $startX,
            'startY' => $startY,
            'height' => $height,
            'width' => $width,
        ], [
            'uid' => $freeLevelCheck[0],
        ]);
        if ($freeLevelCheck[0]) {
            $target_file = '../../Private/Floor/level_uid_' . $freeLevelCheck[0] . '.json';
            $file = fopen($target_file, "w");
            fwrite($file, $tile_json);
            fclose($file);
        }
        $type = 'success';
        $msg = 'Floor Level ' . $level . ' updated!';
        //echo $db->id().' updated!';
    } else if (count($freeLevelCheck) > 0 && $isLoaded == 0) {
        $type = 'error';
        $msg = 'Floor ' . $level . ' is already in use!';
    } else if ($isLoaded == 0) {
        // insert
        if (isset($level) && isset($startX) && isset($startY) && isset($height) && isset($width)) {
            $db->insert('floor', [
                'level' => $level,
                'startX' => $startX,
                'startY' => $startY,
                'height' => $height,
                'width' => $width,
            ]);
            if ($db->id()) {
                $target_file = '../../Private/Floor/level_uid_' . $db->id() . '.json';
                $file = fopen($target_file, "w");
                fwrite($file, $tile_json);
                fclose($file);
            }
            //echo $db->id().' is a new entry!';
            $type = 'success';
            $msg = 'Floor Level ' . $level . ' was saved!';
        } else {
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
    $selectByNameUid = $db->select('tile', '*', ['deleted' => 0, 'name' => $name]);

    if ($dbTypeUid[0] && $selectByNameUid[0] == '') {
        $sorting = $db->select('tile', 'sorting', ['type' => $dbTypeUid[0], 'ORDER' => ['sorting' => 'DESC'], 'LIMIT' => 1]);
        $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
        $target_file = '../../Public/Images/Floor/' . $type . '/' . $source . '.' . $ext;
        if (!in_array(exif_imagetype($file['tmp_name']), $allowedTypes)) {
            $type = 'error';
            $msg = mime_content_type($file['tmp_name']) . ' format is not allowed';
        } else {
            $db->insert('tile', [
                'name' => $name,
                'source' => $source . '.' . $ext,
                'collision' => $collision,
                'sorting' => $sorting[0] + 1,
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
            $target_file = '../../Public/Images/Floor/' . $type . '/' . $source . '.' . $ext;
            move_uploaded_file($file["tmp_name"], $target_file);
        }
        if ($ext) {
            $source = $name . '.' . $ext;
        } else {
            $source = $selectByNameUid[0]['source'];
        }
        $db->update('tile', [
            'name' => $name,
            'source' => $source,
            'collision' => $collision,
            'type' => $dbTypeUid[0],
        ], [
            'uid' => $selectByNameUid[0]['uid'],
        ]);
        $type = 'success';
        $msg = 'Tile ' . $name . ' was saved!';
    }
    echo json_encode(['type' => $type, 'msg' => $msg]);
}

function delTile($db, $name)
{
    $db->update('tile',
        ['deleted' => 1],
        [
            'name' => $name,
        ]
    );
    $type = 'success';
    $msg = 'Tile removed';
    echo json_encode(['type' => $type, 'msg' => $msg]);
}

function returnJson($msg, $result, $success)
{
    if ($success !== false) {
        $type = 'success';
    } else {
        $type = 'error';
    }
    echo json_encode(['type' => $type, 'msg' => $msg, 'result' => $result]);
}
