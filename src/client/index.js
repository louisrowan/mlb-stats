const React = require('react');
const ReactDOM = require('react-dom');
const {
    Link,
    Route,
    BrowserRouter
} = require('react-router-dom');

const { Provider } = require('react-redux');
const Store = require('./redux/store');

const Fangraphs = require('./containers/Fangraphs');
const FindSimilar = require('./containers/FindSimilar');
const Footer = require('./containers/Footer');
const Home = require('./containers/Home');
const NavBar = require('./containers/NavBar');
const PlayerSearch = require('./containers/PlayerSearch');
const StatQuery = require('./containers/StatQuery');

require('./styles.css');

const App = () => {

    return (
        <Provider store={Store}>
            <BrowserRouter>
                <div>
                    <Route path='/' component={NavBar} />
                    <Route path='/' exact component={Home} />
                    <Route path='/fangraphs' component={Fangraphs} />
                    <Route path='/similarBatting' component={FindSimilar} />
                    <Route path='/similarPitching' component={FindSimilar} />
                    <Route path='/queryBatting' component={StatQuery} />
                    <Route path='/queryPitching' component={StatQuery} />
                    <Route path='/playerSearch' component={PlayerSearch} />
                    <Route path='/' component={Footer} />
                </div>
            </BrowserRouter>
        </Provider>
    )
}

ReactDOM.render(<App />, document.getElementById('root'));
