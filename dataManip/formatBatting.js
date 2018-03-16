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
        res.g = l[5];
        res.ab = l[6];
        res.r = l[7];
        res.h = l[8];
        res['2b'] = l[9];
        res['3b'] = l[10];
        res.hr = l[11];
        res.rbi = l[12];
        res.sb = l[13];
        res.cs = l[14];
        res.bb = l[15];
        res.k = l[16];
        res.hbp = l[18];
        res.sf = l[20];
        res.avg = +(+res.h / +res.ab).toFixed(3);
        res.obp = +((+res.h + +res.bb + +res.hbp)/(+res.ab + +res.bb + +res.hbp + +res.sf)).toFixed(3);
        res.slg = +(((4 * +res.hr) + (3 * res['3b']) + (2 * res['2b']) + (+res.h - +res.hr - res['2b'] - res['3b']))/(+res.ab)).toFixed(3);
        res.ops = +(+res.obp + +res.slg).toFixed(3);

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
        lineAsArray.push(statLine.g);
        lineAsArray.push(statLine.ab);
        lineAsArray.push(statLine.r);
        lineAsArray.push(statLine.h);
        lineAsArray.push(statLine['2b']);
        lineAsArray.push(statLine['3b']);
        lineAsArray.push(statLine.hr);
        lineAsArray.push(statLine.rbi);
        lineAsArray.push(statLine.sb);
        lineAsArray.push(statLine.cs);
        lineAsArray.push(statLine.bb);
        lineAsArray.push(statLine.k);
        lineAsArray.push(statLine.hbp);
        lineAsArray.push(statLine.sf);
        lineAsArray.push(statLine.avg);
        lineAsArray.push(statLine.obp);
        lineAsArray.push(statLine.slg);
        lineAsArray.push(statLine.ops);

        const asString = lineAsArray.join(',');
        file += asString + '\n';
    })


    Fs.writeFile(Path.resolve(__dirname, './formattedBatting.csv'), file, (err) => {

        console.log('err?', err);
    })
}

writeBattingFile()


