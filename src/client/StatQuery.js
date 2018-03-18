const React = require('react');
const Axios = require('axios');
const _ = require('lodash');

const {
    Button,
    Checkbox,
    Container,
    Header,
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
initialState.minYear = 1891;
initialState.maxYear = 2006;

class StatQuery extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            ..._.cloneDeep(initialState),
            battingLinesArray: [],
            hasData: false,
            loading: false
        }

        this.handleUpdateStatMinMax = this.handleUpdateStatMinMax.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCheckboxClick = this.handleCheckboxClick.bind(this);
        this.handleReset = this.handleReset.bind(this);
    };


    handleCheckboxClick (stat, event) {

        const stats = { ...this.state.stats }

        stats[stat].active = !stats[stat].active;

        this.setState({
            stats
        });
    };


    handleUpdateStatMinMax (type, stat, value) {

        const state = { ...this.state };

        state.stats[stat][type] = value;

        this.setState({
            stats: state.stats
        });
    };


    handleSubmit () {

        const { minAb, minYear, maxYear, stats } = this.state;

        const payload = {
            stats: {},
            minAb,
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

        this.setState({
            loading: true
        });

        Axios.post('/api/stats/battingLines', { payload })
            .then(res => {

                console.log('data?', res.data);

                this.setState({
                    hasData: true,
                    battingLinesArray: res.data,
                    loading: false
                });
            })
            .catch(err => {

                this.setState({
                    hasData: false,
                    loading: false,
                    battingLinesArray: []
                });

                console.error('err?', err);
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

        const {
            hasData,
            loading,
            minAb,
            minYear,
            maxYear,
            stats,
            battingLinesArray
        } = this.state;

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
                                        onChange={(e) => this.handleCheckboxClick(s, e)}
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
                    <Table.Row>
                        <Table.Cell>Years</Table.Cell>
                        <Table.Cell>
                            <Input
                                onChange={(e) => this.setState({ minYear: e.target.value })}
                                type='number'
                                value={minYear}
                                min={1891}
                                max={2016}
                            />
                        </Table.Cell>
                        <Table.Cell>
                            <Input
                                onChange={(e) => this.setState({ maxYear: e.target.value })}
                                type='number'
                                value={maxYear}
                                min={1891}
                                max={2016}
                            />
                        </Table.Cell>
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
                                        onChange={(e) => this.handleUpdateStatMinMax('min', s, e.target.value)}
                                        type='number'
                                        min={0}
                                        value={min}
                                    />
                                </Table.Cell>
                                <Table.Cell>
                                    <Input
                                        onChange={(e) => this.handleUpdateStatMinMax('max', s, e.target.value)}
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
            { loading &&
                <Segment><Loader active /></Segment>
            }
            { hasData && 
                <Container>
                    <Header as='h4' content={`Your search contained ${battingLinesArray.length} result${battingLinesArray.length === 1 ? '' : 's'}`} />
                { battingLinesArray.length > 0 &&
                    <BattingStatsTable statlineArray={battingLinesArray} />
                }
                </Container>
            }
            </Container>
        )
    }
}

module.exports = StatQuery;
