'use strict';

class Game {
    constructor(lineup, settings) {

        this._settings = settings;
        this._lineup = this.formatLineup(lineup);

        this._atBat = 0; // index denoting current batter
        this._inning = 0;
        this._outs = 0;
        this._runnersOn = [0,0,0]; // bases
        this._teamRuns = 0;

        this.start();
    }

    runnersOn () {

        let baserunner = false;
        this._runnersOn.forEach((base) => {

            if (base !== 0) baserunner = true;
        });
        return baserunner;
    }

    formatLineup (lineup) {

        return lineup.map((player) => {

            const plateAppearances = player.ab + player.bb;

            const p = {};

            p.id = player.id;
            p.hrChance = (player.hr/plateAppearances);
            p.tripleChance = (player['3b']/plateAppearances);
            p.doubleChance = (player['2b']/plateAppearances);
            p.singleChance = ((player.h - player.hr - player['2b'] - player['3b'])/plateAppearances);
            p.bbChance = (player.bb/plateAppearances);
            p.gidpChance = (player.gidp/(player.ab - player.h))

            p.results = {
                ab: 0,
                hr: 0,
                '3b': 0,
                '2b': 0,
                h: 0,
                bb: 0,
                r: 0,
                rbi: 0,
            }

            return p;
        });
    }

    start () {

        this.playInning()
    }

    playInning () {

        while (this._inning < 9) {
            ++this._inning;
            // console.log();
            // console.log('new inning:', this._inning);
            this._outs = 0;
            this._runnersOn = [0,0,0];
            while (this._outs < 3) {
                this.playAtBat()
            }
            // console.log('runs:', this._teamRuns);
        }
        this.endGame()
    }

    playAtBat () {

        if (this._atBat > 8) {
            this._atBat = 0; // wrap around to start of lineup
        }

        const batter = this._lineup[this._atBat];
        const rand = Math.random();

        let result;
        if (rand < batter.hrChance) {
            result = 'hr';
            this.advanceRunners(batter, 4, true);
        }
        else if (rand < batter.hrChance + batter.tripleChance) {
            result = '3b';
            this.advanceRunners(batter, 3, true);
        }
        else if (rand < batter.hrChance + batter.tripleChance + batter.doubleChance) {
            result = '2b';
            this.advanceRunners(batter, 2, true);
        }
        else if (rand < batter.hrChance + batter.tripleChance + batter.doubleChance + batter.singleChance) {
            result = '1b';
            this.advanceRunners(batter, 1, true);
        }
        else if (rand < batter.hrChance + batter.tripleChance + batter.doubleChance + batter.singleChance + batter.bbChance) {
            result = 'bb';
            this.advanceRunners(batter, 1, false);
        }
        else {
            result = 'out';
            this.handleOut(batter);
        }
        ++this._atBat;
    }

    advanceRunners (batter, bases, force) {

        let newRunnersOn = [];

        if (force) { // handle hits

            newRunnersOn = [0,0,0];

            const rand = Math.random();
            let extraBase = 0;
            if (rand > .5) { // determines how often baserunners take extra base on hits
                extraBase = 1;
            }

            this._runnersOn.forEach((baseRunner, base) => {

                let newPosition
                if (baseRunner) {
                    newPosition = base + bases + extraBase;

                    if (newPosition > 2) {
                        baseRunner.results.r += 1;
                        this._teamRuns += 1;
                        batter.results.rbi += 1;
                    }
                    else {
                        newRunnersOn[newPosition] = baseRunner;
                    }
                }
            });
            if (bases < 4) {
                newRunnersOn[bases - 1] = batter;
            }
        }
        else { // handle walk and hbp
            newRunnersOn = this._runnersOn.slice(0);
            if (this._runnersOn[0]) {
                newRunnersOn[1] = this._runnersOn[0];

                if (this._runnersOn[1]) {
                    newRunnersOn[2] = this._runnersOn[1];

                    if (this._runnersOn[2]) {
                        this._runnersOn[2].results.r += 1;
                        batter.results.rbi += 1;
                        this._teamRuns += 1;
                    }
                }
            }
            newRunnersOn[0] = batter;
        };

        if (bases === 4) {
            batter.results.h += 1;
            batter.results.hr += 1;
            batter.results.r += 1;
            batter.results.rbi += 1;
            batter.results.ab += 1;
            this._teamRuns += 1;
        }
        if (bases === 3) {
            batter.results.h += 1;
            batter.results.ab += 1;
            batter.results['3b'] += 1;
        }
        if (bases === 2) {
            batter.results.h += 1;
            batter.results.ab += 1;
            batter.results['2b'] += 1;
        }
        if (bases === 1 && force) {
            batter.results.h += 1;
            batter.results.ab += 1;
        }
        if (bases === 1 && !force) {
            batter.results.bb += 1;
        }

        this._runnersOn = newRunnersOn;
    }

    handleOut (batter) {

        const rand = Math.random();

        if (this._outs < 2 && this.runnersOn()) { // determine double play



        }

        batter.results.ab += 1;
        ++this._outs
        return;
    }

    endGame () {
        return
    }

    results () {
        return this._lineup.map((l) => Object.assign({}, l.results, { id: l.id }));
    }
}


module.exports = Game;
