'use strict';

const Data = require('../data');


const internals = {};

internals.showByRank = (players, stats) => {

    let results = [];
    Object.keys(players).forEach((id) => {

        const player = players[id];

        let qualified = true;
        stats.forEach((obj) => {

            const name = obj.name;
            const value = obj.rank;

            if (player[name].rank > value) {
                qualified = false;
            }
        })
        if (qualified) {
            results.push(player);
        }
    })
    return results
};

module.exports = (req, res) => {

    const data = Data.FangraphsPitchingData;

    let stats = [];
    const payload = req.body.payload;
    Object.keys(payload.stats).forEach((stat) => {

        const rank = payload.stats[stat];
        stats.push({
            name: stat,
            rank
        });
    });

    const results = internals.showByRank(data, stats);

    res.send(results);
};
