function handleFullscreen() {
    // The page is not in an iframe
    var doc = window.document,
        docEl = doc.documentElement,
        requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen,
        cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

    if (!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
        if (!$('body').hasClass('isFullscreen')) {
            requestFullScreen.call(docEl);
            $('body').addClass('isFullscreen');
        }
    } else {
        if ($('body').hasClass('isFullscreen')) {
            cancelFullScreen.call(doc);
            $('body').removeClass('isFullscreen');
        }
    }
}

$('.fullscreen').on('click', function() {
    handleFullscreen();
});
