const express = require('express');
const mysql      = require('mysql');
var cors = require('cors')


const routes = require('./routes')
const config = require('./config.json')

const app = express();

// whitelist localhost 3000
app.use(cors({ credentials: true, origin: ['http://localhost:3000'] }));

// Route 0 - register as GET 
app.get('/', routes.home)

// Route 1 - register as GET
app.get('/timeseries_funding', routes.timeseries_funding)

// Route 2 - register as GET
app.get('/timeseries_count_funding', routes.timeseries_count_funding)

// Route 3 - register as GET
app.get('/timeseries_founding_dates', routes.timeseries_founding_dates)

// Route 4 - register as GET
app.get('/market_funding_share', routes.market_funding_share)

// Route 5 - register as GET
app.get('/international_funding', routes.international_funding)

// Route 6 - register as GET
app.get('/dashboard', routes.populate_us_heatmap)

// Route 7 - register as GET
app.get('/search_companies', routes.search_companies)
 
// Route 8 - register as GET
app.get('/company', routes.company)
 
// Route 9 - register as GET
app.get('/company_rounds', routes.company_rounds)

// Route 10 - register as GET
app.get('/company_investors', routes.company_investors)

// Route 11 - register as GET
app.get('/search_investors', routes.search_investors)

// Route 12 - register as GET
app.get('/investor', routes.investor)

// Route 13 - register as GET
app.get('/investor_companies', routes.investor_companies)


app.listen(config.server_port, () => {
    console.log(`Server running at http://${config.server_host}:${config.server_port}/`);
});

module.exports = app;
