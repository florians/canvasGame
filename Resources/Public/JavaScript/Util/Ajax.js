class AjaxHandler {
    constructor() {
        this.url = 'Resources/Private/PHP/Ajax.php';
    }
    getData(name, params) {
        return new Promise((resolve, reject) => {
            return $.ajax({
                method: 'POST',
                url: this.url,
                data: params,
                success: function(r) {
                    let result = JSON.parse(r);
                    if (result.type == 'success') {
                        resolve({
                            name: name,
                            data: result
                        });
                    } else {
                        reject(result.msg);
                    }
                },
                error: function(err) {
                    reject(err);
                }
            });
        });
    }
    getFile(name, params) {
        return new Promise((resolve, reject) => {
            return $.ajax({
                method: 'POST',
                url: this.url,
                data: params,
                processData: false,
                contentType: false,
                success: function(r) {
                    let result = JSON.parse(r);
                    if (result.type == 'success') {
                        resolve({
                            name: name,
                            data: result
                        });
                    } else {
                        reject(result.msg);
                    }
                },
                error: function(err) {
                    reject(err);
                }
            });
        });
    }
}




var ajaxUrl = 'Resources/Private/PHP/Ajax.php';

function ajaxHandler(callback, params) {
    return $.ajax({
        method: 'POST',
        url: ajaxUrl,
        data: params,
        success: function(result) {
            var result = JSON.parse(result)
            if (callback) {
                callback(result, params);
            }
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
            var result = JSON.parse(result)
            if (callback) {
                callback(result, params);
            }
        },
        error: function(err) {
            console.log(err);
        }
    });
}
