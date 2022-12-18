import React from 'react';
import { Form, FormInput, FormGroup, Button } from "shards-react";
import {
    Row,
    Col
} from 'antd'

import { getDashboard } from '../fetcher'

import Map from "../components/Map";
import MenuBar from '../components/MenuBar';

class DashboardPage extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
        selectedKPI: "Count_of_Funded_Companies",
        selectedMarket: "",
        selectedYear: -1,
        dashboardResults: [],
        content: "",
        minNum: 0,
        maxNum: 10,
        message: "no year selected, all data displayed"
      }

      this.handleKPIChange1 = this.handleKPIChange1.bind(this)
      this.handleKPIChange2 = this.handleKPIChange2.bind(this)
      this.handleKPIChange3 = this.handleKPIChange3.bind(this)
      this.handleMarketChange = this.handleMarketChange.bind(this)
      this.handleYearChange = this.handleYearChange.bind(this)
      this.updateDashboardResults = this.updateDashboardResults.bind(this)
    }

    handleKPIChange1() {
        this.setState({
            selectedKPI: "Count_of_Funded_Companies"
        }, this.updateDashboardResults)
    }
    handleKPIChange2() {
        this.setState({
            selectedKPI: "Net_Funding"
        }, this.updateDashboardResults)
    }
    handleKPIChange3() {
        this.setState({
            selectedKPI: "Total_Funding"
        }, this.updateDashboardResults)
    }
    handleMarketChange(event) {
        this.setState({ selectedMarket: event.target.value })
    }
    handleYearChange(event) {
        this.setState({ selectedYear: event.target.value })
    }

    updateDashboardResults() {
        if (this.state.selectedYear === -1 | this.state.selectedYear === "") {
            this.setState({ message: "no year selected - displaying all data" }); 
            getDashboard(this.state.selectedKPI, this.state.selectedMarket, this.state.selectedYear).then(res => {
                this.setState({ dashboardResults: res.results })
            })
        } else if (this.state.selectedYear <= 2014 & this.state.selectedYear >= 1990) {
            this.setState({ message: <br></br> });
            getDashboard(this.state.selectedKPI, this.state.selectedMarket, this.state.selectedYear).then(res => {
                this.setState({ dashboardResults: res.results })
            })
        } else {
            this.setState({ message: "invalid year - please select a year between 1990 and 2014" });
        }


    }

  componentDidMount() {
      getDashboard(this.state.selectedKPI, this.state.selectedMarket, this.state.selectedYear).then(res => {
      console.log(res);
      this.setState({ dashboardResults: res.results })
    }) 
  }


  render() {

    return (
        <div>
            <MenuBar active="dashboard" />

            {/* Buttons to choose KPI */}
            <Button
                className="choice"
                variant="contained"
                style={{
                    float: "left",
                    marginTop: '3vh',
                }}
                onClick={this.handleKPIChange1}
            >
                Companies Funded
            </Button>
            <Button
                className="choice"
                variant="contained"
                style={{
                    float: "left",
                    marginLeft: '0.5vw',
                    marginTop: '3vh',
                }}
                onClick={this.handleKPIChange2}
            >
                Net Funding
            </Button>
            <Button
                className="choice"
                variant="contained"
                style={{
                    float: "left",
                    marginLeft: '0.5vw',
                    marginTop: '3vh',
                }}
                onClick={this.handleKPIChange3}
            >
                Total Funding
            </Button>

            {/* Forms to input market and year
             * shows 0 if input invalid
             * accepts partial overlap in market names
             * uses all years / all markets if no input */}
            <Form style={{ float: 'left', marginLeft: '3vw', marginTop: '2vh', marginRight: '2vw' }}>
                <Row>
                    <Col flex={2}><FormGroup style={{ width: '12vw', marginLeft: '2vw' }}>
                    <label>Market</label>
                    <FormInput placeholder="Market" value={this.state.selectedMarket} onChange={this.handleMarketChange} onKeyPress={event => event.key === 'Enter' && this.updateDashboardResults()} />
                    </FormGroup></Col>
                    <Col flex={2}><FormGroup style={{ width: '12vw', marginLeft: '2vw' }}>
                    <label>Year</label>
                    <FormInput placeholder="Year" onChange={this.handleYearChange} onKeyPress={event => event.key === 'Enter' && this.updateDashboardResults()} />
                    </FormGroup></Col>
                </Row>
            </Form>

            <p>
                <font size="2">
                    <br></br>
                    {this.state.message}
                </font>
            </p>
            {JSON.stringify(this.state.dashboardResults) === "[]" ?
                <p> <font size="2">
                    no market found, please try again </font>
                </p> : <div> <br></br><br></br> </div>}

            {/* Legend for color scale */}
            <div>
                <div
                    style={{
                        float: 'left',
                        marginTop: '0vh',
                        marginLeft: '4vh',
                    }}
                >
                    <p>
                        Min: 
                        {/*  {this.state.minNum}*/}$
                    </p>
                </div>
                <div
                    style={{
                        width: "30px",
                        height: "20px",
                        float: "left",
                        marginTop: '0.5vh',
                        marginLeft: '0.5vw',
                        backgroundColor: "#ffedea",
                    }}
                />
                <div
                    style={{
                        width: "30px",
                        height: "20px",
                        marginTop: '0.5vh',
                        float: "left",
                        backgroundColor: "#FFB5B7",
                    }}
                />
                <div
                    style={{
                        width: "30px",
                        height: "20px",
                        marginTop: '0.5vh',
                        float: "left",
                        backgroundColor: "#FF9794",
                    }}
                />
                <div
                    style={{
                        width: "30px",
                        height: "20px",
                        marginTop: '0.5vh',
                        float: "left",
                        backgroundColor: "#FD8075",
                    }}
                />
                <div
                    style={{
                        width: "30px",
                        height: "20px",
                        marginTop: '0.5vh',
                        float: "left",
                        backgroundColor: "#F96D57",
                    }}
                />
                <div
                    style={{
                        width: "30px",
                        height: "20px",
                        marginTop: '0.5vh',
                        float: "left",
                        backgroundColor: "#F45D3A",
                    }}
                />
                <div
                    style={{
                        width: "30px",
                        height: "20px",
                        marginTop: '0.5vh',
                        float: "left",
                        backgroundColor: "#ED511F",
                    }}
                />
                <div
                    style={{
                        width: "30px",
                        height: "20px",
                        marginTop: '0.5vh',
                        float: "left",
                        backgroundColor: "#D43B18",
                    }}
                />
                <div
                    style={{
                        width: "30px",
                        height: "20px",
                        marginTop: '0.5vh',
                        float: "left",
                        backgroundColor: "#BA2812",
                    }}
                />
                <div
                    style={{
                        float: "left",
                        marginTop: '0vh',
                        marginLeft: '0.5vw'
                    }}
                >
                    <p>
                        Max: 
                        {/* {this.state.maxNum}*/}$
                    </p>
                </div>



                <div
                    style={{
                        float: 'top',
                        margin: '0vh'
                    }}
                >

            {/* Heatmap */}
            <Map
                dashboardResults={this.state.dashboardResults}
                tooltipContent={this.setState.content}
                kpi={this.state.selectedKPI}
            />
                </div>
                <br></br>
                <br></br>
            </div>
        </div>
    )
  }

}

export default DashboardPage

