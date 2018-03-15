'use strict';

// input is
// a. raw file / split file
// b. stat min
// c. stat max

// output:
// array of playerId-yearIds

const Fs = require('fs');
const Path = require('path');

const HRs = (Path.resolve(__dirname, '../dataManip/indexedStats/indexed-hr.csv'));

const raw = Fs.readFileSync(HRs, 'utf-8');



const internals = {};

internals.findInRange = (array, num) => {

    
}




const mySuperAwesomeFunction = (rawFile, statMin, statMax) => {

    const rawStatLines = rawFile.split('\n');
    const formattedStatLines = rawStatLines.map((l) => l.split(','));

    const startIndex = internals.findInRange(formattedStatLines, statMin);


}