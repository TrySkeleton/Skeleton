const express = require('express')
const cors = require('cors')
const path = require('path')
const skeletonAdmin = require('skeleton-admin')

const headers = require('./internal/headers_middleware')
const connectHandler = require('./internal/connect_handler')
const createAPI = require('./api')
const createSkeletonConnectHandler = require('./internal/logic/skeleton_connect_handler')
const createMySQLBackend = require('./internal/logic/backends/mysql')

const authHandler = require('./internal/auth_handler')
const fileHandler = require('./internal/file_handler')
const errorHandler = require('./internal/error_handler')

const router = express.Router()
const skeletonAdminMiddleware = skeletonAdmin({

})

// opts are not used, but may be necessary in the future
const createMiddleware = (opts, backend) => {

    router.use(express.json({ extended: true }))

    const authMiddleware = authHandler.createAuthMiddleware(backend)

    router.use('/skeleton', headers)
    router.use('/skeleton/api/v1/', express.json({ extended: true }))
    router.use('/skeleton/api/v1/connect', authMiddleware, connectHandler.middleware)
    router.use('/skeleton/api/v1/upload', authMiddleware, fileHandler(opts))
    router.use('/skeleton/api/v1/auth', authHandler.createAuthHandler(backend))
    router.use('/skeleton/api/v1/', errorHandler)

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

    const middleware = createMiddleware(opts, backend)
    const API = createAPI(backend)

    return {
        middleware,
        API
    }
}