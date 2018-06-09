'use strict';

const Cheerio = require('cheerio');
const Upstream = require('./upstream');

const domain = 'https://www.fangraphs.com';



const getTeamBattingStats = () => {

    return new Promise((resolve, reject) => {

        const url = domain + '/leaders.aspx?pos=all&stats=bat&lg=all&qual=0&type=8&season=2018&month=0&season1=2018&ind=0&team=0,ts&rost=&age=&filter=&players=0';

        Upstream.get(url, {}, (err, res, payload) => {

            if (err || !payload) {
                console.log('error getting team batting stats', err);
                return reject()
            };

            return resolve(payload.toString());
        });
    });
};


const formatTeamBattingStats = (html) => {

    return new Promise((resolve, reject) => {

        const $ = Cheerio.load(html);

        const standardTableId = 'LeaderBoard1_dg1_ctl00';

        const headers = formatHeaders(standardTableId, $);
        const 

        console.log($);
        return resolve();
    });
};























getTeamBattingStats()
    .then(res => {

        console.log('first res');

        return formatTeamBattingStats(res);
    })
    .then(res => {

        console.log('in final res');
    })
    .catch(err => {

        console.log('err', err);
    })
