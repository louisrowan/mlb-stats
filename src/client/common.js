export const createStatlinePayload = ({
    minAbIp,
    minAge,
    maxAge,
    minYear,
    maxYear,
    stats
}) => {

    const payload = {
        stats: {},
        minAbIp,
        minAge,
        maxAge,
        minYear,
        maxYear
    };

    Object.keys(stats).forEach((stat) => {

        const active = stats[stat].active;

        if (!active) {
            return;
        }

        const min = stats[stat].min;
        const max = +stats[stat].max ? stats[stat].max : 99999;

        if (max > 0) {

            const qs = `${min},${max}`;
            payload.stats[stat] = qs;
        }
    })
    return payload;
}
