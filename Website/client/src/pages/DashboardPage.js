import React from 'react';

import { getDashboard } from '../fetcher'

class DashboardPage extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      dashboard: [],
    }
  }

  componentDidMount() {
    getDashboard().then(res => {
      console.log("Dashboard")
      console.log(res.name);
      this.setState({ dashboard: res.name })
    }) 
  }


  render() {

    return (
      <div>
        {this.state.dashboard}
      </div>
    )
  }

}

export default DashboardPage

