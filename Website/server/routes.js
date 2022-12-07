const config = require('./config.json')
const mysql = require('mysql');
const e = require('express');

// TODO: fill in your connection details here
const connection = mysql.createConnection({
    host: config.rds_host,
    user: config.rds_user,
    password: config.rds_password,
    port: config.rds_port,
    database: config.rds_db
});
connection.connect();


// ********************************************
//            SIMPLE ROUTE EXAMPLE
// ********************************************

// Route 0 (handler) NOTE: this is just an example route, not going to be used . . .
async function home(req, res) {
    // example route
    connection.query(`SELECT YEAR(date) AS year, SUM(amount_USD) AS total_funding, AVG(amount_USD) AS avg_investment
    FROM Financial_Entity f JOIN Round r ON f.ID = r.company_ID
    WHERE f.market LIKE "%Software%"
    GROUP BY YEAR(date)
    ORDER BY YEAR(date) DESC`, function (error, results, fields) {

        if (error) {
            console.log(error)
            res.json({ error: error })
        } else if (results) {
            res.json({ results: results })
        }
    });
}

// ********************************************
//            HOMEPAGE ROUTES
// ********************************************

// Route 1 (handler)
async function timeseries_funding(req, res) {
    // Returns total funding by year, filtered by market
    
    market = ""
    if (req.query.market) {market = req.query.market}
    
    connection.query(`SELECT YEAR(date) AS year, SUM(amount_USD) AS total_funding
    FROM Financial_Entity f JOIN (SELECT DISTINCT company_ID, round_number, date, amount_USD FROM Round) r ON f.ID = r.company_ID
    WHERE f.market LIKE "%${market}%" AND amount_USD IS NOT NULL
    GROUP BY YEAR(date)
    ORDER BY YEAR(date) DESC`, function (error, results, fields) {

        if (error) {
            console.log(error)
            res.json({ error: error })
        } else if (results) {
            res.json({ results: results })
        }
    });
}

// Route 2 (handler)
async function timeseries_count_funding(req, res) {
    // Returns count of funded companies by year, filtered by market
    
    market = ""
    if (req.query.market) {market = req.query.market}
    
    connection.query(`SELECT YEAR(date) AS year, COUNT(DISTINCT ID, round_number) AS funded_count
    FROM Financial_Entity f JOIN Round r ON f.ID = r.company_ID
    WHERE f.market LIKE "%${market}%"
    GROUP BY YEAR(date)
    ORDER BY YEAR(date) DESC`, function (error, results, fields) {

        if (error) {
            console.log(error)
            res.json({ error: error })
        } else if (results) {
            res.json({ results: results })
        }
    });
}

// Route 3 (handler)
async function timeseries_founding_dates(req, res) {
    // Returns count of startups founded by year, filtered by market
  
    market = ""
    if (req.query.market) {market = req.query.market}
 
    connection.query(`SELECT YEAR(founding_date) AS year, COUNT(DISTINCT ID) AS founded_count
    FROM Financial_Entity f JOIN Company c ON f.ID = c.company_ID
    WHERE market LIKE "%${market}%" AND YEAR(founding_date) IS NOT NULL
    GROUP BY YEAR(founding_date)
    ORDER BY YEAR(founding_date) DESC`, function (error, results, fields) {

        if (error) {
            console.log(error)
            res.json({ error: error })
        } else if (results) {
            res.json({ results: results })
        }
    });
}

// Route 4 (handler)
async function market_funding_share(req, res) {
    // Returns proportion of funds allocated to each market, filtered by year if specified
    
    const year = req.query.year
    
    if (year) {
    connection.query(`
      
    SELECT market, SUM(amount_USD) AS total_funding
    FROM Financial_Entity f JOIN (SELECT DISTINCT company_ID, round_number, date, amount_USD FROM Round) r ON f.ID = r.company_ID
    WHERE amount_USD IS NOT NULL AND YEAR(date) = ${year}
    GROUP BY market
    ORDER BY total_funding DESC
    
    `, function (error, results, fields) {

        if (error) {
            console.log(error)
            res.json({ error: error })
        } else if (results) {
            res.json({ results: results })
        }
    })}
    
    else {
      
    connection.query(`
      
    SELECT market, SUM(amount_USD) AS total_funding
    FROM Financial_Entity f JOIN (SELECT DISTINCT company_ID, round_number, date, amount_USD FROM Round) r ON f.ID = r.company_ID
    WHERE amount_USD IS NOT NULL
    GROUP BY market
    ORDER BY total_funding DESC
    
    `, function (error, results, fields) {

        if (error) {
            console.log(error)
            res.json({ error: error })
        } else if (results) {
            res.json({ results: results })
        }
    })};
}

