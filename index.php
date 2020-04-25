<?php
$debug = true; //$_GET['debug'];
include_once 'Resources/Private/PHP/Util.php';
$jsFiles = [
    'Resources/Public/JavaScript/Lib/virtualjoystick.js',
    'Resources/Public/JavaScript/Util/Ajax.js',
    'Resources/Public/JavaScript/Game/Init.js',
    'Resources/Public/JavaScript/Game/Ui.js',
    'Resources/Public/JavaScript/Game/Fullscreen.js',
    'Resources/Public/JavaScript/Game/Joystick.js',
    'Resources/Public/JavaScript/Game/Keyboard.js',
    'Resources/Public/JavaScript/Game/Floor.js',
    'Resources/Public/JavaScript/Game/Player.js',
    'Resources/Public/JavaScript/Game/Enemy.js',
    'Resources/Public/JavaScript/Game/Battle.js',
    'Resources/Public/JavaScript/Game/Game.js',
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
	<!-- <div class='loaderbar'></div> -->
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
		<canvas id='gameCanvas'></canvas>
		<canvas id='gameCanvas2'></canvas>
	</div>
</body>
<script src='https://code.jquery.com/jquery-3.5.0.min.js'></script>
<script>
    var playerGet = '<?php echo $_GET['player']?>';
</script>
<?php
	echo combine_my_files($jsFiles, 'Temp/JavaScript/', 'Game.min' . '.js', 'js', $debug);
?>
</html>
