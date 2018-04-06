export const battingStatNames = {
    hr:  { name: 'hr',   type: 'count',      direction: 'positive' },
    rbi: { name: 'rbi',  type: 'count',      direction: 'positive' },
    sb:  { name: 'sb',   type: 'count',      direction: 'positive' },
    h:   { name: 'h',    type: 'count',      direction: 'positive' },
    avg: { name: 'avg',  type: 'percentage', direction: 'positive' },
    obp: { name: 'obp',  type: 'percentage', direction: 'positive' },
    slg: { name: 'slg',  type: 'percentage', direction: 'positive' },
    ops: { name: 'ops',  type: 'percentage', direction: 'positive' }
};

export const pitchingStatNames = {
    bb:  { name: 'bb',   type: 'count',      direction: 'negative' },
    cg:  { name: 'cg',   type: 'count',      direction: 'positive' },
    era: { name: 'era',  type: 'percentage', direction: 'negative' },
    fip: { name: 'fip',  type: 'percentage', direction: 'negative' },
    g:   { name: 'g',    type: 'count',      direction: 'positive' },
    gs:  { name: 'gs',   type: 'count',      direction: 'positive' },
    h:   { name: 'h',    type: 'count',      direction: 'negative' },
    hbp: { name: 'hbp',  type: 'count',      direction: 'negative' },
    hr:  { name: 'hr',   type: 'count',      direction: 'negative' },
    ip:  { name: 'ip',   type: 'count',      direction: 'positive' },
    k:   { name: 'k',    type: 'count',      direction: 'positive' },
    l:   { name: 'l',    type: 'count',      direction: 'negative' },
    oba: { name: 'oba',  type: 'percentage', direction: 'negative' },
    sho: { name: 'sho',  type: 'count',      direction: 'positive' },
    sv:  { name: 'sv',   type: 'count',      direction: 'positive' },
    w:   { name: 'w',    type: 'count',      direction: 'positive' }
};

export const formatStats = (state, type) => {

    const statType = type === 'Batting' ?
    { ...battingStatNames } :
    { ...pitchingStatNames };
    const statNames = type === 'Batting' ? battingStatNames : pitchingStatNames;

    const newStats = {};
    Object.keys(statType).forEach((statName) => {

        const stat = statType[statName];

        newStats[statName] = {
            stat: statName,
            min: '',
            max: '',
            active: false,
            type: stat.type,
            direction: stat.direction
        }
    });
    return {
        statNames,
        stats: newStats
    }
};
