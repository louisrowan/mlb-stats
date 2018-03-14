'use strict';

const Fs = require('fs');
const Path = require('path');

const BattingData = '../data/formattedBatting.csv';



const internals = {};

internals.formatBattingData = (data) => {

    const res = {};
    res.id = data[0]
    res.year = data[1];
    res.teamId = data[2]
    res.games = data[3];
    res.atBats = data[4];
    res.runs = data[5];
    res.hits = data[6];
    res.doubles = data[7];
    res.triples = data[8];
    res.homeRuns = data[9];
    res.rbi = data[10];
    res.sb = data[11];
    res.cs = data[12];
    res.bb = data[13];
    res.k = data[14];
    return res;
}

internals.findId = (array, id) => {

    const length = array.length;
    if (length === 1) {
        if (array[0] === id) {
            return 0;
        }
        else {
            console.error('ID not found:', id)
            return new Error('id not found', id);
        }
    }

    const midpoint = Math.floor(length / 2);

    if (array[midpoint] === id) {
        return midpoint;
    }
    if (array[midpoint] > id) {
        return internals.findId(array.slice(0, midpoint), id);
    }
    else {
        return midpoint + internals.findId(array.slice(midpoint, length), id);
    }
}


module.exports = (req, res) => {

    const start = Date.now();

    const playerId = req.params.id;
    const years = [];
    
    const raw = Fs.readFileSync(Path.resolve(__dirname, BattingData))
    const stringified = raw.toString();


    const battingStatsArray = stringified.split('\n');
    const idsOnly = battingStatsArray.map((str) => str.split(',')[0]);
    const indexInArray = internals.findId(idsOnly, playerId);

    let startIndex = indexInArray;
    while (idsOnly[startIndex] === playerId) {
        --startIndex;
    }

    let endIndex = indexInArray;
    while (idsOnly[endIndex] === playerId) {
        ++endIndex;
    }

    const matchingStats = battingStatsArray.slice(startIndex + 1, endIndex);

    const splitMatchingStats = matchingStats.map((year) => year.split(','));
    const formattedMatchingStats = splitMatchingStats.map((year) => internals.formatBattingData(year));

    res.send(formattedMatchingStats);
};
