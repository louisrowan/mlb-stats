'use strict';

const Common = require('../common');
const Data = require('../data');


module.exports = (req, res) => {

    const playerId = req.params.id;
    const year = req.params.year;

    const namesFile = Data.NamesFile;
    const pitchingStatsArray = Data.PitchingLinesFile;

    let indexInArray;
    try {
        indexInArray = Common.findStatLineByIdYear(pitchingStatsArray, playerId, year);
    }
    catch (err) {
        return [];
    }

    res.send(Common.formatPitchingData(pitchingStatsArray[indexInArray], namesFile));
};
