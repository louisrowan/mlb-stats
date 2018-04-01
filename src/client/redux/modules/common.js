export const statNames = ['hr', 'rbi', 'sb', 'h', 'avg', 'obp', 'slg', 'ops'];

export const formatStatNames = (state) => {

    state.statNames.forEach((stat) => {

        state.stats[stat] = {
            stat: stat,
            min: '',
            max: '',
            active: false
        }
    })
};
