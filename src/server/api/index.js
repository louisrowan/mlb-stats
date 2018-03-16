'use strict';


const Routes = require('express').Router();

const GetPlayers = require('./playerRoutes/getPlayers');
const GetPlayerBatting = require('./playerRoutes/getPlayerBatting');

const PostBattingLines = require('./statRoutes/postBattingLines');


Routes.get('/players', GetPlayers);
Routes.get('/players/:id/batting', GetPlayerBatting);

Routes.post('/stats/battingLines', PostBattingLines);

module.exports = Routes;
