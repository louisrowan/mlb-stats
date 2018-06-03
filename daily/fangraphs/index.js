'use strict';

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

            games.push($(this));
        });

        return next(games);
    });
};



const parseGames = (games) => { // games by team

    console.log('num teams', games.length);

    games.forEach((game) => {

        const rows = game.children().children('tr');

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


        const team1 = parseTeams(team1Rows);
        const team2 = parseTeams(team2Rows);

    })
}


const parseTeams = (rows) => { // split up pitcher and lineup

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

    return getTeamStats(team);
}

let pC = 0;
let lC = 0;


const getTeamStats = (team) => {

    if (team.pitcher) {
        GetPlayerData.getPitcherData(team.pitcher, (result) => {

            console.log('pitcher done', ++pC);
        });
    }

    if (team.lineup) {
        GetPlayerData.getLineupData(team.lineup, (result) => {

            console.log('lineup done', ++lC);
        });
    }

}



getGames(parseGames);

