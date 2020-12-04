<?php
include_once 'Resources/Private/PHP/Util.php';

$debug = true; //$_GET['debug'];

if ($_GET && $_GET['p']) {
    $page = $_GET['p'];
} else {
    $page = 'floor';
}
$jsFiles = [
    'Resources/Public/JavaScript/Utilities',
    'Resources/Public/JavaScript/Controls/MouseHandler.js',
    'Resources/Public/JavaScript/Controls/KeyboardHandler.js',
    'Resources/Public/JavaScript/Shared/Assets.js',
    'Resources/Public/JavaScript/Shared/Asset.js',
    'Resources/Public/JavaScript/Shared/Floors.js',
    // Tiles
    'Resources/Public/JavaScript/Shared/Tiles.js',
        'Resources/Public/JavaScript/Shared/Tile.js',
    // Squares
    'Resources/Public/JavaScript/Shared/Squares.js',
        'Resources/Public/JavaScript/Shared/Square.js',
    // Items
    'Resources/Public/JavaScript/Shared/Items.js',
        'Resources/Public/JavaScript/Shared/Item.js',
    // Enemies
    'Resources/Public/JavaScript/Shared/Enemies.js',
        'Resources/Public/JavaScript/Shared/Enemy.js',
    'Resources/Public/JavaScript/Generator/'.ucFirst($page).'.js',
    'Resources/Public/JavaScript/Generator/Generator.js',
    'Resources/Public/JavaScript/Generator/Init.js',
];
$cssFiles = [
    'Resources/Public/Css/Basic.css',
    'Resources/Public/Css/Generator.css',
    'Resources/Public/Css/' . ucFirst($page) . '.css',
];

$pages = ['floor', 'assets', 'skills']//, 'enemies', 'passives'];
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
            $file = 'Resources/Private/Templates/Generator/' . ucFirst($page) . '.html';
            if(is_file($file)){
                echo file_get_contents($file);
            }
        }
    ?>
    <script src='Resources/Public/JavaScript/Library/jquery-3.5.0.min.js'></script>
    <script>
        let generatorType = '<?php echo ucFirst($page) ?>';
    </script>
    <?php
        echo combine_my_files($jsFiles, 'Temp/JavaScript/', ucFirst($page) . '.min.js', 'js', $debug);
    ?>
</body>
</html>
