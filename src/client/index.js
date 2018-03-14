const React = require('react');
const Axios = require('axios');
const ReactDOM = require('react-dom');


const PlayerListItem = (props) => {

    const {
        id,
        fullName,
        teams
    } = props.player;

    const { handleActivePlayerChange} = props;

    return (
        <li >
            <button onClick={() => handleActivePlayerChange(id)}>
                {fullName}
            </button>
            <span>
                | {teams.map((t) => <span>{`${t.abbreviation} `}</span>)}
            </span>
        </li>
    )
}



class App extends React.Component {

    constructor() {

        super()

        this.state = {
            players: [],
            activePlayer: [],
            searchTerm: ''
        }

        Axios.get('/api/players')
            .then(res => {

                console.log('req made', res.data);

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


        Axios.get('/api/player/' + playerId + '/batting')
            .then(res => {

                console.log('d', res.data);

                this.setState({ activePlayer: res.data });
            })
            .catch(err => console.log('err getting batting data'));
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

            return <PlayerListItem player={player} handleActivePlayerChange={this.handleActivePlayerChange} />
        }) : '';



        return (
            <div>
            <input value={searchTerm} onChange={this.handleSearchTermChange} />
            { players.length > 0 && searchTerm.length > 2 && filter }
            { activePlayer.length > 0 &&
                <table>
                    <tbody>
                        <tr>
                            {Object.keys(activePlayer[0]).map((header) => <td>{header}</td>)}
                        </tr>
                    {activePlayer.map((year) => {

                    return (
                        <tr>{Object.keys(year).map((stat) => {

                        return <td>{year[stat]}</td>
                    })}</tr>)
                    })}</tbody>
                </table>}
            </div>
        )

    }


}

ReactDOM.render(<App />, document.getElementById('root'));