// Route 5 (handler)
async function international_funding(req, res) {
    // Returns count of startups founded by year, filtered by market
  
    market = ""
    if (req.query.market) {market = req.query.market}
    year = ""
    if (req.query.year) {year = req.query.year}
    
    if (year) {
 
    connection.query(`WITH CleanedRound AS (
    SELECT company_ID, investor_ID, round_type, date
    FROM Round
    ),  CleanedCompany AS (
        SELECT id, country AS company_country
        FROM Financial_Entity
        WHERE is_a = "company" AND market LIKE "%${market}%" AND country IS NOT NULL
    ), CleanedInvestor AS (
        SELECT id, country AS investor_country
        FROM Financial_Entity
        WHERE is_a = "investor" AND market LIKE "%${market}%" AND country IS NOT NULL
    )
    SELECT round_type,
           SUM(IF(company_country != investor_country,1,0)) / COUNT(*) *
    100 AS percentage_international
    FROM CleanedRound r
        JOIN CleanedCompany c ON r.company_id = c.id
        JOIN CleanedInvestor i ON r.investor_id = i.id
    WHERE YEAR(date) = ${year}
    GROUP BY round_type
    ORDER BY SUM(IF(company_country != investor_country,1,0)) / COUNT(*)
    DESC`, function (error, results, fields) {

        if (error) {
            console.log(error)
            res.json({ error: error })
        } else if (results) {
            res.json({ results: results })
        }
    })}
    
    else {
    
    connection.query(`WITH CleanedRound AS (
    SELECT company_ID, investor_ID, round_type, date
    FROM Round
    ),  CleanedCompany AS (
        SELECT id, country AS company_country
        FROM Financial_Entity
        WHERE is_a = "company" AND market LIKE "%${market}%" AND country IS NOT NULL
    ), CleanedInvestor AS (
        SELECT id, country AS investor_country
        FROM Financial_Entity
        WHERE is_a = "investor" AND market LIKE "%${market}%" AND country IS NOT NULL
    )
    SELECT round_type, YEAR(date),
           SUM(IF(company_country != investor_country,1,0)) / COUNT(*) *
    100 AS percentage_international
    FROM CleanedRound r
        JOIN CleanedCompany c ON r.company_id = c.id
        JOIN CleanedInvestor i ON r.investor_id = i.id
    GROUP BY round_type
    ORDER BY SUM(IF(company_country != investor_country,1,0)) / COUNT(*)
    DESC`, function (error, results, fields) {

        if (error) {
            console.log(error)
            res.json({ error: error })
        } else if (results) {
            res.json({ results: results })
        }
    })};
}

// ********************************************
//            DASHBOARD ROUTES
// ********************************************

