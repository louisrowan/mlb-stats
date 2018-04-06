'use strict';


const Routes = require('express').Router();

const GetPlayers = require('./playerRoutes/getPlayers');

const GetPlayerBatting = require('./playerRoutes/getPlayerBatting');
const GetPlayerBattingYear = require('./playerRoutes/getPlayerBattingYear');
const GetPlayerPitching = require('./playerRoutes/getPlayerPitching');

const PostBattingLines = require('./statRoutes/postBattingLines');
const PostPitchingLines = require('./statRoutes/postPitchingLines');

const Logger = require('./logger/logger');


Routes.get('/players', GetPlayers);

Routes.get('/players/:id/batting/:year', GetPlayerBattingYear);

Routes.get('/players/:id/batting', GetPlayerBatting);
Routes.get('/players/:id/pitching', GetPlayerPitching);

Routes.post('/stats/battingLines', PostBattingLines);
Routes.post('/stats/pitchingLines', PostPitchingLines);

Routes.post('/logger', Logger);

module.exports = Routes;
