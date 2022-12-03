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

// Route 1 (handler)
async function home(req, res) {
    // a GET request to /hello?name=Steve
    connection.query(`SELECT year(date) AS year, COUNT(DISTINCT company_ID) AS number_per_year, SUM(amount_USD) AS total_raised
    FROM Round
    WHERE year(date) IS NOT NULL
    GROUP BY year
    HAVING number_per_year IS NOT NULL AND total_raised IS NOT NULL
    Order BY year`, function (error, results, fields) {

        if (error) {
            console.log(error)
            res.json({ error: error })
        } else if (results) {
            res.json({ results: results })
        }
    });
}

async function company(req, res) {
    res.json({"name": "Test"})
}




// ********************************************
//                  WARM UP 
// ********************************************

// Route 2 (handler)
async function jersey(req, res) {
    const colors = ['red', 'blue', 'white']
    const jersey_number = Math.floor(Math.random() * 20) + 1
    const name = req.query.name ? req.query.name : "player"

    if (req.params.choice === 'number') {
        // TODO: TASK 1: inspect for issues and correct 
        res.json({ message: `Hello, ${name}!`, jersey_number: jersey_number })
    } else if (req.params.choice === 'color') {
        var lucky_color_index = Math.floor(Math.random() * 2);
        // TODO: TASK 2: change this or any variables above to return only 'red' or 'blue' at random (go Quakers!)
        res.json({ message: `Hello, ${name}!`, jersey_color: colors[lucky_color_index] })
    } else {
        // TODO: TASK 3: inspect for issues and correct
        res.json({ message: `Hello, ${name}, we like your jersey!` })
    }
}

// ********************************************
//               GENERAL ROUTES
// ********************************************


// Route 3 (handler)
async function all_matches(req, res) {
    // TODO: TASK 4: implement and test, potentially writing your own (ungraded) tests
    // We have partially implemented this function for you to 
    // parse in the league encoding - this is how you would use the ternary operator to set a variable to a default value
    // we didn't specify this default value for league, and you could change it if you want! 
    // in reality, league will never be undefined since URLs will need to match matches/:league for the request to be routed here... 
    const league = req.params.league ? req.params.league : 'D1'
    // use this league encoding in your query to furnish the correct results

    if (req.query.page && !isNaN(req.query.page)) {
        // This is the case where page is defined.
        // The SQL schema has the attribute OverallRating, but modify it to match spec! 
        // TODO: query and return results here:
        
        const size = req.query.pagesize ? req.query.pagesize : 10
        const start = (req.query.page - 1) * size
        connection.query(`SELECT MatchId, Date, Time, HomeTeam AS Home, AwayTeam AS Away, FullTimeGoalsH AS HomeGoals, FullTimeGoalsA AS AwayGoals  
        FROM Matches 
        WHERE Division = '${league}'
        ORDER BY HomeTeam, AwayTeam
        LIMIT ${start}, ${size}`, function (error, results, fields) {

            if (error) {
                console.log(error)
                res.json({ error: error })
            } else if (results) {
                res.json({ results: results })
            }
        });
   
    } else {
        // we have implemented this for you to see how to return results by querying the database
        connection.query(`SELECT MatchId, Date, Time, HomeTeam AS Home, AwayTeam AS Away, FullTimeGoalsH AS HomeGoals, FullTimeGoalsA AS AwayGoals  
        FROM Matches 
        WHERE Division = '${league}'
        ORDER BY HomeTeam, AwayTeam`, function (error, results, fields) {

            if (error) {
                console.log(error)
                res.json({ error: error })
            } else if (results) {
                res.json({ results: results })
            }
        });
    }
}

// Route 4 (handler)
async function all_players(req, res) {
    // TODO: TASK 5: implement and test, potentially writing your own (ungraded) tests
    

    if (req.query.page && !isNaN(req.query.page)) {
        
        const size = req.query.pagesize ? req.query.pagesize : 10
        const start = (req.query.page - 1) * size
        connection.query(`SELECT PlayerId, Name, Nationality, OverallRating AS Rating, Potential, Club, Value  
        FROM Players 
        ORDER BY Name
        LIMIT ${start}, ${size}`, function (error, results, fields) {

            if (error) {
                console.log(error)
                res.json({ error: error })
            } else if (results) {
                res.json({ results: results })
            }
        });
   
    } else {
        connection.query(`SELECT PlayerId, Name, Nationality, OverallRating AS Rating, Potential, Club, Value  
        FROM Players 
        ORDER BY Name`, function (error, results, fields) {

            if (error) {
                console.log(error)
                res.json({ error: error })
            } else if (results) {
                res.json({ results: results })
            }
        });
    }
}


// ********************************************
//             MATCH-SPECIFIC ROUTES
// ********************************************

