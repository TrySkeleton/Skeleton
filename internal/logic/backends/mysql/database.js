const mysql = require("mysql")
const process = require("process")

const ERROR_INVALID_ID = "Invalid id"
const ERROR_INVALID_LIMIT = "Limit must be integer"
const ERROR_INVALID_OFFSET = "Offset must be integer"

const createConnection = (opts) => {

    const conn = mysql.createConnection(opts.database)

    conn.query(
        "CREATE TABLE IF NOT EXISTS articles (id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY," +
        "created_at datetime NOT NULL," +
        "updated_at datetime DEFAULT NULL," +
        "published_at datetime DEFAULT NULL," +
        "title TEXT," +
        "content LONGTEXT," +
        "preview TEXT)", (err, res) => {

            if (err) {
                console.log(err)
                process.exit(1)
            }
        })

    conn.query(
        "CREATE TABLE IF NOT EXISTS events (id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY," +
        "created_at datetime NOT NULL," +
        "start datetime NOT NULL," +
        "end datetime NOT NULL," +
        "title TEXT," +
        "description TEXT," +
        "location TEXT," +
        "booth TEXT)", (err, res) => {

            if (err) {
                console.log(err)
                process.exit(1)
            }
        })

    return conn
}

module.exports = createConnection
module.exports.ERROR_INVALID_ID = ERROR_INVALID_ID
module.exports.ERROR_INVALID_LIMIT = ERROR_INVALID_LIMIT
module.exports.ERROR_INVALID_OFFSET = ERROR_INVALID_OFFSET