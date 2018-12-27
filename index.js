const express = require('express')
const cors = require('cors')
const path = require('path')
const skeletonAdmin = require('skeleton-admin')

const headers = require('./internal/headers_middleware')
const connectHandler = require('./internal/connect_handler')
const createAPI = require('./api')
const createSkeletonConnectHandler = require('./internal/logic/skeleton_connect_handler')
const createMySQLBackend = require('./internal/logic/backends/mysql')

const router = express.Router()
const skeletonAdminMiddleware = skeletonAdmin({

})

// opts are not used, but may be necessary in the future
const createMiddleware = (opts) => {

    router.use('/skeleton', headers)
    router.use('/skeleton/api', express.json({ limit: '50mb', extended: true }))
    router.use('/skeleton/api/connect', connectHandler.middleware)

    if (opts.middleware.admin) {
        router.use(skeletonAdminMiddleware)
    }

    if (opts.middleware.crossOrigin) {
        router.use(cors())
    }

    return router
}

module.exports = (opts) => {

    const backend = createMySQLBackend(opts)

    const skeletonConnectHandler = createSkeletonConnectHandler(backend)
    connectHandler._registerHandler('_skeleton', skeletonConnectHandler).catch(err => {
        console.error(err)

    })

    const middleware = createMiddleware(opts)
    const API = createAPI(backend)

    return {
        middleware,
        API
    }
}