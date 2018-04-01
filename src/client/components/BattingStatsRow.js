const React = require('react');
const { Link } = require('react-router-dom');
const { Table } = require('semantic-ui-react');

const BattingStatsRow = (props) => {

    const { year, sortedStat } = props;

    return (
        <Table.Row>
            {Object.keys(year).map((stat) => {

                if (stat[0] === '_') {
                    return;
                }

                const isSorted = sortedStat === stat;

                let content;
                if (stat === 'name') {
                    content = <Link to={'/playerSearch?' + year._id} >{year[stat]}</Link>;
                }
                else {
                    content = year[stat];
                }

                return (
                    <Table.Cell
                        key={stat}
                        positive={isSorted}
                    >
                        { content }
                    </Table.Cell>
                )
            })}
            <Table.Cell>
                <Link to={'/similar?' + year._id + '-' + year.year}>Find Similar</Link>
            </Table.Cell>
        </Table.Row>
    )
};


module.exports = BattingStatsRow;
