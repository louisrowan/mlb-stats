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

    const listItems = Object.keys(stats).map((name) => {

        const stat = stats[name];

        const active = stat.active;
        return (
            <List.Item key={name}>
                <Checkbox
                    checked={active}
                    onChange={() => toggleStatActive(name)}
                    label={name}
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
