import config from './config.json'

const getHome = async () => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/`, {
        method: 'GET',
    })
    return res.json()
}

const getCompany = async () => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/company`, {
        method: 'GET',
    })
    return res.json()
}

export {
    getHome,
    getCompany
}