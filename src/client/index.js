const React = require('react');
const ReactDOM = require('react-dom');
const {
    Link,
    Route,
    BrowserRouter
} = require('react-router-dom');

const { Provider } = require('react-redux');
const Store = require('./redux/store');

const NavBar = require('./NavBar');
const Home = require('./Home');
const StatQuery = require('./StatQuery');

const App = () => {

    return (
        <Provider store={Store}>
            <BrowserRouter>
                <Route to='/'>
                <div>
                    <NavBar />
                    <Route path='/query' component={StatQuery} />
                    <Route path='/home' component={Home} />
                </div>
                </Route>
            </BrowserRouter>
        </Provider>
    )
}

ReactDOM.render(<App />, document.getElementById('root'));
