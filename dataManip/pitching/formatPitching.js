'use strict';

const Fs = require('fs');
const Path = require('path');

const PitchingCSV = Path.resolve(__dirname, './unformattedPitching.csv');


const internals = {
    formatInnings: (outs) => {

        try {
            outs = +outs;
        }
        catch (err) {
            return 0;
        }

        if (!outs) {
            return 0;
        };

        const innings = (outs / 3);

        return (Math.round(innings * 100) / 100);
    },
    calculateFip: (obj) => {

        try {

            const hr = +obj.hr || 0;
            const hbp = +obj.hbp || 0;
            const bb = +obj.bb || 0;
            const k = +obj.k || 0;
            const ip = +obj.ip || 0;

            const a = (13 * hr) + (3 * (hbp + bb)) - (2 * k);
            const b = ip;
            const fip = (a / b) + 3.2;
            return (Math.round(fip * 100) / 100);
        }
        catch (err) {
            return 0;
        }
    }
}


const createPlayerByYearArray = () => {

    const playerByYearArray = [];
    const data = Fs.readFileSync(PitchingCSV, 'utf-8');

    const statLines = data.split('\n').slice(1);

    statLines.forEach((line) => {

        const l = line.split(',');
        const res = {};

        const id = l[0];
        res.id = id;
        res.year = l[1];
        res.teamId = l[3];
        res.w = l[5];
        res.l = l[6];
        res.g = l[7];
        res.gs = l[8];
        res.cg = l[9];
        res.sho = l[10];
        res.sv = l[11];
        res.ip = internals.formatInnings(l[12]).toString();
        res.h = l[13];
        res.er = l[14];
        res.hr = l[15];
        res.bb = l[16];
        res.k = l[17];
        res.oba = l[18];
        res.era = l[19];
        res.hbp = l[22];
        res.fip = internals.calculateFip(res).toString();

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
    });
    return sortedArray;
}

const writePitchingFile = () => {

    const sortedArray = createPlayerByYearArray();

    let file = '';

    sortedArray.forEach((l) => {

        const lineAsArray = [];
        lineAsArray.push(l.id);
        lineAsArray.push(l.year);
        lineAsArray.push(l.teamId);
        lineAsArray.push(l.w);
        lineAsArray.push(l.l);
        lineAsArray.push(l.g);
        lineAsArray.push(l.gs);
        lineAsArray.push(l.cg);
        lineAsArray.push(l.sho);
        lineAsArray.push(l.sv);
        lineAsArray.push(l.ip);
        lineAsArray.push(l.h);
        lineAsArray.push(l.er);
        lineAsArray.push(l.hr);
        lineAsArray.push(l.bb);
        lineAsArray.push(l.k);
        lineAsArray.push(l.oba);
        lineAsArray.push(l.era);
        lineAsArray.push(l.hbp);
        lineAsArray.push(l.fip);

        const asString = lineAsArray.join(',');
        file += asString + '\n';
    });

    Fs.writeFile(Path.resolve(__dirname, './formattedPitching.csv'), file, (err) => {

        if (err) {
            console.log('error writing pitching to file', err);
        }
    });
}


writePitchingFile();