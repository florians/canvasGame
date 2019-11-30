<!doctype html>
<html>

<head>
    <title>IDK Floor</title>
    <link rel="stylesheet" type="text/css" href="Resources/CSS/floor.css" />
</head>

<body>
    <!-- fill tiles with ajax -->
    <div class="tiles"></div>
    <div class="dbError"></div>
    <div class="controls">
        <input class="range-x" max="50" type="range" orient="vertical" value="10" />
        <input class="range-y" max="50" type="range" orient="horizontal" value="10" />
        <span class="range-x">4</span>X<span class="range-y">4</span>
        <button class="save">Save</button>
        <input class="level" type="text" placeholder="input level" />
        <input class="isLoded" type="hidden" value="0" />
        Link with Level<select class="endLink">
            <option></option>
        </select>

        Load Level<select class="floorSelect">
            <option></option>
        </select>
    </div>
    <canvas id="gameCanvas"></canvas>

    <!-- <textarea></textarea> -->
</body>

<script src="https://code.jquery.com/jquery-1.11.1.js"></script>
<script src="Resources/JavaScript/floor.js"></script>
</html>
