const React = require('react');
const ReactDOM = require('react-dom');
const { Route, BrowserRouter } = require('react-router-dom');

const Home = require('./Home');

const App = () => {

    return (
        <BrowserRouter>
            <Route path='/' component={Home} />
        </BrowserRouter>
    )
}

ReactDOM.render(<App />, document.getElementById('root'));
