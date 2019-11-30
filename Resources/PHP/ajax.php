<?php

include_once "db.php";



switch ($_POST['type']) {
    case 'getFloor':
        getFloor($database,$_POST['level']);
        break;
    case 'saveFloor':
        saveFloor($database,$_POST['json']);
        break;
    case 'getAllTiles':
        getAllTiles($database);
        break;
    case 'getAllFloorLevels':
        getAllFloorLevels($database);
        break;
    default:
        // code...
        break;
}
function getFloor($db,$level){
    echo json_encode($db->select('Game_Floor','*',['level' => $level]));
}
function getAllFloorLevels($db){
    echo json_encode($db->select('Game_Floor','level'));
}

function saveFloor($db,$json){
    $jsonObj = json_decode($json);

    $isLoaded = $_POST['isLoaded'];

    $level = $jsonObj->{'level'};
    $endLink = $jsonObj->{'endLink'} ?? "";
    $startX  = $jsonObj->{'startX'};
    $startY  = $jsonObj->{'startY'};
    $endX  = $jsonObj->{'endX'};
    $endY  = $jsonObj->{'endY'};
    $height = $jsonObj->{'height'};
    $width = $jsonObj->{'width'};
    $tile_json = json_encode($jsonObj->{'tiles'});

    $freeLevelCheck = $db->select('Game_Floor','uid',['level' => $level]);
    // update
    if(count($freeLevelCheck) > 0 && $isLoaded == 1){
        $db->update("Game_Floor", [
            'level' => $level,
            'startX' => $startX,
            'startY' => $startY,
            'endX' => $endX,
            'endY' => $endY,
            'height' => $height,
            'width' => $width,
            'endLink' => $endLink,
            'tile_json' => $tile_json
        ], [
        	"uid" => $freeLevelCheck
        ]);
        echo $db->id()." updated!";
    }else if(count($freeLevelCheck) > 0 && $isLoaded == 0){
        echo "floorUsed";
    } else if($isLoaded == 0){
        // insert
        if(isset($level) && isset($startX) && isset($startY) && isset($endX) && isset($endY) && isset($height) && isset($width) && isset($tile_json)){
            $db->insert("Game_Floor", [
                'level' => $level,
                'startX' => $startX,
                'startY' => $startY,
                'endX' => $endX,
                'endY' => $endY,
                'height' => $height,
                'width' => $width,
                'endLink' => $endLink,
                'tile_json' => $tile_json
            ]);
            echo $db->id()." is a new entry!";
        }else{
            echo $level;
            echo "smt failed";
        }
    }
}

function getAllTiles($db){
    echo json_encode($db->select('Game_Tiles','*'));
}
