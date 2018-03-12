'use strict';

const Fs = require('fs');
const Path = require('path');
const Routes = require('express').Router();
const PlayersData = './data/players.csv';
const BattingData = './data/batting.csv';


const internals = {};

internals.formatPlayerData = (stringData) => {

    const data = stringData.split(',');
    const res = {};
    res.id = data[0];
    res.birthYear = data[1];
    res.fullName = data[13] + " " + data[14];
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

    const streamingData = Fs.createReadStream(Path.resolve(__dirname, PlayersData));

    const players = [];
    let headersSeen = false;

    streamingData.on('readable', () => {

        const data = streamingData.read();

        if (data && headersSeen) {

            const stringified = data.toString();
            stringified.split('\n').forEach((s) => {

                players.push(internals.formatPlayerData(s));
            });
        }
        if (!headersSeen) headersSeen = true;
    })

    streamingData.on('end', (err) => {

        res.send(players);
    })
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
