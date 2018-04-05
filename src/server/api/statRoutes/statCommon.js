'use strict';

const Data = require('../data');

const internals = {};


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


internals.getMatchingStats = ({
        stat,
        min,
        max,
        minAb,
        minIp,
        minYear,
        maxYear,
        type
    }) => {

    const indexedData = Data[`Indexed_${type}_${stat}_Data`];
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

            const ab_or_ip_performance = +result[2];
            const ab_or_ip_needed = minAb ? minAb : minIp;


            let year;
            try {
                year = +result[1].split('-')[1];
            }
            catch (err) {} // handle undefined

            if (ab_or_ip_performance >= ab_or_ip_needed &&
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





exports.getMinimumStatMatches = ({
    stats,
    minYear,
    maxYear,
    minAb,
    minIp,
    type
}) => {

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

        const results = internals.getMatchingStats({
            stat,
            min,
            max,
            minAb,
            minIp,
            minYear,
            maxYear,
            type
        });

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
    });

    return {
        minResults,
        additionalMatches
    }
}