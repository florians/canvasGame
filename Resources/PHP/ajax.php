<?php

include_once 'db.php';


// '[>]joinTable' => ['selectCol.col' => 'col'] | LEFT JOIN joinTable ON selectCol.col = joinTable.col
// 'table.name(name2)' | table.name AS name2

switch ($_POST['type']) {
    // load
    case 'getFloor':
        getFloor($database,$_POST['level']);
        break;
    case 'getAllTiles':
        getAllTiles($database);
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
        saveFloor($database,$_POST['json']);
        break;
    case 'saveTile':
        saveTile($database,$_POST['json'],$_FILES['file']);
        break;
    default:
        // code...
        break;
}

function getTileType($db){
    $result = $db->select('tile_type','*',['deleted' => 0]);
    echo json_encode($result);
}
function getTileSubtype($db){
    $result = $db->select('tile_subtype','*',['deleted' => 0]);
    echo json_encode($result);
}
function getTileDirection($db){
    $result = $db->select('tile_direction','*',['deleted' => 0]);
    echo json_encode($result);
}

function getFloor($db,$level){
    $result = $db->select('floor','*',['deleted' => 0, 'level' => $level]);
    $type = 'success';
    $msg = 'Floor Level '.$level.' successfully loaded';
    echo json_encode(['type' => $type,'msg' => $msg,'result' => $result]);
}
function getAllFloorLevels($db){
    echo json_encode($db->select('floor','level',['deleted' => 0, 'ORDER' => 'level']));
}

function saveFloor($db,$json){
    $jsonObj = json_decode($json);
    $isLoaded = $_POST['isLoaded'];
    $level = $jsonObj->{'level'};
    $endLink = $jsonObj->{'endLink'} ?? '';
    $startX  = $jsonObj->{'startX'};
    $startY  = $jsonObj->{'startY'};
    $height = $jsonObj->{'height'};
    $width = $jsonObj->{'width'};
    $tile_json = json_encode($jsonObj->{'tiles'});
    $enemy_json = '';//json_encode($jsonObj->{'enemies'}) ?? '';

    $freeLevelCheck = $db->select('floor','uid',['deleted' => 0, 'level' => $level]);
    // update
    if(count($freeLevelCheck) > 0 && $isLoaded == 1){
        $db->update('floor', [
            'level' => $level,
            'startX' => $startX,
            'startY' => $startY,
            'height' => $height,
            'width' => $width,
            'endLink' => $endLink,
            'tile_json' => $tile_json,
            'enemy_json' => $enemy_json
        ], [
        	'uid' => $freeLevelCheck
        ]);
        $type = 'success';
        $msg = 'Floor Level '.$level.' updated!';
        //echo $db->id().' updated!';
    }else if(count($freeLevelCheck) > 0 && $isLoaded == 0){
        //echo 'floorUsed';
        $type = 'error';
        $msg = 'Floor '.$level.' is already in use!';
    } else if($isLoaded == 0){
        // insert
        if(isset($level) && isset($startX) && isset($startY) && isset($height) && isset($width) && isset($tile_json)){
            $db->insert('floor', [
                'level' => $level,
                'startX' => $startX,
                'startY' => $startY,
                'height' => $height,
                'width' => $width,
                'endLink' => $endLink,
                'tile_json' => $tile_json,
                'enemy_json' => $enemy_json
            ]);
            //echo $db->id().' is a new entry!';
            $type = 'success';
            $msg =  'Floor Level '.$level.' was saved!';
        }else{
            // echo $level;
            // echo 'smt failed';
            $type = 'info';
            $msg =  'smt failed';
        }
    }
    echo json_encode(['type' => $type,'msg' => $msg]);
}

function saveTile($db,$json,$file){
    $jsonObj = json_decode($json);

    $name = $jsonObj->{'name'};
    $source = $jsonObj->{'source'};
    $collision  = $jsonObj->{'collision'};
    $type  = $jsonObj->{'type'};
    $subtype = $jsonObj->{'subtype'};
    $direction = $jsonObj->{'direction'};


    $dbTypeUid = $db->select('tile_type','uid',['deleted' => 0, 'name' => $type]);
    $dbSubtypeUid = $db->select('tile_subtype','uid',['deleted' => 0, 'name' => $subtype]);
    $dbDirectionUid = $db->select('tile_direction','uid',['deleted' => 0, 'name' => $direction]);

    if($dbTypeUid[0] && $dbSubtypeUid[0] && $dbDirectionUid[0]){
        $db->insert('tile', [
            'name' => $name,
            'source' => $source,
            'collision' => $collision,
            'type' => $dbTypeUid[0],
            'subtype' => $dbSubtypeUid[0],
            'direction' => $dbDirectionUid[0]
        ]);
        $target_file = '../Images/Floor/'.$type.'/'.$source;
        move_uploaded_file($file["tmp_name"], $target_file);
        $type = 'success';
        $msg =  'Tile '.$name.' was saved!';
    }
    echo json_encode(['type' => $type,'msg' => $msg]);
}



function getAllTiles($db){
    $allTiles = $db->select('tile',
        [
            '[>]tile_type' => ['tile.type' => 'uid'],
            '[>]tile_subtype' => ['tile.subtype' => 'uid'],
            '[>]tile_direction' => ['tile.direction' => 'uid']
        ],
        [
            'tile.sorting',
            'tile.name',
            'tile.source',
            'tile.collision',
            'tile.direction',
            'tile_type.name(type)',
            'tile_subtype.name(subtype)',
            'tile_subtype.parts(parts)',
            'tile_direction.name(direction)'
        ],
        [
            "tile.deleted" => 0,
            'ORDER' => [
            'tile.sorting',
            'tile_type.name'
            ]
        ]
    );
    echo json_encode($allTiles);

}
