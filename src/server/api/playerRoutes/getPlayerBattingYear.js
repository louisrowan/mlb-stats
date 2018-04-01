'use strict';

const Common = require('../common');
const Data = require('../data');


module.exports = (req, res) => {

    const playerId = req.params.id;
    const year = req.params.year;

    const namesFile = Data.NamesFile;
    const battingStatsArray = Data.BattingLinesFile;

    let indexInArray;
    try {
        indexInArray = Common.findBattingLineByIdYear(battingStatsArray, playerId, year);
    }
    catch (err) {
        return [];
    }

    res.send(Common.formatBattingData(battingStatsArray[indexInArray], namesFile));
};
