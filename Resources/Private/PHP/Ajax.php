<?php

include_once 'Db.php';

// Include File per Table
include_once 'Tables/Player.php';
include_once 'Tables/Floor.php';
include_once 'Tables/Assets.php';
include_once 'Tables/Skills.php';

if (function_exists($_POST['type'])) {
    call_user_func($_POST['type']);
} else {
    echo $_POST['type'] . ' not found';
}

function initLoad($raw = false)
{
    $level = $_POST['level'];
    $name = $_POST['name'];

    $assets['assets'] = getAllAssets(true);
    $assets['assetsType'] = getAssetsType(true);
    $floor = getFloor(true);
    $player = getPlayer(true);
    $_POST['player_uid'] = $player['uid'];
    $player['skills'] = getPlayerSkills(true);
    $skills = getAllSkills(true);
    $results = [
        '_assets' => $assets,
        '_skills' => $skills,
        '_player' => $player,
        '_floors' => $floor,
    ];
    $msg = 'test';
    returnJson($msg, $results, 'group');
}

// function getAllRecipes($GLOBALS['db'])
// {
//     $result = $GLOBALS['db']->select('recipes', '*', ['deleted' => 0]);
//     $msg = 'Recipes loaded';
//     returnJson($msg, $result, $success);
// }

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

function returnJson($msg, $result, $type = 'single', $success = true)
{
    if ($success !== false) {
        $state = 'success';
    } else {
        $state = 'error';
    }
    header('Content-Type: application/json');
    echo json_encode(['state' => $state, 'type' => $type, 'msg' => $msg, 'result' => $result]);
}
