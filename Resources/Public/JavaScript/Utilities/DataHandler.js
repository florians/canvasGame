class DataHandler {
    constructor(parent) {
        this.parent = parent;
    }
    compress(data) {
        let dataArray = [],
            counter = 0,
            empty = false,
            uid = '',
            compressed = [];
        for (let row = 0; row < this.parent.height; row++) {
            for (let col = 0; col < this.parent.width; col++) {
                if (data.get(row, col).isEmpty) { // & data.get(row, col).req == 0
                    counter++;
                    uid = '';
                } else {
                    if (data.get(row, col).asset.type == 'portal') {
                        uid = data.get(row, col).asset.uid + "|" + data.get(row, col).level;
                    } else {
                        uid = data.get(row, col).asset.uid;
                    }
                    //console.log(data.get(row, col));
                    // if(data.get(row, col).req) {
                    //     // do stuff
                    // }
                }
                if (uid) {
                    if (counter > 0) {
                        dataArray.push("#" + counter);
                        counter = 0;
                    }
                    dataArray.push(uid);
                }
            }
        }
        if (counter > 0) {
            dataArray.push("#" + counter);
            counter = 0;
        }
        // set to 1 so that on comparison it's 1 + 1
        counter = 1;
        for (let i = 0; i < dataArray.length; i++) {
            if (isNaN(dataArray[i]) && dataArray[i].includes('#')) {
                compressed.push(dataArray[i]);
            } else {
                if (dataArray[i] == dataArray[i + 1]) {
                    counter++;
                } else {
                    if (counter == 1) {
                        compressed.push(dataArray[i]);
                        counter = 1;
                    } else if (counter > 1) {
                        compressed.push('#' + counter + "|" + dataArray[i]);
                        counter = 1;
                    }
                }
            }
        }
        return compressed.join(',');
    }
    extract(data) {
        let decompressedData = [],
            counter = 0,
            amount = 0,
            uid = 0,
            req = {},
            reqArray = [];
        data = data.split(',');
        for (let i = 0; i < data.length; i++) {
            req = {};
            // add emtpy fields when #number
            let firstChar = data[i].substring(0, 1);
            if (firstChar == "#") {
                if (data[i].includes('|')) {
                    data[i] = data[i].slice(1);
                    amount = data[i].split('|')[0]; // *
                    uid = data[i].split('|')[1]; // *
                    reqArray = data[i].split('|')[2];
                    if (reqArray) {
                        req = this.extractRequirements(reqArray);
                    }
                } else {
                    amount = data[i].slice(1);
                    uid = '';
                }
                for (let includes = 0; includes < amount; includes++) {
                    let dataArray = [];
                    if (Object.keys(req).length !== 0) {
                        dataArray.push(uid.trim());
                        dataArray.push(req);
                    } else {
                        dataArray = uid.trim();
                    }
                    decompressedData[counter] = dataArray;
                    counter++;
                }
            } else {
                // split on | when more data
                if (data[i].includes('|')) {
                    let dataArray = data[i].split('|');
                    if (dataArray[1].includes('#')) {
                        reqArray = data[i].split('|')[1];
                        if (reqArray) {
                            dataArray[1] = this.extractRequirements(reqArray);
                        }
                    }
                    decompressedData[counter] = dataArray;
                } else {
                    decompressedData[counter] = data[i].trim();
                }
                counter++;
            }
        }
        return decompressedData;
    }

    extractRequirements(reqArray) {
        let req = {};
        reqArray = reqArray.split(';');
        for (let reqI = 0; reqI < reqArray.length; reqI++) {
            let newReq = reqArray[reqI].slice(1);
            req[newReq.split('*')[1]] = newReq.split('*')[0];
        }
        return req;
    }
}
