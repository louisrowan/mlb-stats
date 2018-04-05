'use strict';

const Fs = require('fs');
const Path = require('path');
const PitchingStats = Path.resolve(__dirname, './formattedPitching.csv');

const stats = [
    // { name: 'w', index: 3 },
    { name: 'l', index: 4 },
    { name: 'g', index: 5 },
    { name: 'gs', index: 6 },
    { name: 'cg', index: 7 },
    { name: 'sho', index: 8 },
    { name: 'sv', index: 9 },
    { name: 'ip', index: 10 },
    { name: 'h', index: 11 },
    { name: 'hr', index: 13 },
    { name: 'bb', index: 14 },
    { name: 'k', index: 15 },
    { name: 'oba', index: 16 },
    { name: 'era', index: 17 },
    { name: 'hbp', index: 18 },
    { name: 'fip', index: 19 }
];


const createStatArray = (splitFile, statName, statIndex) => {

    console.log('start with', statName);

    const unsortedArray = [];

    splitFile.forEach((line) => {

        const l = line.split(',');

        const playerId = l[0];
        const year = l[1];

        const serializedData = {
            id: playerId + '-' + year,
            [statName]: isNaN(l[statIndex]) ? 0 : l[statIndex],
            ip: l[10]
        }

        unsortedArray.push(serializedData);
    });

    return {
        sortedArray: unsortedArray.sort((a, b) => +a[statName] > +b[statName] ? 1 : -1),
        statName
    };
}

const readData = () => {

    const raw = Fs.readFileSync(PitchingStats, 'utf-8');
    return raw.split('\n');
}


const data = readData();

const results = stats.map((s) => {

    return createStatArray(data, s.name, s.index);
});

results.forEach((result) => {

    const { sortedArray, statName } = result;

    let file = '';
    const destination = Path.resolve(__dirname, `./indexedStats/indexed-${statName}.csv`);

    sortedArray.forEach((obj) => {

        const str = `${obj[statName]},${obj.id},${obj.ip}\n`;
        file += str;
    });

    Fs.writeFile(destination, file, (err) => {

        if (err) {
            console.log('error writing to', destination);
        }
    })
});