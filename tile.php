<main>
    <div class="controls flex flex-m">
        <div class="g100 inline padding-lr-m spacer">
            <div class="g100">
                <div class="g100 inline padding-tb-s">
                    <label for="file" class="upload padding-lr-m g100 inline">Upload File</label>
                    <input id="file" class="g100 block" type="file" onchange="previewFile()"><br>
                </div>
                <div class="g100 inline padding-tb-s">
                    <div class="imgContainer">
                        <img class="" src="" height="">
                        <div class="collision parts-4">
                            <div data-part="1"></div>
                            <div data-part="2"></div>
                            <div data-part="3"></div>
                            <div data-part="4"></div>
                            <!-- <div data-part="5"></div>
                            <div data-part="6"></div>
                            <div data-part="7"></div>
                            <div data-part="8"></div>
                            <div data-part="9"></div>
                            <div data-part="10"></div>
                            <div data-part="11"></div>
                            <div data-part="12"></div>
                            <div data-part="13"></div>
                            <div data-part="14"></div>
                            <div data-part="15"></div>
                            <div data-part="16"></div> -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</main>
<aside>
    <div class="container block flex-m">
        <div class="g100 inline padding-lr-m spacer">
            <div class="g100">
                <div class="g100 inline padding-tb-s">
                    <label class="g30 inline">Load Tile</label>
                    <select class="getAllTiles g70 inline"></select>
                </div>
                <div class="g100 inline padding-tb-s">
                    <label class="g30 inline">Set Type</label>
                    <select class="tile-type getTileType g70 inline"></select>
                </div>
                <div class="g100 inline padding-tb-s">
                    <label class="g30 inline">Factor</label>
                    <input class="tile-factor g70 inline" />
                </div>
                <div class="tileName g100 inline padding-tb-s">
                    <label for="name" class="g30 inline">Set Name</label>
                    <input id="name" class="tile-name g70 inline" />
                </div>
                <div class="g100 inline padding-tb-s spacer">
                    <label class="g100 inline">
                        Click squars on the picture to set collision<br />
                        Red = collision
                    </label>
                </div>
                <div class="path g100 inline padding-tb-s spacer">
                    <label class="g30 inline">Save Path:</label>
                    <label class="inline">
                        Resources/Images/Floor/<span class="pathType"></span>/<span class="pathName"></span><span><span class="extension"></span></span>
                    </label>
                </div>
                <div class="inputContainer g100 inline padding-tb-s">
                    <input type="submit" class="saveTile" value="Save Tile" />
                </div>
                <div class="inputContainer g100 inline padding-tb-s">
                    <input type="submit" class="deleteTile" value="Delete Tile" />
                </div>
            </div>
        </div>
    </div>
</aside>
