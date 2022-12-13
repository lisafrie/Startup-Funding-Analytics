import React from 'react';

import { getInvestor } from '../fetcher'

class InvestorPage extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      investor: [],
    }
  }

  componentDidMount() {
    getInvestor().then(res => {
      console.log("Investor")
      console.log(res.name);
      this.setState({ investor: res.name })
    }) 
  }


  render() {

    return (
      <div>
        {this.state.investor}
      </div>
    )
  }

}

export default InvestorPage

