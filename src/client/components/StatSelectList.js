const React = require('react');
const {
    Checkbox,
    List,
    Segment
} = require('semantic-ui-react');


const StatSelectList = (props) => {

    const {
        stats,
        toggleStatActive
    } = props;

    const listItems = Object.keys(stats).map((s) => {

        const active = stats[s].active;
        return (
            <List.Item key={s}>
                <Checkbox
                    checked={active}
                    onChange={() => toggleStatActive(s)}
                    label={s}
                />
            </List.Item>
        )
    });

    return (
        <Segment>
            <List horizontal>
                { listItems }
            </List>
        </Segment>
    )
};


module.exports = StatSelectList;
