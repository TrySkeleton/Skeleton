const registeredHandlers = {}

const _registerHandler = (topic, listener) => new Promise((resolve, reject) => {

    if (typeof topic !== 'string') {
        reject(new Error('Topic must be string'))
    }

    if (typeof listener !== 'function') {
        reject(new Error('Listener must be function'))
    }

    if (listener.length !== 3) {
        reject(new Error('Listener must take three arguments (payload [object], resolve [function], reject [function]))'))
    }

    if (registeredHandlers.hasOwnProperty(topic)) {
        reject(new Error(`A listener for topic ${topic} already registered`))
    }

    registeredHandlers[topic] = listener
    resolve()
})

const middleware = (req, res, next) => {

    const { topic, payload } = req.body

    if (!registeredHandlers.hasOwnProperty(topic)) {

        const response = {
            type: 'ERROR',
            error: new Error('No handler registered').message
        }

        res.json(response)

        return
    }

    const listener = registeredHandlers[topic]

    listener(payload, (responsePayload) => {

        const response = {
            type: 'SUCCESS',
            payload: responsePayload
        }

        res.json(response)

    }, (err) => {

        console.log(err)

        const response = {
            type: 'ERROR',
            error: err.message ? err.message : err
        }

        res.json(response)
    })
}

module.exports = {
    _registerHandler,
    middleware
}