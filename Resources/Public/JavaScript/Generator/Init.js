const gameBaseUrl = 'Resources/Public/Images/Floor/',
    _ctxWorld = document.getElementById('world').getContext('2d', {
        desynchronized: true,
        alpha: true
    });
    if(document.getElementById('grid')){
        _ctxGrid = document.getElementById('grid').getContext('2d', {
            desynchronized: true,
            alpha: true
        });
    }
    _ctxLoader = document.getElementById('loader').getContext('2d', {
        desynchronized: true
    });
    _ctxLoader.canvas.width = 100;
    _ctxLoader.canvas.height = 100;

let _generator = new Generator(generatorType);

/***********************************
 ************* resize ***************
 ***********************************/
window.addEventListener('resize', function() {
    _generator.resize();
});
