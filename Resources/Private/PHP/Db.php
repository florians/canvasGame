<?php

include_once "Lib/Medoo.php";

$host = "web9.internetgalerie.ch";
$username = "florian";
$password = "####";
$db = "florian_game";

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
