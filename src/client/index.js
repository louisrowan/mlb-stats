const React = require('react');
const ReactDOM = require('react-dom');
const {
    Link,
    Route,
    BrowserRouter
} = require('react-router-dom');

const { Provider } = require('react-redux');
const Store = require('./redux/store');

const NavBar = require('./containers/NavBar');
const PlayerSearch = require('./containers/PlayerSearch');
const StatQuery = require('./containers/StatQuery');

const App = () => {

    return (
        <Provider store={Store}>
            <BrowserRouter>
                <Route to='/'>
                <div>
                    <NavBar />
                    <Route path='/query' component={StatQuery} />
                    <Route path='/playerSearch' component={PlayerSearch} />
                </div>
                </Route>
            </BrowserRouter>
        </Provider>
    )
}

ReactDOM.render(<App />, document.getElementById('root'));
