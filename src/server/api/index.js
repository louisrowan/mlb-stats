'use strict';


const Routes = require('express').Router();

const GetPlayers = require('./playerRoutes/getPlayers');

const GetPlayerBatting = require('./playerRoutes/getPlayerBatting');
const GetPlayerBattingYear = require('./playerRoutes/getPlayerBattingYear');

const GetPlayerPitching = require('./playerRoutes/getPlayerPitching');
const GetPlayerPitchingYear = require('./playerRoutes/getPlayerPitchingYear');

const PostBattingLines = require('./statRoutes/postBattingLines');
const PostPitchingLines = require('./statRoutes/postPitchingLines');

const GetFangraphStats = require('./fangraphRoutes/getFangraphStats');
const PostFangraphsQuery = require('./fangraphRoutes/postFangraphsQuery');

const PostSimulator = require('./gameSimulator/postSimulator');

const Logger = require('./logger/logger');


Routes.get('/players', GetPlayers);

Routes.get('/players/:id/batting/:year', GetPlayerBattingYear);
Routes.get('/players/:id/pitching/:year', GetPlayerPitchingYear);

Routes.get('/players/:id/batting', GetPlayerBatting);
Routes.get('/players/:id/pitching', GetPlayerPitching);

Routes.post('/stats/battingLines', PostBattingLines);
Routes.post('/stats/pitchingLines', PostPitchingLines);

Routes.get('/stats/fangraphs', GetFangraphStats);
Routes.post('/stats/fangraphs', PostFangraphsQuery);

Routes.post('/simulate/lineup', PostSimulator);

Routes.post('/logger', Logger);

module.exports = Routes;
