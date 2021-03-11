<?php

function getAllSkills($raw = false)
{
    $result = $GLOBALS['db']->select('skills', '*', ['deleted' => 0]);
    if (count($result)) {
        $msg = 'Skills loaded';
    } else {
        //$success = false;
        $msg = 'No Skill found';
    }
    if ($raw) {
        return $result;
    } else {
        returnJson($msg, $result);
    }
}
function getSkillTypes($raw = false)
{
    $result = $GLOBALS['db']->select('skills_type', '*', ['deleted' => 0]);
    if (count($result)) {
        $msg = 'Skills types loaded';
    } else {
        //$success = false;
        $msg = 'No Skill types found';
    }
    returnJson($msg, $result);
}
