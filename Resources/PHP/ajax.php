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
    echo json_encode($db->select('floor','*',['level' => $level]));
}
function getAllFloorLevels($db){
    echo json_encode($db->select('floor','level',['ORDER' => 'level']));
}

function saveFloor($db,$json){
    $jsonObj = json_decode($json);
    $isLoaded = $_POST['isLoaded'];
    $level = $jsonObj->{'level'};
    $endLink = $jsonObj->{'endLink'} ?? "";
    $startX  = $jsonObj->{'startX'};
    $startY  = $jsonObj->{'startY'};
    $height = $jsonObj->{'height'};
    $width = $jsonObj->{'width'};
    $tile_json = json_encode($jsonObj->{'tiles'});
    $enemy_json = "";//json_encode($jsonObj->{'enemies'}) ?? "";

    $freeLevelCheck = $db->select('floor','uid',['level' => $level]);
    // update
    if(count($freeLevelCheck) > 0 && $isLoaded == 1){
        $db->update("floor", [
            'level' => $level,
            'startX' => $startX,
            'startY' => $startY,
            'height' => $height,
            'width' => $width,
            'endLink' => $endLink,
            'tile_json' => $tile_json,
            'enemy_json' => $enemy_json
        ], [
        	"uid" => $freeLevelCheck
        ]);
        echo $db->id()." updated!";
    }else if(count($freeLevelCheck) > 0 && $isLoaded == 0){
        echo "floorUsed";
    } else if($isLoaded == 0){
        // insert
        if(isset($level) && isset($startX) && isset($startY) && isset($height) && isset($width) && isset($tile_json)){
            $db->insert("floor", [
                'level' => $level,
                'startX' => $startX,
                'startY' => $startY,
                'height' => $height,
                'width' => $width,
                'endLink' => $endLink,
                'tile_json' => $tile_json,
                'enemy_json' => $enemy_json
            ]);
            echo $db->id()." is a new entry!";
        }else{
            echo $level;
            echo "smt failed";
        }
    }
}

function getAllTiles($db){
    echo json_encode($db->select('tile','*',['ORDER' => 'type']));
}
