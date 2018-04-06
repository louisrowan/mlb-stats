const React = require('react');
const Axios = require('axios');
const _ = require('lodash');

const { connect } = require('react-redux');
const { bindActionCreators } = require('redux');
const {
    statqueryUpdateLoading,
    statqueryFetchBattingLinesSuccess,
    statqueryFetchBattingLinesFailure,
    statqueryUpdateMinAbIp,
    statqueryUpdateMinAge,
    statqueryUpdateMaxAge,
    statqueryUpdateMinYear,
    statqueryUpdateMaxYear,
    statqueryToggleStatActive,
    statqueryUpdateStatValue,
    statqueryReset,
    statqueryUpdateType
} = require('../redux/modules/statQuery');

const {
    Button,
    Checkbox,
    Container,
    Header,
    List,
    Loader,
    Segment
 } = require('semantic-ui-react');

const Common = require('../common');

const BattingStatsTable = require('../components/BattingStatsTable');
const StatMatchForm = require('../components/StatMatchForm');
const StatSelectList = require('../components/StatSelectList');


const HowTo = (props) => {

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


    componentDidMount = () => {

        this.props.statqueryReset();
        const type = this.props.location.pathname.includes('Batting') ? 'Batting' : 'Pitching'
        this.props.statqueryUpdateType(type);
    };


    handleSubmit = () => {

        const payload = Common.createStatlinePayload({
            minAbIp: this.props.minAbIp,
            minAge: this.props.minAge,
            maxAge: this.props.maxAge,
            minYear: this.props.minYear,
            maxYear: this.props.maxYear,
            stats: this.props.stats
        });

        this.props.statqueryUpdateLoading(true);
        Axios.post(`/api/stats/${this.props.type.toLowerCase()}Lines`, { payload })
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

                if (stat.direction === 'positive') {
                    if (!stat.min && stat.min !== 0) {
                        missingVal = true;
                    }
                }
                else {
                    if (!stat.max) {
                        missingVal = true;
                    }
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
            minAbIp,
            minAge,
            maxAge,
            minYear,
            maxYear,
            stats,
            type,
            statqueryUpdateMinAbIp,
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
                <StatSelectList
                    stats={stats}
                    toggleStatActive={statqueryToggleStatActive}
                />
                <StatMatchForm 
                    minAbIp={minAbIp}
                    updateMinAbIp={statqueryUpdateMinAbIp}
                    minYear={minYear}
                    updateMinYear={statqueryUpdateMinYear}
                    maxYear={maxYear}
                    updateMaxYear={statqueryUpdateMaxYear}
                    minAge={minAge}
                    updateMinAge={statqueryUpdateMinAge}
                    maxAge={maxAge}
                    updateMaxAge={statqueryUpdateMaxAge}
                    stats={stats}
                    updateStatValue={statqueryUpdateStatValue}
                    toggleStatActive={statqueryToggleStatActive}
                    type={type}
                />
                <Button
                    color='green'
                    disabled={!this.isButtonEnabled()}
                    onClick={() => this.handleSubmit()}
                    content='Submit'
                />
                <Button onClick={() => statqueryReset()} content='Reset' />
            { loading &&
                <Segment><Loader active /></Segment>
            }
            { hasData && 
                <Container fluid>
                    <br />
                    <Header as='h4' content={`Your search contained ${battingLinesArray.length} result${battingLinesArray.length === 1 ? '' : 's'}`} />
                { battingLinesArray.length > 0 &&
                    <BattingStatsTable statlineArray={battingLinesArray} type={type} />
                }
                </Container>
            }
            { !hasData && <HowTo /> }
            </Container>
        )
    }
}


const mapStateToProps = (state) => {

    return {
        battingLinesArray: state.statQuery.battingLinesArray,
        hasData: state.statQuery.hasData,
        loading: state.statQuery.loading,
        minAbIp: state.statQuery.minAbIp,
        minAge: state.statQuery.minAge,
        maxAge: state.statQuery.maxAge,
        minYear: state.statQuery.minYear,
        maxYear: state.statQuery.maxYear,
        stats: state.statQuery.stats,
        type: state.statQuery.type
    }
}

const mapDispatchToProps = (dispatch) => {

    return bindActionCreators({
        statqueryUpdateLoading,
        statqueryFetchBattingLinesSuccess,
        statqueryFetchBattingLinesFailure,
        statqueryUpdateMinAbIp,
        statqueryUpdateMinAge,
        statqueryUpdateMaxAge,
        statqueryUpdateMinYear,
        statqueryUpdateMaxYear,
        statqueryToggleStatActive,
        statqueryUpdateStatValue,
        statqueryReset,
        statqueryUpdateType
    }, dispatch);
}


module.exports = connect(mapStateToProps, mapDispatchToProps)(StatQuery);
