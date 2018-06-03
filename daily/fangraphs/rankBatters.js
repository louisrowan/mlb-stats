'use strict';

exports.rankRaw = (games) => {

    let allBatters = [];

    games.forEach((game) => {

        const gameBatters = [];
        game.team1.stats.lineup.forEach((batter) => {

            gameBatters.push({
                ...batter,
                opponent: {
                    name: game.team2.stats.pitcher.name,
                    handedness: game.team2.stats.pitcher.handedness
                }
            });
        });

        game.team2.stats.lineup.forEach((batter) => {

            gameBatters.push({
                ...batter,
                opponent: {
                    name: game.team1.stats.pitcher.name,
                    handedness: game.team1.stats.pitcher.handedness
                }
            });
        });
        allBatters = allBatters.concat(gameBatters);
    });

    const sorted = allBatters.sort((a, b) => {

        return rawGamePrediction(a) > rawGamePrediction(b) ? -1 : 1;
    });

    return sorted;
}

const rawGamePrediction = (batter) => {

    const paVsStarter = 2 + (1 - (batter.spotInOrder/10));
    const paVsReliever = 2;
    const starterHandedness = batter.opponent.handedness;

    const _single_VsStarter = calculateStat(batter, '1B', starterHandedness) * paVsStarter;
    const _single_VsReliever = calculateStat(batter, '1B', starterHandedness) * paVsReliever;
    const total_single_ = _single_VsStarter + _single_VsReliever;
    const total_single_Points = total_single_ * 3;

    const _double_VsStarter = calculateStat(batter, '2B', starterHandedness) * paVsStarter;
    const _double_VsReliever = calculateStat(batter, '2B', starterHandedness) * paVsReliever;
    const total_double_ = _double_VsStarter + _double_VsReliever;
    const total_double_Points = total_double_ * 5;

    const _triple_VsStarter = calculateStat(batter, '3B', starterHandedness) * paVsStarter;
    const _triple_VsReliever = calculateStat(batter, '3B', starterHandedness) * paVsReliever;
    const total_triple_ = _triple_VsStarter + _triple_VsReliever;
    const total_triple_Points = total_triple_ * 8;

    const _hr_VsStarter = calculateStat(batter, 'HR', starterHandedness) * paVsStarter;
    const _hr_VsReliever = calculateStat(batter, 'HR', starterHandedness) * paVsReliever;
    const total_hr_ = _hr_VsStarter + _hr_VsReliever;
    const total_hr_Points = total_hr_ * 10;

    const _rbi_VsStarter = calculateStat(batter, 'RBI', starterHandedness) * paVsStarter;
    const _rbi_VsReliever = calculateStat(batter, 'RBI', starterHandedness) * paVsReliever;
    const total_rbi_ = _rbi_VsStarter + _rbi_VsReliever;
    const total_rbi_Points = total_rbi_ * 2;

    const _r_VsStarter = calculateStat(batter, 'R', starterHandedness) * paVsStarter;
    const _r_VsReliever = calculateStat(batter, 'R', starterHandedness) * paVsReliever;
    const total_r_ = _r_VsStarter + _r_VsReliever;
    const total_r_Points = total_r_ * 2;

    const _bb_VsStarter = calculateStat(batter, 'BB', starterHandedness) * paVsStarter;
    const _bb_VsReliever = calculateStat(batter, 'BB', starterHandedness) * paVsReliever;
    const total_bb_ = _bb_VsStarter + _bb_VsReliever;
    const total_bb_Points = total_bb_ * 2;

    const _hbp_VsStarter = calculateStat(batter, 'HBP', starterHandedness) * paVsStarter;
    const _hbp_VsReliever = calculateStat(batter, 'HBP', starterHandedness) * paVsReliever;
    const total_hbp_ = _hbp_VsStarter + _hbp_VsReliever;
    const total_hbp_Points = total_hbp_ * 2;

    const _sb_VsStarter = calculateStat(batter, 'SB', starterHandedness) * paVsStarter;
    const _sb_VsReliever = calculateStat(batter, 'SB', starterHandedness) * paVsReliever;
    const total_sb_ = _sb_VsStarter + _sb_VsReliever;
    const total_sb_Points = total_sb_ * 5;

    const totalPoints =
        total_single_Points +
        total_double_Points +
        total_triple_Points +
        total_hr_Points +
        total_rbi_Points +
        total_r_Points +
        total_bb_Points +
        total_hbp_Points +
        total_sb_Points

    batter.totalPoints = totalPoints;


    return totalPoints;
}



const calculateStat = (batter, stat, hand) => {

    const stats = batter[selectStats(hand)];
    return (stats[stat]/stats.PA) || 0;
}


const selectStats = (hand) => {

    if (hand === 'L') {
        return 'vsLeft';
    }
    else if (hand === 'R') {
        return 'vsRight';
    }
    return 'total';
}