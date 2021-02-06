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
    case 'getAllRecipes':
        getAllRecipes($database);
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
        savePlayer($database, $_POST['name'], $_POST['level'], $_POST['stats'], $_POST['skills']);
        break;

    // save
    case 'saveFloor':
        saveFloor($database, $_POST['json']);
        break;
    case 'saveAssets':
        saveAssets($database, $_POST['json'], $_REQUEST['file']);
        break;
    case 'saveSpriteSheet':
        saveSpriteSheet($database, $_REQUEST['file']);
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
    $tiles = getFile('../../Private/Floor/Level_' . $level . '/Layer_Tiles.txt');
    $interactions = getFile('../../Private/Floor/Level_' . $level . '/Layer_Interactions.txt');
    $collectibles = getFile('../../Private/Floor/Level_' . $level . '/Layer_Collectibles.txt');
    if ($tiles || $interactions || $collectibles) {
        $result['tiles'] = $tiles;
        $result['interactions'] = $interactions;
        $result['collectibles'] = $collectibles;
        $msg = 'Floor Level ' . $level . ' successfully loaded';
    } else {
        $result = false;
        $msg = 'Fallback Floor Level loaded';
    }
    returnJson($msg, $result, $success);
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
            'assets.req',
            'assets.pos',
            'assets.type(typeuid)',
            'assets_type.name(type)',
            'assets_type.factor(factor)',
            'assets_type.layer(layer)',
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
            'assets.uid',
            'assets.sorting',
            'assets.name',
            'assets.source',
            'assets.collision',
            'assets.req',
            'assets.pos',
            'assets.type(typeuid)',
            'assets_type.name(type)',
            'assets_type.factor(factor)',
            'assets_type.layer(layer)',
        ],
        [
            'AND' => [
                'assets.name' => $name,
                'assets.deleted' => 0,
            ],
        ]
    );
    $msg = 'Assets loaded';
    returnJson($msg, $result, $success);
}
function getAllFloors($db)
{
    $result = $db->select('floor', '*', ['deleted' => 0, 'ORDER' => 'level']);
    $msg = 'Floors loaded';
    returnJson($msg, $result, $success);
}
function getAllRecipes($db)
{
    $result = $db->select('recipes', '*', ['deleted' => 0]);
    $msg = 'Recipes loaded';
    returnJson($msg, $result, $success);
}
function getAssetsType($db)
{
    $result = $db->select('assets_type', '*', ['deleted' => 0]);
    $msg = 'Asset Types loaded';
    returnJson($msg, $result, $success);
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
            $r->name = $name;
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
    if (count($result)) {
        $msg = 'Skills types loaded';
    } else {
        $success = false;
        $msg = 'No Skill types found';
    }
    returnJson($msg, $result, $success);
}
function savePlayer($db, $name, $level, $stats, $skills)
{
    $skillArray = json_decode($skills);
    $result = $db->select('player', 'uid', ['AND' => ['deleted' => 0, 'name' => $name]]);
    if ($result[0]) {
        $db->update('player', [
            'level' => $level,
            'stats' => $stats,
        ], [
            'uid' => $result[0],
        ]);
        $msg = 'Player: ' . $name . ' updated!';
    } else {
        $db->insert('player', [
            'name' => $name,
            'level' => $level,
            'stats' => $stats,
        ]);
        $result = $db->select('player', 'uid', ['AND' => ['deleted' => 0, 'name' => $name]]);
        $msg = 'Player: ' . $name . ' added!';
    }
    if ($skillArray) {
        for ($i = 0; $i < count($skillArray); $i++) {
            $exp = $skillArray[$i]->exp->current . ',' . $skillArray[$i]->exp->max;
            if ($skillArray[$i]->player_uid) {
                //echo $skillArray[$i]->player_uid. 'update to it<br />';
                // update
                $db->update('player_skills', [
                    'level' => $skillArray[$i]->level,
                    'exp' => $exp,
                ], [
                    'player_uid' => $skillArray[$i]->player_uid,
                    'skills_uid' => $skillArray[$i]->skills_uid,
                ]);
            } else {
                //echo $result[0]. 'insert<br />';
                // insert
                $db->insert('player_skills', [
                    'player_uid' => $result[0],
                    'skills_uid' => $skillArray[$i]->skills_uid,
                    'level' => $skillArray[$i]->level,
                    'exp' => $exp,
                ]);
            }
        }
    }
    returnJson($msg, $result[0], $success);
}

