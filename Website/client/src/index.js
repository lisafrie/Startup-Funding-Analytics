import React from 'react';
import ReactDOM from 'react-dom';
import {
	BrowserRouter as Router,
	Route,
	Switch
} from 'react-router-dom';

import "./styles.css";

import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import CompanyPage from './pages/CompanyPage';
import InvestorPage from './pages/InvestorPage';
import 'antd/dist/antd.css';

import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css"

ReactDOM.render(
  <div>
    <Router>
      <Switch>
        <Route exact
				path="/"
				render={() => (
					<HomePage />
				)}/>
		<Route exact
				path="/dashboard"
					render={() => (
						<DashboardPage />
				)} />
		<Route exact
				path="/company"
				render={() => (
					<CompanyPage />
				)}/>
		<Route exact
				path="/investor"
				render={() => (
					<InvestorPage />
				)}/>
      </Switch>
    </Router>
  </div>,
  document.getElementById('root')
);

