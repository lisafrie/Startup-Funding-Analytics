import React from 'react';
import { Form, FormInput, FormGroup, Button, Card, CardBody } from "shards-react";

import {
    Table,
    Row,
    Col,
} from 'antd'

import { getInvestorSearch, getInvestor } from '../fetcher'

import MenuBar from '../components/MenuBar';

const investorColumns = [
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        sorter: (a, b) => a.name.localeCompare(b.name),
        render: (text, row) => <a href={`/investor?ID=${row.ID}`}>{text}</a>
    },
    {
        title: 'Market',
        dataIndex: 'market',
        key: 'market',
        sorter: (a, b) => a.market.localeCompare(b.market)
    },
    {
        title: 'Country',
        dataIndex: 'country',
        key: 'country',
        sorter: (a, b) => a.country.localeCompare(b.country)
    },
    {
        title: 'State',
        dataIndex: 'state',
        key: 'state',
        sorter: (a, b) => a.state.localeCompare(b.state)
    },
    {
        title: '# Investments',
        dataIndex: 'num_investments',
        key: 'num_investments',
        sorter: (a, b) => b.num_investments - a.num_investments

    },
    {
        title: '# Acquisitions',
        dataIndex: 'num_acquisitions',
        key: 'num_acquisitions',
        sorter: (a, b) => b.num_acquisitions - a.num_acquisitions

    }
];

const detailColumns = [
    {
        title: 'Market',
        dataIndex: 'market',
        key: 'market'
    },
    {
        title: '# Investments',
        dataIndex: 'num_investments',
        key: 'num_investments',
        sorter: (a, b) => b.num_investments - a.num_investments
    },
    {
        title: '# Acquisitions',
        dataIndex: 'num_acquisitions',
        key: 'num_acquisitions',
        sorter: (a, b) => b.num_acquisitions - a.num_acquisitions
    }
];


class InvestorPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            name: '',
            market: '',
            country: '',
            selectedState: '',
            city: '',
            is_person: '',
            num_investmentsLow: 0,
            num_investmentsHigh: 800,
            num_acquisitionsLow: 0,
            num_acquisitionsHigh: 200,
            investorsResults: [],
            selectedInvestorID: window.location.search ? window.location.search.substring(1).split('=')[1] : -1,
            selectedInvestorDetails: null

        }

        this.handleNameChange = this.handleNameChange.bind(this)
        this.handleMarketChange = this.handleMarketChange.bind(this)
        this.handleCountryChange = this.handleCountryChange.bind(this)
        this.handleStateChange = this.handleStateChange.bind(this)
        this.handlePersonChange = this.handlePersonChange.bind(this)
        this.handleInvestmentsChange = this.handleInvestmentsChange.bind(this)
        this.handleAcquisitionsChange = this.handleAcquisitionsChange.bind(this)
        this.updateSearchResults = this.updateSearchResults.bind(this)

    }



    handleNameChange(event) {
        this.setState({ name: event.target.value })
    }
    handleMarketChange(event) {
        this.setState({ market: event.target.value })
    }
    handleCountryChange(event) {
        this.setState({ country: event.target.value })
    }
    handleStateChange(event) {
        this.setState({ selectedState: event.target.value })
    }
    handlePersonChange(event) {
        this.setState({ is_person: event.target.value })
    }
    handleInvestmentsChange(value) {
        this.setState({ num_investmentsLow: value[0] })
        this.setState({ num_investmentsHigh: value[1] })
    }
    handleAcquisitionsChange(value) {
        this.setState({ num_acquisitionsLow: value[0] })
        this.setState({ num_acquisitionsHigh: value[1] })
    }

    updateSearchResults() {
        getInvestorSearch(this.state.name, this.state.market, this.state.country, this.state.selectedState, this.state.city, this.state.is_person, this.state.num_investmentsLow, this.state.num_investmentsHigh, this.state.num_acquisitionsLow, this.state.num_acquisitionsHigh, null, null).then(res => {
            this.setState({ investorsResults: res.results })
        })
        this.setState({ selectedCompanyID: -1 })
    }

    componentDidMount() {
        getInvestorSearch(this.state.name, this.state.market, this.state.country, this.state.selectedState, this.state.city, this.state.is_person, this.state.num_investmentsLow, this.state.num_investmentsHigh, this.state.num_acquisitionsLow, this.state.num_acquisitionsHigh, null, null).then(res => {
            this.setState({ investorsResults: res.results })
        })

        getInvestor(this.state.selectedInvestorID).then(res => {
            this.setState({
                selectedInvestorDetails: res.results
            })
        })




    }

    render() {
        return (
            <div>
                <MenuBar />

                {/*{JSON.stringify(this.state.selectedInvestorDetails)}*/}

                <Form style={{ width: '80vw', margin: '0 auto', marginTop: '5vh' }}>
                    <Row>
                        <Col flex={2}><FormGroup style={{ width: '15vw', marginLeft: '1vw' }}>
                            <label>Investor Name</label>
                            <FormInput placeholder="Name" value={this.state.name} onChange={this.handleNameChange} />
                        </FormGroup></Col>
                        <Col flex={2}><FormGroup style={{ width: '15vw', marginLeft: '1vw' }}>
                            <label>Market</label>
                            <FormInput placeholder="Market" value={this.state.market} onChange={this.handleMarketChange} />
                        </FormGroup></Col>
                        <Col flex={2}><FormGroup style={{ width: '15vw', marginLeft: '1vw' }}>
                            <label>Country</label>
                            <FormInput placeholder="Country" value={this.state.country} onChange={this.handleCountryChange} />
                        </FormGroup></Col>
                        <Col flex={2}><FormGroup style={{ width: '15vw', marginLeft: '1vw' }}>
                            <label>State</label>
                            <FormInput placeholder="State" value={this.state.selectedState} onChange={this.handleStateChange} />
                        </FormGroup></Col>
{/*                        <Col flex={2}><FormGroup style={{ width: '20vw', marginLeft: '4vw' }}>
                            <label># Investments</label>
                            <Slider range={true} defaultValue={[0, 800]} onChange={this.handleInvestmentsChange} />
                        </FormGroup></Col>
                        <Col flex={2}><FormGroup style={{ width: '20vw', marginLeft: '5vw' }}>
                            <label># Acquisitions</label>
                            <Slider range={true} defaultValue={[0, 200]} onChange={this.handleAcquisitionsChange} />
                        </FormGroup></Col>*/}
                        <Col flex={2}><FormGroup style={{ width: '15vw' }}>
                            <Button style={{ float: 'right', marginTop: '4vh' }} onClick={this.updateSearchResults}>Search</Button>
                        </FormGroup></Col>

                    </Row>
                </Form>

                {/*Error message in case of invalid user input*/}
                {JSON.stringify(this.state.investorsResults) === "[]" ?
                    <div style={{ textAlign: 'center' }}>
                        <h4>
                            Please wait a few seconds for the results to load. If no results found, adjust your input.
                        </h4>
                    </div> :
                    /*                    Table with all investors returned by search*/
                    <Table dataSource={this.state.investorsResults} columns={investorColumns} pagination={{ pageSizeOptions: [5, 10, 20], defaultPageSize: 5, showQuickJumper: true }} style={{ width: '70vw', margin: '0 auto', marginTop: '2vh' }} />
                } 

                {/*                Pop-up box with additional detail for selected investor*/}
                {this.state.selectedInvestorDetails && this.state.selectedInvestorID !== -1 ? <div style={{ width: '70vw', margin: '0 auto', marginTop: '2vh' }}>
                    <Card>

                        <CardBody>
                            <Row gutter='30' align='middle' justify='center'>
                                <Col flex={2} style={{ textAlign: 'left' }}>
                                    <h3>{this.state.selectedInvestorDetails[0].name}</h3>
                                    <Table dataSource={this.state.selectedInvestorDetails} columns={detailColumns} style={{ marginLeft: '1.6vw' }} />
                                </Col>
                            </Row>

                            <br>
                            </br>

                        </CardBody>

                    </Card>

                </div> : null}


            </div>
        )
    }
}

export default InvestorPage

