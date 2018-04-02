'use strict';

const Common = require('../common');
const Data = require('../data');


module.exports = (req, res) => {

    const playerId = req.params.id;

    const namesFile = Data.NamesFile;
    const battingStatsArray = Data.BattingLinesFile;

    let indexInArray;
    try {
        indexInArray = Common.getIndexFromId(battingStatsArray, playerId);
    }
    catch (err) {
        return [];
    }

    let startIndex = indexInArray;
    while (battingStatsArray[startIndex][0] === playerId) {
        --startIndex;
    }

    let endIndex = indexInArray;
    while (battingStatsArray[endIndex][0] === playerId) {
        ++endIndex;
    }

    const matchingStats = battingStatsArray.slice(startIndex + 1, endIndex);
    const formattedMatchingStats = matchingStats.map((year) => Common.formatBattingData(year, namesFile));

    res.send(formattedMatchingStats);
};
