class Fullscreen {
    constructor() {
        // The page is not in an iframe
        this.doc = window.document;
        this.docEl = this.doc.documentElement;
        this.requestFullScreen = this.docEl.requestFullscreen || this.docEl.mozRequestFullScreen || this.docEl.webkitRequestFullScreen || this.docEl.msRequestFullscreen;
        this.cancelFullScreen = this.doc.exitFullscreen || this.doc.mozCancelFullScreen || this.doc.webkitExitFullscreen || this.doc.msExitFullscreen;
    }
    toggle() {
        if (!this.doc.fullscreenElement && !this.doc.mozFullScreenElement && !this.doc.webkitFullscreenElement && !this.doc.msFullscreenElement) {
            if (!document.body.classList.contains('isFullscreen')) {
                this.requestFullScreen.call(this.docEl);
                document.body.classList.add('isFullscreen');
            }
        } else {
            if (document.body.classList.contains('isFullscreen')) {
                this.cancelFullScreen.call(this.doc);
                document.body.classList.remove('isFullscreen');
            }
        }
    }
}
