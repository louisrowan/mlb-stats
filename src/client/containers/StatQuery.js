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
    statqueryUpdateMinAge,
    statqueryUpdateMaxAge,
    statqueryUpdateMinYear,
    statqueryUpdateMaxYear,
    statqueryToggleStatActive,
    statqueryUpdateStatValue,
    statqueryReset
} = require('../redux/modules/statQuery');

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

const BattingStatsTable = require('../components/BattingStatsTable');


const Footer = (props) => {

    return (
        <Segment>
            <Header as='h3' content='How to Use' />
            <p>
                This interface is provided to query all <b>100,000</b> MLB seasonal batting lines for custom performance. Allows for minimum and max (if desired) performance for the shown statistics, as well as control over age, year, and minimum at-bat count.
            </p>
        </Segment>
    )
}



class StatQuery extends React.Component {

    constructor (props) {

        super (props);
    };


    createPayload = () => {

        const {
            minAb,
            minAge,
            maxAge,
            minYear,
            maxYear,
            stats
        } = this.props;

        const payload = {
            stats: {},
            minAb,
            minAge,
            maxAge,
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
            minAge,
            maxAge,
            minYear,
            maxYear,
            stats,
            statqueryUpdateMinAb,
            statqueryUpdateMinAge,
            statqueryUpdateMaxAge,
            statqueryUpdateMinYear,
            statqueryUpdateMaxYear,
            statqueryToggleStatActive,
            statqueryUpdateStatValue,
            statqueryReset
        } = this.props;

        return (
            <Container fluid style={{ overflow: 'auto' }}>
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
                    <Table.Row>
                        <Table.Cell>Age</Table.Cell>
                        <Table.Cell>
                            <Input
                                onChange={(e) => statqueryUpdateMinAge(e.target.value)}
                                type='number'
                                value={minAge}
                                min={0}
                                max={100}
                            />
                        </Table.Cell>
                        <Table.Cell>
                            <Input
                                onChange={(e) => statqueryUpdateMaxAge(e.target.value)}
                                type='number'
                                value={maxAge}
                                min={0}
                                max={100}
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
                                <Table.Cell>
                                    <Button
                                        onClick={(e) => statqueryToggleStatActive(s)}
                                        icon='cancel'
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
                    <BattingStatsTable statlineArray={battingLinesArray} />
                }
                </Container>
            }
            <Footer />
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
        minAge: state.statQuery.minAge,
        maxAge: state.statQuery.maxAge,
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
        statqueryUpdateMinAge,
        statqueryUpdateMaxAge,
        statqueryUpdateMinYear,
        statqueryUpdateMaxYear,
        statqueryToggleStatActive,
        statqueryUpdateStatValue,
        statqueryReset
    }, dispatch);
}


module.exports = connect(mapStateToProps, mapDispatchToProps)(StatQuery);
