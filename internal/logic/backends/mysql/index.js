const createConnection = require('./database')
const Auth = require('./auth')
const Articles = require('./articles')
const Events = require('./events')
const Jobs = require('./jobs')

const createBackend = (opts) => {

    const conn = createConnection(opts)

    return {
        Auth: Auth(conn),
        Articles: Articles(conn),
        Events: Events(conn),
        Jobs: Jobs(conn)
    }
}

module.exports = createBackend