// Route 6 (handler)
async function populate_us_heatmap(req, res) {
  
    market = ""
    if (req.query.market) {market = req.query.market}
    
    kpi = "Count_of_Funded_Companies"
    if (req.query.kpi) {kpi = req.query.kpi}
    
    year = -1
    if (req.query.year) {year = req.query.year}
    
    if (kpi === "Net_Funding") {
  
      connection.query(`SELECT f.state,
      IFNULL(SUM(r.amount_USD),0) - IFNULL(SUM(r1.amount_USD),0) AS
      net_funding
      FROM Financial_Entity f
        JOIN Round r ON f.ID = r.company_ID
        JOIN Round r1 ON f.ID = r1.investor_ID
      WHERE state IS NOT NULL AND market LIKE "%${market}%" AND (YEAR(r.date) = ${year} OR ${year} = -1)
      GROUP BY f.state
      ORDER BY IFNULL(SUM(r.amount_USD),0) - IFNULL(SUM(r1.amount_USD),0)
      DESC`, function (error, results, fields) {

      if (error) {
      console.log(error)
      res.json({ error: error })
      } else if (results) {
      res.json({ results: results })
      }
    })}
    
    else if (kpi === "Total_Funding") {
      
      connection.query(`SELECT f.state,
      IFNULL(SUM(r.amount_USD),0) AS total_funding
      FROM Financial_Entity f
        JOIN Round r ON f.ID = r.company_ID
      WHERE state IS NOT NULL AND market LIKE "%${market}%" AND (YEAR(r.date) = ${year} OR ${year} = -1)
      GROUP BY f.state
      ORDER BY IFNULL(SUM(r.amount_USD),0)
      DESC`, function (error, results, fields) {

      if (error) {
      console.log(error)
      res.json({ error: error })
      } else if (results) {
      res.json({ results: results })
      }
    })}
    
    else {
      
      connection.query(`SELECT f.state,
      COUNT(DISTINCT f.ID) AS count_companies
      FROM Financial_Entity f
        JOIN Round r ON f.ID = r.company_ID
      WHERE state IS NOT NULL AND market LIKE "%${market}%" AND (YEAR(r.date) = ${year} OR ${year} = -1)
      GROUP BY f.state
      ORDER BY IFNULL(SUM(r.amount_USD),0)
      DESC`, function (error, results, fields) {

      if (error) {
      console.log(error)
      res.json({ error: error })
      } else if (results) {
      res.json({ results: results })
      }
    })};
}

// ********************************************
//            COMPANY ROUTES
// ********************************************

// Route 7 (handler)
async function search_companies(req, res) {
	const name = req.query.name ? req.query.name : ''
	const market = req.query.market ? req.query.market : ''
	const country = req.query.country ? req.query.country : ''
	const state = req.query.state ? req.query.state : ''
	const city = req.query.city ? req.query.city : ''
	
	const total_fundingLow = req.query.fundingLow ? req.query.fundingLow : 0
	const total_fundingHigh = req.query.fundingHigh ? req.query.fundingHigh : 10000000
	const num_acquisitionsLow = req.query.acquisitionsLow ? req.query.acquisitionsLow : 0
	const num_acquisitionsHigh = req.query.acquisitionsHigh ? req.query.acquisitionsHigh : 10

	const page = req.query.page
	const pagesize = req.query.pagesize ? req.query.pagesize : 10
	const start = page * pagesize - pagesize


	if (req.query.page && !isNan(req.query.page)) {
	  connection.query(`SELECT f.ID, f.name, f.market, f.country, f.state, f.city, c.founding_date, c.status, SUM(amount_USD) AS total_funding
		FROM Financial_Entity f JOIN Company c ON f.ID = c.company_ID JOIN (SELECT DISTINCT company_ID, round_number, date, amount_USD FROM Round) r ON f.ID = r.company_ID
		WHERE name LIKE '%${name}%' AND
			market LIKE '%${market}%' AND
			country LIKE '%${country}%' AND
			state LIKE '%${state}%' AND
			city LIKE '%${city}%' AND
			total_funding >= ${total_fundingLow} AND total_funding <= ${total_fundingHigh}
		GROUP BY ID, name, market, country, state, city, founding_date, status
		ORDER BY name
		LIMIT ${start}, ${pagesize}`, function (error, results, fields) {
	    if (error) {
		console.log(error)
		res.json({error: error})
	    } else if (results) {
		res.json({results: results})
	    }
	  });
	} else {
	  connection.query(`SELECT f.ID, f.name, f.market, f.country, f.state, f.city, c.founding_date, c.status, SUM(amount_USD) AS total_funding
		FROM Financial_Entity f JOIN Company c ON f.ID = c.company_ID JOIN (SELECT DISTINCT company_ID, round_number, date, amount_USD FROM Round) r ON f.ID = r.company_ID
		WHERE name LIKE '%${name}%' AND
			market LIKE '%${market}%' AND
			country LIKE '%${country}%' AND
			state LIKE '%${state}%' AND
			city LIKE '%${city}%' AND
			total_funding >= ${total_fundingLow} AND total_funding <= ${total_fundingHigh}
		GROUP BY ID, name, market, country, state, city, founding_date, status
		ORDER BY name`, function (error, results, fields) {
	    if (error) {
		console.log(error)
		res.json({error: error})
	    } else if (results) {
		res.json({results: results})
	    }
	  });
	}
} 

