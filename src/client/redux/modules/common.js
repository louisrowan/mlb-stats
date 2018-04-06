export const battingStatNames = [
    'hr',
    'rbi',
    'sb',
    'h',
    'avg',
    'obp',
    'slg',
    'ops'
];

export const pitchingStatNames = [
    'bb',
    'cg',
    'era',
    'fip',
    'g',
    'gs',
    'h',
    'hbp',
    'hr',
    'ip',
    'k',
    'l',
    'oba',
    'sho',
    'sv',
    'w'
];

export const formatStats = (state, type) => {

    const array = type === 'Batting' ? battingStatNames.slice(0) : pitchingStatNames.slice(0);

    const newStats = {};
    array.forEach((stat) => {

        newStats[stat] = {
            stat: stat,
            min: '',
            max: '',
            active: false
        }
    });
    return newStats;
};
