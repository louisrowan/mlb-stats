'use strict';

const Fs = require('fs');
const Path = require('path');

const BattingLinesFile = Path.resolve(__dirname, '../data/formattedBatting.csv');

const Common = require('../common');



const internals = {};


internals.findBattingLine = (id) => {

    const split = id.split('-');
    const playerId = split[0];
    const year = split[1];
}


internals.findIndex = (statTotals, min, max) => {

    const length = statTotals.length;

    if (length === 1) {
        if (statTotals[0] >= min && statTotals[0] <= max) {
            return 0;
        }
        else {
            throw new Error(`no results found between ${min} and ${max}`);
        }
    }

    const midpoint = Math.floor(length / 2);

    if (statTotals[midpoint] >= min && statTotals[midpoint] <= max) {
        return midpoint;
    }

    if (statTotals[midpoint] > max) {
        return internals.findIndex(statTotals.slice(0, midpoint), min, max);
    }
    else {
        return midpoint + internals.findIndex(statTotals.slice(midpoint, length), min, max);
    }
}


internals.getMatchingStats = (stat, min, max) => {

    const file = Path.resolve(__dirname, `../data/indexed-${stat}.csv`);
    const raw = Fs.readFileSync(file, 'utf-8');
    const battingLines = raw.split('\n')

    const statTotals = battingLines.map((line) => +line.split(',')[0]);

    let startIndex;
    try {
        startIndex = internals.findIndex(statTotals, min, max);
    }
    catch (err) {}

    if (startIndex || startIndex === 0) {
        let beginIndex = startIndex;

        while (+statTotals[beginIndex] >= min) {
            --beginIndex;
        }

        let endIndex = startIndex;
        while (+statTotals[endIndex] <= max) {
            ++endIndex;
        }

        const results = battingLines.slice(beginIndex + 1, endIndex);

        const ids = results.map((result) => result.split(',')[1]);
        return ids;
    }
    return [];
}


module.exports = (req, res) => {

    // const payload = {
    //     stats: {
    //         hr: '40,100',
    //         sb: '40,200'
    //     }
    // };

    const payload = req.body.payload;

    if (!payload) {
        return res.status(400).send('Bad payload');
    }

    const stats = payload.stats;

    const battingLines = [];


    const rawBattingLinesFile = Fs.readFileSync(BattingLinesFile, 'utf-8').split('\n');
    const formattedBattingLines = rawBattingLinesFile.map((line) => line.split(','));

    Object.keys(stats).forEach((stat) => {

        const splitStats = stats[stat].split(',');
        const min = +splitStats[0];
        const max = +splitStats[1];

        const results = internals.getMatchingStats(stat, min, max);

        results.forEach((id) => {

            try {

                const splitId = id.split('-');
                const playerId = splitId[0];
                const year = splitId[1];

                const index = Common.findBattingLineByIdYear(formattedBattingLines, playerId, year);

                const player = Common.formatBattingData(formattedBattingLines[index]);

                battingLines.push(player);
            }
            catch (err) {
                console.log('missing data for', id);
            } // skip bad data
        })
    })

    console.log('count before filter', battingLines.length);

    let count = 0;

    const filteredLines = battingLines.filter((line) => {

        if (count > 99) { return false; };

        let match = true;

        Object.keys(stats).forEach((stat) => {

            const splitStats = stats[stat].split(',');
            const min = +splitStats[0];
            const max = +splitStats[1];

            if (+line[stat] < min || +line[stat] > max) {
                match = false;
            }
        })
        if (match) {
            ++count
            return true;
        }
        return false;
    })

    console.log('res?', filteredLines);


    res.send(filteredLines);
};
