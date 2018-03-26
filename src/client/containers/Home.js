const React = require('react');
const { Link } = require('react-router-dom');
const { Container, Header, Segment } = require('semantic-ui-react');

const Home = (props) => {

    return (
        <Container fluid>
            <Segment.Group>
                <Segment>
                    <Header as='h2' content='MLB Graphs' />
                    <Header as='h5' content='About' />
                    <p>
                        This application provides a quick search interface for the <a href='http://www.seanlahman.com/baseball-archive/statistics/' target='_blank'>Lahman Baseball Database</a>, a comprehensive dataset of Major League Baseball statistics from 1871 to 2016. The data contains over <b>18,000</b> individual players and <b>100,000</b> yearly batting lines.
                    </p>
                    <p>
                        The <Link to='/playerSearch'>Player Search</Link> page allows for querying by name, organizations and positions. <Link to='query'>Batting Stats Search</Link> allows for custom querying of specific yearly performance in common statistics, as well as specified age, year performed, and minimum at-bat count.
                    </p>
                </Segment>
            </Segment.Group>
        </Container>
    )
}


module.exports = Home;
