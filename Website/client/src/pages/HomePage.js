import React from 'react';

import { getHome } from '../fetcher'

class HomePage extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      hello: [],
    }
  }

  componentDidMount() {
    getHome().then(res => {
      console.log(res);
      this.setState({ hello: res.results })
    }) 
  }


  render() {

    return (
      <div>
        {JSON.stringify(this.state.hello)}
      </div>
    )
  }

}

export default HomePage

