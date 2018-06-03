const React = require('react');
const { Link } = require('react-router-dom');
const { Button, Segment } = require('semantic-ui-react');

const NavBar = (props) => {

    const { pathname } = props.location;

    return (
        <Segment inverted color='green'>
            <Link to='/'>
                <Button inverted={pathname === '/' ? true : false} content='Home' />
            </Link>
            <Link to='/queryBatting'>
                <Button inverted={pathname === '/queryBatting' ? true : false} content='Batting Stats Search' />
            </Link>
            <Link to='/queryPitching'>
                <Button inverted={pathname === '/queryPitching' ? true : false} content='Pitching Stats Search' />
            </Link>
            <Link to='/playerSearch'>
                <Button inverted={pathname === '/playerSearch' ? true : false} content='Player Search' />
            </Link>
            <Link to='/fangraphs'>
                <Button inverted={pathname === '/fangraphs' ? true : false} content='Fangraphs Search' />
            </Link>
        </Segment>
    )
}

module.exports = NavBar;
