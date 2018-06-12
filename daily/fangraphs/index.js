'use strict';

// node --max-old-space-size=8192 index.js 


const DATE = exports.DATE = '06-09';
const PATH_TO_FILE = './fixtures/games_' + DATE + '.json';

const Fs = require('fs');
const Path = require('path');



const mockAllGames = require('./mockAllGames.json');


const Cheerio = require('cheerio');

const GetPlayerData = require('./getPlayerData');
const GenerateLineup = require('./generateLineup');
const RankPitchers = require('./rankPitchers');
const RankBatters = require('./rankBatters');
const Upstream = require('./Upstream');


const domain = 'https://www.fangraphs.com';



const getGames = (next) => { // get html

    const path = '/livescoreboard.aspx?date=2018-' + DATE;

    Upstream.get(domain + path, {}, (err, res, payload) => {

        const html = payload.toString();
        const $ = Cheerio.load(html);

        const games = [];

        $('.lineup').each(function(i, element) {

            const lineup = element;
            const game = element.parent.parent;
            const team1Name = game.children[0].children[0].children[0].data;
            const team2Name = game.children[2].children[0].children[0].data;
            

            games.push({
                team1Name,
                team2Name,
                lineups: $(this)
            });
        });

        return next(games);
    });
};



const parseGames = (games) => { // split game html into teams

    const completedGames = [];
    let numGames = games.length;

    games.forEach((game) => {

        const team1Name = game.team1Name;
        const team2Name = game.team2Name;

        const rows = game.lineups.children().children('tr');

        let team1Rows = [];
        let team2Rows = [];
        rows.each(function(_, element) {

            element.children.forEach((el, index) => {

                if (index && el.children.length) {
                    team2Rows.push(el)
                }
                else if (el.children.length ) {
                    team1Rows.push(el)
                }
            })
        });

        const setupRequests = (team1Rows, team2Rows) => { // get player data

            return new Promise((resolve, reject) => {

                let statsComplete = 0;
                const game = {
                    team1: {},
                    team2: {}
                };

                parseTeams(team1Rows, (err, results) => {

                    if (err) {
                        return reject();
                    }

                    ++statsComplete;
                    game.team1.stats = results;

                    if (statsComplete === 2) {
                        resolve(game);
                    }
                });

                parseTeams(team2Rows, (err, results) => {

                    if (err) {
                        return reject();
                    }

                    ++statsComplete;
                    game.team2.stats = results;

                    if (statsComplete == 2) {
                        resolve(game);
                    }
                })
            })
        }

        setupRequests(team1Rows, team2Rows)
            .then(game => {

                game.team1.name = team1Name;
                game.team2.name = team2Name;
                completedGames.push(game);

                if (completedGames.length === numGames) {
                    writeGamesToFile(completedGames);
                }
            })
            .catch(() => {

                --numGames;

                if (completedGames.length === numGames) {
                    writeGamesToFile(completedGames);
                }
            })

    })
}


const writeGamesToFile = (completedGames) => {

    Fs.writeFileSync(
        Path.resolve(__dirname, PATH_TO_FILE),
        JSON.stringify(completedGames, null, 2)
    );
};



const parseTeams = (rows, cb) => { // split up pitcher and lineup

    const team = {};

    const pitcher = rows[0];
    const text = pitcher.children.find((c) => c.type === 'text');
    const link = pitcher.children.find((c) => c.name === 'a');

    const position = text.data;
    const href = link.attribs.href;
    const name = link.children[0].data;

    team.pitcher = {
        href,
        name
    }

    if (!rows[1]) { // lineup not announced yet
        return cb('no lineup');
    }
    else {
        console.log('line up found for', team.pitcher.name);
    }

    const positionPlayersData = rows[1].children;
    const lineup = {};

    let i = 0;
    let lineupIndex = 1;
    while (i < positionPlayersData.length) { // parse lineup data to format batting order

        try {

            const spotInOrder = lineupIndex;
            const name = positionPlayersData[i + 1].children[0].data;
            const href = positionPlayersData[i + 1].attribs.href;
            const position = positionPlayersData[i + 2].data;

            lineup[spotInOrder] = {
                spotInOrder,
                name,
                href,
                position
            };

        }
        catch (err) { // no player link
            console.log(team.pitcher.name, 'lineup parse err', i, lineupIndex);
        }

        i += 4;
        lineupIndex++;

    }

    team.lineup = lineup;

    return getTeamStats(team, (err, result) => {

        return cb(err, result);
    });
}


const getTeamStats = (team, cb) => { // get pitcher and lineup data

    let promisesComplete = 0;
    const results = {};

    if (team.pitcher) {
        GetPlayerData.getPitcherData(team.pitcher, (err, result) => {

            if (err) {
                return cb(err, results);
            }

            results.pitcher = result;
            ++promisesComplete;
            if (promisesComplete === 2) {
                return cb(null, results);
            }
        });
    }
    else {
        ++promisesComplete;
        if (promisesComplete === 2) {
            return cb(null, results);
        }
    }

    if (team.lineup) {
        GetPlayerData.getLineupData(team.lineup, (err, result) => {

            if (err) {
                console.log('lineup err', err);
                return cb(err, results);
            }

            results.lineup = result.filter(p => p !== null);
            ++promisesComplete;
            if (promisesComplete === 2) {
                return cb(null, results);
            }
        });
    }
    else {
        ++promisesComplete;
        if (promisesComplete === 2) {
            return cb(null, results);
        }
    }

}


const handleAllDataFetched = (games) => { // print stuff to screen and generate lineups


    games.forEach((g) => {

        console.log(g.team1.name);
        console.log(g.team2.name);
    });
    console.log(games.length * 2);
    console.log('');


    // console.log(JSON.stringify(games, null, 2));

    const allPitchers = RankPitchers.rankRaw(games);
    const allBatters = RankBatters.rankRaw(games);

    const pos = {};

    allBatters.forEach((b) => {
        pos[b.position] ? pos[b.position].push(b) : pos[b.position] = [b];
    });

    Object.keys(pos).forEach((position) => {

        console.log('');
        console.log(position);
        pos[position].forEach((player) => {
            console.log(player.name, player.totalPoints.toFixed(3));
        });
    });

    console.log('total games is', games.length);


    const battersWithSalaries = GenerateLineup.battersWithSalaries(allBatters);
    const pitchersWithSalaries = GenerateLineup.pitchersWithSalaries(allPitchers)

    const lineup = GenerateLineup.generate(battersWithSalaries, pitchersWithSalaries);


}





getGames(parseGames);
// handleAllDataFetched(require(PATH_TO_FILE));

