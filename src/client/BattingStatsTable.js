const React = require('react');

const { connect } = require('react-redux');
const { bindActionCreators } = require('redux')
const { statquerySortBattingStats } = require('./redux/modules/statQuery');

const { Icon, Table } = require('semantic-ui-react');


class BattingStatsTable extends React.Component {

    constructor (props) {

        super (props);
    }


    render () {

        const {
            sorted,
            statlineArray,
            statquerySortBattingStats
        } = this.props;

        return (
            <Table>
                <Table.Body>
                    <Table.Row>
                        {Object.keys(statlineArray[0]).map((header) => {

                            const isSorted = sorted.stat === header;
                            const isSortedDesc = (isSorted && sorted.direction === 'desc');

                            return (
                                <Table.Cell
                                    key={header}
                                    onClick={() => statquerySortBattingStats(header)}
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

                                    const isSorted = sorted.stat === stat;

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

const mapStateToProps = state => {
    return {
        sorted: state.statQuery.sorted,
        statlineArray: state.statQuery.battingLinesArray
    }
}

const mapDispatchToProps = dispatch => {

    return bindActionCreators({
        statquerySortBattingStats
    }, dispatch);
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(BattingStatsTable);
