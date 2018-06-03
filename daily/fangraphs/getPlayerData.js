'use strict';

const Wreck = require('wreck');
const Cheerio = require('cheerio');

const domain = 'https://www.fangraphs.com';


exports.getPitcherData = (pitcher) => {

    const url = domain + '/' + pitcher.href;

    Wreck.get(url, {}, (err, res, payload) => {

        const html = payload.toString();
        const $ = Cheerio.load(html);


        const headerTDs = $('#SeasonStats1_dgSeason11_ctl00 th');
        const headers = {};
        headerTDs.each((i, header) => {


            let value;
            if (header.children[0].children) {
                value = header.children[0].children[0].data;

            }
            else {
                value = header.children[0].data;
            }


            headers[i] = {
                index: i,
                value
            }
        })


        const statRows = $('#SeasonStats1_dgSeason11_ctl00 tr');
        // console.log('length', statRows.length, pitcher);
        
        let currentYear;
        statRows.each(function(i, row) {

            try {
                const yearTD = row.children[1];
                const yearLink = yearTD.children[0];
                const yearLinkHref = yearLink.attribs.href;
                const isActiveSeason = yearLink.name === 'a' &&
                    yearLinkHref.includes('season=2018') &&
                    !yearLinkHref.includes('minor');

                if (!currentYear && isActiveSeason) {
                    currentYear = row;
                }
            }
            catch (err) {};
        })

        let playerStats = [];
        let i = 0;
        while (true) {

            const child = currentYear.children[i];
            if (!child) {
                break;
            }

            if (child.name === 'td') {
                playerStats.push(child)
            }

            ++i;
        }

        const player = {
            name: pitcher.name
        };

        playerStats.forEach((statTD, i) => {

            const currentHeader = headers[i];

            let value;
            if (statTD.children[0].name === 'a') {
                value = statTD.children[0].children[0].data;
            }
            else {
                value = statTD.children[0].data
            }

            player[currentHeader.value] = value;
        })



        // get handedness
        const playerInfoDivs = $('.player-info-box-item, div');
        playerInfoDivs.each((_, element) => {

            if (element.children) {
                element.children.forEach((child) => {

                    if (child.data && child.data.includes('Bats/Throws')) {
                        const handedness = child.data.split(': ')[1].split('/')[1];
                        pitcher.handedness = handedness
                    }
                })
            }
        })

        return pitcher;
    });
};



// { spotInOrder: 7,
//   name: 'Denard Span',
//   href: 'statss.aspx?playerid=8347&position=OF',
//   position: ' (LF)' }



exports.getLineupData = (lineup) => {

    Object.keys(lineup).forEach((index) => {

        const player = lineup[index];
        

        const url = domain + '/' + player.href.replace('statss', 'statsplits');

        Wreck.get(url, {}, (err, res, payload) => {

            const html = payload.toString();
            const $ = Cheerio.load(html);
            console.log($);
            process.exit()
        })
    })
}