// Route 5 (handler)
async function match(req, res) {
    // TODO: TASK 6: implement and test, potentially writing your own (ungraded) tests
    

    if (req.query.id && !isNaN(req.query.id)) {

        connection.query(`SELECT MatchId, Date, Time, HomeTeam AS Home, AwayTeam AS Away, FullTimeGoalsH AS HomeGoals, FullTimeGoalsA AS AwayGoals, HalfTimeGoalsH AS HTHomeGoals, HalfTimeGoalsA AS HTAwayGoals, ShotsH AS ShotsHome, ShotsA AS ShotsAway, ShotsOnTargetH AS ShotsOnTargetHome, ShotsOnTargetA AS ShotsOnTargetAway, FoulsH AS FoulsHome, FoulsA AS FoulsAway, CornersH AS CornersHome, CornersA AS CornersAway, YellowCardsH AS YCHome, YellowCardsA AS YCAway, RedCardsH AS RCHome, RedCardsA AS RCAway
        FROM Matches 
        WHERE MatchID = ${req.query.id}`, function (error, results, fields) {

            if (error) {
                console.log(error)
                res.json({ error: error })
            } else if (results) {
                res.json({ results: results })
            }
        });

    } else {
        connection.query(`SELECT MatchId, Date, Time, HomeTeam AS Home, AwayTeam AS Away, FullTimeGoalsH AS HomeGoals, FullTimeGoalsA AS AwayGoals, HalfTimeGoalsH AS HTHomeGoals, HalfTimeGoalsA AS HTAwayGoals, ShotsH AS ShotsHome, ShotsA AS ShotsAway, ShotsOnTargetH AS ShotsOnTargetHome, ShotsOnTargetA AS ShotsOnTargetAway, FoulsH AS FoulsHome, FoulsA AS FoulsAway, CornersH AS CornersHome, CornersA AS CornersAway, YellowCardsH AS YCHome, YellowCardsA AS YCAway, RedCardsH AS RCHome, RedCardsA AS RCAway
        FROM Matches 
        WHERE MatchID = -1`, function (error, results, fields) {

            if (error) {
                console.log(error)
                res.json({ error: error })
            } else if (results) {
                res.json({ results: results })
            }
        });
    }
}

// ********************************************
//            PLAYER-SPECIFIC ROUTES
// ********************************************

// Route 6 (handler)
async function player(req, res) {
    // TODO: TASK 7: implement and test, potentially writing your own (ungraded) tests
    if (req.query.id && !isNaN(req.query.id)) {

        connection.query(`SELECT BestPosition
        FROM Players 
        WHERE PlayerId = ${req.query.id}`, function (error, results, fields) {

            if (error) {
                console.log(error)
                res.json({ error: error })
            } else if (results) {
                if (results[0]['BestPosition'] === 'GK') {
                    connection.query(`SELECT PlayerId, Name, Age, Photo, Nationality, Flag, OverallRating AS Rating, Potential, Club, ClubLogo, Value, Wage, InternationalReputation, Skill, JerseyNumber, ContractValidUntil, Height, Weight, BestPosition, BestOverallRating, ReleaseClause, GKPenalties, GKDiving, GKHandling, GKKicking, GKPositioning, GKReflexes
                    FROM Players
                    WHERE PlayerID = ${req.query.id}`, function (error, results, fields) {

                        if (error) {
                            console.log(error)
                            res.json({ error: error })
                        } else if (results) {
                            res.json({ results: results })
                        }
                    });
                }
                else {
                    connection.query(`SELECT PlayerId, Name, Age, Photo, Nationality, Flag, OverallRating AS Rating, Potential, Club, ClubLogo, Value, Wage, InternationalReputation, Skill, JerseyNumber, ContractValidUntil, Height, Weight, BestPosition, BestOverallRating, ReleaseClause, NPassing, NBallControl, NAdjustedAgility, NStamina, NStrength, NPositioning
                    FROM Players
                    WHERE PlayerID = ${req.query.id}`, function (error, results, fields) {

                        if (error) {
                            console.log(error)
                            res.json({ error: error })
                        } else if (results) {
                            res.json({ results: results })
                        }
                    });
                }
            }
        });

    } else {
        connection.query(`SELECT PlayerId, Name, Age, Photo, Nationality, Flag, OverallRating AS Rating, Potential, Club, ClubLogo, Value, Wage, InternationalReputation, Skill, JerseyNumber, ContractValidUntil, Height, Weight, BestPosition, BestOverallRating, ReleaseClause, GKPenalties, GKDiving, GKHandling, GKKicking, GKPositioning, GKReflexes
        FROM Players
        WHERE PlayerID = -1`, function (error, results, fields) {

            if (error) {
                console.log(error)
                res.json({ error: error })
            } else if (results) {
                res.json({ results: results })
            }
        });
    }
}


