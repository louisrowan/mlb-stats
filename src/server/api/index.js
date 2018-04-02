'use strict';


const Routes = require('express').Router();

const GetPlayers = require('./playerRoutes/getPlayers');
const GetPlayerBatting = require('./playerRoutes/getPlayerBatting');
const GetPlayerBattingYear = require('./playerRoutes/getPlayerBattingYear');
const GetPlayerPitching = require('./playerRoutes/getPlayerPitching');
const PostBattingLines = require('./statRoutes/postBattingLines');

const Logger = require('./logs/logger');


Routes.get('/players', GetPlayers);

Routes.get('/players/:id/batting/:year', GetPlayerBattingYear);

Routes.get('/players/:id/batting', GetPlayerBatting);
Routes.get('/players/:id/pitching', GetPlayerPitching);

Routes.post('/stats/battingLines', PostBattingLines);

Routes.post('/logger', Logger);

module.exports = Routes;
