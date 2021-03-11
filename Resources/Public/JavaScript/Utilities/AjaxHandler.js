class AjaxHandler {
    constructor() {
        this.url = 'Resources/Private/PHP/Ajax.php';
    }
    getData(name, params) {
        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            xhr.open("POST", this.url, true);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.onreadystatechange = function() {
                if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                    let result = JSON.parse(this.response);
                    if (result.state == 'success') {
                        result.name = name;
                        //
                        resolve(result);
                    } else {
                        reject(result.msg);
                    }
                }
            }
            xhr.onerror = function() {
                reject(this);
            };
            let paramsUrlEncoded = Object.entries(params).map(([key, val]) => `${key}=${val}`).join('&');
            xhr.send(paramsUrlEncoded);
        });
    }
    // needs fixing
    getFile(name, params) {
        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            xhr.open("POST", this.url, true);
            //xhr.setRequestHeader("Content-Type", "multipart/form-data");
            xhr.onreadystatechange = function() {
                if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                    let result = JSON.parse(this.response);
                    if (result.state == 'success') {
                        resolve({
                            name: name,
                            data: result
                        });
                    } else {
                        reject(result.msg);
                    }
                }
            }
            xhr.onerror = function() {
                reject(this);
            };
            xhr.send(params);
        });
    }
}
