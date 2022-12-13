import config from './config.json'

const getHome = async () => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/`, {
        method: 'GET',
    })
    return res.json()
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
    getHome,
    getDashboard,
    getCompany,
    getInvestor
}