class Loader {
    constructor(obj) {
        this.promises = [];
        this.progress = 0;
        this.max = 0;
        this.step = 0;
        this.txt = '';
        this.ajaxHandler = new AjaxHandler();
        this.obj = obj;
    }
    clear() {
        this.promises = [];
    }
    add(type, name, params) {
        if (type == 'data') {
            this.promises.push(this.ajaxHandler.getData(name, params));
        }
        if (type == 'file') {
            this.promises.push(this.ajaxHandler.getFile(name, params));
        }
    }
    getObj() {
        return this.obj;
    }
    setObj(obj) {
        this.obj = obj;
    }
    run() {
        if (this.promises) {
            Promise.all(this.promises).then((result) => {
                this.getObj().preloaderResult(result);
            }).then((result) => {
                this.clear();
            }).catch((error) => {
                console.error(error);
            });
        }
    }
    // max steps the progressbar can have
    addMax(max) {
        this.max = max;
    }
    addStep() {
        this.step++;
        this.paint();
    }
    addText(txt) {
        //$('.loaderBar .text').html(txt);
        if (document.querySelector('.loaderBar .text')) {
            document.querySelector('.loaderBar .text').innerHTML = txt;
        }
    }
    removeText() {
        //$('.loaderBar .text').html('');
        if (document.querySelector('.loaderBar .text')) {
            document.querySelector('.loaderBar .text').innerHTML = '';
        }
    }
    hide(){
        document.body.classList.add('remove-loaderBar');
    }
    reset() {
        this.progress = 0;
        this.step = 0;
        this.max = 0;
        this.removeText();
        this.paint();
    }
    paint() {
        if (this.max != 0) {
            this.progress = (100 / this.max) * this.step;
            //$('.loaderBar .bar').css('width', this.progress + '%');
            if (document.querySelector('.loaderBar .bar')) {
                document.querySelector('.loaderBar .bar').style.width = this.progress + '%';
            }
        } else {
            //$('.loaderBar .bar').css('width', '0%');
            if (document.querySelector('.loaderBar .bar')) {
                document.querySelector('.loaderBar .bar').style.width = '0%';
            }
        }
    }
    showProgress() {
        console.log(this.progress);
    }
}
