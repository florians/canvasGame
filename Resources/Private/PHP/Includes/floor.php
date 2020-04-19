<main>
    <div class="controls flex flex-m">
        <div class="g30 dimension inline padding-lr-m padding-tb flex-min">
            <div class="dimension g100">
                <div class="inputContainer g100 inline padding-tb-s">
                    <label for="height" class="g30 inline">Height:</label>
                    <input id="height" class="dimension-h g70 inline" min="1" max="500" type="number" value="20" />
                </div>
                <div class="inputContainer g100 inline padding-tb-s">
                    <label for="width"class="g30 inline">Width:</label>
                    <input id="width" class="dimension-w g70 inline" min="1" max="500" type="number" value="20" />
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
                    <label class="g30 inline">Floor Level</label>
                    <input class="level g70 inline" type="number" />
                </div>
            </div>
        </div>
        <div class="g100 inline padding-lr-m padding-tb-m">
            <div class="g50 inline">
                <div class="inputContainer g100 inline padding-t-s">
                    <label class="g70 inline">Zoom Level:&nbsp; <span class="zoomLevel">100</span>%</label>
                    <span class="smallbtn zoom" data-change="+">+</span>
                    <span class="smallbtn zoom" data-change="-">-</span>
                </div>
            </div>
            <div class="g50 inline">
                <div class="inputContainer g100 inline padding-t-s">
                    <label class="g70 inline">Brush Size:&nbsp; <span class="brushSize">1</span></label>
                    <span class="smallbtn brush" data-change="+">+</span>
                    <span class="smallbtn brush" data-change="-">-</span>
                </div>
            </div>
        </div>
        <div class="g100 inline padding-tb">
            <div class="g70 padding-lr-m">
                <input class="isLoded" type="hidden" value="0" />
                <input type="submit" class="saveFloor g100" value="Save Floor" />
            </div>
            <div class="g30 padding-lr-m">
                <input type="reset" class="reset" value="Reset" />
            </div>
        </div>
    </div>
    <div class="canvasContainer">
        <canvas id="gameCanvas"></canvas>
    </div>
</main>
<aside>
    <div class="accordion-container"></div>
    <div class="custom block flex-m">
        <div class="g100 inline">
            <div class="g100">
                <div class="inputContainer g100 inline padding-tb-s">
                    <label class="g30 inline">Floor Level</label>
                    <input class="custom-hidden" type="hidden" />
                    <input class="level g70 inline" type="number" />
                </div>
                <input type="submit" class="save-to-element g100" value="Save to Element" />
            </div>
        </div>
    </div>
</aside>
