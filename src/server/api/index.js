'use strict';

const Fs = require('fs');
const Path = require('path');
const Routes = require('express').Router();
const PlayersData = './data/names.csv';
const BattingData = './data/batting.csv';


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

internals.formatBattingData = (data) => {

    const res = {};
    res.year = data[1];
    res.games = data[5];
    res.atBats = data[6];
    res.runs = data[7];
    res.hits = data[8];
    res.doubles = data[9];
    res.triples = data[10];
    res.homeRuns = data[11];
    res.rbi = data[12];
    res.sb = data[13];
    res.cs = data[14];
    res.bb = data[15];
    res.k = data[16];
    return res;
}


Routes.get('/players', (req, res) => {

    const players = [];

    const raw = Fs.readFileSync(Path.resolve(__dirname, PlayersData));
    const stringified = raw.toString();

    stringified.split('\n').forEach((s) => {

        if (s) players.push(internals.formatPlayerData(s));
    });

    res.send(players);
});

Routes.get('/player/:id/batting', (req, res) => {

    const playerId = req.params.id;
    
    const streamingData = Fs.createReadStream(Path.resolve(__dirname, BattingData))

    const years = [];
    let headersSeen = false;

    streamingData.on('readable', () => {

        const data = streamingData.read();

        if (data && headersSeen) {

            const stringified = data.toString();
            stringified.split('\n').forEach((s) => {

                const splitData = s.split(',');

                if (splitData[0] == playerId) years.push(internals.formatBattingData(splitData));
            })
        }
        if (!headersSeen) headersSeen = true;
    });

    streamingData.on('end', (err) => {

        res.send(years);
    });
})

module.exports = Routes;
