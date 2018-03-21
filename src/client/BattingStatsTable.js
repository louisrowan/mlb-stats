const React = require('react');

const { connect } = require('react-redux');
const { bindActionCreators } = require('redux')
const { statquerySortBattingStats } = require('./redux/modules/statQuery');

const { Table } = require('semantic-ui-react');


class BattingStatsTable extends React.Component {

    constructor (props) {

        super (props);
    }


    render () {

        const {
            statlineArray,
            statquerySortBattingStats
        } = this.props;

        return (
            <Table>
                <Table.Body>
                    <Table.Row>
                        {Object.keys(statlineArray[0]).map((header) => <Table.Cell
                            key={header}
                            onClick={() => statquerySortBattingStats(header, 'positive')}
                            >{header}</Table.Cell>)}
                    </Table.Row>
                    {statlineArray.map((year, index) => {

                        return (
                            <Table.Row key={index}>
                                {Object.keys(year).map((stat) => {

                                    return <Table.Cell key={stat}>{year[stat]}</Table.Cell>
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
        statlineArray: state.statQuery.battingLinesArray
    }
}

const mapDispatchToProps = dispatch => {

    return bindActionCreators({
        statquerySortBattingStats
    }, dispatch);
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(BattingStatsTable);
