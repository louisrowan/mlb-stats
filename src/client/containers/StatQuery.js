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
    List,
    Loader,
    Segment
 } = require('semantic-ui-react');

const Common = require('../common');

const BattingStatsTable = require('../components/BattingStatsTable');
const StatMatchForm = require('../components/StatMatchForm');
const StatSelectList = require('../components/StatSelectList');


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


    handleSubmit = () => {

        const payload = Common.createStatlinePayload({
            minAb: this.props.minAb,
            minAge: this.props.minAge,
            maxAge: this.props.maxAge,
            minYear: this.props.minYear,
            maxYear: this.props.maxYear,
            stats: this.props.stats
        });

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
                <StatSelectList
                    stats={stats}
                    toggleStatActive={statqueryToggleStatActive}
                />
                <StatMatchForm 
                    minAb={minAb}
                    updateMinAb={statqueryUpdateMinAb}
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
                />
                <Button 
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
