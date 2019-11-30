<?php

include_once "Medoo.php";

$host = "localhost";
$username = "game";
$password = "#######";
$db = "Game";

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
