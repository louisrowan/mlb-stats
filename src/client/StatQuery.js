const React = require('react');
const Axios = require('axios');

const {
    Button,
    Container,
    Input,
    Loader,
    Table,
    Segment
 } = require('semantic-ui-react');

const staticStats = ['hr', 'rbi', 'sb', 'h', 'avg', 'obp', 'slg', 'ops'];

const initialState = {};
staticStats.forEach((stat) => {

    initialState[stat] = { min: 0, max: 0, active: false }
})

class StatQuery extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            stats: initialState,
            response: {},
            loading: false
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCheck = this.handleCheck.bind(this);
        this.handleRowClick = this.handleRowClick.bind(this);
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

        this.setState({ loading: true });

        Axios.post('/api/stats/battingLines', { payload })
            .then(res => {

                console.log('res?', res);

                this.setState({ response: res.data, loading: false });
            })
            .then(err => {

                this.setState({ loading: false });

                console.log('err?', err);
            })
    }


    handleCheck (stat, event) {

        const stats = { ...this.state.stats }

        stats[stat].active = !stats[stat].active;

        this.setState({
            stats
        });
    }


    handleRowClick (stat) {

        const stats = { ...this.state.stats };

        stats[stat].active = 'active';

        this.setState({
            stats
        });
    }


    isButtonEnabled () {

        const { stats } = this.state;

        let anyActive = false;
        let missingVal = false;

        Object.keys(stats).forEach((s) => {

            const stat = stats[s];

            if (stat.active) {
                anyActive = true;
                if (!stat.min || !stat.max) {
                    missingVal = true;
                }
            }
        })

        if (!anyActive || missingVal) {
            return false;
        }
        return true;
    }

    render() {

        const { loading, stats } = this.state;

        return (
            <Container fluid>
                <Table collapsing>
                    <Table.Body>
                    <Table.Row>
                        <Table.Cell></Table.Cell>
                        <Table.Cell>Min</Table.Cell>
                        <Table.Cell>Max</Table.Cell>
                        <Table.Cell>Active</Table.Cell>
                    </Table.Row>
                        {Object.keys(stats).map((s) => {

                            const active = stats[s].active;

                            return (
                            <Table.Row
                                positive={active}
                                negative={!active}
                                onClick={() => this.handleRowClick(s)}
                            >
                                <Table.Cell>
                                    {s}
                                </Table.Cell>
                                <Table.Cell>
                                    <Input
                                        disabled={!active}
                                        onChange={(e) => this.handleChange('min', s, e.target.value)}
                                        type='number'
                                        min='0'
                                    />
                                </Table.Cell>
                                <Table.Cell>
                                    <Input
                                        disabled={!active}
                                        onChange={(e) => this.handleChange('max', s, e.target.value)}
                                        type='number'
                                        min='0'
                                        />
                                </Table.Cell>
                                <Table.Cell>
                                    <Input
                                        type='checkbox'
                                        checked={active}
                                        onChange={(e) => this.handleCheck(s, e)}
                                    />
                                </Table.Cell>
                            </Table.Row>
                            )
                        })}
                    </Table.Body>
                </Table>
                <Button 
                disabled={!this.isButtonEnabled()}
                onClick={() => this.handleSubmit()}>Submit</Button>
                { loading && <Segment><Loader active /></Segment>}
                <pre>{JSON.stringify(this.state.response, null, 2)}</pre>
            </Container>
        )
    }
}

module.exports = StatQuery;
