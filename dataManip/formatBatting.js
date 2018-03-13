'use strict';

const Fs = require('fs');
const Path = require('path');

const BattingCsv = Path.resolve(__dirname, './batting.csv');

const createPlayerByYearArray = () => {

    const playerByYearArray = [];
    const data = Fs.readFileSync(BattingCsv, 'utf-8');

    const statLines = data.split('\n').slice(1);

    statLines.forEach((line) => {

        const l = line.split(',');
        const res = {};

        const id = l[0];
        res.id = id;
        res.year = l[1];
        res.teamId = l[3];
        res.games = l[5];
        res.atBats = l[6];
        res.runs = l[7];
        res.hits = l[8];
        res.doubles = l[9];
        res.triples = l[10];
        res.homeRuns = l[11];
        res.rbi = l[12];
        res.sb = l[13];
        res.cs = l[14];
        res.bb = l[15];
        res.k = l[16];

        if (id) playerByYearArray.push(res);
    })

    const sortedArray = playerByYearArray.sort((a, b) => {

        if (a.id > b.id) {
            return 1;
        }
        if (a.id === b.id && a.year > b.year) {
            return 1;
        }
        return -1;
    })
    return sortedArray;
}

const writeBattingFile = () => {

    const sortedArray = createPlayerByYearArray();

    let file = '';

    sortedArray.forEach((statLine) => {

        const lineAsArray = [];
        lineAsArray.push(statLine.id);
        lineAsArray.push(statLine.year);
        lineAsArray.push(statLine.teamId);
        lineAsArray.push(statLine.games);
        lineAsArray.push(statLine.atBats);
        lineAsArray.push(statLine.runs);
        lineAsArray.push(statLine.hits);
        lineAsArray.push(statLine.doubles);
        lineAsArray.push(statLine.triples);
        lineAsArray.push(statLine.homeRuns);
        lineAsArray.push(statLine.rbi);
        lineAsArray.push(statLine.sb);
        lineAsArray.push(statLine.cs);
        lineAsArray.push(statLine.bb);
        lineAsArray.push(statLine.k);

        const asString = lineAsArray.join(',');
        file += asString + '\n';
    })


    Fs.writeFile(Path.resolve(__dirname, './formattedBatting.csv'), file, (err) => {

        console.log('err?', err);
    })
}

writeBattingFile()