// Route 8 (handler)
async function company(req, res) {
	const id = req.query.id

	connection.query(`SELECT ID, name, founding_date, homepage_URL, f.market AS company_market, SUM(amount_USD) AS total_funding
		FROM Financial_Entity f JOIN Company c ON f.ID = c.company_ID JOIN (SELECT DISTINCT company_ID, round_number, date, amount_USD FROM Round) r ON f.ID = r.company_ID
		WHERE ID = ${id} 
		GROUP BY ID`, function (error, results, fields) {
	    if (error) {
		console.log(error)
		res.json({error: error})
	    } else if (results) {
		res.json({results: results})
	    }
	});
}

// Route 9 (handler)
async function company_rounds(req, res) {
	const id = req.query.id

	connection.query(`SELECT DISTINCT ID, f.name AS company, round_number, round_type, r.date AS funding_date, amount_USD, a.date AS acquisition_date, a.price, a.currency
		FROM Financial_Entity f LEFT JOIN Round r ON f.ID = r.company_ID LEFT JOIN Acquisition a ON f.ID = a.acquired_ID
		WHERE ID = ${id}
		ORDER BY date DESC`, function (error, results, fields) {
	    if (error) {
		console.log(error)
		res.json({error: error})
	    } else if (results) {
		res.json({results: results})
	    }
	});
}

// Route 10 (handler)
async function company_investors(req, res) {
	const id = req.query.id

	connection.query(`SELECT ID, investor_ID, f1.name AS investor, round_number, round_type, f1.market AS investor_market, acquirer_ID, f2.name AS acquirer, f2.market AS acquirer_market
		FROM Financial_Entity f JOIN Round r ON f.ID = r.company_ID JOIN Financial_Entity f1 ON f1.ID = r.investor_ID
			LEFT JOIN Acquisition a ON f.ID = a.acquired_ID JOIN Financial_Entity f2 ON f2.ID = a.aquirer_ID
		WHERE ID = ${id}
		GROUP BY ID	
		ORDER BY date DESC`, function (error, results, fields) {
	    if (error) {
		console.log(error)
		res.json({error: error})
	    } else if (results) {
		res.json({results: results})
	    }
	});
}

// ********************************************
//            INVESTOR ROUTES
// ********************************************