// ********************************************
//             SEARCH ROUTES
// ********************************************

// Route 7 (handler)
async function search_matches(req, res) {
    // TODO: TASK 8: implement and test, potentially writing your own (ungraded) tests
    // IMPORTANT: in your SQL LIKE matching, use the %query% format to match the search query to substrings, not just the entire string

        var home = req.query.Home ? req.query.Home : ''
        var away = req.query.Away ? req.query.Away : ''

        if(!isNaN(req.query.Home)){
            home = ''
        }
        if(!isNaN(req.query.Away)){
            away = ''
        }

        if (req.query.page && !isNaN(req.query.page)) {
            var page = req.query.page
            var size = req.query.pagesize ? req.query.pagesize : 10
            var start = (page - 1) * size
            connection.query(`SELECT MatchId, Date, Time, HomeTeam AS Home, AwayTeam AS Away, FullTimeGoalsH AS HomeGoals, FullTimeGoalsA AS AwayGoals  
            FROM Matches
            WHERE HomeTeam LIKE '%${home}%' AND AwayTeam LIKE '%${away}%'
            ORDER BY HomeTeam, AwayTeam
            LIMIT ${start}, ${size}`, function (error, results, fields) {

                if (error) {
                    console.log(error)
                    res.json({ error: error })
                } else if (results) {
                    res.json({ results: results })
                }
            });
        }
        else{
            connection.query(`SELECT MatchId, Date, Time, HomeTeam AS Home, AwayTeam AS Away, FullTimeGoalsH AS HomeGoals, FullTimeGoalsA AS AwayGoals  
            FROM Matches
            WHERE HomeTeam LIKE '%${home}%' AND AwayTeam LIKE '%${away}%'
            ORDER BY HomeTeam, AwayTeam`, function (error, results, fields) {

                if (error) {
                    console.log(error)
                    res.json({ error: error })
                } else if (results) {
                    res.json({ results: results })
                }
            });
        }
        


}

// Route 8 (handler)
async function search_players(req, res) {
    // TODO: TASK 9: implement and test, potentially writing your own (ungraded) tests
    // IMPORTANT: in your SQL LIKE matching, use the %query% format to match the search query to substrings, not just the entire string
        
        var name = req.query.Name ? req.query.Name : ''
        var nation = req.query.Nationality ? req.query.Nationality : ''
        var club = req.query.Club ? req.query.Club : ''
        var rlow = req.query.RatingLow ? req.query.RatingLow : 0
        var rhigh = req.query.RatingHigh ? req.query.RatingHigh : 100
        var plow = req.query.PotentialLow ? req.query.PotentialLow : 0
        var phigh = req.query.PotentialHigh ? req.query.PotentialHigh : 100

        if(!isNaN(req.query.Name)){
            name = ''
        }
        if(!isNaN(req.query.Nationality)){
            nation = ''
        }
        if(!isNaN(req.query.Club)){
            club = ''
        }

        if(isNaN(req.query.RatingLow)){
            rlow = 0
        }
        if(isNaN(req.query.RatingHigh)){
            rhigh = 100
        }
        if(isNaN(req.query.PotentialLow)){
            plow = 0
        }
        if(isNaN(req.query.PotentialHigh)){
            phigh = 100
        }

        if(req.query.page && !isNaN(req.query.page)){
            var page = req.query.page
            var size = req.query.pagesize ? req.query.pagesize : 10
            var start = (page - 1) * size
            connection.query(`SELECT PlayerId, Name, Nationality, OverallRating AS Rating, Potential, Club, Value  
            FROM Players 
            WHERE Name LIKE '%${name}%' AND Nationality LIKE '%${nation}%' AND Club LIKE '%${club}%' AND OverallRating >= ${rlow} AND OverallRating <= ${rhigh} AND Potential >= ${plow} AND Potential <= ${phigh}
            ORDER BY Name
            LIMIT ${start}, ${size}`, function (error, results, fields) {

                if (error) {
                    console.log(error)
                    res.json({ error: error })
                } else if (results) {
                    res.json({ results: results })
                }
            });
        }
        else{
            connection.query(`SELECT PlayerId, Name, Nationality, OverallRating AS Rating, Potential, Club, Value  
            FROM Players 
            WHERE Name LIKE '%${name}%' AND Nationality LIKE '%${nation}%' AND Club LIKE '%${club}%' AND OverallRating >= ${rlow} AND OverallRating <= ${rhigh} AND Potential >= ${plow} AND Potential <= ${phigh}
            ORDER BY Name`, function (error, results, fields) {

                if (error) {
                    console.log(error)
                    res.json({ error: error })
                } else if (results) {
                    res.json({ results: results })
                }
            });
        }

}

module.exports = {
    home,
    company,
    jersey,
    all_matches,
    all_players,
    match,
    player,
    search_matches,
    search_players
}