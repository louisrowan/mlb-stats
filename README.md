# mlb-stats

[Rotosearch.com](http://rotosearch.com/)

### About
This React/Redux/Express webapp provides an interface to search the [Lahman baseball database](http://www.seanlahman.com/baseball-archive/statistics/) for batting (soon: pitching) statistics for all 18,000 Major League Baseball players (totalling over 180,000 individual batting lines) dating back to 1871.

### Current functionality
* Search by name and organization
* Custom search matching specified statistical parameters
* Filter for minimum at-bats, year and age windows
* Search from any individual batting line for others with similar performance
* Search results return in under 100ms


### Run locally:
    npm install -g node-gyp
    npm install
    node_modules/.bin/webpack --watch
    npm run server

Open a browser and direct yourself to [http://localhost:3001](http://localhost:3001)

### Deployment
Deployed on a Ubuntu machine from [Digital Ocean](https://www.digitalocean.com/) at [Rotosearch.com](http://rotosearch.com/)
