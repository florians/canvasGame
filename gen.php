<?php
include_once 'Resources/Private/PHP/Util.php';

$debug = true; //$_GET['debug'];

if ($_GET && $_GET['p']) {
    $page = $_GET['p'];
} else {
    $page = 'floor';
}
$jsFiles = [
    'Resources/Public/JavaScript/Util/Ajax.js',
    'Resources/Public/JavaScript/Gen/' . ucFirst($page) . '.js'
];
$cssFiles = [
    'Resources/Public/Css/Basic.css',
    'Resources/Public/Css/Gen.css',
    'Resources/Public/Css/' . ucFirst($page) . '.css',
];

$pages = ['floor', 'tile', 'skills']//, 'enemies', 'passives'];
?>
<!doctype html>
<html>

<head>
    <title>IDK Generator</title>
    <meta name='viewport' content='width=device-width, initial-scale=1.0, user-scalable=no'>
    <?php
        echo combine_my_files($cssFiles, 'Temp/Css/', ucFirst($page) . '.min.css', 'css', $debug);
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
            include_once 'Resources/Private/PHP/Includes/' . ucFirst($page) . '.php';
        }
    ?>
</body>

<script src='https://code.jquery.com/jquery-3.5.0.min.js'></script>
<?php
    echo combine_my_files($jsFiles, 'Temp/JavaScript/', ucFirst($page) . '.min.js', 'js', $debug);
?>

</html>
