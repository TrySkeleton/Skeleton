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
    cloud: {
        projectId: "curratec-219910",
        storageBucket: "curratec-219910.appspot.com"
    },
    database: {
        host: "localhost",
        user: "skeleton-prod",
        database: "skeleton",
        password: "dGPqm4QeRKHHb2X",
    }
})

app.use(skeleton.middleware)

app.listen(port, () => console.log(`Starting development server on port ${port}...`))