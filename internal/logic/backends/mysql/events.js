const moment = require('moment')

const ERROR_INVALID_START_DATE_FORMAT = new Error("Invalid start date format")
const ERROR_INVALID_END_DATE_FORMAT = new Error("Invalid end date format")
const ERROR_EVENT_NOT_FOUND = new Error("Requested event could not be found")
const ERROR_INVALID_TITLE = new Error("Event title must be valid string")
const ERROR_INVALID_DESCRIPTION = new Error("Event description must be valid string")
const ERROR_INVALID_LOCATION = new Error("Event location must be valid string")
const ERROR_INVALID_BOOTH = new Error("Event booth must be valid string")

const getEvent = (_conn, id) => new Promise((resolve, reject) => {

    if (!(Number.isInteger(parseInt(id)) && id >= 0)) {
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

    _conn.query(`SELECT * FROM events ORDER BY start DESC LIMIT ${limit} OFFSET ${offset}`, (err, result, fields) => {

        if (err) {
            reject(err)
            return
        }

        resolve(result.map(row => Object.assign({}, row)))
    })
})

const createEvent = (_conn, params) => new Promise((resolve, reject) => {

    const { title, start, end, description, location, booth } = params

    if(!moment(start, "YYYY-MM-DD HH:MM").isValid()) {
        reject(ERROR_INVALID_START_DATE_FORMAT)
        return
    }

    if(!moment(end, "YYYY-MM-DD HH:MM").isValid()) {
        reject(ERROR_INVALID_END_DATE_FORMAT)
        return
    }

    if (typeof title !== "string") {
        reject(ERROR_INVALID_TITLE)
        return
    }

    if (typeof description !== "string" && typeof description !== "undefined") {
        reject(ERROR_INVALID_DESCRIPTION)
        return
    }

    if (typeof location !== "string" && typeof location !== "undefined") {
        reject(ERROR_INVALID_LOCATION)
        return
    }

    if (typeof booth !== "string" && typeof booth !== "undefined") {
        reject(ERROR_INVALID_BOOTH)
        return
    }

    _conn.query(`INSERT INTO events (title, description, location, booth, start, end, created_at) VALUES ('${title}', '${description ? description : ""}', '${location ? location : ""}', '${booth ? booth : ""}', '${start}', '${end}', NOW())`, (err, result) => {

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
        deleteEvent: (id) => deleteEvent(conn, id),
        ERROR_EVENT_NOT_FOUND,
        ERROR_INVALID_TITLE,
        ERROR_INVALID_DESCRIPTION,
        ERROR_INVALID_LOCATION,
        ERROR_INVALID_BOOTH
    }
}