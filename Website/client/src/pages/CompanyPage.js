import React from 'react';
import { Form, FormInput, FormGroup, Button, Card, CardBody } from "shards-react";
import Linkify from 'react-linkify';

import {
    Table,
    Row,
    Col,
} from 'antd'

import { getCompanySearch, getCompany, getCompanyRounds, getCompanyInvestors } from '../fetcher'

import MenuBar from '../components/MenuBar';
import BarChartRounds from '../components/BarChartRounds';


const companyColumns = [
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        sorter: (a, b) => a.name.localeCompare(b.name),
        render: (text, row) => <a href={`/company?ID=${row.ID}`}>{text}</a>
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
        title: 'City',
        dataIndex: 'city',
        key: 'city',
        sorter: (a, b) => a.city.localeCompare(b.city)
    },
    {
        title: 'Founding Date',
        dataIndex: 'founding_date',
        key: 'founding_date',
        sorter: (a, b) => a.state.localeCompare(b.state)
    },
    {
        title: 'Total Funding',
        dataIndex: 'total_funding',
        key: 'total_funding',
        sorter: (a, b) => a.total_funding - b.total_funding,
        render: (value) => {
            return "US$ " + Math.round(value / 1000000).toLocaleString("en") + "M";
        }

    }
];

const investorColumns = [
    {
        title: 'Date',
        dataIndex: 'date',
        key: 'date'
    },
    {
        title: 'Round',
        dataIndex: 'round_type',
        key: 'round_type'
    },
    {
        title: 'Investor',
        dataIndex: 'investor',
        key: 'investor'
    }
];

const DataFormatter = (num) => {
    if (num > 1000000000) {
        return "US$ " + Math.round(num / 100000000) / 10 + "Bn";
    } else if (num > 1000000) {
        return "US$ " + Math.round(num / 100000) / 10 + "M";
    } else {
        return "US$ " + Math.round(num / 100) / 10 + "K";
    }
}


class CompanyPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            name: '',
	        market: '',
	        country: '',
            selectedState: '',
            city: '',
            companiesResults: [],
            total_fundingLow: 0,
            total_fundingHigh: 31000000000,
            selectedCompanyID: window.location.search ? window.location.search.substring(1).split('=')[1] : -1,
            selectedCompanyDetails: null,
            selectedCompanyRounds: null,
            selectedCompanyInvestors: null
        }

        this.handleNameChange = this.handleNameChange.bind(this)
        this.handleMarketChange = this.handleMarketChange.bind(this)
        this.handleCountryChange = this.handleCountryChange.bind(this)
        this.handleStateChange = this.handleStateChange.bind(this)
        this.handleFundingChange = this.handleFundingChange.bind(this)
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
    handleFundingChange(value) {
        this.setState({ total_fundingLow: value[0] })
        this.setState({ total_fundingHigh: value[1] })
    }

    updateSearchResults() {
        getCompanySearch(this.state.name, this.state.market, this.state.country, this.state.selectedState, this.state.city, this.state.total_fundingLow, this.state.total_fundingHigh, null, null).then(res => {
            this.setState({ companiesResults: res.results })
        }) 
        this.setState({ selectedCompanyID: -1 })
    }

    componentDidMount() {
        getCompanySearch(this.state.name, this.state.market, this.state.country, this.state.selectedState, this.state.city, this.state.total_fundingLow, this.state.total_fundingHigh, null, null).then(res => {
            this.setState({ companiesResults: res.results })
        })

        getCompany(this.state.selectedCompanyID).then(res => {
            this.setState({
                selectedCompanyDetails: res.results[0]
            })
        })

        getCompanyRounds(this.state.selectedCompanyID).then(res => {
            this.setState({ selectedCompanyRounds: res.results })
        })

        getCompanyInvestors(this.state.selectedCompanyID).then(res => {
            this.setState({ selectedCompanyInvestors: res.results })
        })


    }

    render() {
        return (
            <div>
                <MenuBar />

                <Form style={{ width: '80vw', margin: '0 auto', marginTop: '5vh' }}>
                    <Row>
                        <Col flex={2}><FormGroup style={{ width: '15vw', marginLeft: '1vw' }}>
                            <label>Company Name</label>
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
{/*                        <Col flex={2}><FormGroup style={{ width: '20vw', marginLeft: '5vw' }}>
                            <label>Total Funding</label>
                            <Slider range={true} defaultValue={[0, 310000000000]} onChange={this.handleFundingChange} />
                        </FormGroup></Col>*/}
                        <Col flex={2}><FormGroup style={{ width: '15vw' }}>
                            <Button style={{float: 'right', marginTop: '4vh'}} onClick={this.updateSearchResults}>Search</Button>
                        </FormGroup></Col>

                    </Row>
                </Form>

                {/*Error message in case of invalid user input*/}
                {JSON.stringify(this.state.companiesResults) === "[]" ?
                    <div style={{textAlign: 'center'} }>
                    <h4> 
                        Please wait a few seconds for the results to load. If no results found, adjust your input.
                        </h4>
                    </div> : 

/*                    Table with all companies returned by search*/
                <Table dataSource={this.state.companiesResults} columns={companyColumns} pagination={{ pageSizeOptions: [5, 10, 20], defaultPageSize: 5, showQuickJumper: true }} style={{ width: '70vw', margin: '0 auto', marginTop: '2vh' }} />

                }

{/*                Pop-up box with additional detail for selected company*/}
                {this.state.selectedCompanyDetails && this.state.selectedCompanyRounds && this.state.selectedCompanyID !== -1 ?
                    <div style={{ width: '70vw', margin: '0 auto', marginTop: '2vh' }}>
                    <Card>

                        <CardBody>
                            <Row gutter='30' align='middle' justify='center'>
                                <Col flex={2} style={{ textAlign: 'left' }}>
                                    <h3>{this.state.selectedCompanyDetails.name}</h3>

                                </Col>

                            </Row>
                            <Row gutter='30' align='top' justify='left'>
                                    <Col flex={2} style={{ textAlign: 'left' }}>
                                        <br></br>
                                        <h6><Linkify properties={{ target: '_blank' }}> {this.state.selectedCompanyDetails.homepage_URL} </Linkify></h6>
                                        <h6>Founding Date:  {this.state.selectedCompanyDetails.date}</h6>
                                        <h6>Market:         {this.state.selectedCompanyDetails.company_market}</h6>
                                        <h6>Total funding:  {DataFormatter(this.state.selectedCompanyDetails.total_funding)} </h6>
                                        <Table dataSource={this.state.selectedCompanyInvestors} columns={investorColumns} style={{marginLeft: '1.6vw'} }/>
                                    </Col>
                                    <Col flex={2} style={{ textAlign: 'right' }} >

                                        <div className='graph'>

                                            <BarChartRounds
                                                queryResults={this.state.selectedCompanyRounds}
                                                title={"Funding per Round"}
                                        />
                                        </div>
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

export default CompanyPage

