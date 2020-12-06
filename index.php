<?php
$debug = true; //$_GET['debug'];
include_once 'Resources/Private/PHP/Util.php';
$jsFiles = [
    // Utilities
    'Resources/Public/JavaScript/Utilities/',

    // UserInterface
    'Resources/Public/JavaScript/UserInterface/UserInterface.js',
        'Resources/Public/JavaScript/UserInterface/Bars.js',
        'Resources/Public/JavaScript/UserInterface/Bar.js',

    // Assets
    'Resources/Public/JavaScript/Shared/Assets.js',
        'Resources/Public/JavaScript/Shared/Asset.js',

    // Floors
    'Resources/Public/JavaScript/Shared/Floors.js',
        'Resources/Public/JavaScript/Game/Floor.js',
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
            // Battle
            'Resources/Public/JavaScript/Game/Battle.js',

    // Skills
    'Resources/Public/JavaScript/Game/Skills.js',
        'Resources/Public/JavaScript/Game/Skill.js',

    // Actions
    'Resources/Public/JavaScript/Game/Actions.js',
        'Resources/Public/JavaScript/Game/Action.js',

    // Player
    'Resources/Public/JavaScript/Game/Player.js',

    // Controls
    'Resources/Public/JavaScript/Controls/MouseHandler.js',
    'Resources/Public/JavaScript/Controls/KeyboardHandler.js',
    'Resources/Public/JavaScript/Controls/Joystick.js',
    'Resources/Public/JavaScript/Controls/Fullscreen.js',

    // Game
    'Resources/Public/JavaScript/Game/Game.js',

    // Initialize the script
    'Resources/Public/JavaScript/Game/Init.js',
];
$cssFiles = [
    'Resources/Public/Css/Basic.css',
    'Resources/Public/Css/Game.css',
];
?>
<!doctype html>
<html>

<head>
	<title>IDK</title>
	<meta name='viewport' content='width=device-width, initial-scale=1.0, user-scalable=no'>
	<?php
        echo combine_my_files($cssFiles, 'Temp/Css/', 'Game.min' . '.css', 'css', $debug);
    ?>
</head>

<body>
	<div class='loaderBar'>
        <div class="bar"></div>
        <div class="text"></span></div>
    </div>
	<div class='loader'>
		<div class='rect1'></div>
		<div class='rect2'></div>
		<div class='rect3'></div>
		<div class='rect4'></div>
		<div class='rect5'></div>
	</div>
	<div id='mobileControls'></div>

	<div class='fullscreen'></div>
	<div class='game'>
		<canvas id='world'></canvas>
		<canvas id='ui'></canvas>
	</div>
    <!-- <script src='Resources/Public/JavaScript/Library/jquery-3.5.0.min.js'></script> -->
    <script src='Resources/Public/JavaScript/Library/virtualjoystick.js'></script>
    <script>
        let playerGet = '<?php echo $_GET['player'] ?>';
    </script>
    <?php
        echo combine_my_files($jsFiles, 'Temp/JavaScript/', 'Game.min' . '.js', 'js', $debug);
    ?>
</body>

</html>
