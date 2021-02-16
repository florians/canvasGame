class AssetGenerator {
    constructor(parent) {
        this.parent = parent;
        this.mousehandler = new MouseHandler(this);
        this.keyboardHandler = new KeyboardHandler(this);
        this.reader = new FileReader();
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
    load() {
        this.parent.loader.add('data', 'fillAssetTypeSelect', {
            type: 'getAssetsType'
        });
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
        this.listAssets();
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
        for (let i = 0; i < this.upload.req.length; i++) {
            reqArray.push('#' + this.upload.req[i].amount + '*' + this.upload.req[i].asset.uid);
        }
        return reqArray.join(',');
    }
    saveFile(event) {
        if (this.upload.image) {
            let upload = {
                collision: $('.tile-collision').val() || "false",
                factor: $('.tile-factor').val(),
                //layer: "tiles"
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
            this.parent.loader.add('file', 'assets', formData);
            //$('#newImg').attr('src', image);
            this.parent.loader.run();

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
        this.parent.loader.add('file', 'assets', formData);
        this.parent.loader.run();
    }
    fillForm() {
        $('input.tile-name').val('new');
        if (this.upload.typeuid) {
            $('select.tile-type').val(this.upload.typeuid);
        }
        if (this.upload.type) {
            $('.tile-folder').text(this.upload.type);
        }
        if (this.upload.factor) {
            $('.tile-factor').val(this.upload.factor);
        }
        if (this.upload.name) {
            $('input.tile-name').val(this.upload.name);
            $('span.tile-name').text(this.upload.name);
        }
        $('.tile-collision').val(this.upload.collision);
        $('.req-container').html('');
        this.setRequirements();
        $('.tile-pos').val(JSON.stringify(this.upload.pos));
    }
    addRequirements(e) {
        let amount = parseInt($('.custom .amount').val());
        if (amount) {
            let uid = $(e.target).parent().data('uid');
            this.upload.addRequirements(uid, amount);
            this.hideRequirements();
            $('.req-container').html('');
            this.setRequirements();
        }
    }
    showRequirements(e) {
        $('.custom').show();
    }
    hideRequirements() {
        $('.custom').hide();
        $('.custom .amount').val('');
    }
    setRequirements() {
        let html = [];
        if (this.upload.req.length > 0) {
            for (var i = 0; i < this.upload.req.length; i++) {
                html.push('<div class="req g100 block padding-tb-s">');
                html.push('<img class="g10 padding-lr-s" src="' + this.upload.req[i].asset.image.src + '" />');
                html.push('<span class="g30 padding-lr-s">' + this.upload.req[i].asset.name + '</span>');
                html.push('<input type="number" value="' + this.upload.req[i].amount + '" class="req-amount g20" />');
                html.push('<div class="del inline">D</div>');
                html.push('</div>');
            }
        }
        $('.req-container').append(html.join(''));
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
    listAssets() {
        let htmlArray = [];
        let typeArray = [{
                key: 'Material',
                items: this.parent._assets.getByType('material')
            },
            {
                key: 'Craftable',
                items: this.parent._assets.getByType('craftable')
            }
        ];
        let extraClass = '';
        for (let typeI = 0; typeI < typeArray.length; typeI++) {
            let items = typeArray[typeI].items;
            extraClass = typeI == 0 ? 'active' : '';
            htmlArray.push('<div class="asset-layer layer-' + typeArray[typeI].key + '">');
            htmlArray.push('<div class="title">' + typeArray[typeI].key + '</div>');
            for (let itemsI = 0; itemsI < items.length; itemsI++) {
                htmlArray.push('<div class="asset inline" data-uid="' + items[itemsI].uid + '"><img src="' + items[itemsI].image.src + '" /></div>');
            }
            htmlArray.push('</div>');
        }
        $('.custom-container').append(htmlArray.join(''));
        this.mousehandler.add('.custom-container .asset', 'click', 'addRequirements');
        //$('.asset-layer.active .assetGroup .title').first().click();
        //this.mousehandler.add('aside .asset', 'click', 'changeAsset');
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
