const getJob = (_conn, id) => new Promise((resolve, reject) => {

    if (!(Number.isInteger(parseInt(id)) && id >= 0)) {
        reject(_conn.ERROR_INVALID_ID)
        return
    }


})

module.exports = conn => {

    return {
        getJob: (id) => getJob(conn, id)
    }
}