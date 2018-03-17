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


internals.getMatchingStats = (stat, min, max, minAb) => {

    const file = Path.resolve(__dirname, `../data/indexedStats/indexed-${stat}.csv`);
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
        const filteredResults = results.filter((result) => result.split(',')[2] >= minAb);
        const ids = filteredResults.map((result) => result.split(',')[1]);
        return ids;
    }
    return [];
}


module.exports = (req, res) => {

    const payload = req.body.payload;

    if (!payload) {
        return res.status(400).send('Bad payload');
    }

    console.log('');
    const start = Date.now()
    console.log('request received to post batting Lines:', payload);


    // format payload
    const stats = payload.stats;
    const minAb = payload.minAb;
    const battingLines = [];
    const namesFile = Common.readNamesFile();


    // read in batting lines file for later use
    const rawBattingLinesFile = Fs.readFileSync(BattingLinesFile, 'utf-8').split('\n');
    const formattedBattingLines = rawBattingLinesFile.map((line) => line.split(','));



    // prepare stat params
    const firstStat = {};
    const additionalMatches = [];
    let minCount;
    let minStat = '';
    Object.keys(stats).forEach((stat) => {

        const splitStats = stats[stat].split(',');
        const min = +splitStats[0];
        const max = +splitStats[1];

        const results = internals.getMatchingStats(stat, min, max, minAb);
        const count = results.length;

        if (!minCount || count < minCount) {
            minCount = count;
            minStat = stat;
        }
    });

    Object.keys(stats).forEach((stat) => {

        if (stat === minStat) {
            firstStat.stat = stat;
            firstStat.params = stats[stat];
        }
        else {
            additionalMatches.push({
                stat: stat,
                params: stats[stat]
            });
        }
    })

    // get stats for first stat
    const splitStats = firstStat.params.split(',');
    const min = +splitStats[0];
    const max = +splitStats[1];
    const results = internals.getMatchingStats(firstStat.stat, min, max, minAb);

    // loop thru each match for first stat
    let count = 0;
    results.forEach((id) => {

        if (count > 99) return; // max 100 results for now

        try {

            const splitId = id.split('-');
            const playerId = splitId[0];
            const year = splitId[1];

            // find batting line index and locate correct batting line
            const index = Common.findBattingLineByIdYear(formattedBattingLines, playerId, year);
            const player = Common.formatBattingData(formattedBattingLines[index], namesFile);

            // loop thru additional stats in payload to see if they are also a match
            let matchesAll = true;
            additionalMatches.forEach((match) => {

                const splitStats = match.params.split(',');
                const min = +splitStats[0];
                const max = +splitStats[1];

                if (player[match.stat] < min || player[match.stat] > max) {
                    matchesAll = false;
                }
            })

            if (matchesAll) {
                ++count
                battingLines.push(player)
            };
        }
        catch (err) {
            console.log('error in post batting data', id, err);
        }
    });

    console.log('total time:', Date.now() - start);

    res.send(battingLines);
};
