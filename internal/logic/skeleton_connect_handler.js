const createSkeletonConnectHandler = (backend) => {

    return (requestPayload, resolve, reject) => {

        const action = requestPayload.action

        if (action === "AUTH_WITH_ACCESS_PASSWORD") {

            const password = requestPayload.password

            if (password === "hallo1") {

                const token = "GET_TOKEN"
                resolve(token)
            } else {
                reject("Invalid credentials")
            }

        } else if (action === "GET_ARTICLES") {

            const { limit, offset } = requestPayload

            backend.Articles.getArticlePreviews(limit, offset).then(articles => {
                resolve(articles)
            }).catch(err => {
                reject(err)
            })

        } else if (action === "GET_ARTICLES_COUNT") {

            backend.Articles.getArticlesCount().then(count => {
                resolve(count)
            }).catch(err => {
                reject(err)
            })

        } else if (action === "GET_EVENTS_COUNT") {

            backend.Events.getEventsCount().then(count => {
                resolve(count)
            }).catch(err => {
                reject(err)
            })

        } else if (action === "GET_EVENTS") {

            const { limit, offset } = requestPayload

            backend.Events.getEvents(limit, offset).then(events => {
                resolve(events)
            }).catch(err => {
                reject(err)
            })

        } else if (action === "CREATE_NEW_ARTICLE") {

            backend.Articles.createArticle().then(id => {
                resolve(id)
            }).catch(err => {
                reject(err)
            })

        } else {
            console.log("Unknown client request")
        }
    }
}

module.exports = createSkeletonConnectHandler