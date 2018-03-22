// actions and action creators
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

const STATQUERY_UPDATE_MIN_AB = 'STATQUERY_UPDATE_MIN_AB';
export const statqueryUpdateMinAb = (value) => {
    return {
        type: STATQUERY_UPDATE_MIN_AB,
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

const STATQUERY_SORT_BATTING_STATS = 'STATQUERY_SORT_BATTING_STATS';
export const statquerySortBattingStats = (stat, direction) => {
    return {
        type: STATQUERY_SORT_BATTING_STATS,
        stat
    }
}


// initial state
const initialState = {
    battingLinesArray: [],
    hasData: false,
    loading: false,
    minAb: 100,
    minAge: 0,
    maxAge: 100,
    maxYear: 2016,
    minYear: 1891,
    sorted: {},
    statNames: ['hr', 'rbi', 'sb', 'h', 'avg', 'obp', 'slg', 'ops'],
    stats: {}
};

initialState.statNames.forEach((stat) => {

    initialState.stats[stat] = { stat: stat, min: '', max: '', active: false }
});




// reducers

const toggleStatActiveReducer = (state, action) => {

    const newStats = {};
    state.statNames.forEach((statName) => {
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
    state.statNames.forEach((statName) => {
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

const sortBattingStatsReducer = (state, action) => {

    const { stat } = action;

    let reverse = false;
    if (state.sorted.stat === stat && state.sorted.direction === 'desc') {
        reverse = true;
    }

    const sorted = state.battingLinesArray.sort((a, b) => {

        if (a[stat] < b[stat]) {
            return reverse ? -1 : 1;
        }
        return reverse ? 1 : -1;
    });

    return {
        ...state,
        battingLinesArray: [ ...sorted ],
        sorted: {
            stat: stat,
            direction: reverse ? 'asc' : 'desc'
        }
    }
}


// statQuery root reducer
export const reducer = (state = initialState, action) => {

    console.log('action', action);

    switch (action.type) {
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
        case STATQUERY_UPDATE_MIN_AB:
            return {
                ...state,
                minAb: action.value
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
        case STATQUERY_SORT_BATTING_STATS:
            return sortBattingStatsReducer(state, action);
        default:
            return state;
    }

    return state;
}
