const React = require('react');
const { Container, Grid, Icon, Segment } = require('semantic-ui-react');

const Footer = (props) => {

    return (
        <Container fluid>
            <Container
                style={{
                    width: '100%',
                    height: '80px'
                }}
            />
            <Segment
                size='mini'
                color='green'
                style={{
                    position: 'fixed',
                    bottom: '0px',
                    width: '100%',
                    height: '50px'
                }}
            >
                <Grid textAlign='center' verticalAlign='middle'>
                    <Grid.Row columns={2}>
                        <Grid.Column>
                            <a href='http://github.com/louisrowan/mlb-stats' target='_blank'><Icon size='big' name='github' /></a>
                        </Grid.Column>
                        <Grid.Column>
                            <p>2018 Louis Rowan</p>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Segment>
        </Container>
    )
}

module.exports = Footer;