function saveFloor($db, $json)
{
    $jsonObj = json_decode($json);
    $level = $jsonObj->{'level'};
    $startX = $jsonObj->{'startX'};
    $startY = $jsonObj->{'startY'};
    $height = $jsonObj->{'height'};
    $width = $jsonObj->{'width'};
    $tiles = $jsonObj->{'tiles'};
    $interactions = $jsonObj->{'interactions'};
    $collectibles = $jsonObj->{'collectibles'};

    $isUpdate = $db->select('floor', 'uid', ['deleted' => 0, 'level' => $level])[0];
    $destination_dir = '../../Private/Floor/Level_' . $level;

    if (!is_dir($destination_dir)) {
        mkdir($destination_dir, 0755, true);
    }
    // update
    if ($isUpdate) {
        $db->update('floor', [
            'level' => $level,
            'startX' => $startX,
            'startY' => $startY,
            'height' => $height,
            'width' => $width,
        ], [
            'uid' => $isUpdate,
        ]);
        $msg = 'Floor Level ' . $level . ' updated!';
    } else {
        // insert
        if (isset($level) && isset($startX) && isset($startY) && isset($height) && isset($width)) {
            $db->insert('floor', [
                'level' => $level,
                'startX' => $startX,
                'startY' => $startY,
                'height' => $height,
                'width' => $width,
            ]);
            $msg = 'Floor Level ' . $level . ' was saved!';
        }
    }
    if ($isUpdate || $db->id()) {
        if ($tiles) {
            writeFile($destination_dir . '/Layer_Tiles.txt', $tiles);
        }
        if ($interactions) {
            writeFile($destination_dir . '/Layer_Interactions.txt', $interactions);
        }
        if ($collectibles) {
            writeFile($destination_dir . '/Layer_Collectibles.txt', $collectibles);
        }
    }
    returnJson($msg, '', $success);
}

function saveAssets($db, $json, $file)
{
    $jsonObj = json_decode($json);

    $uid = $jsonObj->{'uid'};
    $name = $jsonObj->{'name'};
    $factor = $jsonObj->{'factor'};
    $source = $jsonObj->{'source'};
    $collision = $jsonObj->{'collision'};
    $type = $jsonObj->{'type'};
    $typeuid = $jsonObj->{'typeuid'};
    $req = $jsonObj->{'req'};
    $pos = $jsonObj->{'pos'};

    if (!$type) {
        $type = $db->select('assets_type', 'name', ['deleted' => 0, 'uid' => $typeuid])[0];
    }
    $target_file = '../../Public/Images/Floor/' . $type . '/' . $name . '.webp';

    $file = base64_decode(explode(',', $file)[1]);
    file_put_contents($target_file, $file);

    if ($uid) {
        $db->update('assets_type', [
            'factor' => $factor,
        ], [
            'uid' => $typeuid,
        ]);
        $db->update('assets', [
            'name' => $name,
            'source' => $name . '.webp',
            'collision' => $collision,
            'type' => $typeuid,
            'req' => $req,
            'pos' => $pos,
        ], [
            'uid' => $uid,
        ]);
        $msg = 'Assets ' . $name . ' was updated!';
    } else {
        $sorting = $db->select('assets', 'sorting', ['type' => $typeuid, 'ORDER' => ['sorting' => 'DESC'], 'LIMIT' => 1]);
        $db->insert('assets', [
            'name' => $name,
            'source' => $name . '.webp',
            'collision' => $collision,
            'sorting' => $sorting[0] + 1,
            'type' => $typeuid,
            'req' => $req,
            'pos' => $pos,
        ]);
        $msg = 'Assets ' . $name . ' was saved!';
    }
    returnJson($msg, '', $success);
}
function saveSpriteSheet($db, $file)
{
    $target_file = '../../Public/Images/Floor/SpriteSheet.webp';

    $file = base64_decode(explode(',', $file)[1]);
    file_put_contents($target_file, $file);
    $msg = 'SpriteSheet saved!';
    returnJson($msg, '', $success);
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

function getFile($path)
{
    if (file_exists($path)) {
        return file_get_contents($path);
    } else {
        return false;
    }
}

function writeFile($path, $content)
{
    $file = fopen($path, "w");
    fwrite($file, $content);
    fclose($file);
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
