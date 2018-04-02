'use strict';

const Fs = require('fs');
const Path = require('path');

const Common = require('../common');
const Data = require('../data');



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


internals.getMatchingStats = (stat, min, max, minAb, minYear, maxYear) => {

    const indexedData = Data[`Indexed_${stat}_Data`];
    const statTotals = indexedData.map((line) => +line[0]);

    let startIndex;
    try {
        startIndex = internals.findIndex(statTotals, min, max);
    }
    catch (err) {}

    if (startIndex || startIndex === 0) {
        let beginIndex = startIndex;

        while (statTotals[beginIndex] >= min) {
            --beginIndex;
        }

        let endIndex = startIndex;
        while (statTotals[endIndex] <= max) {
            ++endIndex;
        }

        const results = indexedData.slice(beginIndex + 1, endIndex);
        const filteredResults = results.filter((result) => {

            const ab = +result[2];

            let year;
            try {
                year = +result[1].split('-')[1];
            }
            catch (err) {} // handle undefined

            if (ab >= minAb &&
                year >= minYear &&
                year <= maxYear) {
                return true;
            }
            return false;
        });
        const ids = filteredResults.map((result) => result[1]);
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
    const minAb = +payload.minAb;
    const minYear = +payload.minYear;
    const maxYear = +payload.maxYear;
    const minAge = +payload.minAge || 0;
    const maxAge = +payload.maxAge || 100;

    const battingLines = [];

    const namesFile = Data.NamesFile;
    const formattedBattingLines = Data.BattingLinesFile;

    // prepare stat params
    const firstStat = {};
    const additionalMatches = [];
    let minCount;
    let minStat = '';
    let minResults = [];
    Object.keys(stats).forEach((stat) => {

        const splitStats = stats[stat].split(',');
        const min = +splitStats[0];
        const max = +splitStats[1];

        const results = internals.getMatchingStats(stat, min, max, minAb, minYear, maxYear);
        const count = results.length;

        if (!minCount || count < minCount) {
            minCount = count;
            minStat = stat;
            minResults = results;
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

    // loop thru each match for first stat
    let count = 0;
    minResults.forEach((id) => {

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
            if (+player.age < minAge || +player.age > maxAge) matchesAll = false;
            additionalMatches.forEach((match) => {

                if (!matchesAll) return;

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
            res.send([]);
        }
    });

    console.log('total time:', Date.now() - start);

    res.send(battingLines);
};
