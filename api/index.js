const Plugin = require('./plugin')

const createAPI = (backend) => {

    return {
        Plugin,
        Articles: backend.Articles,
        Events: backend.Events
    }
}

module.exports = createAPI