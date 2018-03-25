const React = require('react');
const Axios = require('axios');

const {
    Button,
    Card,
    Container,
    Input
} = require ('semantic-ui-react');


const BattingStatsTable = require('../components/BattingStatsTable');


const PlayerListItem = (props) => {

    const {
        debut,
        id,
        fullName,
        positions,
        teams
    } = props.player;

    const { handleActivePlayerChange} = props;

    return (
        <Card id={id} onClick={() => handleActivePlayerChange(id)}>
            <Card.Content>
                <Card.Header>{fullName}</Card.Header>
            </Card.Content>
            <Card.Content>
                <Card.Meta>Debut: {debut}</Card.Meta>
                <Card.Meta>
                    {positions.map((p, i) => `${i > 0 ? '- ' : ''}${p} `)}
                </Card.Meta>
                <Card.Meta>
                    {teams.map((t, i) => `${i > 0 ? '- ' : ''}${t.abbreviation} `)}
                </Card.Meta>
             </Card.Content>
        </Card>
    )
}



class PlayerSearch extends React.Component {

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

                this.setState({ activePlayer: res.data, searchTerm: '' });
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
            <Container fluid style={{ overflow: 'auto' }}>
                <Input
                    value={searchTerm}
                    onChange={this.handleSearchTermChange}
                    placeholder='Search for a player, team or position'
                    fluid
                />
            { players.length > 0 && searchTerm.length > 2 &&
                <Card.Group>{filter}</Card.Group>
            }
            { activePlayer.length > 0 &&
                <BattingStatsTable statlineArray={activePlayer} />
            }
            </Container>
        )

    }
}

module.exports = PlayerSearch;
