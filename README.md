# mlb-stats

## About
This React/Redux/Express webapp provides an interface to search the [Lahman baseball database](http://www.seanlahman.com/baseball-archive/statistics/) for batting (and in the future, pitching) statistics for all 18,000 Major League Baseball players dating back to 1871.

Current functionality includes searching for specific yearly parameters (maximum and minimum performance in common stats such as OPS, HR, Batting Average), as well as custom specifications for minmum At-bats, year, and age. Response time for these complex queries is often under 1 second and still improving.


To run locally:

    npm install
    node_modules/.bin/webpack
    npm run server

Open a browser and direct yourself to [http://localhost:3001](http://localhost:3001)

## Deployment
Deployed on a Ubuntu machine from [Digital Ocean](https://www.digitalocean.com/) at [Rotosearch.com](http://rotosearch.com/)
