const React = require('react');
const Axios = require('axios');

const { Input } = require('semantic-ui-react');

const stats = ['hr', 'rbi', 'sb', 'h'];

const initialState = {};
stats.forEach((stat) => {

    initialState[stat] = { min: 0, max: 0}
})

class StatQuery extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            stats: initialState,
            response: {}
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    };

    handleChange (type, stat, value) {

        if (+value) {
            value = +value;
        }
        else {
            console.log('ret', value);
            return;
        }

        const state = { ...this.state }

        state.stats[stat][type] = value;

        this.setState({
            stats: state.stats
        })
    }

    handleSubmit () {

        const { stats } = this.state;

        const payload = {
            stats: {}
        }

        Object.keys(stats).forEach((stat) => {

            const min = stats[stat].min;
            const max = stats[stat].max;

            if (+max > 0) {

                const qs = `${min},${max}`;
                payload.stats[stat] = qs;
            }
        })

        console.log('sendingpl', payload);

        Axios.post('/api/stats/battingLines', { payload })
            .then(res => {

                console.log('res?', res);

                this.setState({ response: res.data })
            })
            .then(err => {

                console.log('err?', err);
            })
    }

    render() {

        console.log('state is', this.state);

        return (
            <div>
                <table>
                    <tbody>
                    <tr>
                        <td></td>
                        <td>Min</td>
                        <td>Max</td>
                    </tr>
                        {stats.map((s) => {

                            return (
                            <tr>
                                <td>{s}</td>
                                <td><Input onChange={(e) => this.handleChange('min', s, e.target.value)}/></td>
                                <td><Input onChange={(e) => this.handleChange('max', s, e.target.value)}/></td>
                            </tr>
                            )
                        })}
                    </tbody>
                </table>
                <button onClick={() => this.handleSubmit()}>Submit</button>
                <pre>{JSON.stringify(this.state.response, null, 2)}</pre>
            </div>
        )
    }
}

module.exports = StatQuery;
