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
                        <div class="subtype">
                            <div class="type-default">
                                <div data-part="1"></div>
                            </div>
                            <div class="type-divided">
                                <div data-part="1"></div>
                                <div data-part="2"></div>
                            </div>
                            <div class="type-edge">
                                <div data-part="1"></div>
                                <div data-part="2"></div>
                                <div data-part="3"></div>
                                <div data-part="4"></div>
                            </div>
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
                    <label class="g30 inline">Set Type</label>
                    <select class="tile-type getTileType g70 inline"></select>
                </div>
                <div class="g100 inline padding-tb-s">
                    <label class="g30 inline">Set Subtype</label>
                    <select class="tile-subtype getTileSubtype g70 inline"></select>
                </div>
                <div class="g100 inline padding-tb-s">
                    <label class="g30 inline">Set Direction</label>
                    <select class="tile-direction getTileDirection g70 inline"></select>
                </div>
                <div class="tileName g100 inline padding-tb-s">
                    <label for="name" class="g30 inline">Set Name</label>
                    <input id="name" class="tile-name g70 inline" />
                </div>
                <div class="g100 inline padding-tb-s">
                    <label class="g100 inline">Set Subtype collision</label>
                </div>
                <div class="subtypeInfo g100 inline padding-tb-s spacer">
                    <label class="g100 inline">
                        Click on the suqares after selecting a subtype. <br />
                        Red = collision
                    </label>
                </div>
                <div class="path g100 inline padding-tb-s">
                    <label class="g30 inline">Save Path:</label>
                    <label class="inline">
                        Resources/Images/Floor/<span class="pathType"></span>/<span class="pathName"></span><span>.jpg</span>
                    </label>
                </div>
                <div class="inputContainer g100 inline padding-tb-s spacer">
                    <input type="submit" class="saveTile" value="Save Tile" />
                </div>
            </div>
        </div>
    </div>
</aside>
