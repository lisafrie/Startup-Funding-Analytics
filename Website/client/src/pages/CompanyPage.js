import React from 'react';

import { getCompany } from '../fetcher'

class CompanyPage extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      company: [],
    }
  }

  componentDidMount() {
    getCompany().then(res => {
      console.log("Company")
      console.log(res.name);
      this.setState({ company: res.name })
    }) 
  }


  render() {

    return (
      <div>
        {this.state.company}
      </div>
    )
  }

}

export default CompanyPage

