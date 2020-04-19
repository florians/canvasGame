<?php

include_once "Medoo.php";

$host = "**";
$username = "**";
$password = "**";
$db = "**";

// Using Medoo namespace
use Medoo\Medoo;

// Initialize
$database = new Medoo([
    'database_type' => 'mysql',
    'database_name' => $db,
    'server' => 'localhost',
    'username' => $username,
    'password' => $password
]);
