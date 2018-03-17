const React = require('react');

const { Link } = require('react-router-dom');

const { Button, Segment } = require('semantic-ui-react');

const NavBar = () => {

    return (
        <Segment inverted color='green'>
            <Link to='/query'>
                <Button content='Query' />
            </Link>
            <Link to='/home'>
                <Button content='Home' />
            </Link>
        </Segment>
    )
}

module.exports = NavBar;
