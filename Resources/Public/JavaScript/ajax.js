var ajaxUrl = 'Resources/Private/PHP/ajax.php';

function ajaxHandler(callback, params) {
    return $.ajax({
        method: 'POST',
        url: ajaxUrl,
        data: params,
        success: function(result) {
            callback(result, params);
        },
        error: function(err) {
            console.log(err);
        }
    });
}
function ajaxHandlerFile(callback, params) {
    return $.ajax({
        method: 'POST',
        url: ajaxUrl,
        data: params,
        processData: false,
        contentType: false,
        success: function(result) {
            callback(result, params);
        },
        error: function(err) {
            console.log(err);
        }
    });
}
