'use strict';

const Fs = require('fs');
const Path = require('path');


const internals = {
    negativeStats: [
        'ERA',
        'H',
        'R',
        'ER',
        'HR',
        'BB',
        'IBB',
        'HBP',
        'BB/9',
        'AVG',
        'BABIP',
        'FIP',
        'HR/FB',
        'O-Contact%',
        'Z-Contact%',
        'Contact%',
        'BB%'
    ]
};

const files = [
    './fangraphs_pitching_2017.csv'
];

const file = Path.resolve(__dirname, files[0]);


const format = (file) => {

    const rawFile = Fs.readFileSync(file, 'utf-8').replace(/\r/g, '');
    const allLines = rawFile.split('\n');

    const headers = allLines[0].split(',');
    const lines = allLines.filter((l, index) => index !== 0);
    
    const results = {};
    for (let i = 0; i < lines.length; ++i) {

        const line = lines[i].split(',');
        const player = {};
        for (let j = 0; j < line.length; ++j) {

            let val = line[j].replace('%', '');
            val = +val ? +val : val; // coerce to number is possible

            player[headers[j]] = {
                value: val
            }
        }
        results[player.playerid.value] = player;
    }
    return {
        headers,
        results
    };
}

const { headers, results } = format(file);


const getRank = (results, headers) => {

    headers.forEach((header) => {

        let unsorted = [];
        Object.keys(results).forEach((id) => {

            const player = results[id];
            const value = player[header].value;
            unsorted.push({
                id: player.playerid.value,
                value
            })
        })
        const sorted = unsorted.sort((a, b) => {

            if (internals.negativeStats.includes(header)) {
                [a, b] = [b, a]
            };

            if (a.value < b.value) {
                return 1
            }
            return -1;
        })

        sorted.forEach((p, rank) => {

            const id = p.id;
            const player = results[id];
            player[header].rank = rank + 1;
        });
    });
    return results
}

const data = getRank(results, headers);

exports.pitchingData = () => data;
exports.getPitchingStats = () => headers;


// const showByRank = (players, stats) => {

//     let results = [];
//     Object.keys(players).forEach((id) => {

//         const player = players[id];

//         let qualified = true;
//         stats.forEach((obj) => {

//             const name = obj.name;
//             const value = obj.rank;

//             if (player[name].rank > value) {
//                 qualified = false;
//             }
//         })
//         if (qualified) {
//             results.push(player);
//         }
//     })
//     return results
// };

// const stats = [
//     { name: 'SwStr%', rank: 10 },
//     // { name: 'FIP', rank: 10 }
// ]

// const ranked = showByRank(data, stats);
// console.log(ranked);