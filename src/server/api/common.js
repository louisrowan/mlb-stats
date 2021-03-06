'use strict';

const _ = require('lodash');

const internals = {};


// @purpose
// take in array of player info and a playerId, where playerId is in first position, recursively find player info from a given playerId
// @params
// namesArray: [ 'bondeje01',
//   'Jeremy',
//   'Bonderman',
//   'Jeremy Bonderman',
//   '2003-04-02',
//   '2013-09-21',
//   'P',
//   'Detroit Tigers:DET-Seattle Mariners:SEA',
//   '1982'
// ]
// id: bondsba01
// @return: int or error
const getIndexFromId =  (namesArray, id) => {

    const length = namesArray.length;

    if (length === 1) {
        if (namesArray[0][0] === id) {
            return 0;
        }
        else {
            throw new Error('Id not found in Common.getIndexFromId:', id);
        }
    }

    const midpoint = Math.floor(length / 2);

    if (namesArray[midpoint][0] === id) {
        return midpoint;
    }

    if (namesArray[midpoint][0] > id) {
        return getIndexFromId(namesArray.slice(0, midpoint), id);
    }
    else {
        return midpoint + getIndexFromId(namesArray.slice(midpoint, length), id);
    }
}


// @purpose
// take in percentage stat like OBP and properly format with corrent # of decimal places
// @params
// stat: .30
// @return formatted string .300
internals.formatPercentageStat = (stat) => {

    if (!stat.includes('.')) {
        return '0.000';
    }

    if (stat[0] === '0') {
        return _.padEnd(stat.substring(1, stat.length), 4, '0');
    }
    return _.padEnd(stat, 5, '0');
};



// @purpose
// take in array of playerIds and find index of a select id
// @params
// array: [aardsda01]
// id: bondsba01
// @return
// int or error
// const findStatLineById = (array, id) => {

//     const length = array.length;
//     if (length === 1) {
//         if (array[0] === id) {
//             return 0;
//         }
//         else {
//             console.error('ID not found:', id)
//             return new Error('id not found', id);
//         }
//     }

//     const midpoint = Math.floor(length / 2);

//     if (array[midpoint] === id) {
//         return midpoint;
//     }
//     if (array[midpoint] > id) {
//         return findStatLineById(array.slice(0, midpoint), id);
//     }
//     else {
//         return midpoint + findStatLineById(array.slice(midpoint, length), id);
//     }
// }


// @purpose
// find index of a full batting line from a given playerId and year
// @params
// battingLines: [ 'suzukic01',
//   '2001',
//   'SEA',
//   '157',
//   '692',
//   '127',
//   '242',
//   '34',
//   '8',
//   '8',
//   '69',
//   '56',
//   '14',
//   '30',
//   '53',
//   '8',
//   '4',
//   '0.35',
//   '0.381',
//   '0.457',
//   '0.838'
// ]
// id: suzukic01
// year: 2004
// @return
// int or error
const findStatLineByIdYear = (statLines, id, year) => {

    const length = statLines.length;
    if (length === 1) {
        if (statLines[0][0] === id && statLines[0][1] === year) {
            return 0;
        }
        else {
            console.error('ID not found:', id)
            return new Error('id not found', id);
        }
    }

    const midpoint = Math.floor(length / 2);
    const isIdMatch = statLines[midpoint][0] === id;

    if (isIdMatch && statLines[midpoint][1] === year) {
        return midpoint;
    }
    if (statLines[midpoint][0] > id || (isIdMatch && statLines[midpoint][1] > year)) {
        return findStatLineByIdYear(statLines.slice(0, midpoint), id, year);
    }
    else {
        return midpoint + findStatLineByIdYear(statLines.slice(midpoint, length), id, year);
    }
}


// @purpose
// format a given battingLine array into a formatted battingLine object
// @params
// data: [ 'nixontr01',
//   '2008',
//   'NYN',
//   '11',
//   '35',
//   '2',
//   '6',
//   '1',
//   '0',
//   '1',
//   '1',
//   '1',
//   '0',
//   '6',
//   '9',
//   '0',
//   '0',
//   '0.171',
//   '0.293',
//   '0.286',
//   '0.579'
// ]
// namesFile: file with id/name mapping
// @return
// formatted battingLine object
const formatBattingData = (data, namesFile) => {

    const id = data[0];
    const index = getIndexFromId(namesFile, id);
    const year = data[1];
    const birthYear = namesFile[index][8];

    const res = {};
    res.name = namesFile[index][3];
    res._id = id;
    res.age = +year - +birthYear;
    res.year = +year;
    res.teamId = data[2];
    res.g = +data[3] || 0;
    res.ab = +data[4] || 0;
    res.r = +data[5] || 0;
    res.h = +data[6] || 0;
    res['2b'] = +data[7] || 0;
    res['3b'] = +data[8] || 0;
    res.hr = +data[9] || 0;
    res.rbi = +data[10] || 0;
    res.sb = +data[11] || 0;
    res.cs = +data[12] || 0;
    res.bb = +data[13] || 0;
    res.k = +data[14] || 0;
    res.hbp = +data[15] || 0;
    res.sf = +data[16] || 0;
    res.avg = +(internals.formatPercentageStat(data[17])) || .000;
    res.obp = +(internals.formatPercentageStat(data[18])) || .000;
    res.slg = +(internals.formatPercentageStat(data[19])) || .000;
    res.ops = +(internals.formatPercentageStat(data[20])) || .000;

    return res;
}


const formatPitchingData = (data, namesFile) => {

    const id = data[0];
    const index = getIndexFromId(namesFile, id);
    const year = data[1];
    const birthYear = namesFile[index][8];

    const res = {};
    res.name = namesFile[index][3];
    res._id = id;
    res.age = +year - +birthYear;
    res.year = +year;
    res.teamId = data[2];
    res.w = +data[3] || 0;
    res.l = +data[4] || 0;
    res.g = +data[5] || 0;
    res.gs = +data[6] || 0;
    res.cg = +data[7] || 0;
    res.sho = +data[8] || 0;
    res.sv = +data[9] || 0;
    res.ip = +data[10] || 0;
    res.h = +data[11] || 0;
    res.er = +data[12] || 0;
    res.hr = +data[13] || 0;
    res.bb = +data[14] || 0;
    res.k = +data[15] || 0;
    res.oba = +data[16] || 0;
    res.era = +data[17] || 0;
    res.hbp = +data[18] || 0;
    res.fip = +data[19] || 0;

    return res;
}


module.exports = {
    // findStatLineById,
    getIndexFromId,
    findStatLineByIdYear,
    formatBattingData,
    formatPitchingData
}