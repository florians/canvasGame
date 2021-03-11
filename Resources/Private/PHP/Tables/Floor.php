<?php

function getFloor($raw = false)
{
    $level = $_POST['level'];
    $result = $GLOBALS['db']->select('floor', '*', ['deleted' => 0, 'level' => $level])[0];

    $tiles = getFile('../../Private/Floor/Level_' . $level . '/Layer_Tiles.txt');
    $interactions = getFile('../../Private/Floor/Level_' . $level . '/Layer_Interactions.txt');
    $collectibles = getFile('../../Private/Floor/Level_' . $level . '/Layer_Collectibles.txt');

    if ($tiles || $interactions || $collectibles) {
        $result['tiles'] = $tiles;
        $result['interactions'] = $interactions;
        $result['collectibles'] = $collectibles;
        $msg = 'Floor Level ' . $level . ' successfully loaded';
    } else {
        //getFloor($GLOBALS['db'], $_POST);return;
        $result = false;
        $msg = 'Fallback Floor Level loaded';
    }
    if ($raw) {
        return $result;
    } else {
        returnJson($msg, $result);
    }
}
function getAllFloors($raw = false)
{
    $result = $GLOBALS['db']->select('floor', '*', ['deleted' => 0, 'ORDER' => 'level']);
    $msg = 'Floors loaded';
    returnJson($msg, $result);
}

function saveFloor($raw = false)
{
    $jsonObj = json_decode($_POST['json']);
    $level = $jsonObj->{'level'};
    $startX = $jsonObj->{'startX'};
    $startY = $jsonObj->{'startY'};
    $height = $jsonObj->{'height'};
    $width = $jsonObj->{'width'};
    $tiles = $jsonObj->{'tiles'};
    $interactions = $jsonObj->{'interactions'};
    $collectibles = $jsonObj->{'collectibles'};

    $isUpdate = $GLOBALS['db']->select('floor', 'uid', ['deleted' => 0, 'level' => $level])[0];
    $destination_dir = '../../Private/Floor/Level_' . $level;

    if (!is_dir($destination_dir)) {
        mkdir($destination_dir, 0755, true);
    }
    // update
    if ($isUpdate) {
        $GLOBALS['db']->update('floor', [
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
            $GLOBALS['db']->insert('floor', [
                'level' => $level,
                'startX' => $startX,
                'startY' => $startY,
                'height' => $height,
                'width' => $width,
            ]);
            $msg = 'Floor Level ' . $level . ' was saved!';
        }
    }
    if ($isUpdate || $GLOBALS['db']->id()) {
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
    returnJson($msg, '');
}

function saveSpriteSheet($raw = false)
{
    $file = $_REQUEST['file'];
    $target_file = '../../Public/Images/Floor/SpriteSheet.webp';

    $file = base64_decode(explode(',', $file)[1]);
    file_put_contents($target_file, $file);
    $msg = 'SpriteSheet saved!';
    returnJson($msg, '');
}
