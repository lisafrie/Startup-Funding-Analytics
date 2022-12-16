import config from './config.json'

const getFundingValue = async (market) => {
    try {
        var res = await fetch(`http://${config.server_host}:${config.server_port}/timeseries_funding?market=${market}`, {
            method: 'GET',
        })
        return res.json()
    } catch (error) {
        console.error(error)
        return null
    }
}

const getFundingNumber = async (market) => {
    try {
        var res = await fetch(`http://${config.server_host}:${config.server_port}/timeseries_count_funding?market=${market}`, {
            method: 'GET',
        })
        return res.json()
    } catch (error) {
        console.error(error)
        return null
    }
}

const getFoundingDates = async (market) => {
    try {
        var res = await fetch(`http://${config.server_host}:${config.server_port}/timeseries_founding_dates?market=${market}`, {
            method: 'GET',
        })
        return res.json()
    } catch (error) {
        console.error(error)
        return null
    }
}

const getFundingShare = async (year) => {
    try {
        var res = await fetch(`http://${config.server_host}:${config.server_port}/market_funding_share?year=${year}`, {
            method: 'GET',
        })
        return res.json()
    } catch (error) {
        console.error(error)
        return null
    }
}

const getInternationalFunding = async (year, market) => {
    try {
        var res = await fetch(`http://${config.server_host}:${config.server_port}/international_funding?year=${year}&market=${market}`, {
            method: 'GET',
        })
        return res.json()
    } catch (error) {
        console.error(error)
        return null
    }
}

const getDashboard = async (kpi, market, year) => {
    try {
        var res = await fetch(`http://${config.server_host}:${config.server_port}/dashboard?kpi=${kpi}&market=${market}&year=${year}`, {
            method: 'GET',
        })
        return res.json()
    } catch (error) {
        console.error(error)
        return null
    }
}

const getCompany = async () => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/company`, {
        method: 'GET',
    })
    return res.json()
}

const getInvestor = async () => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/investor`, {
        method: 'GET',
    })
    return res.json()
}

export {
    getFundingValue,
    getFundingNumber,
    getFoundingDates,
    getFundingShare,
    getInternationalFunding,
    getDashboard,
    getCompany,
    getInvestor
}