const ERROR_EVENT_NOT_FOUND = "Requested event could not be found"
const ERROR_INVALID_TITLE = "Event title must be valid string"
const ERROR_INVALID_DESCRIPTION = "Event description must be valid string"
const ERROR_INVALID_LOCATION = "Event location must be valid string"
const ERROR_INVALID_BOOTH = "Event booth must be valid string"

const getEvent = (_conn, id) => new Promise((resolve, reject) => {

    if (!(Number.isInteger(id) && id >= 0)) {
        reject(_conn.ERROR_INVALID_ID)
        return
    }

    _conn.query(`SELECT * FROM events WHERE id=${id} LIMIT 1`, (err, result, fields) => {

        if (err) {
            reject(err)
            return
        }

        if (result.length !== 1) {
            reject(ERROR_EVENT_NOT_FOUND)
            return
        }

        resolve({ ...result[0] })
    })
})

const getEventsCount = (_conn) => new Promise((resolve, reject) => {

    _conn.query(`SELECT * FROM events`, (err, result, fields) => {

        if (err) {
            reject(err)
            return
        }

        resolve(result.length)
    })
})

const getEvents = (_conn, limit, offset) => new Promise((resolve, reject) => {

    if (!(Number.isInteger(limit) && limit >= 0)) {
        reject(_conn.ERROR_INVALID_LIMIT)
        return
    }

    if (!(Number.isInteger(offset) && offset >= 0)) {
        reject(_conn.ERROR_INVALID_OFFSET)
        return
    }

    _conn.query(`SELECT * FROM events WHERE start >= CURDATE() ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`, (err, result, fields) => {

        if (err) {
            reject(err)
            return
        }

        resolve(result.map(row => Object.assign({}, row)))
    })
})

const createEvent = (_conn, params) => new Promise((resolve, reject) => {

    const { title, startDate, startTime, endDate, endTime, description, location, booth } = params

    if (typeof title !== "string") {
        reject(ERROR_INVALID_TITLE)
    }

    if (typeof description !== "string" && typeof description !== "undefined") {
        reject(ERROR_INVALID_DESCRIPTION)
    }

    if (typeof location !== "string" && typeof location !== "undefined") {
        reject(ERROR_INVALID_LOCATION)
    }

    if (typeof booth !== "string" && typeof booth !== "undefined") {
        reject(ERROR_INVALID_BOOTH)
    }

    const start = "2018-12-22 18:00:00"
    const end = "2018-12-30 20:00:00"

    _conn.query(`INSERT INTO events (title, start, end, created_at) VALUES ('${title}', '${start}', '${end}', NOW())`, (err, result) => {

        if (err) {
            reject(err)
            return
        }

        resolve(result.insertId)
    })
})

const deleteEvent = (_conn, id) => new Promise((resolve, reject) => {

    if (!(Number.isInteger(id) && id >= 0)) {
        reject(_conn.ERROR_INVALID_ID)
        return
    }

    _conn.query(`DELETE FROM events WHERE id=${id}`, (err, result) => {

        if (err) {
            reject(err)
            return
        }

        resolve()
    })
})

module.exports = conn => {

    return {
        getEvent: (id) => getEvent(conn, id),
        getEventsCount: () => getEventsCount(conn),
        getEvents: (limit, offset) => getEvents(conn, limit, offset),
        createEvent: (params) => createEvent(conn, params),
        deleteEvent: (id) => deleteEvent(conn, id)
    }
}