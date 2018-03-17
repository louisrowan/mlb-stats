const React = require('react');
const Axios = require('axios');
const _ = require('lodash');

const {
    Button,
    Checkbox,
    Container,
    Input,
    List,
    Loader,
    Table,
    Segment
 } = require('semantic-ui-react');


const BattingStatsTable = require('./BattingStatsTable');


const staticStats = ['hr', 'rbi', 'sb', 'h', 'avg', 'obp', 'slg', 'ops'];

const initialState = {
    stats: {}
};
staticStats.forEach((stat) => {

    initialState.stats[stat] = { min: '', max: '', active: false }
});
initialState.minAb = 100;

class StatQuery extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            ..._.cloneDeep(initialState),
            response: {},
            loading: false
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCheck = this.handleCheck.bind(this);
        this.handleReset = this.handleReset.bind(this);
    };

    handleChange (type, stat, value) {

        const state = { ...this.state }

        state.stats[stat][type] = value;

        this.setState({
            stats: state.stats
        })
    }

    handleSubmit () {

        const { minAb, stats } = this.state;

        const payload = {
            stats: {},
            minAb
        }

        Object.keys(stats).forEach((stat) => {

            const active = stats[stat].active;

            if (!active) {
                return;
            }

            const min = stats[stat].min;
            const max = +stats[stat].max ? stats[stat].max : 99999;

            if (+max > 0) {

                const qs = `${min},${max}`;
                payload.stats[stat] = qs;
            }
        })

        this.setState({ loading: true });

        Axios.post('/api/stats/battingLines', { payload })
            .then(res => {

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



    isButtonEnabled () {

        const { stats } = this.state;

        let anyActive = false;
        let missingVal = false;

        Object.keys(stats).forEach((s) => {

            const stat = stats[s];

            if (stat.active) {
                anyActive = true;
                if (!stat.min) {
                    missingVal = true;
                }
            }
        })

        if (!anyActive || missingVal) {
            return false;
        }
        return true;
    }


    handleReset () {

        this.setState({ ...this.state, ..._.cloneDeep(initialState) });
    }

    render() {

        const { loading, minAb, stats, response } = this.state;

        return (
            <Container fluid>
                <Segment>
                    <List horizontal>
                        {Object.keys(stats).map((s) => {

                            const active = stats[s].active;

                            return (
                                <List.Item key={s}>
                                    <Checkbox
                                        checked={active}
                                        onChange={(e) => this.handleCheck(s, e)}
                                        label={s}
                                    />
                                </List.Item>
                            )
                        })}
                    </List>
                </Segment>
                <Table collapsing>
                    <Table.Body>
                    <Table.Row>
                        <Table.Cell>Stat</Table.Cell>
                        <Table.Cell>Min</Table.Cell>
                        <Table.Cell>Max</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>ab</Table.Cell>
                        <Table.Cell>
                            <Input
                                onChange={(e) => this.setState({ minAb: e.target.value })}
                                type='number'
                                value={minAb}
                                min={1}
                            />
                        </Table.Cell>
                        <Table.Cell>N/A</Table.Cell>
                    </Table.Row>
                        {Object.keys(stats).map((s) => {

                            const active = stats[s].active;

                            if (!active) {
                                return;
                            }

                            const min = stats[s].min;
                            const max = stats[s].max;

                            return (
                            <Table.Row key={s}>
                                <Table.Cell>
                                    {s}
                                </Table.Cell>
                                <Table.Cell>
                                    <Input
                                        onChange={(e) => this.handleChange('min', s, e.target.value)}
                                        type='number'
                                        min={0}
                                        value={min}
                                    />
                                </Table.Cell>
                                <Table.Cell>
                                    <Input
                                        onChange={(e) => this.handleChange('max', s, e.target.value)}
                                        type={+max ? 'number' : 'text'}
                                        min={0}
                                        value={+max ? max : 'N/A'}
                                        />
                                </Table.Cell>
                            </Table.Row>
                            )
                        })}
                    </Table.Body>
                </Table>
                <Button 
                    disabled={!this.isButtonEnabled()}
                    onClick={() => this.handleSubmit()}
                >
                    Submit
                </Button>
                <Button onClick={() => this.handleReset()} content='Reset' />
                { loading && <Segment><Loader active /></Segment>}
                { response.length > 0 && <BattingStatsTable statlineArray={response} />}
            </Container>
        )
    }
}

module.exports = StatQuery;
