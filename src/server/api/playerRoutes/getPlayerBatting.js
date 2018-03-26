'use strict';

const Fs = require('fs');
const Path = require('path');

const BattingData = '../data/formattedBatting.csv';
const Common = require('../common');
const Data = require('../data');



module.exports = (req, res) => {

    const playerId = req.params.id;

    const namesFile = Data.NamesFile;
    const battingStatsArray = Data.BattingLinesFile;

    const idsOnly = battingStatsArray.map((str) => str[0]);
    const indexInArray = Common.findBattingLineById(idsOnly, playerId);

    let startIndex = indexInArray;
    while (idsOnly[startIndex] === playerId) {
        --startIndex;
    }

    let endIndex = indexInArray;
    while (idsOnly[endIndex] === playerId) {
        ++endIndex;
    }

    const matchingStats = battingStatsArray.slice(startIndex + 1, endIndex);
    const formattedMatchingStats = matchingStats.map((year) => Common.formatBattingData(year, namesFile));

    res.send(formattedMatchingStats);
};
