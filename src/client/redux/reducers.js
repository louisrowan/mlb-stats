const { combineReducers } = require('redux');
const statQuery = require('./modules/statQuery').reducer;

const rootReducer = combineReducers({
    statQuery
});

module.exports = rootReducer;
