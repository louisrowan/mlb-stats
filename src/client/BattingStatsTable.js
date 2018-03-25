const React = require('react');

const { connect } = require('react-redux');
const { bindActionCreators } = require('redux')
const { statquerySortBattingStats } = require('./redux/modules/statQuery');

const { Icon, Table } = require('semantic-ui-react');


class BattingStatsTable extends React.Component {

    constructor (props) {

        super (props);

        this.state = {
            sortedStat: '',
            sortedDirection: '',
            statlineArray: this.props.statlineArray.slice(0) // copy statline array props into state so that it can be reordered in this component when sorted. Parent does not need to be updated on this since sorting is just a visual of data and alerting the parent to update its data is not needed for this use case. This also allows for multiple parents to use this child component without needing all of them to know how to handle sorted data.
        };
    }


    sortStats = (stat) => {

        const { sortedStat, sortedDirection, statlineArray } = this.state;

        let reverse = false;
        if (sortedStat === stat && sortedDirection === 'desc') {
            reverse = true;
        }

        const sorted = statlineArray.sort((a, b) => {

            if (a[stat] < b[stat]) {
                return reverse ? -1 : 1;
            }
            return reverse ? 1 : -1;
        });

        this.setState({
            statlineArray: sorted,
            sortedStat: stat,
            sortedDirection: reverse ? ' asc' : 'desc'
        });
    }


    render () {

        const {
            // sorted,
            // statlineArray,
            // statquerySortBattingStats
        } = this.props;

        const {
            sortedStat,
            sortedDirection,
            statlineArray
        } = this.state;

        console.log(statlineArray);

        return (
            <Table>
                <Table.Body>
                    <Table.Row>
                        {Object.keys(statlineArray[0]).map((header) => {

                            const isSorted = sortedStat === header;
                            const isSortedDesc = (isSorted && sortedDirection === 'desc');

                            return (
                                <Table.Cell
                                    key={header}
                                    onClick={() => this.sortStats(header)}
                                    singleLine
                                    active={isSorted}
                                    >
                                    {header}
                                    <Icon
                                        name={isSorted ? isSortedDesc ? 'sort descending' : 'sort ascending' : 'hand pointer'}
                                        size='small'
                                    />
                                </Table.Cell>
                            )
                        })}
                    </Table.Row>
                    {statlineArray.map((year, index) => {

                        return (
                            <Table.Row key={index}>
                                {Object.keys(year).map((stat) => {

                                    const isSorted = sortedStat === stat;

                                    return (
                                        <Table.Cell
                                            key={stat}
                                            positive={isSorted}
                                        >
                                            {year[stat]}
                                        </Table.Cell>
                                    )
                                })}
                            </Table.Row>
                        )
                    })}
                </Table.Body>
            </Table>
        )
    }
};

// const mapStateToProps = state => {
//     return {
//         sorted: state.statQuery.sorted,
//         statlineArray: state.statQuery.battingLinesArray
//     }
// }

// const mapDispatchToProps = dispatch => {

//     return bindActionCreators({
//         statquerySortBattingStats
//     }, dispatch);
// }

// module.exports = connect(mapStateToProps, mapDispatchToProps)(BattingStatsTable);
module.exports = BattingStatsTable;
