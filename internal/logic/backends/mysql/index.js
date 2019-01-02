const createConnection = require('./database')
const Articles = require('./articles')
const Events = require('./events')

const createBackend = (opts) => {

    const conn = createConnection(opts)

    return {
        Articles: Articles(conn),
        Events: Events(conn)
    }
}

module.exports = createBackend