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

const getCompanySearch = async (name, market, country, state, city, total_fundingLow, total_fundingHigh, page, pagesize) => {
    try {
        var res = await fetch(`http://${config.server_host}:${config.server_port}/search_companies?name=${name}&market=${market}&country=${country}&state=${state}&city=${city}&total_fundingLow=${total_fundingLow}&total_fundingHigh=${total_fundingHigh}&page=${page}&pagesize=${pagesize}`, {
            method: 'GET',
        })
        return res.json()
    } catch (error) {
        console.error(error)
        return null
    }
}

const getCompany = async (ID) => {
    try {
        var res = await fetch(`http://${config.server_host}:${config.server_port}/company?ID=${ID}`, {
            method: 'GET',
        })
        return res.json()
    } catch (error) {
        console.error(error)
        return null
    }
}

const getCompanyRounds = async (ID) => {
    try {
        var res = await fetch(`http://${config.server_host}:${config.server_port}/company_rounds?ID=${ID}`, {
            method: 'GET',
        })
        return res.json()
    } catch (error) {
        console.error(error)
        return null
    }
}

const getCompanyInvestors = async (ID) => {
    try {
        var res = await fetch(`http://${config.server_host}:${config.server_port}/company_investors?ID=${ID}`, {
            method: 'GET',
        })
        return res.json()
    } catch (error) {
        console.error(error)
        return null
    }
}

const getInvestorSearch = async (name, market, country, state, city, is_person, num_investmentsLow, num_investmentsHigh, num_acquisitionsLow, num_acquisitionsHigh, page, pagesize) => {
    try {
        var res = await fetch(`http://${config.server_host}:${config.server_port}/search_investors?name=${name}&market=${market}&country=${country}&state=${state}&city=${city}&is_person=${is_person}&num_investmentsLow=${num_investmentsLow}&num_investmentsHigh=${num_investmentsHigh}&num_acquisitionsLow=${num_acquisitionsLow}&num_acquisitionsHigh=${num_acquisitionsHigh}&page=${page}&pagesize=${pagesize}`, {
            method: 'GET',
        })
        return res.json()
    } catch (error) {
        console.error(error)
        return null
    }
}

const getInvestor = async (ID) => {
    try {
        var res = await fetch(`http://${config.server_host}:${config.server_port}/investor?ID=${ID}`, {
            method: 'GET',
        })
        return res.json()
    } catch (error) {
        console.error(error)
        return null
    }
}

export {
    getFundingValue,
    getFundingNumber,
    getFoundingDates,
    getFundingShare,
    getInternationalFunding,
    getDashboard,
    getCompanySearch,
    getCompany,
    getCompanyRounds,
    getCompanyInvestors,
    getInvestorSearch,
    getInvestor
}