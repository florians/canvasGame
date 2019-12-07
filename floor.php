<main>
    <!-- <div class="tilesButton"></div> -->
    <div class="controls flex flex-m">
        <div class="g30 dimension inline padding-lr-m padding-tb flex-min">
            <div class="dimension g100">
                <div class="inputContainer g100 inline padding-tb-s">
                    <label for="height" class="g30 inline">Height:</label>
                    <input id="height" class="dimension-h g70 inline" min="1" max="50" type="number" value="10" />
                </div>
                <div class="inputContainer g100 inline padding-tb-s">
                    <label for="width"class="g30 inline">Width:</label>
                    <input id="width" class="dimension-w g70 inline" min="1" max="50" type="number" value="10" />
                </div>
                <input type="submit" class="sizeSubmit" value="Set Dimension" />
            </div>
        </div>
        <div class="g70 inline padding-lr-m padding-tb">
            <div class="g100">
                <div class="inputContainer g100 inline padding-tb-s">
                    <label class="g30 inline">Load Floor</label>
                    <select class="floorSelect g70 inline">
                        <option></option>
                    </select>
                </div>
                <div class="inputContainer g100 inline padding-tb-s">
                    <label class="g30 inline">Link with Floor</label>
                    <select class="endLink g70 inline">
                        <option></option>
                    </select>
                </div>
                <input type="reset" class="reset" value="Reset" />
            </div>
        </div>
        <div class="g100 inline padding-lr-m padding-tb">
            <div class="save g100">
                <div class="inputContainer g100 inline padding-tb-s">
                    <label class="g30 inline">Floor Level</label>
                    <input class="level g70 inline" type="number" />
                </div>
                <input class="isLoded" type="hidden" value="0" />
                <input type="submit" class="saveFloor" value="Save Floor" />
            </div>
        </div>
    </div>
    <canvas id="gameCanvas"></canvas>
</main>
<aside>
</aside>
