'use strict';


const Routes = require('express').Router();

const GetPlayers = require('./playerRoutes/getPlayers');
const GetPlayerBatting = require('./playerRoutes/getPlayerBatting');
const GetPlayerPitching = require('./playerRoutes/getPlayerPitching');
const PostBattingLines = require('./statRoutes/postBattingLines');


Routes.get('/players', GetPlayers);
Routes.get('/players/:id/batting', GetPlayerBatting);
Routes.get('/players/:id/pitching', GetPlayerPitching);

Routes.post('/stats/battingLines', PostBattingLines);

module.exports = Routes;
