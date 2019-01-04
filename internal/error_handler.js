const errorHandler = (err, req, res, next) => {

    res.json({
        type: "ERROR",
        error: {
            name: err.name || "Unknown error",
            message: err.message || "No error message specified"
        }
    })
}

module.exports = errorHandler
