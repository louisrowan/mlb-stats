const React = require('react');
const Axios = require('axios');
const ReactDOM = require('react-dom');

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

    handleActivePlayerChange (player) {


        Axios.get('/api/player/' + player.id + '/batting')
            .then(res => {

                console.log('d', res.data);

                this.setState({ activePlayer: res.data });
            })
            .catch(err => console.log('err getting batting data'));
    }



    render () {

        const { activePlayer, players, searchTerm } = this.state;

        const splitTerm = searchTerm ? searchTerm.toLowerCase().split(' ') : [];

        const filter = players.length > 0 ? players.filter((p) => {

            const name = p.fullName.toLowerCase();
            const birthYear = p.birthYear ? p.birthYear.toString() : '';

            let match = true;
            splitTerm.forEach((term) => {

                if (!name.includes(term) && !birthYear.includes(term)) {
                    match = false;
                }
            })
            return match;
        }).map((player, i) => {

            return <p onClick={() => this.handleActivePlayerChange(player)}>{player.fullName}: {player.birthYear}</p>
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
