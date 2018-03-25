const React = require('react');

const { Link } = require('react-router-dom');

const { Button, Segment } = require('semantic-ui-react');

const NavBar = () => {

    return (
        <Segment inverted color='green'>
            <Link to='/query'>
                <Button content='Batting Stats Search' />
            </Link>
            <Link to='/playerSearch'>
                <Button content='Player Search' />
            </Link>
        </Segment>
    )
}

module.exports = NavBar;
