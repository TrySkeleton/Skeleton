const connectHandler = require('../../internal/connect_handler')

const registerHandler = (topic, listener) => connectHandler._registerHandler(topic, listener)

module.exports = {
    registerHandler
}