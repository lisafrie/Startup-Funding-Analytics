import React from 'react';
import '../styles.css';

import { Form, FormInput, FormGroup } from "shards-react";
import {
    Row,
    Col
} from 'antd'

import {
    getFundingValue,
    getFundingNumber,
    getFoundingDates,
    getFundingShare,
    getInternationalFunding, } from '../fetcher'
import MenuBar from '../components/MenuBar';
import LineCChart from "../components/LineCharts";
import PieCChart from '../components/PieChart';

class HomePage extends React.Component {

  constructor(props) {
    super(props)

      this.state = {
          selectedMarket: "",
          selectedYear: -1,
          fundingValue: [],
          fundingNumber: [],
          foundingDates: [],
          fundingShare: [],
          internationalFunding: []

      }

      this.handleMarketChange = this.handleMarketChange.bind(this)
      this.handleYearChange = this.handleYearChange.bind(this)
      this.updateResults = this.updateResults.bind(this)
    }

    handleMarketChange(event) {
        this.setState({ selectedMarket: event.target.value })
    }
    handleYearChange(event) {
        this.setState({ selectedYear: event.target.value })
    }

    updateResults() {
        getFundingValue(this.state.selectedMarket).then(res => {
            console.log(res);
            this.setState({ fundingValue: res.results })
        })

        getFundingNumber(this.state.selectedMarket).then(res => {
            console.log(res);
            this.setState({ fundingNumber: res.results })
        })

        getFoundingDates(this.state.selectedMarket).then(res => {
            console.log(res);
            this.setState({ foundingDates: res.results })
        })

        getFundingShare(this.state.selectedYear).then(res => {
            console.log(res);
            this.setState({ fundingShare: res.results })
        })

        getInternationalFunding(this.state.selectedYear, this.state.selectedMarket).then(res => {
            console.log(res);
            this.setState({ internationalFunding: res.results })
        }) 
    }


  componentDidMount() {
      getFundingValue(this.state.selectedMarket).then(res => {
          console.log(res);
          this.setState({ fundingValue: res.results })
      }) 

      getFundingNumber(this.state.selectedMarket).then(res => {
          console.log(res);
          this.setState({ fundingNumber: res.results })
      }) 

      getFoundingDates(this.state.selectedMarket).then(res => {
          console.log(res);
          this.setState({ foundingDates: res.results })
      }) 

      getFundingShare(this.state.selectedYear).then(res => {
          console.log(res);
          this.setState({ fundingShare: res.results })
      }) 

      getInternationalFunding(this.state.selectedYear, this.state.selectedMarket).then(res => {
          console.log(res);
          this.setState({ internationalFunding: res.results })
      }) 
  }


  render() {

    return (
        <div>
            <MenuBar active="Home" />

            {/* Forms to input market and year
             * shows 0 if input invalid
             * accepts partial overlap in market names
             * uses all years / all markets if no input */}
            <Form style={{ float: 'left', marginLeft: '1vw', marginTop: '2vh' }}>
                <Row>
                    <Col flex={2}><FormGroup style={{ width: '15vw', marginLeft: '2vw' }}>
                        <label>Market</label>
                        <FormInput placeholder="Market" value={this.state.selectedMarket} onChange={this.handleMarketChange} onKeyPress={event => event.key === 'Enter' && this.updateResults()} />
                    </FormGroup></Col>
                    <Col flex={2}><FormGroup style={{ width: '15vw', marginLeft: '2vw' }}>
                        <label>Year</label>
                        <FormInput placeholder="Year" onChange={this.handleYearChange} onKeyPress={event => event.key === 'Enter' && this.updateResults()} />
                    </FormGroup></Col>
                </Row>
            </Form>

            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>

            <div className="left">

            <LineCChart 
                queryResults={this.state.fundingValue}
                kpi={"total_funding"}
                title={"$ Funding"}
                />
            </div>
            <div className="middle">
                <LineCChart 
                queryResults={this.state.fundingNumber}
                kpi={"funded_count"}
                title={"# Funded Companies"}
            />
            </div>
            <div className="right">
                <LineCChart
                queryResults={this.state.foundingDates}
                kpi={"founded_count"}
                title={"# Founded Companies"}
                />
            </div>

{/*            <br></br>
            <div className="left">
                <PieCChart
                    queryResults={this.state.fundingShare}
                    title={"Funding by Market"}
                />
            </div>


            {JSON.stringify(this.state.fundingShare)}*/}

      </div>
    )
  }

}

export default HomePage

