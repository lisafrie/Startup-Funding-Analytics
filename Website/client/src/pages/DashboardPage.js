import React from 'react';

import { getDashboard } from '../fetcher'

import Map from "../components/Map";

class DashboardPage extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
        selectedKPI: "",
        selectedMarket: "tech",
        selectedYear: -1,
        dashboardResults: []
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
            {JSON.stringify(this.state.dashboardResults)}
            <Map />
      </div>
    )
  }

}

export default DashboardPage

