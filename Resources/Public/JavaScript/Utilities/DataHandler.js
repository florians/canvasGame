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
                if (data.get(row, col).isEmpty) {
                    counter++;
                    uid = '';
                } else {
                    if (data.get(row, col).asset.type == 'portal') {
                        uid = data.get(row, col).asset.uid + "|" + data.get(row, col).level;
                    } else {
                        uid = data.get(row, col).asset.uid;
                    }
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
            uid = 0;
        data = data.split(',');
        for (let i = 0; i < data.length; i++) {
            // add emtpy fields when #number
            if (data[i].includes('#')) {
                if (data[i].includes('|')) {
                    data[i] = data[i].slice(1);
                    amount = data[i].split('|')[0];
                    uid = data[i].split('|')[1];
                } else {
                    amount = data[i].slice(1);
                    uid = '';
                }
                for (let includes = 0; includes < amount; includes++) {
                    decompressedData[counter] = uid.trim();
                    counter++;
                }
            } else {
                // split on | when more data
                if (data[i].includes('|')) {
                    decompressedData[counter] = data[i].split('|');
                } else {
                    decompressedData[counter] = data[i].trim();
                }
                counter++;
            }
        }
        return decompressedData;
    }
}
