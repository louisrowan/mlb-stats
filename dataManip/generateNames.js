const Fs = require('fs');
const Path = require('path');

const TeamsCSV = Path.resolve(__dirname, './teams.csv');
const BattingCSV = Path.resolve(__dirname, './batting.csv');
const FieldingCSV = Path.resolve(__dirname, './fielding.csv');
const PlayersCSV = Path.resolve(__dirname, './players.csv');


const generateFranchiseMap = () => {

    const franchiseMap = {};
    const data = Fs.readFileSync(TeamsCSV, 'utf-8');

    const teams = data.split('\n').slice(1);

    teams.forEach((team) => {

        const t = team.split(',');
        const res = {};

        res.teamId = t[2];
        res.teamName = t[40];
        res.teamAbbreviation = t[45];

        if (t[2]) franchiseMap[t[2]] = res;
        
    })
    return franchiseMap;
}


const generatePositionTeamMaps = (franchiseMap) => {

    const positionMap = {};
    const teamMap = {};
    const data = Fs.readFileSync(FieldingCSV, 'utf-8');

    const players = data.split('\n').slice(1);

    players.forEach((player) => {

        const p = player.split(',');
        const res = {};

        const id = p[0]
        const position = p[5];
        const teamId = p[3];
        const teamName = franchiseMap[teamId];

        if (id) {
            if (positionMap[id]) {
                if (!positionMap[id].includes(position)) {
                    positionMap[id].push(position);
                }
            }
            else {
                positionMap[id] = [position];
            }

            if (teamMap[id]) {
                if (!teamMap[id].includes(teamName)) {
                    teamMap[id].push(teamName);
                }
            }
            else {
                teamMap[id] = [teamName];
            }
        }

    })
    return {
        positionMap,
        teamMap
    };
}




const generateNamesMap = () => {

    const franchiseMap = generateFranchiseMap();
    const { positionMap, teamMap } = generatePositionTeamMaps(franchiseMap);

    const playerMap = {};
    const data = Fs.readFileSync(PlayersCSV, 'utf-8');

    const players = data.split('\n').slice(1);

    players.forEach((player) => {

        const p = player.split(',');
        const res = {};

        const id = p[0];
        res.id = id;
        res.firstName = p[13];
        res.lastName = p[14];
        res.fullName = res.firstName + " " + res.lastName;
        res.debut = p[20];
        res.finalGame = p[21];
        res.positions = positionMap[id];
        res.teams = teamMap[id];

        if (id) playerMap[id] = res;
    })
    return playerMap;
}



const generateNamesFile = (namesMap) => {

    let file = '';
    let errCount = 0

    Object.keys(namesMap).forEach((id) => {

        try {

            player = namesMap[id];

            const line = []
            line.push(player.id);
            line.push(player.firstName);
            line.push(player.lastName);
            line.push(player.fullName);
            line.push(player.debut);
            line.push(player.finalGame);
            line.push(player.positions.join('-'));

            const teams = player.teams.map((team) => {

                return `${team.teamName}:${team.teamAbbreviation}`
            });

            line.push(teams.join('-'));

            const string = line.join(',') + '\n';
            file += string;

        }

        catch (err) { }
    })

    return file;
}

const names = generateNamesMap()
const namesFile = generateNamesFile(names)

Fs.writeFile(Path.resolve(__dirname, './names.csv'), namesFile, (err, data) => {

    console.log('err?', err);
    console.log('data?', data);
})