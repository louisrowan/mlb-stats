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
    statqueryUpdateMinAb,
    statqueryUpdateMinAge,
    statqueryUpdateMaxAge,
    statqueryUpdateMinYear,
    statqueryUpdateMaxYear,
    statqueryToggleStatActive,
    statqueryUpdateStatValue,
    statqueryReset
} = require('../redux/modules/statQuery');

const Common = require('../common');

const BattingStatsTable = require('../components/BattingStatsTable');
const StatMatchForm = require('../components/StatMatchForm');
const StatSelectList = require('../components/StatSelectList');


class FindSimilar extends React.Component {

    constructor (props) {

        super(props);

        this.state = {
            lineToMatch: {},
            lineToMatchId: '',
            modalOpen: false,
            variance: 0
        }
    }

    componentDidMount () {

        this.props.statqueryReset();

        const playerIdYear = this.props.location.search.slice(1);

        this.setState({
            lineToMatchId: playerIdYear
        });

        const [id, year] = playerIdYear.split('-');

        Axios.get('/api/players/' + id + '/batting/' + year)
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

        Object.keys(stats).forEach((stat) => {

            statqueryToggleStatActive(stat);
            const lineToMatchValue = lineToMatch[stat];
            const min = lineToMatchValue - (lineToMatchValue/variance) || 0;
            const max = lineToMatchValue + (lineToMatchValue/variance);

            statqueryUpdateStatValue(stat, 'min', min);
            statqueryUpdateStatValue(stat, 'max', max);
        });
    }

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

                console.log(this.state.lineToMatchId);
                console.log(res.data);

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

        const hasData = Object.keys(lineToMatch).length > 0;

        const modal = (
        <Modal open={modalOpen}>
            <Header
                as='h3'
                textAlign='center'
                content='Select Variance Level'
            />
            <Modal.Content>
                <Header
                    as='h3'
                    textAlign='center'
                    content={`${variance} %`}
                />
                <Input
                    fluid
                    min={0}
                    max={50}
                    type='range'
                    onChange={(e) => this.setState({ variance: e.target.value })}
                    value={variance}
                />
                <Button
                    fluid
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
                    <BattingStatsTable statlineArray={[lineToMatch]} />
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
                        onClick={() => this.handleSubmit()}
                        content='Submit'
                    />
                { loading &&
                    <Segment><Loader active /></Segment>
                }
                { hasMatchingData && 
                    <Container fluid>
                        <Header
                            as='h4'
                            content={`Your search contained ${battingLinesArray.length} result${battingLinesArray.length === 1 ? '' : 's'}`}
                        />
                    { battingLinesArray.length > 0 &&
                        <BattingStatsTable statlineArray={battingLinesArray} />
                    }
                    </Container>
                }
                    </Container>
                }
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            </Container>
        )
    }
}


const mapStateToProps = (state) => {

    return {
        battingLinesArray: state.statQuery.battingLinesArray,
        hasMatchingData: state.statQuery.hasData,
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


module.exports = connect(mapStateToProps, mapDispatchToProps)(FindSimilar);
