'use strict'

const Fs = require('fs');
const Path = require('path');
const BattingStats = Path.resolve(__dirname, './formattedBatting.csv');


const stats = [
    // { name: 'hr', index: 9 },
    // { name: 'rbi', index: 10 },
    // { name: 'sb', index: 11 },
    // { name: 'h', index: 6 }
    { name : 'avg', index: 17 },
    { name : 'obp', index: 18 },
    { name : 'slg', index: 19 },
    { name : 'ops', index: 20 },
];


const createStatArray = (splitFile, statName, statIndex) => {

    console.log('start with', statName);

    const unsortedArray = [];

    splitFile.forEach((line) => {

        const l = line.split(',');

        const pair = {
            id: l[0] + "-" + l[1],
            [statName]: isNaN(l[statIndex]) ? 0 : l[statIndex]
        }

        unsortedArray.push(pair);
    });

    return {
        sortedArray: unsortedArray.sort((a, b) => +a[statName] > +b[statName] ? 1 : -1),
        statName: statName
    };
}


const readData = () => {

    const raw = Fs.readFileSync(BattingStats, 'utf-8');
    return raw.split('\n');
}


const data = readData();


const results = stats.map((s) => {

    return createStatArray(data, s.name, s.index);
})


results.forEach((result) => {

    const { sortedArray, statName } = result;

    let file = '';
    const destination = Path.resolve(__dirname, `./indexedStats/indexed-${statName}.csv`);

    sortedArray.forEach((obj) => {

        const str = `${obj[statName]},${obj.id}\n`;
        file += str;
    });

    Fs.writeFile(destination, file, (err) => {

        console.log(`err writing to ${destination}?:`, err);
    });
});