// Route 11 (handler)
async function search_investors(req, res) {
	const name = req.query.name ? req.query.name : ''
	const market = req.query.market ? req.query.market : ''
	const country = req.query.country ? req.query.country : ''
	const state = req.query.state ? req.query.state : ''
	const city = req.query.city ? req.query.city : ''
	const is_person = req.query.is_person ? req.query.is_person : ''
	
	const num_investmentsLow = req.query.investmentsLow ? req.query.investmentsLow : 0
	const num_investmentsHigh = req.query.investmentsHigh ? req.query.investmentsHigh : 100
	const num_acquisitionsLow = req.query.acquisitionsLow ? req.query.acquisitionsLow : 0
	const num_acquisitionsHigh = req.query.acquisitionsHigh ? req.query.acquisitionsHigh : 100

	const page = req.query.page
	const pagesize = req.query.pagesize ? req.query.pagesize : 10
	const start = page * pagesize - pagesize


	if (req.query.page && !isNan(req.query.page)) {
	  connection.query(`SELECT f.ID, f.name, f.market, f.country, f.state, f.city, i.is_person, num_investments, num_acquisitions
		FROM Financial_Entity f LEFT JOIN Investor i ON f.ID = i.investor_ID JOIN (SELECT investor_ID, COUNT(*) AS num_investments FROM Round GROUP BY investor_ID) r ON i.investor_ID = r.investor_ID
			LEFT JOIN (SELECT acquirer_ID, COUNT(*) AS num_acquisitions FROM Acquisition GROUP BY acquirer_ID) a ON f.ID = a.acquirer_ID
		WHERE name LIKE '%${name}%' AND
			market LIKE '%${market}%' AND
			country LIKE '%${country}%' AND
			state LIKE '%${state}%' AND
			city LIKE '%${city}%' AND
			is_person LIKE '%${is_person}%' AND
			num_investments >= ${num_investmentsLow} AND num_investments <= ${num_investmentsHigh} AND
			num_acquisitions >= ${num_acquisitionsLow} AND num_acquisitions <= ${num_acquisitionsHigh} AND
			(num_investments > 0 OR num_acquistions > 0)
		ORDER BY name
		LIMIT ${start}, ${pagesize}`, function (error, results, fields) {
	    if (error) {
		console.log(error)
		res.json({error: error})
	    } else if (results) {
		res.json({results: results})
	    }
	  });
	} else {
	  connection.query(`SELECT f.ID, f.name, f.market, f.country, f.state, f.city, i.is_person, num_investments, num_acquisitions
		FROM Financial_Entity f LEFT JOIN Investor i ON f.ID = i.investor_ID JOIN (SELECT investor_ID, COUNT(*) AS num_investments FROM Round GROUP BY investor_ID) r ON i.investor_ID = r.investor_ID
			LEFT JOIN (SELECT acquirer_ID, COUNT(*) AS num_acquisitions FROM Acquisition GROUP BY acquirer_ID) a ON f.ID = a.acquirer_ID
		WHERE name LIKE '%${name}%' AND
			market LIKE '%${market}%' AND
			country LIKE '%${country}%' AND
			state LIKE '%${state}%' AND
			city LIKE '%${city}%' AND
			is_person LIKE '%${is_person}%' AND
			num_investments >= ${num_investmentsLow} AND num_investments <= ${num_investmentsHigh} AND
			num_acquisitions >= ${num_acquisitionsLow} AND num_acquisitions <= ${num_acquisitionsHigh} AND
			(num_investments > 0 OR num_acquistions > 0)
		ORDER BY name`, function (error, results, fields) {
	    if (error) {
		console.log(error)
		res.json({error: error})
	    } else if (results) {
		res.json({results: results})
	    }
	  });
	}
} 

// Route 12 (handler)
async function investor(req, res) {
	const id = req.query.id

	connection.query(`SELECT f.ID, f.name, i.is_person, r.market AS investment_market, num_investments, a.market AS acquisition_market, num_acquisitions
		FROM Financial_Entity f LEFT JOIN Investor i ON f.ID = i.investor_ID JOIN (SELECT investor_ID, market, COUNT(*) AS num_investments FROM Round r1 JOIN Financial_Entity f2 ON r1.company_ID = f2.ID GROUP BY investor_ID, market) r ON i.investor_ID = r.investor_ID
			LEFT JOIN (SELECT acquirer_ID, market COUNT(*) AS num_acquisitions FROM Acquisition a1 JOIN Financial_Entity f1 ON a1.acquired_ID = f1.ID GROUP BY acquirer_ID, market) a ON f.ID = a.acquirer_ID
		WHERE ID = ${id}`, function (error, results, fields) {
	    if (error) {
		console.log(error)
		res.json({error: error})
	    } else if (results) {
		res.json({results: results})
	    }
	});
}

// Route 13 (handler)
async function investor_copmanies(req, res) {
	const id = req.query.id

	connection.query(`SELECT o.investor_ID, o.investor_name, o.company_ID, o.investment_name, r1.investor_ID AS coinvestor_ID, f2.name AS coinvestor_name
		FROM (SELECT r.investor_ID, f.name AS investor_name, r.company_ID, f1.name AS investment_name
			FROM Financial_Entity f JOIN Round r ON r.investor_ID = f.ID JOIN Financial_Entity f1 ON f1.ID = r.company_ID
			WHERE ID = ${id}) o LEFT JOIN ROUND r1 ON r1.company_ID = o.company_ID JOIN Financial_Entity f2 ON f2.ID = r1.investor_ID
		, function (error, results, fields) {
	    if (error) {
		console.log(error)
		res.json({error: error})
	    } else if (results) {
		res.json({results: results})
	    }
	});
}


module.exports = {
    home,
    timeseries_funding,
    timeseries_count_funding,
    timeseries_founding_dates,
    market_funding_share,
    international_funding,
    populate_us_heatmap,
    company
}
