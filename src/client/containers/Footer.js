const React = require('react');
const { Grid, Icon, Segment } = require('semantic-ui-react');

const Footer = (props) => {

    return (
        <Segment
            size='mini'
            color='green'
            style={{
                position: 'fixed',
                bottom: '0px',
                width: '100%'
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
    )
}

module.exports = Footer;
