'use strict';

const Fs = require('fs');
const Path = require('path');

const NamesCSV = Path.resolve(__dirname, './names.csv');
const BattingLinesCSV = Path.resolve(__dirname, './formattedBatting.csv');
const PitchingLinesCSV = Path.resolve(__dirname, './formattedPitching.csv');

const internals = {
    battingStats: [
        'avg',
        'h',
        'hr',
        'obp',
        'ops',
        'rbi',
        'sb',
        'slg'
    ],
    pitchingStats: [
        'bb',
        'cg',
        'era',
        'fip',
        'g',
        'gs',
        'h',
        'hbp',
        'hr',
        'ip',
        'k',
        'l',
        'oba',
        'sho',
        'sv',
        'w'
    ]
};

internals.readNamesFile = () => {

    const file = Fs.readFileSync(NamesCSV, 'utf-8').split('\n');
    return file.map((line) => line.split(','));
};


internals.readBattingLinesFile = () => {

    const file = Fs.readFileSync(BattingLinesCSV, 'utf-8').split('\n');
    return file.map((line) => line.split(','));
};

internals.readPitchingLinesFile = () => {

    const file = Fs.readFileSync(PitchingLinesCSV, 'utf-8').split('\n');
    return file.map((line) => line.split(','));
};


const NamesFile = exports.NamesFile = internals.readNamesFile();
const BattingLinesFile = exports.BattingLinesFile = internals.readBattingLinesFile();
const PitchingLinesFile = exports.PitchingLinesFile = internals.readPitchingLinesFile();

internals.battingStats.forEach((stat) => {

    const pathToCSV = Path.resolve(__dirname, `./indexedBattingStats/indexed-${stat}.csv`);
    const file = Fs.readFileSync(pathToCSV, 'utf-8').split('\n');
    const result = file.map((line) => line.split(','));
    exports[`Indexed_Batting_${stat}_Data`] = result;
});

internals.pitchingStats.forEach((stat) => {

    const pathToCSV = Path.resolve(__dirname, `./indexedPitchingStats/indexed-${stat}.csv`);
    const file = Fs.readFileSync(pathToCSV, 'utf-8').split('\n');
    const result = file.map((line) => line.split(','));
    exports[`Indexed_Pitching_${stat}_Data`] = result;
});

