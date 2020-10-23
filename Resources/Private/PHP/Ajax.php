<?php

include_once 'Db.php';

switch ($_POST['type']) {
    // load
    case 'getFloor':
        getFloor($database, $_POST['level']);
        break;
    case 'getAllAssets':
        getAllAssets($database);
        break;
    case 'getAssets':
        getAssets($database, $_POST['name']);
        break;
    case 'getAllFloors':
        getAllFloors($database);
        break;
    case 'getAssetsType':
        getAssetsType($database);
        break;
    case 'getPlayer':
        getPlayer($database, $_POST['name']);
        break;
    case 'getPlayerSkills':
        getPlayerSkills($database, $_POST['name']);
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
    case 'saveAssets':
        saveAssets($database, $_POST['json'], $_FILES['file']);
        break;
    // delete
    case 'delAssets':
        delAssets($database, $_POST['name']);
        break;
    default:
        print_r($_POST);
        // code...
        break;
}

function getFloor($db, $level)
{
    $result = $db->select('floor', '*', ['deleted' => 0, 'level' => $level])[0];
    $target_file = '../../Private/Floor/level_' . $result['uid'] . '.json';
    if (file_exists($target_file)) {
        $file = file_get_contents($target_file);
        $result['tilesJson'] = $file;
        $msg = 'Floor Level ' . $level . ' successfully loaded';
    } else {
        $result = false;
        $msg = 'Fallback Floor Level loaded';
    }
    returnJson($msg, $result, $success);

    //echo json_encode(['type' => $type, 'msg' => $msg, 'result' => $result[0]]);
}
function getAllAssets($db)
{
    $result = $db->select('assets',
        [
            '[>]assets_type' => ['assets.type' => 'uid'],
        ],
        [
            'assets.uid',
            'assets.sorting',
            'assets.name',
            'assets.source',
            'assets.collision',
            'assets_type.name(type)',
            'assets_type.factor(factor)',
        ],
        [
            'assets.deleted' => 0,
            'ORDER' => [
                'assets.sorting',
                'assets_type.name',
            ],
        ]
    );
    if (count($result)) {
        $msg = 'Assets loaded';
    } else {
        $success = false;
        $msg = 'no Assets found';
    }
    returnJson($msg, $result, $success);
    //echo json_encode(['type' => $success, 'msg' => $msg, 'result' => $result]);

}
function getAsset($db, $name)
{
    $result = $db->select('assets',
        [
            '[>]assets_type' => ['assets.type' => 'uid'],
        ],
        [
            'assets.name',
            'assets.source',
            'assets.collision',
            'assets_type.name(type)',
            'assets_type.factor(factor)',
        ],
        [
            'AND' => [
                'assets.name' => $name,
                'assets.deleted' => 0,
            ],
        ]
    );
    //returnJson($msg, $result,$type);
    echo json_encode($result);
}
function getAllFloors($db)
{
    $result = $db->select('floor', '*', ['deleted' => 0, 'ORDER' => 'level']);
    $msg = 'Floors loaded';
    returnJson($msg, $result, $success);
}
function getAssetsType($db)
{
    $result = $db->select('assets_type', '*', ['deleted' => 0]);
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
function getPlayerSkills($db, $name)
{
    $result = $db->select('player_skills',
        [
            '[>]player' => ['player_skills.player_uid' => 'uid'],
        ],
        [
            'player_skills.player_uid',
            'player_skills.skills_uid',
            'player_skills.level',
            'player_skills.exp ',
        ],
        [
            'AND' => [
                'player.name' => $name,
                'player.deleted' => 0,
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
    $tilesJson = json_encode($jsonObj->{'tileJson'});

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
            $target_file = '../../Private/Floor/level_' . $freeLevelCheck[0] . '.json';
            $file = fopen($target_file, "w");
            fwrite($file, $tilesJson);
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
                $target_file = '../../Private/Floor/level_' . $db->id() . '.json';
                $file = fopen($target_file, "w");
                fwrite($file, $tilesJson);
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

function saveAssets($db, $json, $file)
{
    $allowedTypes = array(IMAGETYPE_PNG, IMAGETYPE_JPEG, IMAGETYPE_GIF);
    $jsonObj = json_decode($json);

    $name = $jsonObj->{'name'};
    $source = $jsonObj->{'source'};
    $collision = $jsonObj->{'collision'};
    $type = $jsonObj->{'type'};

    $dbTypeUid = $db->select('assets_type', 'uid', ['deleted' => 0, 'name' => $type]);
    $selectByNameUid = $db->select('assets', '*', ['deleted' => 0, 'name' => $name]);

    if ($dbTypeUid[0] && $selectByNameUid[0] == '') {
        $sorting = $db->select('assets', 'sorting', ['type' => $dbTypeUid[0], 'ORDER' => ['sorting' => 'DESC'], 'LIMIT' => 1]);
        $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
        $target_file = '../../Public/Images/Floor/' . $type . '/' . $source . '.' . $ext;
        if (!in_array(exif_imagetype($file['tmp_name']), $allowedTypes)) {
            $type = 'error';
            $msg = mime_content_type($file['tmp_name']) . ' format is not allowed';
        } else {
            $db->insert('assets', [
                'name' => $name,
                'source' => $source . '.' . $ext,
                'collision' => $collision,
                'sorting' => $sorting[0] + 1,
                'type' => $dbTypeUid[0],
            ]);
            move_uploaded_file($file["tmp_name"], $target_file);
            $type = 'success';
            $msg = 'Assets ' . $name . ' was saved!';
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
        $db->update('assets', [
            'name' => $name,
            'source' => $source,
            'collision' => $collision,
            'type' => $dbTypeUid[0],
        ], [
            'uid' => $selectByNameUid[0]['uid'],
        ]);
        $type = 'success';
        $msg = 'Assets ' . $name . ' was saved!';
    }
    echo json_encode(['type' => $type, 'msg' => $msg]);
}

function delAssets($db, $name)
{
    $db->update('assets',
        ['deleted' => 1],
        [
            'name' => $name,
        ]
    );
    $type = 'success';
    $msg = 'Assets removed';
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
