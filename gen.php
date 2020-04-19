<?php
if ($_GET && $_GET['p']) {
    $page = $_GET['p'];
} else {
    $page = 'floor';
}

$pages = ['floor', 'tile']//, 'enemies', 'skills', 'passives'];
?>
<!doctype html>
<html>

<head>
    <title>IDK Generator</title>
    <link rel="stylesheet" type="text/css" href="Resources/CSS/basic.css" />
    <link rel="stylesheet" type="text/css" href="Resources/CSS/gen.css" />
    <?php
        if ($page) {
            echo '<link rel="stylesheet" type="text/css" href="Resources/CSS/' . $page . '.css" />';
        }
    ?>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
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
    <div class="infoBox">
        <span class="error"></span>
        <span class="success"></span>
        <span class="info"></span>
    </div>
    <?php
        if ($page) {
            include_once $page . ".php";
        }
    ?>
</body>

<script src="https://code.jquery.com/jquery-3.5.0.min.js"></script>
<?php
if ($page) {
    echo '<script src="Resources/JavaScript/' . $page . '.js"></script>';
}
?>

</html>
