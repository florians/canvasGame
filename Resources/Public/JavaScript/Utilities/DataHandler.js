class DataHandler {
    constructor(parent) {
        this.parent = parent;
    }
    compress(data) {
        let dataArray = [],
            counter = 0,
            empty = false,
            elementString = '',
            compressed = [];
        for (let row = 0; row < this.parent.height; row++) {
            for (let col = 0; col < this.parent.width; col++) {
                if (data.get(row, col).isEmpty) { // & data.get(row, col).req == 0
                    counter++;
                    elementString = '';
                } else {
                    if (data.get(row, col).asset.type == 'portal') {
                        elementString = data.get(row, col).asset.uid + '|' + data.get(row, col).level;
                    } else if (data.get(row, col).req.length > 0) {
                        elementString = data.get(row, col).asset.uid;
                        let req = data.get(row, col).req;
                        let reqArray = [];
                        for (let i = 0; i < req.length; i++) {
                            if (req[i].amount > 0) {
                                reqArray.push(req[i].amount + '*' + req[i].asset.uid);
                            }
                        }
                        if (reqArray.length > 0) {
                            elementString += '|' + reqArray.join('/');
                        }
                    } else {
                        elementString = data.get(row, col).asset.uid;
                    }
                }
                if (elementString) {
                    if (counter > 0) {
                        dataArray.push(counter + '*0');
                        counter = 0;
                    }
                    dataArray.push(elementString);
                }
            }
        }
        if (counter > 0) {
            dataArray.push(counter + '*0');
            counter = 0;
        }
        // set to 1 so that on comparison it's 1 + 1
        counter = 1;
        for (let i = 0; i < dataArray.length; i++) {
            if (isNaN(dataArray[i]) && dataArray[i].includes('*')) {
                compressed.push(dataArray[i]);
            } else {
                if (dataArray[i] == dataArray[i + 1]) {
                    counter++;
                } else {
                    if (counter == 1) {
                        compressed.push(dataArray[i]);
                        counter = 1;
                    } else if (counter > 1) {
                        compressed.push(counter + '*' + dataArray[i]);
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
            if (data[i].includes('*') && !data[i].includes('|')) {
                amount = data[i].split('*')[0];
                uid = data[i].split('*')[1];
                for (let includes = 0; includes < amount; includes++) {
                    decompressedData[counter] = parseInt(uid.trim());
                    counter++;
                }
            } else {
                // split on | when more data
                if (data[i].includes('|')) {
                    decompressedData[counter] = data[i].split('|');

                } else {
                    decompressedData[counter] = parseInt(data[i].trim());
                }
                counter++;
            }
        }
        return decompressedData;
    }
}
