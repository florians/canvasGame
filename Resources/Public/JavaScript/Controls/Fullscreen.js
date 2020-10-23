class Fullscreen {
    constructor() {
        // The page is not in an iframe
        this.doc = window.document;
        this.docEl = this.doc.documentElement;
        this.requestFullScreen = this.docEl.requestFullscreen || this.docEl.mozRequestFullScreen || this.docEl.webkitRequestFullScreen || this.docEl.msRequestFullscreen;
        this.cancelFullScreen = this.doc.exitFullscreen || this.doc.mozCancelFullScreen || this.doc.webkitExitFullscreen || this.doc.msExitFullscreen;
    }
    toggle(){
        if (!this.doc.fullscreenElement && !this.doc.mozFullScreenElement && !this.doc.webkitFullscreenElement && !this.doc.msFullscreenElement) {
            if (!$('body').hasClass('isFullscreen')) {
                this.requestFullScreen.call(this.docEl);
                $('body').addClass('isFullscreen');
            }
        } else {
            if ($('body').hasClass('isFullscreen')) {
                this.cancelFullScreen.call(this.doc);
                $('body').removeClass('isFullscreen');
            }
        }
    }
}
// 
// const fullscreen = new Fullscreen();
//
// $('.fullscreen').on('click', function() {
//     fullscreen.toggle();
// });
