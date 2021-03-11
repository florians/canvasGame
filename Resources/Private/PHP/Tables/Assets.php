<?php

function getAllAssets($raw = false)
{
    $result = $GLOBALS['db']->select('assets',
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
        ]
    );
    if (count($result)) {
        $msg = 'Assets loaded';
    } else {
        //$success = false;
        $msg = 'no Assets found';
    }
    if ($raw) {
        return $result;
    } else {
        returnJson($msg, $result);
    }
}
function getAssetsType($raw = false)
{
    $result = $GLOBALS['db']->select('assets_type', '*', ['deleted' => 0]);
    $msg = 'Asset Types loaded';
    if ($raw) {
        return $result;
    } else {
        returnJson($msg, $result);
    }
}

// function getAsset($GLOBALS['db'], $name)
// {
//     $result = $GLOBALS['db']->select('assets',
//         [
//             '[>]assets_type' => ['assets.type' => 'uid'],
//         ],
//         [
//             'assets.uid',
//             'assets.sorting',
//             'assets.name',
//             'assets.source',
//             'assets.collision',
//             'assets.req',
//             'assets.pos',
//             'assets.type(typeuid)',
//             'assets_type.name(type)',
//             'assets_type.factor(factor)',
//             'assets_type.layer(layer)',
//         ],
//         [
//             'AND' => [
//                 'assets.name' => $name,
//                 'assets.deleted' => 0,
//             ],
//         ]
//     );
//     $msg = 'Assets loaded';
//     returnJson($msg, $result, $success);
// }

function saveAssets($raw = false)
{
    $file = $_REQUEST['file'];
    $jsonObj = json_decode($_POST['json']);

    $uid = $jsonObj->{'uid'};
    $name = $jsonObj->{'name'};
    $layer = $jsonObj->{'layer'};
    $factor = $jsonObj->{'factor'};
    $source = $jsonObj->{'source'};
    $collision = $jsonObj->{'collision'};
    $type = $jsonObj->{'type'};
    $typeuid = $jsonObj->{'typeuid'};
    $req = $jsonObj->{'req'};
    $pos = $jsonObj->{'pos'};

    if (!$type) {
        $type = $GLOBALS['db']->select('assets_type', 'name', ['deleted' => 0, 'uid' => $typeuid])[0];
    }
    $target_file = '../../Public/Images/Floor/' . $type . '/' . $name . '.webp';

    $file = base64_decode(explode(',', $file)[1]);
    file_put_contents($target_file, $file);

    if ($uid) {
        $GLOBALS['db']->update('assets_type', [
            'factor' => $factor,
            'layer' => $layer,
        ], [
            'uid' => $typeuid,
        ]);
        $GLOBALS['db']->update('assets', [
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
        $result = $GLOBALS['db']->id();
    } else {
        $sorting = $GLOBALS['db']->select('assets', 'sorting', ['type' => $typeuid, 'ORDER' => ['sorting' => 'DESC'], 'LIMIT' => 1]);
        $GLOBALS['db']->insert('assets', [
            'name' => $name,
            'source' => $name . '.webp',
            'collision' => $collision,
            'sorting' => $sorting[0] + 1,
            'type' => $typeuid,
            'req' => $req,
            'pos' => $pos,
        ]);
        $msg = 'Assets ' . $name . ' was saved!';
        $result = $GLOBALS['db']->id();
    }
    returnJson($msg, $result);
}
function delAssets($raw = false)
{
    $name = $_POST['name'];
    $GLOBALS['db']->update('assets',
        ['deleted' => 1],
        [
            'name' => $name,
        ]
    );
    $type = 'success';
    $msg = 'Assets removed';
    echo json_encode(['type' => $type, 'msg' => $msg]);
}
