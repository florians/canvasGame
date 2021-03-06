class AssetGenerator {
    constructor(parent) {
        this.parent = parent;
        this.mousehandler = new MouseHandler(this);
        this.keyboardHandler = new KeyboardHandler(this);
        this.reader = new FileReader();
        this.requirements = new Requirements(parent);
        this.h = 100;
        this.w = 100;
        this.upload = {};
        this.tileTypes = [];
        this.zoom = 1;
        // click
        this.mousehandler.add('.saveAsset', 'click', 'saveFile');
        this.mousehandler.add('#grid', 'click', 'loadAsset');
        this.mousehandler.add('.addToGrid', 'click', 'addToGrid');
        this.mousehandler.add('.requirements .new', 'click', 'showRequirements');
        this.mousehandler.add('.custom .close', 'click', 'hideRequirements');

        // change
        this.mousehandler.add('#file', 'change', 'readImage');
        this.mousehandler.add('.tile-type', 'change', 'fillAssetTypeInfo');
        //this.mousehandler.add('.tiles', 'change', 'loadAsset');
        // drag & drop
        this.mousehandler.add('body', 'dragover', 'dragover');
        this.mousehandler.add('body', 'drop', 'readImage');
        // mousewheel
        this.mousehandler.add('#world', 'wheel', 'wheelZoom');
        // keyboard
        this.keyboardHandler.add(document, 'keydown', 'keydown', [38, 40, 37, 39]);
        this.init();
    }
    init() {
        _ctxWorld.canvas.width = this.w;
        _ctxWorld.canvas.height = this.h;
    }
    generateGrid(addRow = 0) {
        this.assetGridArray = [];
        this.maxRow = 0;
        this.maxCol = 0;
        let assets = this.parent._assets.assets;
        for (let i = 0; i < assets.length; i++) {
            if (!assets[i]) {
                continue;
            }
            if (!this.assetGridArray[assets[i].pos.row]) {
                this.assetGridArray[assets[i].pos.row] = [];
                this.maxRow++;
            }
            if (!this.assetGridArray[assets[i].pos.row][assets[i].pos.col]) {
                this.assetGridArray[assets[i].pos.row][assets[i].pos.col] = [];

            }
            this.assetGridArray[assets[i].pos.row][assets[i].pos.col] = assets[i];
            if (this.maxCol <= assets[i].pos.col) {
                this.maxCol = assets[i].pos.col;
            }
        }
        if (addRow) {
            for (let i = 0; i < addRow; i++) {
                if (!this.assetGridArray[this.maxRow]) {
                    this.assetGridArray[this.maxRow] = [];
                    this.maxRow++;
                }
            }
        }
        // el+1
        this.maxCol++;
        _ctxGrid.canvas.width = this.w * this.maxCol;
        _ctxGrid.canvas.height = this.h * this.maxRow;
        for (var row = 0; row < this.assetGridArray.length; row++) {
            let y = row * this.h;
            for (var col = 0; col < this.assetGridArray[row].length; col++) {
                if (!this.assetGridArray[row][col]) {
                    continue;
                }
                let x = col * this.w;
                if (this.assetGridArray[row][col].image) {
                    _ctxGrid.drawImage(this.assetGridArray[row][col].image, x, y, this.w, this.h);
                }
            }
        }
    }
    addToGrid() {
        this.generateGrid(1);
    }
    readImage(e) {
        let file = null;
        if (e.target.files && e.target.files[0]) {
            file = e.target.files[0];
        } else if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            file = e.dataTransfer.files[0];
        } else {
            return;
        }
        this.reader.addEventListener("load", (evt) => {
            this.upload.image = new Image();
            this.upload.image.addEventListener("load", () => {
                this.setUploadSize();
                this.drawSingle();
            });
            this.upload.image.src = evt.target.result;
        });
        this.reader.readAsDataURL(file);
    }
    fillAssetTypeSelect(data, className = 'tiles') {
        let array = [];
        let type = '';
        let oldType = '';
        array.push('<option></option>');
        for (let i = 0; i < data.length; i++) {
            if (!data[i]) {
                continue;
            }
            type = data[i].type;
            if (type && type != oldType) {
                if (i >= 1) {
                    array.push('</optgroup>');
                }
                array.push('<optgroup label=' + type + '>');
            }
            array.push('<option value="' + data[i].uid + '">' + data[i].name + '</option>');
            oldType = data[i].type;
        }
        $('select.' + className).append(array.join(''));
        this.requirements.load();
    }
    loadAsset(e) {
        var mPos = {
            x: e.offsetX,
            y: e.offsetY
        };
        let col = Math.floor(mPos.x / (this.w)); // + 10));
        let row = Math.floor(mPos.y / (this.h)); // + 10));
        if (this.assetGridArray[row] && this.assetGridArray[row][col]) {
            this.upload = this.assetGridArray[row][col];
            if (this.assetGridArray[row][col].image) {
                this.upload.h = this.assetGridArray[row][col].image.height;
                this.upload.w = this.assetGridArray[row][col].image.width;
            }
        } else {
            this.assetGridArray[row][col] = {};
            this.assetGridArray[row][col].pos = {
                row: row,
                col: col
            }
            this.upload = this.assetGridArray[row][col];
            this.upload.h = this.h;
            this.upload.w = this.w;
        }
        this.upload.x = 0;
        this.upload.y = 0;
        this.fillForm();
        this.drawSingle();
    }
    prepareRequirements() {
        let reqArray = [];
        if(!this.upload.req) return null;
        for (let i = 0; i < this.upload.req.length; i++) {
            if (this.upload.req[i].amount > 0) {
                reqArray.push(this.upload.req[i].amount + '*' + this.upload.req[i].asset.uid);
            }
        }
        if (reqArray.length > 0) {
            return reqArray.join(',');
        } else {
            return null;
        }
    }
    saveFile(event) {
        if (this.upload.image) {
            let upload = {
                collision: $('.tile-collision').val() || "false",
                factor: parseFloat($('.tile-factor').val()),
                layer: $('.tile-layer').val(),
                name: $('.tile-name').val(),
                typeuid: parseInt($('select.tile-type').val()),
                req: this.prepareRequirements(),
                type: this.upload.type,
                uid: parseInt(this.upload.uid)
            };
            let pos = JSON.parse($('.tile-pos').val());
            upload.pos = pos.row + ',' + pos.col;
            let imgDataUrl = document.getElementById('world').toDataURL("image/webp", 1);
            var formData = new FormData();
            formData.append('type', 'saveAssets');
            formData.append('json', JSON.stringify(upload));
            formData.append('file', imgDataUrl);
            this.parent.loader.add('file', '', formData);
            this.parent.loader.run();
            this.parent.loader.clear();

            let dataUrlToImage = new Image();
            dataUrlToImage.src = imgDataUrl;
            dataUrlToImage.onload = () => {
                this.generateGrid();
            };
            this.upload.image = dataUrlToImage;
            this.saveSpriteSheet();
        }
    }
    saveSpriteSheet() {
        let imgDataUrl = document.getElementById('grid').toDataURL("image/webp", 1);
        var formData = new FormData();
        formData.append('type', 'saveSpriteSheet');
        formData.append('file', imgDataUrl);
        this.parent.loader.add('file', '', formData);
        this.parent.loader.run();
    }
    fillAssetTypeInfo(e) {
        let asset = this.parent._assets.getLayerWidthTypeuid(e.target.value);
        if (asset.layer) {
            $('.tile-layer').val(asset.layer);
        }
        if (asset.factor) {
            $('.tile-factor').val(asset.factor);
        }
    }
    fillForm() {
        $('input.tile-name').val('new');
        $('span.tile-name').text($('input.tile-name').val());
        if (this.upload.typeuid) {
            $('select.tile-type').val(this.upload.typeuid);
        }
        if (this.upload.type) {
            $('.tile-folder').text(this.upload.type);
        }
        if (this.upload.layer) {
            $('.tile-layer').val(this.upload.layer);
        }
        if (this.upload.factor) {
            $('.tile-factor').val(this.upload.factor);
        }
        if (this.upload.name) {
            $('input.tile-name').val(this.upload.name);
            $('span.tile-name').text(this.upload.name);
        }
        $('.tile-collision').val(this.upload.collision);
        if (this.upload.req) {
            this.requirements.set(this.requirements);
        }
        $('.tile-pos').val(JSON.stringify(this.upload.pos));
    }
    addRequirements(e) {
        this.requirements.add(e, this.upload);
    }
    removeRequirements(e) {
        this.requirements.remove(e, this.upload);
    }
    showRequirements() {
        this.requirements.show(this.upload);
    }
    hideRequirements() {
        this.requirements.hide();
    }
    setUploadSize() {
        this.upload.h = this.upload.image.height * (this.h / 100);
        this.upload.w = this.upload.image.width * (this.w / 100);
    }
    drawSingle() {
        _ctxWorld.fillStyle = '#e5e5e5';
        _ctxWorld.clearRect(0, 0, this.h, this.w);
        if (this.upload.image) {
            _ctxWorld.drawImage(this.upload.image, this.upload.x, this.upload.y, this.upload.w, this.upload.h);
        }
    }
    draw() {
        this.drawSingle();
        this.generateGrid();
    }
    resize() {
        _ctxWorld.canvas.width = this.w;
        _ctxWorld.canvas.height = this.h;
        this.drawSingle();
    }
    /**********************************
     * keyboardHandler & mousehandler *
     **********************************/
    dragover(e) {
        e.stopPropagation();
        e.preventDefault();
    }
    drop(e) {
        e.stopPropagation();
        e.preventDefault();
    }
    keydown(e) {
        if (!$('input').is(':focus')) {
            // w / up
            if (e.keyCode == 38 || e.keyCode == 87) {
                this.upload.y--;
            }
            // s / down
            if (e.keyCode == 40 || e.keyCode == 83) {
                this.upload.y++;
            }
            // a / left
            if (e.keyCode == 37 || e.keyCode == 65) {
                this.upload.x--;
            }
            // d / right
            if (e.keyCode == 39 || e.keyCode == 68) {
                this.upload.x++;
            }
            this.drawSingle();
        }
    }
    wheelZoom(e) {
        if (e.deltaY > 0) {
            this.zoom -= 0.1;
            if (this.zoom <= 0) {
                this.zoom = 0.1;
            }
        } else {
            this.zoom += 0.1;
        }
        this.upload.h = this.upload.image.height * (this.h / 100) * this.zoom;
        this.upload.w = this.upload.image.width * (this.w / 100) * this.zoom;
        this.drawSingle();
    }
}
