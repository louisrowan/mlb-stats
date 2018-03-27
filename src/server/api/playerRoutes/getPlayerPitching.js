'use strict';

const Fs = require('fs');
const Path = require('path');

const Common = require('../common');
const Data = require('../data');

module.exports = (req, res) => {

    const playerId = req.params.id;

    const namesFile = Data.NamesFile;
    const pitchingStatsArray = Data.PitchingLinesFile;

    let indexInArray;
    try {
        indexInArray = Common.getIndexFromId(pitchingStatsArray, playerId);
    }
    catch (err) {
        return [];
    }

    let startIndex = indexInArray;
    while (pitchingStatsArray[startIndex][0] === playerId) {
        --startIndex;
    }

    let endIndex = indexInArray;
    while (pitchingStatsArray[endIndex][0] === playerId) {
        ++endIndex;
    }

    const matchingStats = pitchingStatsArray.slice(startIndex + 1, endIndex);
    const formattedMatchingStats = matchingStats.map((year) => Common.formatPitchingData(year, namesFile));

    res.send(formattedMatchingStats);
};
