class DataHandler {
    constructor(parent) {
        this.parent = parent;
    }
    compress(assets) {
        let assetArray = [],
            counter = 0,
            empty = false,
            uid = '',
            compressed = [];
        for (let row = 0; row < this.parent.getHeight(); row++) {
            for (let col = 0; col < this.parent.getWidth(); col++) {
                if (assets.get(row, col).getIsEmpty()) {
                    counter++;
                    uid = '';
                } else {
                    if (assets.get(row, col).asset.getType() == 'portal') {
                        uid = assets.get(row, col).asset.getUid() + "|" + assets.get(row, col).level;
                    } else {
                        uid = assets.get(row, col).asset.getUid();
                    }
                }
                if (uid) {
                    if (counter > 0) {
                        assetArray.push("#" + counter);
                        counter = 0;
                    }
                    assetArray.push(uid);
                }
            }
        }
        if (counter > 0) {
            assetArray.push("#" + counter);
            counter = 0;
        }
        // set to 1 so that on comparisson it's 1 + 1
        counter = 1;
        for (let i = 0; i < assetArray.length; i++) {
            if (assetArray[i].includes('#')) {
                compressed.push(assetArray[i]);
            } else {
                if (assetArray[i] == assetArray[i + 1]) {
                    counter++;
                } else {
                    if (counter == 1) {
                        compressed.push(assetArray[i]);
                        counter = 1;
                    } else if (counter > 1) {
                        compressed.push('#' + counter + "|" + assetArray[i]);
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
