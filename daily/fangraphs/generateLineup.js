'use strict';

const { DATE } = require('./');


const Fs = require('fs');
const Path = require('path');
const SalariesPath = Path.resolve(__dirname, './fixtures/salaries_' + DATE + '.csv');
const salaries = Fs.readFileSync(SalariesPath, 'utf-8').split('\n');


const readSalaries = () => {

    return salaries.map(sal => {

        const s = sal.split(',');
        const player = {};

        player.position = s[0];
        player.name = s[2];
        player.salary = +s[5];
        player.game = s[6];
        player.team = s[7];
        player.averagePoints = +s[8];

        return player;
    });
}




exports.battersWithSalaries = (batters) => {

    const battersWithSalaries = batters.map((b) => {

        const allSalaries = readSalaries();

        const salary = allSalaries.find(s => s.name === b.name);

        if (!salary) {
            return;
        };

        return {
            ...b,
            ...salary
        }
    }).filter(mapped => mapped !== undefined);

    return battersWithSalaries;
}


exports.pitchersWithSalaries = (pitchers) => {

    const pitchersWithSalaries = pitchers.map((p) => {

        const allSalaries = readSalaries();

        const salary = allSalaries.find(s => s.name === p.name);

        if (!salary) {
            return;
        };

        return {
            ...p,
            ...salary,
            totalPoints: salary.averagePoints
        }
    }).filter(mapped => mapped !== undefined);

    return pitchersWithSalaries;
}



const lineup = {
    'C': 1,
    '1B': 1,
    '2B': 1,
    'SS': 1,
    '3B': 1,
    'OF': 3
}

const MAX_SALARY = 50000;


const filterPositions = (players, buffer) => {

    return players.filter(p => {

        let betterPlayers = 0;

        for (let i = 0; i < players.length; ++i) {

            const player = players[i];

            if (p.name === player.name) {
                continue;
            }

            if (p.totalPoints < player.totalPoints && p.salary > player.salary) {
                ++betterPlayers;
            }
        }

        if (betterPlayers > buffer) {
            console.log('filter out', p.name, p.position);
            return false;
        }
        return true;
    });
}



exports.generate = (battersWithSalaries, pitchersWithSalaries) => {

    const sorted = battersWithSalaries.sort((a, b) => {

        return a.pointsPerK > b.pointsPerK ? -1 : 1
    }).filter(b => b.total.AB > 80);

    console.log('total player', sorted.length);
    
    const catchers = filterPositions(sorted.filter(p => p.position === 'C'), 0);
    const firstBasemen = filterPositions(sorted.filter(p => p.position === '1B'), 0);
    const secondBasemen = filterPositions(sorted.filter(p => p.position === '2B'), 0);
    const thirdBasemen = filterPositions(sorted.filter(p => p.position === '3B'), 0);
    const shortStops = filterPositions(sorted.filter(p => p.position === 'SS'), 0);
    const outfielders = filterPositions(sorted.filter(p => p.position === 'OF'), 2);
    const pitchers = filterPositions(pitchersWithSalaries, 1);

    const start = Date.now();
    let perms = 0;
    let highestSoFar = 0;
    let highestLineup = [];

    for (let catcherI = 0; catcherI < catchers.length; ++catcherI) {

        const catcher = catchers[catcherI];

        console.log('catcher', catcherI + 1, '/', catchers.length);
        console.log(Date.now() - start);
        console.log('');

        for (let firstBasemenI = 0; firstBasemenI < firstBasemen.length; ++firstBasemenI) {

            const firstBaseman = firstBasemen[firstBasemenI];

            for (let secondBasemenI = 0; secondBasemenI < secondBasemen.length; ++secondBasemenI) {

                const secondBaseman = secondBasemen[secondBasemenI];

                for (let thirdBasemenI = 0; thirdBasemenI < thirdBasemen.length; ++thirdBasemenI) {

                    const thirdBaseman = thirdBasemen[thirdBasemenI];

                    for (let shortStopI = 0; shortStopI < shortStops.length; ++shortStopI) {

                        const shortStop = shortStops[shortStopI];

                        for (let outfielder1I = 0; outfielder1I < outfielders.length - 2; ++outfielder1I) {

                            const outfielder1 = outfielders[outfielder1I];

                            for (let outfielder2I = outfielder1I + 1; outfielder2I < outfielders.length - 1; ++outfielder2I) {

                                const outfielder2 = outfielders[outfielder2I];

                                for (let outfielder3I = outfielder1I + 2; outfielder3I < outfielders.length; ++outfielder3I) {

                                    const outfielder3 = outfielders[outfielder3I];

                                    if (outfielder1.name === outfielder2.name ||
                                        outfielder2.name === outfielder3.name ||
                                        outfielder1.name === outfielder3.name) {
                                        ++perms;
                                        continue;
                                    }


                                    for (let pitcher1I = 0; pitcher1I < pitchers.length - 1; ++pitcher1I) {

                                        const pitcher1 = pitchers[pitcher1I];

                                        for (let pitcher2I = pitcher1I + 1; pitcher2I < pitchers.length; ++pitcher2I) {

                                            const pitcher2 = pitchers[pitcher2I];

                                            if (pitcher1.name === pitcher2.name) {
                                                ++perms;
                                                continue;
                                            }

                                            const lineup = [
                                                catcher,
                                                firstBaseman,
                                                secondBaseman,
                                                thirdBaseman,
                                                shortStop,
                                                outfielder1,
                                                outfielder2,
                                                outfielder3,
                                                pitcher1,
                                                pitcher2
                                            ]

                                            const totalPoints = lineup.reduce((total, player) => total += player.totalPoints, 0);
                                            const totalSalary = lineup.reduce((total, player) => total += player.salary, 0);

                                            if (totalPoints > highestSoFar && totalSalary < MAX_SALARY) {
                                                highestSoFar = totalPoints;
                                                highestLineup = lineup;
                                            }
                                            ++perms;

                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    console.log('time', Date.now() - start, 'perms', perms)

    highestLineup.forEach(p => {

        const isPitcher = !p.spotInOrder;

        const FIP = !isPitcher && p.opponent.FIP && p.opponent.xFIP ? (+p.opponent.FIP + +p.opponent.xFIP)/2 : 'N/A';

        console.log(
            p.position.padEnd(5, ' '),
            p.name.padEnd(15, ' '),
            p.totalPoints.toFixed(2).padEnd(5, ' '),
            p.salary.toString().padEnd(5, ' '),
            !isPitcher ? p.opponent.name.padEnd(15, ' ') : '',
            !isPitcher ? `FIP: ${FIP}`.padEnd(10, ' ') : ''
        );
    })

    console.log('');
    console.log('total points:', highestLineup.reduce((total, player) => total += player.totalPoints, 0));
    console.log('total salary:', highestLineup.reduce((total, player) => total += player.salary, 0));

}

