'use strict';

// node --max-old-space-size=8192 index.js 

const Cheerio = require('cheerio');

const GetPlayerData = require('./getPlayerData');
const Upstream = require('./Upstream');


const domain = 'https://www.fangraphs.com';



const getGames = (next) => { // get html

    const path = '/livescoreboard.aspx?date=2018-06-01';

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

        return next([games[2], games[3]]);
    });
};



const parseGames = (games) => { // games by team

    const completedGames = [];
    const numGames = games.length;

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

        const setupRequests = (team1Rows, team2Rows) => {

            return new Promise((resolve, reject) => {

                let statsComplete = 0;
                const game = {
                    team1: {},
                    team2: {}
                };

                parseTeams(team1Rows, (results) => {

                    ++statsComplete;
                    game.team1.stats = results;

                    if (statsComplete === 2) {
                        resolve(game);
                    }
                });

                parseTeams(team2Rows, (results) => {

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
                    return handleAllDataFetched(completedGames);
                }
            });

    })
}


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
        return getTeamStats(team)
    }

    const positionPlayersData = rows[1].children;
    const lineup = {};

    let i = 0;
    let lineupIndex = 1;
    while (i < positionPlayersData.length) { // parse lineup data to format batting order

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

        i += 4;
        lineupIndex++;

    }

    team.lineup = lineup;

    return getTeamStats(team, (result) => {

        return cb(result);
    });
}

let pC = 0;
let lC = 0;


const getTeamStats = (team, cb) => {

    let promisesComplete = 0;
    const results = {};

    if (team.pitcher) {
        GetPlayerData.getPitcherData(team.pitcher, (result) => {

            results.pitcher = result;
            ++promisesComplete;
            if (promisesComplete === 2) {
                return cb(results);
            }
        });
    }
    else {
        ++promisesComplete;
        if (promisesComplete === 2) {
            return cb(results);
        }
    }

    if (team.lineup) {
        GetPlayerData.getLineupData(team.lineup, (result) => {

            results.lineup = result;
            ++promisesComplete;
            if (promisesComplete === 2) {
                return cb(results);
            }
        });
    }
    else {
        ++promisesComplete;
        if (promisesComplete === 2) {
            return cb(results);
        }
    }

}


const handleAllDataFetched = (games) => {

    console.log(JSON.stringify(games, null, 2));
}



getGames(parseGames);

