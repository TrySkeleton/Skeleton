const ERROR_EMAIL_ALREADY_USED = new Error("Email already used")

const createAccount = (_conn, email, passwordHash) => new Promise((resolve, reject) => {

    _conn.query(`INSERT INTO accounts (email, password, created_at) VALUES ('${email.toLowerCase()}', '${passwordHash}', NOW())`, (err, result) => {

        if (err) {
            reject(err)
            console.log(err)
            return
        }

        resolve(result.insertId)
    })
})

const createSession = (_conn, accountId, password) => {

    // TODO: Generate token which stores the token id
    const token = ""
}

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

module.exports = conn => {

    return {
        createAccount: (email, passwordHash) => createAccount(conn, email, passwordHash),
        createSession: (accountId, password) => createSession(conn, accountId, password),
        destroySession: (sessionId) => destroySession(conn, sessionId),
        getAccountSessions: (accountId) => getAccountSessions(conn, accountId),
        ERROR_EMAIL_ALREADY_USED
    }
}