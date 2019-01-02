const mysql = require("mysql")
const process = require("process")

const ERROR_INVALID_ID = new Error("Invalid id")
const ERROR_INVALID_LIMIT = new Error("Limit must be integer")
const ERROR_INVALID_OFFSET = new Error("Offset must be integer")

const createConnection = (opts) => {

    const conn = mysql.createConnection(opts.database)

    conn.query(
        "CREATE TABLE IF NOT EXISTS articles (id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY," +
        "created_at datetime NOT NULL," +
        "updated_at datetime NOT NULL," +
        "published_at datetime DEFAULT NULL," +
        "title varchar(150) NOT NULL," +
        "content MEDIUMTEXT," +
        "preview TEXT," +
        "slug varchar(150) NOT NULL UNIQUE KEY)", (err, res) => {

            if (err) {
                console.log(err)
                console.error("Could not create 'articles' table")
                process.exit(1)
            }
        })

    conn.query(
        "CREATE TABLE IF NOT EXISTS events (id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY," +
        "created_at datetime NOT NULL," +
        "start datetime NOT NULL," +
        "end datetime NOT NULL," +
        "title varchar(150) NOT NULL," +
        "description TEXT," +
        "location varchar(150)," +
        "booth varchar(150))", (err, res) => {

            if (err) {
                console.log(err)
                console.error("Could not create 'events' table")
                process.exit(1)
            }
        })

    conn.query(
        "CREATE TABLE IF NOT EXISTS accounts (id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY," +
        "created_at datetime NOT NULL," +
        "email varchar(150) NOT NULL," +
        "password varchar(128) NOT NULL)", (err, res) => {

            if (err) {
                console.log(err)
                console.error("Could not create 'accounts' table")
                process.exit(1)
            }
        })

    conn.query(
        "CREATE TABLE IF NOT EXISTS sessions (id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY," +
        "account_id INT(6) NOT NULL," +
        "token TEXT NOT NULL," +
        "created_at datetime NOT NULL," +
        "expires_at datetime NOT NULL)", (err, res) => {

            if (err) {
                console.log(err)
                console.error("Could not create 'sessions' table")
                process.exit(1)
            }
        })

    return conn
}

module.exports = createConnection
module.exports.ERROR_INVALID_ID = ERROR_INVALID_ID
module.exports.ERROR_INVALID_LIMIT = ERROR_INVALID_LIMIT
module.exports.ERROR_INVALID_OFFSET = ERROR_INVALID_OFFSET