'use strict';

exports.rankRaw = (games) => {

    // console.log(JSON.stringify(games, null, 2));

    let pitchers = [];

    games.forEach((game) => {

        const game1Pitcher = {
            ...game.team1.stats.pitcher,
            opponent: game.team2.name
        };

        const game2Pitcher = {
            ...game.team2.stats.pitcher,
            opponent: game.team1.name
        };

        pitchers.push(game1Pitcher);
        pitchers.push(game2Pitcher);
    })

    const sorted = pitchers.sort((a, b) => {

        return a.xFIP > b.xFIP ? 1 : -1;
    });

    sorted.forEach(s => {

        console.log(s.name, s.xFIP);
    })

    // console.log(sorted);

    return sorted;
};



