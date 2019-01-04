const createError = require('http-errors')
const { Router } = require('express')
const {Storage} = require('@google-cloud/storage')
const multer  = require('multer')

module.exports = (opts) => {

    const router = new Router()

    const storage = new Storage({
        projectId: opts.cloud.projectId,
    })

    const upload = multer({
        storage: multer.memoryStorage(),
        limits: {
            fileSize: 5 * 1024 * 1024
        }
    })

    const bucket = storage.bucket(opts.cloud.storageBucket)

    router.post('/', upload.single('image'), (req, res, next) => {

        if (!req.file) {
            next(createError(400, 'No file present'))
            return
        }

        const gcsname = Date.now() + req.file.originalname;
        const file = bucket.file(gcsname)

        const stream = file.createWriteStream({
            metadata: {
                contentType: req.file.mimetype
            },
            resumable: false
        })

        stream.on('error', (err) => {
            req.file.cloudStorageError = err
            next(createError(500, err.message))
        })

        stream.on('finish', () => {

            req.file.cloudStorageObject = gcsname
            file.makePublic().then(() => {

                const publicUrl = `https://storage.googleapis.com/${opts.cloud.storageBucket}/${gcsname}`

                req.file.cloudStoragePublicUrl = publicUrl
                res.json({
                    publicUrl: publicUrl
                })

            }).catch(err => {
                console.error(err)
                next(err)
            })
        })

        stream.end(req.file.buffer)
    })

    return router
}