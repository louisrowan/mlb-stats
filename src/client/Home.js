const React = require('react');
const Axios = require('axios');

const {
    Button,
    Container,
    Input,
    List,
} = require ('semantic-ui-react');


const BattingStatsTable = require('./BattingStatsTable');


const PlayerListItem = (props) => {

    const {
        id,
        fullName,
        teams
    } = props.player;

    const { handleActivePlayerChange} = props;

    return (
        <List.Item>
            <Button onClick={() => handleActivePlayerChange(id)}>
                {fullName} | {teams.map((t, i) => <span key={`${id}-${i}`}>{`${t.abbreviation} `}</span>)}
            </Button>
        </List.Item>
    )
}



class Home extends React.Component {

    constructor() {

        super()

        this.state = {
            players: [],
            activePlayer: [],
            searchTerm: ''
        }

        Axios.get('/api/players')
            .then(res => {

                this.setState({ players: res.data })
            })
            .catch(err => console.log('err'));

        this.handleSearchTermChange = this.handleSearchTermChange.bind(this);
        this.handleActivePlayerChange = this.handleActivePlayerChange.bind(this);
    }


    handleSearchTermChange (e) {

        const searchTerm = e.target.value;

        this.setState({ searchTerm });
    }

    handleActivePlayerChange (playerId) {

        Axios.get('/api/players/' + playerId + '/batting')
            .then(res => {

                this.setState({ activePlayer: res.data });
            })
            .catch(err => console.log('err getting batting data', err));
    }


    render () {

        const { activePlayer, players, searchTerm } = this.state;

        const splitTerm = searchTerm ? searchTerm.toLowerCase().split(' ').filter((t) => t != "") : [];

        let filterCount = 0;
        const filter = players.length > 0 ? players.filter((p) => {

            if (filterCount > 10) {
                return false;
            }

            const matchingFields = [];

            if (p.fullName) matchingFields.push(p.fullName.toLowerCase())
            if (p.debut) matchingFields.push(p.debut.toString());

            p.positions.forEach((pos) => matchingFields.push(pos.toLowerCase()));

            p.teams.forEach((team) => {

                if (team.name) matchingFields.push(team.name.toLowerCase());
                if (team.abbreviation) matchingFields.push(team.abbreviation.toLowerCase());
            });

            let match = true;
            splitTerm.forEach((term) => {

                let found = false;
                matchingFields.forEach((field) => {
                    if (field && field.includes(term)) {
                        found = true;
                    }
                })
                if (!found) match = false;

            })

            if (match) {
                ++filterCount
                return true;
            }
            else {
                return false;
            }
        }).map((player, i) => {

            return (<PlayerListItem
                        key={`${player.id}-${i}`}
                        player={player}
                        handleActivePlayerChange={this.handleActivePlayerChange}
                    />)
        }) : '';



        return (
            <Container>
            <Input
                value={searchTerm}
                onChange={this.handleSearchTermChange}
                placeholder='Search for a player, team or position'
                fluid
                />
            { players.length > 0 && searchTerm.length > 2 && <List>{filter}</List> }
            { activePlayer.length > 0 && <BattingStatsTable statlineArray={activePlayer} /> }
            </Container>
        )

    }
}

module.exports = Home;
