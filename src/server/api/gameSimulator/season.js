'use strict';

const Game = require('./game');

const internals = {
    statsToTrack: [
        'ab',
        'hr',
        '3b',
        '2b',
        'h',
        'bb',
        'r',
        'rbi'
    ]
}

class Season {
    constructor(lineup, settings) {

        this._settings = settings;
        this._lineup = lineup;
    }

    simulateSeason(games = 162) {

        let allResults = [];
        let teamRuns = 0;

        for (let i = 0; i < games; ++i) {
            const g = new Game(this._lineup);
            teamRuns += g._teamRuns;
            allResults = allResults.concat(g.results());
        }

        const playerResults = {};
        allResults.forEach((result) => {

            let player = playerResults[result.id];

            if (!player) {
                player = playerResults[result.id] = {};
                internals.statsToTrack.forEach((stat) => {
                    player[stat] = 0;
                });
            }

            Object.keys(player).forEach((stat) => {

                player[stat] += result[stat];
            });
        });

        Object.keys(playerResults).forEach((name) => {

            const player = playerResults[name];
            player['avg'] = (player.h/player.ab).toFixed(3);
            player['obp'] = ((player.h + player.bb)/(player.ab + player.bb)).toFixed(3);
            player['slg'] = ((4 * player.hr +
                            3 * player['3b'] +
                            2 * player['2b'] +
                            (player.h -
                                player.hr -
                                player['2b'] -
                                player['3b'])
                            )/player.ab).toFixed(3);
            player.ops = (+player.obp + +player.slg).toFixed(3);
        });

        return {
            playerResults,
            teamRuns
        };
    }
}

const sampleLineup = [
    {
        id: 'johnnyDamon',
        ab: 621,
        hr: 20,
        bb: 76,
        h: 189,
        '2b': 35,
        '3b': 6,
        gidp: 10
    },
    {
        id: 'billMueller',
        ab: 399,
        hr: 12,
        bb: 51,
        h: 113,
        '2b': 27,
        '3b': 1,
        gidp: 10
    },
    {
        id: 'mannyRamirez',
        ab: 568,
        hr: 43,
        bb: 82,
        h: 175,
        '2b': 44,
        '3b': 0,
        gidp: 10
    },
    {
        id: 'davidOrtiz',
        ab: 582,
        hr: 41,
        bb: 75,
        h: 175,
        '2b': 47,
        '3b': 3,
        gidp: 10
    },
    {
        id: 'kevinMillar',
        ab: 508,
        hr: 18,
        bb: 57,
        h: 151,
        '2b': 36,
        '3b': 0,
        gidp: 10
    },
    {
        id: 'trotNixon',
        ab: 149,
        hr: 6,
        bb: 15,
        h: 47,
        '2b': 9,
        '3b': 1,
        gidp: 10
    },
    {
        id: 'jasonVaritek',
        ab: 463,
        hr: 18,
        bb: 62,
        h: 137,
        '2b': 30,
        '3b': 1,
        gidp: 10
    },
    {
        id: 'markBellhorn',
        ab: 523,
        hr: 17,
        bb: 88,
        h: 138,
        '2b': 37,
        '3b': 3,
        gidp: 10
    },
    {
        id: 'gabeKapler',
        ab: 290,
        hr: 6,
        bb: 15,
        h: 79,
        '2b': 14,
        '3b': 1,
        gidp: 10
    },
]

// const s = new Season(sampleLineup);
// s.simulateSeason();

module.exports = Season;
