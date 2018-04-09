const React = require('react');
const Axios = require('axios');
const {
    Button,
    Container,
    Header,
    Input,
    Loader,
    Modal,
    Segment,
    Table
} = require('semantic-ui-react');

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

const Common = require('../common');

const BattingStatsTable = require('../components/BattingStatsTable');
const StatMatchForm = require('../components/StatMatchForm');
const StatSelectList = require('../components/StatSelectList');


const HowTo = (props) => {

    return (
        <Segment>
            <Header as='h3' content='How to Use' />
            <p>
                This interface starts with a single batting line and queries for similar lines based on the specified statistics and performance.
            </p>
        </Segment>
    )
}


class FindSimilar extends React.Component {

    constructor (props) {

        super(props);

        const type = this.props.location.pathname.includes('Batting') ? 'Batting' : 'Pitching'

        this.state = {
            lineToMatch: {},
            lineToMatchId: '',
            modalOpen: false,
            type,
            variance: 10
        }
    }

    componentDidMount () {

        const { type } = this.state;

        this.props.statqueryReset();
        this.props.statqueryUpdateType(type);

        const playerIdYear = this.props.location.search.slice(1);

        this.setState({
            lineToMatchId: playerIdYear
        });

        const [id, year] = playerIdYear.split('-');

        Axios.get(`/api/players/${id}/${type.toLowerCase()}/${year}`)
            .then(res => {

                this.setState({
                    lineToMatch: res.data,
                    modalOpen: true
                });
            })
            .catch(err => {

                console.log('err?', err);
            })
    }

    handleModalClose = () => {

        this.setState({
            modalOpen: false
        });

        this.handleOriginalData();
    }

    handleOriginalData = () => {

        const { lineToMatch, variance } = this.state;

        const {
            stats,
            statqueryToggleStatActive,
            statqueryUpdateStatValue
        } = this.props;

        const hackRound = (num) => { // temp fix until I rewrite to properly label type of stat

            if (num > 2) {
                return Math.floor(num);
            }
            return Math.round(num * 1000)/1000;
        }

        Object.keys(stats).forEach((stat) => {

            statqueryToggleStatActive(stat);
            const lineToMatchValue = lineToMatch[stat];
            const min = lineToMatchValue - (lineToMatchValue/variance) || 0;
            const max = lineToMatchValue + (lineToMatchValue/variance);

            statqueryUpdateStatValue(stat, 'min', hackRound(min));
            statqueryUpdateStatValue(stat, 'max', hackRound(max));
        });
    }

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
        Axios.post(`/api/stats/${this.state.type.toLowerCase()}Lines`, { payload })
            .then(res => {

                const results = res.data.filter((l) => {

                    const id = l._id + '-' + l.year.toString();
                    return id != this.state.lineToMatchId;
                });

                this.props.statqueryFetchBattingLinesSuccess(results);
            })
            .catch(err => {

                this.props.statqueryFetchBattingLinesFailure();
            });
    }

    render() {

        const {
            lineToMatch,
            modalOpen,
            variance
        } = this.state;

        const {
            battingLinesArray,
            hasMatchingData,
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

        const hasData = Object.keys(lineToMatch).length > 0;

        const modal = (
        <Modal open={modalOpen}>
            <Header
                as='h3'
                textAlign='center'
                content='Select Variance Level'
            />
            <Header
                as='h5'
                textAlign='center'
                content='Note: Smaller variance will yield fewer matching results'
            />
            <Modal.Content>
                <Header
                    as='h3'
                    textAlign='center'
                    content={`${variance} %`}
                />
                <Input
                    fluid
                    min={1}
                    max={50}
                    type='range'
                    onChange={(e) => this.setState({ variance: e.target.value })}
                    value={variance}
                />
                <Button
                    fluid
                    color='green'
                    onClick={this.handleModalClose}
                    content='Submit'
                />
            </Modal.Content>
        </Modal>)

        return (
            <Container fluid>
            { modalOpen && modal }
            { hasData &&
                <Container fluid>
                    <BattingStatsTable statlineArray={[lineToMatch]} type={type} />
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
                        onClick={() => this.handleSubmit()}
                        content='Submit'
                    />
                { loading &&
                    <Segment><Loader active /></Segment>
                }
                { hasMatchingData && 
                    <Container fluid>
                    <br />
                        <Header
                            as='h4'
                            content={`Your search contained ${battingLinesArray.length} result${battingLinesArray.length === 1 ? '' : 's'}`}
                        />
                    { battingLinesArray.length > 0 &&
                        <BattingStatsTable statlineArray={battingLinesArray} />
                    }
                    </Container>
                }
                { !hasMatchingData && <HowTo /> }
                    </Container>
            }
            </Container>
        )
    }
}


const mapStateToProps = (state) => {

    return {
        battingLinesArray: state.statQuery.battingLinesArray,
        hasMatchingData: state.statQuery.hasData,
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


module.exports = connect(mapStateToProps, mapDispatchToProps)(FindSimilar);
