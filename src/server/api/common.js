'use strict';

const findBattingLineById = (array, id) => {

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
        return findBattingLineById(array.slice(0, midpoint), id);
    }
    else {
        return midpoint + findBattingLineById(array.slice(midpoint, length), id);
    }
}


const findBattingLineByIdYear = (battingLines, id, year) => {


    const length = battingLines.length;
    if (length === 1) {
        if (battingLines[0][0] === id && battingLines[0][1] === year) {
            return 0;
        }
        else {
            console.error('ID not found:', id)
            return new Error('id not found', id);
        }
    }

    const midpoint = Math.floor(length / 2);
    const isIdMatch = battingLines[midpoint][0] === id;

    if (isIdMatch && battingLines[midpoint][1] === year) {
        return midpoint;
    }
    if (battingLines[midpoint][0] > id || (isIdMatch && battingLines[midpoint][1] > year)) {
        return findBattingLineByIdYear(battingLines.slice(0, midpoint), id, year);
    }
    else {
        return midpoint + findBattingLineByIdYear(battingLines.slice(midpoint, length), id, year);
    }
}

const formatBattingData = (data) => {

    const res = {};
    res.id = data[0]
    res.year = data[1];
    res.teamId = data[2]
    res.g = data[3];
    res.ab = data[4];
    res.r = data[5];
    res.h = data[6];
    res['2b'] = data[7];
    res['3b'] = data[8];
    res.hr = data[9];
    res.rbi = data[10];
    res.sb = data[11];
    res.cs = data[12];
    res.bb = data[13];
    res.k = data[14];
    return res;
}


module.exports = {
    findBattingLineById,
    findBattingLineByIdYear,
    formatBattingData
}