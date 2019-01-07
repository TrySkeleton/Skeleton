const createError = require('http-errors')

const createAuthHandler = (backend) => {

    return async (req, res, next) => {

        const { username, password } = req.body

        try {

            const account = await backend.Auth.getAccountFromCredentials(username, password)
            const token = await backend.Auth.createSession(account.id)

            res.json({
                token
            })

        } catch(err) {
            next(err)
        }
    }
}

const createAuthMiddleware = (backend) => {

    return async (req, res, next) => {

        let token

        try {

            const authHeader = req.headers['authorization'].split(' ')
            if (authHeader.length !== 2 || authHeader[0] !== "Bearer") {
                next(createError(401, "Invalid authorization header"))
                return
            }

            token = authHeader[1]

        } catch (e) {
            next(createError(401, "Invalid authorization header"))
            return
        }


        try {

            const isValid = await backend.Auth.isTokenValid(token)

            if (isValid) {
                next()
            } else {
                next(createError(401))
            }

        } catch(err) {
            next(err)
        }
    }
}

module.exports = {
    createAuthHandler: (backend) => createAuthHandler(backend),
    createAuthMiddleware: (backend) => createAuthMiddleware(backend)
}