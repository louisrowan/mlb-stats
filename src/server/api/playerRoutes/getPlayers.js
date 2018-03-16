'use strict';

const Fs = require('fs');
const Path = require('path');

const PlayersData = '../data/names.csv';


const internals = {};

internals.formatPlayerData = (stringData) => {

    const data = stringData.split(',');
    const res = {};
    res.id = data[0];
    res.fullName = data[3];
    res.debut = data[4];
    res.finalGame = data[5];
    res.positions = data[6] ? data[6].split('-') : [];
    res.teams = data[7] ? data[7].split('-').map((t) => {

        const split = t.split(':');
        return {
            name: split[0],
            abbreviation: split[1]
        }
    }) : [];

    return res;
}


module.exports = (req, res) => {

    const players = [];

    const raw = Fs.readFileSync(Path.resolve(__dirname, PlayersData));
    const stringified = raw.toString();

    stringified.split('\n').forEach((s) => {

        if (s) players.push(internals.formatPlayerData(s));
    });

    res.send(players);
};
