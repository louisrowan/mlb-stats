'use strict';

const StatCommon = require('./statCommon');


module.exports = (req, res) => {

    console.log(req.body.payload);

    const type = 'Batting';
    const payload = req.body.payload;
    if (!payload) {
        return res.status(400).send('Bad payload');
    }


    // format payload
    const stats = payload.stats;
    const minAb = +payload.minAbIp;
    const minYear = +payload.minYear;
    const maxYear = +payload.maxYear;
    const minAge = +payload.minAge || 0;
    const maxAge = +payload.maxAge || 100;


    const {
        minResults,
        additionalMatches
    } = StatCommon.getMinimumStatMatches({
        stats,
        minYear,
        maxYear,
        minAb,
        type
    });


    const battingLines = StatCommon.filterInitialMatchingStats({
        minResults,
        additionalMatches,
        minAge,
        maxAge,
        type
    });

    res.send(battingLines);
};
