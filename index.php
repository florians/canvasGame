<?php
$debug = true; //$_GET['debug'];
include_once 'Resources/Private/PHP/Lib/combine_my_files.php';
$jsFiles = [
    'Resources/Public/JavaScript/Lib/virtualjoystick.js',
    'Resources/Public/JavaScript/ajax.js',
    'Resources/Public/JavaScript/game.js',
];
$cssFiles = [
    'Resources/Public/Css/basic.css',
    'Resources/Public/Css/game.css',
];
?>
<!doctype html>
<html>

<head>
	<title>IDK</title>
	<meta name='viewport' content='width=device-width, initial-scale=1.0, user-scalable=no'>
	<?php
		echo combine_my_files($cssFiles, 'Temp/Css/', 'game.min' . '.css', 'css', $debug);
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
<?php
	echo combine_my_files($jsFiles, 'Temp/JavaScript/', 'game.min' . '.js', 'js', $debug);
?>
</html>
