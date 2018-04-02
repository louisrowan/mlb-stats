'use strict';

const Fs = require('fs');
const Path = require('path');
const pathToLog = Path.resolve(__dirname, './logs.log');


module.exports = (req, res) => {

    const log = JSON.stringify({
        time: Date.now(),
        body: req.body.patyload
    })

    Fs.appendFile(pathToLog, log, () => {});

    return res.send();
};
