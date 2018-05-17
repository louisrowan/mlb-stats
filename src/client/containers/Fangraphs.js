const React = require('react');
const Axios = require('axios');
const {
    Checkbox,
    Dropdown
} = require('semantic-ui-react');

const BattingStatsTable = require('../components/BattingStatsTable');


class Fangraphs extends React.Component {

    constructor (props) {

        super(props);

        this.state = {
            year: 2017,
            availableStats: {},
            selectedStats: {}
        };


        const payload = {
            year: 2017,
            stats: {
                ERA: 10
            }
        }

        Axios.post('/api/stats/fangraphs', { payload })
            .then(res => {

                console.log('post res', res);
            })
            .catch(err => {

                console.log('post err', err);
            });
    }

    componentDidMount () {

        Axios.get('/api/stats/fangraphs')
            .then(res => {

                this.setState({ availableStats: res.data });
            })
            .catch(err => {

                console.log('fg err', err);
            });
    }

    render () {

        const { availableStats, selectedStats } = this.state;
        console.log(availableStats);

        const hasAvailableStats = availableStats.length > 0;

        return (
            <div>
        { hasAvailableStats && 
                <Dropdown
                 fluid
                 options={availableStats}
                />
        }

            hi
            </div>
        )
    }
}


module.exports = Fangraphs;
