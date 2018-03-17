'use strict';

const Fs = require('fs');
const Path = require('path');

const BattingData = '../data/formattedBatting.csv';
const Common = require('../common');



module.exports = (req, res) => {

    const start = Date.now();

    const playerId = req.params.id;
    const years = [];
    
    const raw = Fs.readFileSync(Path.resolve(__dirname, BattingData))
    const stringified = raw.toString();


    const battingStatsArray = stringified.split('\n');
    const idsOnly = battingStatsArray.map((str) => str.split(',')[0]);
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

    const splitMatchingStats = matchingStats.map((year) => year.split(','));

    const namesFile = Common.readNamesFile();
    const formattedMatchingStats = splitMatchingStats.map((year) => Common.formatBattingData(year, namesFile));

    res.send(formattedMatchingStats);
};
