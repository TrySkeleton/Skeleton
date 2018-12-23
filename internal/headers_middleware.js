const headersMiddleware = (req, res, next) => {
    res.header("X-Powered-By", "Skeleton")
    next()
}

module.exports = headersMiddleware