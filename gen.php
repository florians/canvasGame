<?php
include_once 'Resources/Private/PHP/Lib/combine_my_files.php';

$debug = true; //$_GET['debug'];

if ($_GET && $_GET['p']) {
    $page = $_GET['p'];
} else {
    $page = 'floor';
}
$jsFiles = [
    'Resources/Public/JavaScript/' . $page . '.js',
];
$cssFiles = [
    'Resources/Public/Css/basic.css',
    'Resources/Public/Css/gen.css',
    'Resources/Public/Css/' . $page . '.css',
];

$pages = ['floor', 'tile']//, 'enemies', 'skills', 'passives'];
?>
<!doctype html>
<html>

<head>
    <title>IDK Generator</title>
    <meta name='viewport' content='width=device-width, initial-scale=1.0, user-scalable=no'>
    <?php
        echo combine_my_files($cssFiles, 'Temp/Css/', $page . '.min.css', 'css', $debug);
    ?>
</head>

<body>
    <nav>
    <?php
        foreach ($pages as $p) {
            if ($p == $page) {
                echo '<a class="active" href="?p=' . $p . '">' . ucFirst($p) . '</a>';
            } else {
                echo '<a href="?p=' . $p . '">' . ucFirst($p) . '</a>';
            }
        }
    ?>
    </nav>
    <div class='infoBox'>
        <span class='error'></span>
        <span class='success'></span>
        <span class='info'></span>
    </div>
    <?php
        if ($page) {
            include_once 'Resources/Private/PHP/Includes/' . $page . '.php';
        }
    ?>
</body>

<script src='https://code.jquery.com/jquery-3.5.0.min.js'></script>
<script src='Resources/Public/JavaScript/ajax.js'></script>
<?php
    echo combine_my_files($jsFiles, 'Temp/JavaScript/', $page . '.min.js', 'js', $debug);
?>

</html>
