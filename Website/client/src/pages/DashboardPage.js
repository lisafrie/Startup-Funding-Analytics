import React from 'react';
import { Form, FormInput, FormGroup, Button } from "shards-react";
import {
    Row,
    Col
} from 'antd'
import { Tooltip as ReactTooltip } from 'react-tooltip';

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
        content: ""
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
        getDashboard(this.state.selectedKPI, this.state.selectedMarket, this.state.selectedYear).then(res => {
            this.setState({ dashboardResults: res.results })
        })
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
            <Button
                className="choice"
                variant="contained"
                style={{
                    float: "left",
                    marginLeft: '0 auto',
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
                    marginLeft: '2vw',
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
                    marginLeft: '2vw',
                    marginTop: '3vh',
                }}
                onClick={this.handleKPIChange3}
            >
                Total Funding
            </Button>
            <Form style={{ width: '40vw', margin: '55vw', marginTop: '1vh' }}>
                <Row>
                    <Col flex={2}><FormGroup style={{ width: '15vw', margin: '0 auto' }}>
                        <label>Market</label>
                        <FormInput placeholder="Market" value={this.state.selectedMarket} onChange={this.handleMarketChange} onKeyPress={event => event.key === 'Enter' && this.updateDashboardResults()} />
                    </FormGroup></Col>
                    <Col flex={2}><FormGroup style={{ width: '15vw', margin: '0 auto' }}>
                        <label>Year</label>
                        <FormInput placeholder="Year" value={this.state.selectedYear} onChange={this.handleYearChange} onKeyPress={event => event.key === 'Enter' && this.updateDashboardResults() } />
                    </FormGroup></Col>
                </Row>
            </Form>
            {JSON.stringify(this.state.dashboardResults)}
            <Map
                dashboardResults={this.state.dashboardResults}
                tooltipContent={this.setState.content}
                kpi={this.state.selectedKPI}
            />
            <ReactTooltip>{this.content}</ReactTooltip>
      </div>
    )
  }

}

export default DashboardPage

