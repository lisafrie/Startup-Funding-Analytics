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
import PieChart from "../components/PieChart";

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
        pieChartData: [{
            type: 'bar',
            data: {
                labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
                datasets: [{
                    label: '# of Votes',
                    data: [12, 19, 3, 5, 2, 3],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        }]

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

            <div>
                <canvas id="myChart"></canvas>
            </div>

{/*            <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

            <script>
                const ctx = document.getElementById('myChart');
                new Chart(ctx, {this.state.pieChartData});
            </script>*/}



            <br></br>
            <PieChart chartData={this.state.pieChartData} />
            {JSON.stringify(this.state.fundingValue)}
            <br></br>
            {JSON.stringify(this.state.fundingNumber)}
      </div>
    )
  }

}

export default HomePage

