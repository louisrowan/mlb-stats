const React = require('react');
const Axios = require('axios');
const _ = require('lodash');

const { connect } = require('react-redux');
const { bindActionCreators } = require('redux')
const {
    statqueryUpdateLoading,
    statqueryFetchBattingLinesSuccess,
    statqueryFetchBattingLinesFailure,
    statqueryUpdateMinAb,
    statqueryUpdateMinYear,
    statqueryUpdateMaxYear,
    statqueryToggleStatActive,
    statqueryUpdateStatValue,
    statqueryReset
} = require('./redux/modules/statQuery');

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



class StatQuery extends React.Component {

    constructor (props) {

        super (props);
    };


    createPayload = () => {

        const { minAb, minYear, maxYear, stats } = this.props;

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
        return payload;
    };


    handleSubmit = () => {

        const payload = this.createPayload();

        this.props.statqueryUpdateLoading(true);
        Axios.post('/api/stats/battingLines', { payload })
            .then(res => {

                this.props.statqueryFetchBattingLinesSuccess(res.data);
            })
            .catch(err => {

                this.props.statqueryFetchBattingLinesFailure();
            });
    };


    isButtonEnabled = () => {

        const { stats } = this.props;

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
    };


    render = () => {

        const {
            battingLinesArray,
            hasData,
            loading,
            minAb,
            minYear,
            maxYear,
            stats,
            statqueryUpdateMinAb,
            statqueryUpdateMinYear,
            statqueryUpdateMaxYear,
            statqueryToggleStatActive,
            statqueryUpdateStatValue,
            statqueryReset
        } = this.props;

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
                                        onChange={() => statqueryToggleStatActive(s)}
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
                                onChange={(e) => statqueryUpdateMinAb(e.target.value)}
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
                                onChange={(e) => statqueryUpdateMinYear(e.target.value)}
                                type='number'
                                value={minYear}
                                min={1891}
                                max={2016}
                            />
                        </Table.Cell>
                        <Table.Cell>
                            <Input
                                onChange={(e) => statqueryUpdateMaxYear(e.target.value)}
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
                                        onChange={(e) => statqueryUpdateStatValue(s, 'min', e.target.value)}
                                        type='number'
                                        min={0}
                                        value={min}
                                        error={!min}
                                    />
                                </Table.Cell>
                                <Table.Cell>
                                    <Input
                                        onChange={(e) => statqueryUpdateStatValue(s, 'max', e.target.value)}
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
                <Button onClick={() => statqueryReset()} content='Reset' />
            { loading &&
                <Segment><Loader active /></Segment>
            }
            { hasData && 
                <Container fluid>
                    <Header as='h4' content={`Your search contained ${battingLinesArray.length} result${battingLinesArray.length === 1 ? '' : 's'}`} />
                { battingLinesArray.length > 0 &&
                    <BattingStatsTable />
                }
                </Container>
            }
            </Container>
        )
    }
}


const mapStateToProps = (state) => {

    return {
        battingLinesArray: state.statQuery.battingLinesArray,
        hasData: state.statQuery.hasData,
        loading: state.statQuery.loading,
        minAb: state.statQuery.minAb,
        minYear: state.statQuery.minYear,
        maxYear: state.statQuery.maxYear,
        stats: state.statQuery.stats
    }
}

const mapDispatchToProps = (dispatch) => {

    return bindActionCreators({
        statqueryUpdateLoading,
        statqueryFetchBattingLinesSuccess,
        statqueryFetchBattingLinesFailure,
        statqueryUpdateMinAb,
        statqueryUpdateMinYear,
        statqueryUpdateMaxYear,
        statqueryToggleStatActive,
        statqueryUpdateStatValue,
        statqueryReset
    }, dispatch);
}


module.exports = connect(mapStateToProps, mapDispatchToProps)(StatQuery);
