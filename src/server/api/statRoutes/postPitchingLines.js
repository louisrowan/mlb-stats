'use strict';

const Common = require('../common');
const Data = require('../data');






module.exports = (req, res) => {

    const payload = req.body.payload;

    if (!payload) {
        return res.status(400).send('Bad payload');
    }

    console.log('');
    const start = Date.now()
    console.log('request received to post pitching Lines:', payload);

    // format payload
    const stats = payload.stats;
    const minIp = +payload.minIp;
    const minYear = +payload.minYear;
    const maxYear = +payload.maxYear;
    const minAge = +payload.minAge || 0;
    const maxAge = +payload.maxAge || 100;

    const pitchingLines = [];

    const namesFile = Data.NamesFile;
    const formattedPitchingLines = Data.PitchingLinesFile;

}