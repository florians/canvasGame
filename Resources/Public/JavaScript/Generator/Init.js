const gameBaseUrl = 'Resources/Public/Images/Floor/',
    _ctx = document.getElementById('world').getContext('2d');

let _generator = new Generator(generatorType);

/***********************************
 ************* resize ***************
 ***********************************/
$(window).resize(function() {
    _generator.resize();
});
