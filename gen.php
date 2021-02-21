<?php
include_once 'Resources/Private/PHP/Util.php';

$debug = true; //$_GET['debug'];

if ($_GET && $_GET['p']) {
    $page = $_GET['p'];
} else {
    $page = 'floor';
}
$pageName = implode('', array_map('ucfirst', explode('-', $page)));

$jsFiles = [
    'Resources/Public/JavaScript/Utilities',
    'Resources/Public/JavaScript/Controls/MouseHandler.js',
    'Resources/Public/JavaScript/Controls/KeyboardHandler.js',
    'Resources/Public/JavaScript/Shared/Assets.js',
    'Resources/Public/JavaScript/Shared/Asset.js',
    'Resources/Public/JavaScript/Shared/Floors.js',

    // Abstract
    'Resources/Public/JavaScript/Abstract/AbstractSquares.js',
    'Resources/Public/JavaScript/Abstract/AbstractSquare.js',
    // Tiles
    'Resources/Public/JavaScript/Shared/Tiles.js',
    'Resources/Public/JavaScript/Shared/Tile.js',
    // Collectibles
    'Resources/Public/JavaScript/Shared/Collectibles.js',
    'Resources/Public/JavaScript/Shared/Collectible.js',

    // Interactions
    'Resources/Public/JavaScript/Shared/Interactions.js',
    'Resources/Public/JavaScript/Shared/Interaction.js',
    'Resources/Public/JavaScript/Generator/Requirements.js',
    'Resources/Public/JavaScript/Generator/' . $pageName . '.js',
    'Resources/Public/JavaScript/Generator/Generator.js',
    'Resources/Public/JavaScript/Generator/Init.js',
];
$cssFiles = [
    'Resources/Public/Css/Basic.css',
    'Resources/Public/Css/Generator.css',
    'Resources/Public/Css/' . $pageName . '.css',
];

$pages = ['floor', 'asset-generator']; //, 'skills']//, 'enemies', 'passives'];
?>
<!doctype html>
<html>

<head>
    <title>IDK Generator</title>
    <meta name='viewport' content='width=device-width, initial-scale=1.0, user-scalable=no'>
    <?php
echo combine_my_files($cssFiles, 'Temp/Css/', $pageName . '.min.css', 'css', $debug);
?>
</head>

<body>
    <nav>
    <?php
        foreach ($pages as $p) {
            $naviName = implode(' ', array_map('ucfirst', explode('-', $p)));
            if ($p == $page) {
                echo '<a class="active" href="?p=' . $p . '">' . $naviName . '</a>';
            } else {
                echo '<a href="?p=' . $p . '">' . $naviName . '</a>';
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
            $file = 'Resources/Private/Templates/Generator/' . $pageName . '.html';
            if (is_file($file)) {
                echo file_get_contents($file);
            }
        }
    ?>
    <canvas id="loader"></canvas>
    <script src='Resources/Public/JavaScript/Library/jquery-3.5.0.min.js'></script>
    <script>
        let generatorType = '<?php echo $pageName ?>';
    </script>
    <?php
        echo combine_my_files($jsFiles, 'Temp/JavaScript/', $pageName . '.min.js', 'js', $debug);
    ?>
</body>
</html>
