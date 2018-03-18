const React = require('react');

const { Table } = require('semantic-ui-react');


class BattingStatsTable extends React.Component {

    constructor (props) {
        super (props);

    }


    render () {

        const { statlineArray } = this.props;

        return (
            <Table>
                <Table.Body>
                    <Table.Row>
                        {Object.keys(statlineArray[0]).map((header) => <Table.Cell key={header}>{header}</Table.Cell>)}
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
}

module.exports = BattingStatsTable;
