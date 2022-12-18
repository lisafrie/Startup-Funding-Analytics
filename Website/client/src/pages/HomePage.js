import React from 'react';
import '../styles.css';

import { Form, FormInput, FormGroup } from "shards-react";
import {
    Table,
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
import BarCChart from "../components/BarCharts";

const marketColumns = [
    {
        title: 'Market',
        dataIndex: 'market',
        key: 'market'
    },
    {
        title: 'Total Funding',
        dataIndex: 'total_funding',
        key: 'total_funding',
        render: (value) => {
            return "US$ " + Math.round(value/1000000).toLocaleString("en") + "M";
        }
    }
];


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
          internationalFunding: [],
          message: "no year selected - displaying all data"
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
        if (this.state.selectedYear === "" | this.state.selectedYear === -1) {
            this.setState({ message: "no year selected - displaying all data" });
        } else if (this.state.selectedYear <= 2014 & this.state.selectedYear >= 2000) {
            this.setState({ message: <br></br> });
        } else {
            this.setState({ message: "invalid year - please select a year between 2000 and 2014" });
        }

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
{/*            {JSON.stringify(this.state.internationalFunding)}*/}

            {/* Forms to input market and year
             * shows 0 if input invalid
             * accepts partial overlap in market names
             * uses all years / all markets if no input */}
            <Form style={{ float: 'left', marginLeft: '1vw', marginTop: '2vh', marginRight: '2vw' }}>
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



            {/*Error messages in case of invalid user input*/}
            <p>
                <br></br>
                <font size="2">
                    {this.state.message}
                </font>
            </p>
            

            {JSON.stringify(this.state.fundingValue) === "[]" ?
                <p> <font size="2">
                    no market found, please try again </font>
                </p> : <div> <br></br> <br></br> </div>}

                <div>

            <br></br>

{/*                Charts for funding amount and number as well as founding dates per year and international funding ratio */}
            <div className="left">

            <LineCChart 
                queryResults={this.state.fundingValue}
                kpi={"total_funding"}
                title={"$ Funding"}
                />
            </div>
            <div className="left">
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


            <div className="two">

                <BarCChart
                    queryResults={this.state.internationalFunding}
                    title={"% International Funding"}
                />
                </div>

                <div className="left">
                    <Table dataSource={this.state.fundingShare} columns={marketColumns} pagination={{ defaultPageSize: 5 }} style={{ width: '40vw', margin: '0 auto', marginTop: '2vh' }} />
                </div>


            {/*<br></br>
            <div className="left">
                <PieCChart
                    queryResults={this.state.fundingShare}
                    title={"Funding by Market"}
                />
            </div>
*/}
                </div>


      </div>
    )
  }

}

export default HomePage

