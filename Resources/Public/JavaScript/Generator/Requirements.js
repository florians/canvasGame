class Requirements {
    constructor(parent) {
        this.parent = parent;
        this.mousehandler = new MouseHandler(this);
        this.element = {};
    }
    asset() {
        if (this.parent.generatorType == 'Floor') {
            return this.element;
        }
        if (this.parent.generatorType == 'AssetGenerator') {
            return this.parent.assetGenerator.upload;
        }
    }
    add(e) {
        let uid = e.target.parentElement.parentElement.dataset.uid;
        this.asset().addRequirements(uid);
        this.set();
    }
    remove(e) {
        let uid = e.target.parentElement.parentElement.dataset.uid;
        this.asset().removeRequirements(uid);
        this.set();
    }
    clear() {
        $('.custom-container').html('');
    }
    show() {
        $('.custom').addClass('active');
        this.set();
    }
    hide() {
        $('.custom').removeClass('active');
    }
    set() {
        let req = this.asset().req;
        if (!req) return;
        $('.custom-container .asset .counter').html('0');
        for (let i = 0; i < req.length; i++) {
            $('.custom-container .asset[data-uid=' + req[i].asset.uid + '] .counter').html(req[i].amount);
        }
    }
    load() {
        let htmlArray = [];
        let typeArray = [{
                key: 'Material',
                items: this.parent._assets.getByType('material')
            },
            {
                key: 'Craftable',
                items: this.parent._assets.getByType('craftable')
            },
            {
                key: 'Keys',
                items: this.parent._assets.getByType('keys')
            }
        ];
        let extraClass = '';
        for (let typeI = 0; typeI < typeArray.length; typeI++) {
            let items = typeArray[typeI].items;
            extraClass = typeI == 0 ? 'active' : '';
            htmlArray.push('<div class="spacer padding-lr-s padding-tb-s g50 flex layer-' + typeArray[typeI].key + '">');
            htmlArray.push('<div class="title"><strong>' + typeArray[typeI].key + '</strong></div>');
            for (let itemsI = 0; itemsI < items.length; itemsI++) {
                htmlArray.push('<div class="asset flex flex-align-center flex-space-between g100 padding-tb-s" data-uid="' + items[itemsI].uid + '">');
                htmlArray.push('<img width="40" src="' + items[itemsI].image.src + '" />');
                htmlArray.push('<span class="padding-tb-s padding-lr-s">' + items[itemsI].name + '</span>');
                htmlArray.push('<div class="flex"><button class="remove padding-tb-s padding-lr-s">-</button>');
                htmlArray.push('<span class="counter padding-tb-s padding-lr-s">0</span>');
                htmlArray.push('<button class="add padding-tb-s padding-lr-s">+</button></div>');
                htmlArray.push('</div>');
            }
            htmlArray.push('</div>');
        }
        $('.custom-container').append(htmlArray.join(''));
        this.mousehandler.add('.custom-container .asset .remove', 'click', 'remove');
        this.mousehandler.add('.custom-container .asset .add', 'click', 'add');
    }
}
