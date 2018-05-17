'use strict';

const Season = require('./season');

module.exports = (req, res) => {

    const lineup = req.payload.lineup;
    if (lineup.length !== 9) {
        return res.status(400).send('Bad payload');
    }

    const season = new Season(lineup);
    return res.send(season.simulateSeason);
}