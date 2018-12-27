const express = require('express')
const errorhandler = require('errorhandler')
const app = express()
const port = 7554

app.use(errorhandler({
    dumpExceptions: true,
    showStack: true
}))

const skeleton = require('../index')({
    middleware: {
        admin: false,
        crossOrigin: true
    },
    database: {
        host: "localhost",
        user: "skeleton",
        database: "skeleton",
        password: "tv5W9egsS4hLRSx",
    }
})

app.use(skeleton.middleware)

app.listen(port, () => console.log(`Starting development server on port ${port}...`))