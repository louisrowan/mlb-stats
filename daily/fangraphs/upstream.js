'use strict';

const Wreck = require('wreck');


const Upstream = {};

Upstream.get = (url, options, cb, retries = 0) => {

    // const start = Date.now()

    Wreck.get(url, options, (err, res, payload) => {

        // console.log(Date.now() - start, url);

        if (!payload) {

            if (retries > 3) {
                return cb(new Error(`too many retries for ${url}`));
            }
            ++retries;
            return Upstream.get(url, options, cb, retries)
        }

        cb(err, res, payload);
    })
}

module.exports = Upstream;
