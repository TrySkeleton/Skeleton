const DiffMatchPatch = require("diff-match-patch")
const crypto = require("crypto")

const dmp = new DiffMatchPatch()

const createSkeletonConnectHandler = (backend) => {

    return (requestPayload, resolve, reject) => {

        const action = requestPayload.action

        if (action === "GET_ARTICLES") {

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

        } else if (action === "GET_ARTICLE") {

            const { id } = requestPayload

            backend.Articles.getArticle(id).then(article => {
                resolve(article)
            }).catch(err => {
                console.log(err)
                reject(err)
            })

        } else if (action === "SET_ARTICLE_PUBLISH_STATE") {

            const { id, publish } = requestPayload

            if (publish) {
                backend.Articles.publishArticle(id).then(() => resolve())
                    .catch(err => reject(err))
            } else {
                backend.Articles.unpublishArticle(id).then(() => resolve())
                    .catch(err => reject(err))
            }
        } else if (action === "SET_ARTICLE_COVER_URL") {

            const { id, coverURL } = requestPayload
            backend.Articles.setArticleCoverURL(id, coverURL).then(() => resolve())
                .catch(err => reject(err))

        } else if (action === "DELETE_ARTICLE") {

            const { id } = requestPayload

            backend.Articles.deleteArticle(id).then(() => {
                resolve()
            }).catch(err => {
                console.log(err)
                reject(err)
            })
        } else if (action === "PATCH_ARTICLE") {

            const { id, patches, checkSum, title } = requestPayload

            backend.Articles.getArticle(id).then(article => {

                const patchedContent = dmp.patch_apply(patches, article.content || "")[0]
                const patchedCheckSum = crypto.createHash('md5').update(patchedContent).digest("hex")

                if (checkSum !== patchedCheckSum) {
                    reject(new Error('Patch error, invalid checksum.'))
                    return
                }

                backend.Articles.updateArticle(id, {
                    content: patchedContent,
                    title
                }).then(() => resolve(checkSum))
                    .catch(err => {
                        console.log(err)
                        reject(err)
                    })

            }).catch(err => {
                console.log(err)
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

        } else if (action === "GET_EVENT") {

            const id = requestPayload.id

            backend.Events.getEvent(id).then(event => {
                resolve(event)
            }).catch(err => {
                reject(err)
            })

        } else if (action === "DELETE_EVENT") {

            const id = requestPayload.id

            backend.Events.deleteEvent(id).then(() => {
                resolve()
            }).catch(err => {
                reject(err)
            })

        } else if (action === "CREATE_NEW_ARTICLE") {

            backend.Articles.createArticle().then(id => {
                resolve(id)
            }).catch(err => {
                reject(err)
            })

        } else if (action === "CREATE_EVENT") {

            const { event } = requestPayload

            backend.Events.createEvent(event).then(id => {
                resolve(id)
            }).catch(e => {
                reject(e)
            })

        } else {
            console.log("Unknown client request")
        }
    }
}

module.exports = createSkeletonConnectHandler