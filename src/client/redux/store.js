const { createStore } = require('redux');
const reducers = require('./reducers');

const initialState = {};

const store = createStore(
    reducers,
    initialState
)


module.exports = store;
