'use strict';

const Cheerio = require('cheerio');
const Wreck = require('wreck');


const domain = 'https://www.baseball-reference.com';
const allPlayersPath = '/leagues/MLB/2018-standard-batting.shtml';

const getAllPlayers = () => {

    const options = {};

    Wreck.get(domain + allPlayersPath, options, (err, res, payload) => {

        if (err || !payload) {
            console.log('error fetching data', err);
            process.exit();
        }

        // console.log(payload.toString());

        const $ = Cheerio.load(payload.toString());


        const table = $('#players_standard_batting');
        
        const rows = table('tr');
        console.log(rows.length);
        // const players = [];

        // $(rows).each(function(tr) {

        //     const row = $(this);
        //     const player = [];
        //     row.children('td').each((function(td) {

        //         const cell = $(this)
        //         const text = cell.text();
        //         player.push(cell.text());
        //     }))
        //     players.push(player);
        // })
        // console.log(players, players.length);
    })
}

getAllPlayers();