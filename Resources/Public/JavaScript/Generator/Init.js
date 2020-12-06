const gameBaseUrl = 'Resources/Public/Images/Floor/',
    _ctx = document.getElementById('world').getContext('2d', {
        desynchronized: true,
        alpha: false
    });

let _generator = new Generator(generatorType);

/***********************************
 ************* resize ***************
 ***********************************/
window.addEventListener('resize', function() {
    _generator.resize();
});
