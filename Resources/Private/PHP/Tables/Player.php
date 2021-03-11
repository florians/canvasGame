<?php

$player_path = '../../Private/Player/';

function getPlayer($raw = false)
{
    $name = $_POST['name'];
    $result = $GLOBALS['db']->select('player', '*', ['AND' => ['deleted' => 0, 'name' => $name]]);
    if (count($result)) {
        $msg = 'Player loaded';
        $r = $result[0];
    } else {
        // new player
        $target_file = '../../Private/Player/DefaultPlayer.json';
        if (file_exists($target_file)) {
            $r = (array) json_decode(file_get_contents($target_file));
            $r['name'] = $name;
        }
        $msg = 'New Player';
    }
    if ($raw) {
        return $r;
    } else {
        returnJson($msg, $r);
    }
}
function getPlayerSkills($raw = false)
{
    $name = $_POST['name'];
    if($raw){
        $uid = $_POST['player_uid'];
    }
    $result = $GLOBALS['db']->select('player_skills',
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
    if ($raw) {
        $result = $GLOBALS['db']->select('player_skills',
            [
                '[>]skills' => ['player_skills.skills_uid' => 'uid'],
            ],
            [
                'player_skills.level',
                'player_skills.exp',
                'skills.uid',
                'skills.name',
                'skills.text',
                'skills.level',
                'skills.type',
                'skills.cost',
                'skills.value',
                'skills.turns',
            ],
            [
                'player_skills.player_uid' => $uid, // is actually uid
            ]
        );
        return $result;
    } else {
        returnJson($msg, $result);
    }
}
function savePlayer($raw = false)
{
    $name = $_POST['name'];
    $level = $_POST['level'];
    $stats = $_POST['stats'];
    $skills = $_POST['skills'];
    $skillArray = json_decode($skills);
    $result = $GLOBALS['db']->select('player', 'uid', ['AND' => ['deleted' => 0, 'name' => $name]]);
    if ($result[0]) {
        $GLOBALS['db']->update('player', [
            'level' => $level,
            'stats' => $stats,
        ], [
            'uid' => $result[0],
        ]);
        $msg = 'Player: ' . $name . ' updated!';
    } else {
        $GLOBALS['db']->insert('player', [
            'name' => $name,
            'level' => $level,
            'stats' => $stats,
        ]);
        $result = $GLOBALS['db']->select('player', 'uid', ['AND' => ['deleted' => 0, 'name' => $name]]);
        $msg = 'Player: ' . $name . ' added!';
    }
    if ($skillArray) {
        for ($i = 0; $i < count($skillArray); $i++) {
            $exp = $skillArray[$i]->exp->current . ',' . $skillArray[$i]->exp->max;
            if ($skillArray[$i]->player_uid) {
                //echo $skillArray[$i]->player_uid. 'update to it<br />';
                // update
                $GLOBALS['db']->update('player_skills', [
                    'level' => $skillArray[$i]->level,
                    'exp' => $exp,
                ], [
                    'player_uid' => $skillArray[$i]->player_uid,
                    'skills_uid' => $skillArray[$i]->skills_uid,
                ]);
            } else {
                //echo $result[0]. 'insert<br />';
                // insert
                $GLOBALS['db']->insert('player_skills', [
                    'player_uid' => $result[0],
                    'skills_uid' => $skillArray[$i]->skills_uid,
                    'level' => $skillArray[$i]->level,
                    'exp' => $exp,
                ]);
            }
        }
    }
    returnJson($msg, $result[0]);
}
