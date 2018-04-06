const Common = require('./common');

// actions and action creators
const STATQUERY_UPDATE_TYPE = 'STATQUERY_UPDATE_TYPE';
export const statqueryUpdateType = (value) => {
    return {
        type: STATQUERY_UPDATE_TYPE,
        value
    }
};

const STATQUERY_UPDATE_LOADING = 'STATQUERY_UPDATE_LOADING';
export const statqueryUpdateLoading = (value) => {
    return {
        type: STATQUERY_UPDATE_LOADING,
        value
    }
};

const STATQUERY_FETCH_BATTING_LINES_SUCCESS = 'STATQUERY_FETCH_BATTING_LINES_SUCCESS';
export const statqueryFetchBattingLinesSuccess = (payload) => {
    return {
        type: STATQUERY_FETCH_BATTING_LINES_SUCCESS,
        payload
    }
};

const STATQUERY_FETCH_BATTING_LINES_FAILURE = 'STATQUERY_FETCH_BATTING_LINES_FAILURE';
export const statqueryFetchBattingLinesFailure = () => {
    return {
        type: STATQUERY_FETCH_BATTING_LINES_FAILURE
    }
};

const STATQUERY_UPDATE_MIN_AB_IP = 'STATQUERY_UPDATE_MIN_AB_IP';
export const statqueryUpdateMinAbIp = (value) => {
    return {
        type: STATQUERY_UPDATE_MIN_AB_IP,
        value
    }
};

const STATQUERY_UPDATE_MIN_YEAR = 'STATQUERY_UPDATE_MIN_YEAR';
export const statqueryUpdateMinYear = (value) => {
    return {
        type: STATQUERY_UPDATE_MIN_YEAR,
        value
    }
}

const STATQUERY_UPDATE_MAX_YEAR = 'STATQUERY_UPDATE_MAX_YEAR';
export const statqueryUpdateMaxYear = (value) => {
    return {
        type: STATQUERY_UPDATE_MAX_YEAR,
        value
    }
}

const STATQUERY_UPDATE_MIN_AGE = 'STATQUERY_UPDATE_MIN_AGE';
export const statqueryUpdateMinAge = (value) => {
    return {
        type: STATQUERY_UPDATE_MIN_AGE,
        value
    }
}

const STATQUERY_UPDATE_MAX_AGE = 'STATQUERY_UPDATE_MAX_AGE';
export const statqueryUpdateMaxAge = (value) => {
    return {
        type: STATQUERY_UPDATE_MAX_AGE,
        value
    }
}

const STATQUERY_TOGGLE_STAT_ACTIVE = 'STATQUERY_TOGGLE_STAT_ACTIVE';
export const statqueryToggleStatActive = (stat) => {
    return {
        type: STATQUERY_TOGGLE_STAT_ACTIVE,
        stat
    }
}

const STATQUERY_UPDATE_STAT_VALUE = 'STATQUERY_UPDATE_STAT_VALUE';
export const statqueryUpdateStatValue = (stat, minMax, value) => {
    return {
        type: STATQUERY_UPDATE_STAT_VALUE,
        stat,
        minMax,
        value
    }
}

const STATQUERY_RESET = 'STATQUERY_RESET';
export const statqueryReset = () => {
    return {
        type: STATQUERY_RESET
    }
}


// initial state
const initialState = {
    battingLinesArray: [],
    hasData: false,
    loading: false,
    minAbIp: 100,
    minAge: 0,
    maxAge: 100,
    maxYear: 2016,
    minYear: 1891,
    statNames: {},
    stats: {},
    type: ''
};



// reducers

const toggleStatActiveReducer = (state, action) => {

    console.log('in toggle stat active reducer', state, action);

    const newStats = {};
    Object.keys(state.statNames).forEach((statName) => {
        const newStat = { ...state.stats[statName]};
        if (newStat.stat === action.stat) {
            newStat.active = !newStat.active;
        }
        newStats[statName] = newStat;
    });

    return {
        ...state,
        stats: newStats
    }
};


const updateStatValueReducer = (state, action) => {

    const newStats = {};
    Object.keys(state.statNames).forEach((statName) => {
        const newStat = { ...state.stats[statName]};
        if (newStat.stat === action.stat) {
            newStat[action.minMax] = action.value;
        }
        newStats[statName] = newStat;
    });

    return {
        ...state,
        stats: newStats
    }
};



// statQuery root reducer
export const reducer = (state = initialState, action) => {

    switch (action.type) {
        case STATQUERY_UPDATE_TYPE:
            const { statNames, stats } = Common.formatStats(state, action.value);
            return {
                ...state,
                type: action.value,
                statNames,
                stats
            };
        case STATQUERY_UPDATE_LOADING:
            return {
                ...state,
                loading: action.value
            };
        case STATQUERY_FETCH_BATTING_LINES_SUCCESS:
            return {
                ...state,
                battingLinesArray: action.payload,
                hasData: true,
                loading: false
            }
        case STATQUERY_FETCH_BATTING_LINES_FAILURE:
            return {
                ...state,
                battingLinesArray: [],
                hasData: false,
                loading: false
            }
        case STATQUERY_UPDATE_MIN_AB_IP:
            return {
                ...state,
                minAbIp: action.value
            }
        case STATQUERY_UPDATE_MIN_YEAR:
            return {
                ...state,
                minYear: action.value
            }
        case STATQUERY_UPDATE_MAX_YEAR:
            return {
                ...state,
                maxYear: action.value
            }
        case STATQUERY_UPDATE_MIN_AGE:
            return {
                ...state,
                minAge: action.value
            }
        case STATQUERY_UPDATE_MAX_AGE:
            return {
                ...state,
                maxAge: action.value
            }
        case STATQUERY_TOGGLE_STAT_ACTIVE:
            return toggleStatActiveReducer(state, action);
        case STATQUERY_UPDATE_STAT_VALUE:
            return updateStatValueReducer(state, action);
        case STATQUERY_RESET:
            return initialState;
        default:
            return state;
    }
}
