const bcrypt = require("bcrypt")

const ERROR_EMAIL_ALREADY_USED = new Error("Email already used")
const ERROR_INVALID_CREDENTIALS = new Error("Invalid credentials")

const createAccount = (_conn, email, passwordHash) => new Promise(async (resolve, reject) => {

    try {
        password = await bcrypt.hash(password, 10)
    } catch (e) {
        reject(e)
        return
    }

    _conn.query(`INSERT INTO accounts (email, password, created_at) VALUES ('${email.toLowerCase()}', '${passwordHash}', NOW())`, (err, result) => {

        if (err) {
            reject(err)
            console.log(err)
            return
        }

        resolve(result.insertId)
    })
})

const createSession = (_conn, accountId) => new Promise((resolve, reject) => {

    // TODO: Generate token which stores the token id
    const token = "lhdbfusbdodgubv"

    _conn.query(`INSERT INTO sessions (account_id, token, created_at, expires_at) VALUES (?, ?, NOW(), NOW() + INTERVAL 1 MONTH)`, [accountId, token], (err, result) => {

        if (err) {
            reject(err)
            return
        }

        resolve(token)
    })
})

const destroySession = (_conn, sessionId) => new Promise((resolve, reject) => {

    if (!(Number.isInteger(sessionId) && sessionId >= 0)) {
        reject(_conn.ERROR_INVALID_ID)
        return
    }

    _conn.query(`DELETE FROM sessions WHERE id=${sessionId}`, (err, result) => {

        if (err) {
            reject(err)
            return
        }

        resolve()
    })
})

const getAccountSessions = (_conn, accountId) => new Promise((resolve, reject) => {

    _conn.query(`SELECT * FROM sessions WHERE account_id=${accountId}`, (err, result, fields) => {

        if (err) {
            reject(err)
            return
        }

        resolve(result.map(row => Object.assign({}, row)))
    })
})

const getAccountFromCredentials = (_conn, id, password) => new Promise(async (resolve, reject) => {

    _conn.query(`SELECT * FROM accounts WHERE email=?`, [id], async (err, result, fields) => {

        if (err) {
            reject(err)
            return
        }

        if (result.length !== 1) {
            reject(ERROR_INVALID_CREDENTIALS)
            return
        }

        try {
            const passwordIsValid = await bcrypt.compare(password, result[0].password)
            if (!passwordIsValid) {
                reject(ERROR_INVALID_CREDENTIALS)
                return
            }
        } catch (e) {
            reject(ERROR_INVALID_CREDENTIALS)
            return
        }

        resolve({ ...result[0] })
    })
})

const isTokenValid = (_conn, token) => new Promise((resolve, reject) => {

    console.log("isTokenValid")

    _conn.query(`SELECT * FROM sessions WHERE token=?`, [ token ], (err, result, fields) => {

        if (err) {
            reject(err)
            return
        }

        console.log(token)
        console.log(result)

        resolve(result.length >= 1)
    })
})

const hashPassword = (password) => {
    return password
}

module.exports = conn => {

    return {
        getAccountFromCredentials: (id, password) => getAccountFromCredentials(conn, id, password),
        createAccount: (email, passwordHash) => createAccount(conn, email, passwordHash),
        createSession: (accountId) => createSession(conn, accountId),
        destroySession: (sessionId) => destroySession(conn, sessionId),
        getAccountSessions: (accountId) => getAccountSessions(conn, accountId),
        hashPassword: (password) => hashPassword(password),
        isTokenValid: (token) => isTokenValid(conn, token),
        ERROR_EMAIL_ALREADY_USED,
        ERROR_INVALID_CREDENTIALS
    }
}