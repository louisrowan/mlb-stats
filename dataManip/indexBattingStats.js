'use strict';

// purpose: create list sorted by HR total with
// HR | playerId

const Fs = require('fs');
const Path = require('path');

const BattingStats = Path.resolve(__dirname, './formattedBatting.csv');

const start = Date.now()

const createSortedHrArray = () => {

    const unsortedArray = [];

    const raw = Fs.readFileSync(BattingStats, 'utf-8');
    const statLines = raw.split('\n');

    statLines.forEach((line) => {

        const l = line.split(',');

        const id = l[0];
        const hr = l[9];

        unsortedArray.push({ id, hr });
    });

    return unsortedArray.sort((a, b) => +a.hr > +b.hr ? 1 : -1);
}

const writeArrayToFile = (array) => {

    let file = '';
    const destination = Path.resolve(__dirname, './indexedStats/indexedHomeRuns.csv');

    array.forEach((obj) => {

        const str = `${obj.hr},${obj.id}\n`;
        file += str;
    });

    Fs.writeFile(destination, file, (err) => {

        console.log(`err writing to ${destination}?:`, err);
    });
}

const arr = createSortedHrArray();
writeArrayToFile(arr);