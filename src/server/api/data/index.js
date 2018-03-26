'use strict';

const Fs = require('fs');
const Path = require('path');

const NamesCSV = Path.resolve(__dirname, './names.csv');
const BattingLinesCSV = Path.resolve(__dirname, './formattedBatting.csv');


const internals = {};

internals.readNamesFile = () => {

    const file = Fs.readFileSync(NamesCSV, 'utf-8').split('\n');
    return file.map((line) => line.split(','));
};


internals.readBattingLinesFile = () => {

    const file = Fs.readFileSync(BattingLinesCSV, 'utf-8').split('\n');
    return file.map((line) => line.split(','));
};



const NamesFile = internals.readNamesFile();
const BattingLinesFile = internals.readBattingLinesFile();


module.exports = {
    NamesFile,
    BattingLinesFile
};
