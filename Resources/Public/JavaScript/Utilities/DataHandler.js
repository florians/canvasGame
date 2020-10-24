class DataHandler {
    constructor(parent) {
        this.parent = parent;
    }
    compress(tiles) {
        let tileArray = [],
            counter = 0,
            empty = false,
            info = '';
        for (let row = 0; row < this.parent.getHeight(); row++) {
            for (let col = 0; col < this.parent.getWidth(); col++) {
                if (tiles.get(row, col).getIsEmpty()) {
                    counter++;
                    info = '';
                } else {
                    if (tiles.get(row, col).asset.getType() == 'portal') {
                        info = tiles.get(row, col).asset.getUid() + "|" + tiles.get(row, col).level;
                    } else {
                        info = tiles.get(row, col).asset.getUid();
                    }
                }
                if (info) {
                    if (counter > 0) {
                        tileArray.push("#" + counter);
                        counter = 0;
                    }
                    tileArray.push(info);
                }
            }
        }
        if (counter > 0) {
            tileArray.push("#" + counter);
            counter = 0;
        }
        return tileArray.join(',');
    }
    extract(data) {
        let decompressedData = [],
            counter = 0,
            amount = 0;
        data = data.split(',');
        for (let i = 0; i < data.length; i++) {
            // add emtpy fields when #number
            if (data[i].includes('#')) {
                amount = data[i].slice(1);
                for (let includes = 0; includes < amount; includes++) {
                    decompressedData[counter] = '';
                    counter++;
                }
            } else {
                // split on | when more data
                if (data[i].includes('|')) {
                    decompressedData[counter] = data[i].split('|');
                } else {
                    decompressedData[counter] = data[i];
                }
                counter++;
            }
        }
        return decompressedData;
    }
}
