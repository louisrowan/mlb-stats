'use strict';

const BodyParser = require('body-parser');
const Express = require('express');
const Path = require('path');
const Fs = require('fs');
const Api = require('./api');

const PORT = process.env.PORT || 3001;
const app = Express();

app.use(Express.static(__dirname + '/../../dist'));
app.use(BodyParser.json());

app.use('/api', Api);


app.get('/*', (req, res) => {
  res.sendFile(Path.resolve(__dirname, '../../dist/index.html'));
});


app.listen(PORT, (err) => {

    if (err) {
        console.log("err starting server", err);
        process.exit(1);
    }
    console.log('server started on port', PORT)
});
