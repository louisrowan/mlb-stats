'use strict';

const Data = require('../data');

module.exports = (req, res) => {

    const stats = Object.keys(Data.FangraphsPitchingStats).map((index) => {

        return Data.FangraphsPitchingStats[index];
    })

    res.send(stats);
};
