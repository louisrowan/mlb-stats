'use strict';

const { expect } = require('code');
const { describe, it } = exports.lab = require('lab').script();

const Common = require('../../../src/server/api/common');


const internals = {
    battingLineArray: [
        'nixontr01',
        '2008',
        'NYN',
        '11',
        '35',
        '2',
        '6',
        '1',
        '0',
        '1',
        '1',
        '1',
        '0',
        '6',
        '9',
        '0',
        '0',
        '0.171',
        '0.293',
        '0.286',
        '0.579'
    ],
    namesFile: Common.readNamesFile()
}


describe('server - api - common.js', () => {

    // it('findBattingLineByIdYear - fetch index from id and year', (done) => {

    //     const result = Common.findBattingLineByIdYear()
    // })

    it('formatBattingData - formats batting line array', (done) => {

        const result = Common.formatBattingData(internals.battingLineArray, internals.namesFile);

        expect(result.name).to.equal('Trot Nixon');
        expect(result.year).to.equal(2008);
        expect(result.age).to.equal(34);
        expect(result.teamId).to.equal('NYN');
        expect(result.g).to.equal(11);
        expect(result.ab).to.equal(35);
        expect(result.r).to.equal(2);
        expect(result.h).to.equal(6);
        expect(result['2b']).to.equal(1);
        expect(result['3b']).to.equal(0);
        expect(result.hr).to.equal(1);
        expect(result.rbi).to.equal(1);
        expect(result.sb).to.equal(1);
        expect(result.cs).to.equal(0);
        expect(result.bb).to.equal(6);
        expect(result.k).to.equal(9);
        expect(result.hbp).to.equal(0);
        expect(result.sf).to.equal(0);
        expect(result.avg).to.equal(0.171);
        expect(result.obp).to.equal(0.293);
        expect(result.slg).to.equal(0.286);
        expect(result.ops).to.equal(0.579);

        done();
    });
})