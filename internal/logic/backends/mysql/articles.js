const getTextFromHTML = require('html2plaintext')

const ERROR_ARTICLE_NOT_FOUND = new Error("Article not found")
const ERROR_INVALID_SLUG = new Error("Invalid article slug")

const getArticle = (_conn, id) => new Promise((resolve, reject) => {

    if (!(Number.isInteger(id) && id >= 0)) {
        reject(_conn.ERROR_INVALID_ID)
        return
    }

    _conn.query(`SELECT * FROM articles WHERE id=${id} LIMIT 1`, (err, result, fields) => {

        if (err) {
            reject(err)
            return
        }

        if (result.length !== 1) {
            reject(ERROR_ARTICLE_NOT_FOUND)
            return
        }

        resolve({ ...result[0] })
    })
})

const getArticleBySlug = (_conn, slug) => new Promise((resolve, reject) => {

    if (typeof slug !== "string") {
        reject(ERROR_INVALID_SLUG)
        return
    }

    _conn.query(`SELECT * FROM articles WHERE slug='${slug}' LIMIT 1`, (err, result, fields) => {

        if (err) {
            reject(err)
            return
        }

        if (result.length !== 1) {
            reject(ERROR_ARTICLE_NOT_FOUND)
            return
        }

        resolve({ ...result[0] })
    })
})

const getArticlesCount = (_conn) => new Promise((resolve, reject) => {

    _conn.query(`SELECT id FROM articles`, (err, result, fields) => {

        if (err) {
            reject(err)
            return
        }

        resolve(result.length)
    })
})

const getPublishedArticlesCount = (_conn) => new Promise((resolve, reject) => {

    _conn.query(`SELECT id FROM articles WHERE published_at IS NOT NULL`, (err, result, fields) => {

        if (err) {
            reject(err)
            return
        }

        resolve(result.length)
    })
})

const createArticle = (_conn) => new Promise((resolve, reject) => {

    const title = "Untitled article"

    _titleToSlug(_conn, title).then(slug => {

        _conn.query(`INSERT INTO articles (title, slug, created_at, updated_at) VALUES ('${title}', '${slug}', NOW(), NOW())`, (err, result) => {

            if (err) {
                reject(err)
                console.log(err)
                return
            }

            resolve(result.insertId)
        })

    }).catch(err => {
        console.log(err)
        reject(err)
    })
})

const getArticlePreviews = (_conn, limit, offset) => new Promise((resolve, reject) => {

    if (!(Number.isInteger(limit) && limit >= 0)) {
        reject(_conn.ERROR_INVALID_LIMIT)
        return
    }

    if (!(Number.isInteger(offset) && offset >= 0)) {
        reject(_conn.ERROR_INVALID_OFFSET)
        return
    }

    _conn.query(`SELECT id, slug, title, preview, created_at, updated_at, published_at, cover_image_url FROM articles ORDER BY updated_at DESC LIMIT ${limit} OFFSET ${offset}`, (err, result, fields) => {

        if (err) {
            console.log(err)
            reject(err)
            return
        }

        resolve(result.map(row => Object.assign({}, row)))
    })
})

const getPublishedArticlePreviews = (_conn, limit, offset) => new Promise((resolve, reject) => {

    if (!(Number.isInteger(limit) && limit >= 0)) {
        reject(_conn.ERROR_INVALID_LIMIT)
        return
    }

    if (!(Number.isInteger(offset) && offset >= 0)) {
        reject(_conn.ERROR_INVALID_OFFSET)
        return
    }

    _conn.query(`SELECT id, slug, title, preview, created_at, updated_at, published_at, cover_image_url FROM articles WHERE published_at IS NOT NULL ORDER BY updated_at DESC LIMIT ${limit} OFFSET ${offset}`, (err, result, fields) => {

        if (err) {
            console.log(err)
            reject(err)
            return
        }

        resolve(result.map(row => Object.assign({}, row)))
    })
})

const updateArticle = (_conn, id, changes) => new Promise((resolve, reject) => {

    if (!(Number.isInteger(id) && id >= 0)) {
        reject(_conn.ERROR_INVALID_ID)
        return
    }

    let query = ""

    if (typeof changes.title === "string") {

        _titleToSlug(_conn, changes.title).then(slug => {

            query = `,title='${changes.title}',slug='${slug}'`

            let values = []

            if (typeof changes.content === "string") {

                const preview = _contentToPreview(changes.content)
                query += `,content=?,preview=?`
                values.push(changes.content)
                values.push(preview)
            }

            values.push(id)

            _conn.query(`UPDATE articles SET updated_at=NOW()${query} WHERE id=?`, values, (err, result) => {

                if (err) {
                    reject(err)
                    return
                }

                resolve()
            })

        }).catch(err => {
            reject(err)
        })

        return
    }

    let values = []

    if (typeof changes.content === "string") {
        const preview = _contentToPreview(changes.content)
        query += `,content=?,preview=?`

        values.push(changes.content)
        values.push(preview)
    }

    values.push(id)

    _conn.query(`UPDATE articles SET updated_at=NOW()${query} WHERE id=?`, values, (err, result) => {

        if (err) {
            reject(err)
            return
        }

        resolve()
    })
})

const deleteArticle = (_conn, id) => new Promise((resolve, reject) => {

    if (!(Number.isInteger(id) && id >= 0)) {
        reject(_conn.ERROR_INVALID_ID)
        return
    }

    _conn.query(`DELETE FROM articles WHERE id=${id}`, (err, result) => {

        if (err) {
            reject(err)
            return
        }

        resolve()
    })
})

const publishArticle = (_conn, id) => new Promise((resolve, reject) => {

    if (!(Number.isInteger(id) && id >= 0)) {
        reject(_conn.ERROR_INVALID_ID)
        return
    }

    _conn.query(`UPDATE articles SET updated_at=NOW(), published_at=NOW() WHERE id=${id}`, (err, result) => {

        if (err) {
            reject(err)
            return
        }

        resolve()
    })
})

const setArticleCoverURL = (_conn, id, coverURL) => new Promise((resolve, reject) => {

    if (!(Number.isInteger(id) && id >= 0)) {
        reject(_conn.ERROR_INVALID_ID)
        return
    }

    _conn.query(`UPDATE articles SET updated_at=NOW(), cover_image_url=? WHERE id=${id}`, [ coverURL ], (err, result) => {

        if (err) {
            console.log(err)
            reject(err)
            return
        }

        resolve()
    })
})

const unpublishArticle = (_conn, id) => new Promise((resolve, reject) => {

    if (!(Number.isInteger(id) && id >= 0)) {
        reject(_conn.ERROR_INVALID_ID)
        return
    }

    _conn.query(`UPDATE articles SET updated_at=NOW(), published_at=NULL WHERE id=${id}`, (err, result) => {

        if (err) {
            reject(err)
            return
        }

        resolve()
    })
})

const _contentToPreview = (content) => {

    let preview = getTextFromHTML(content)

    if (preview.length > 150) {

        preview = preview.substring(0, 150)

        const lastIndex = preview.lastIndexOf(" ")
        preview = `${preview.substring(0, lastIndex)}...`
    }

    return preview
}

const _titleToSlug = (_conn, title) => new Promise((resolve, reject) => {

    let slug = title.replace(/ /g, "-").toLowerCase()
    slug = slug.replace(/#/g, "")
    slug = slug.replace(/\//g, "")
    slug = slug.replace(/\?/g, "")
    slug = slug.replace(/&/g, "")
    slug = slug.replace(/--+/g, "-")
    slug = slug.replace(/"/g, "")

    _conn.query(`SELECT id FROM articles WHERE slug LIKE '${slug}%'`, async (err, result, fields) => {

        if (err) {
            reject(err)
            return
        }

        if (result.length === 0) {
            resolve(slug)
            return
        }

        let appendage = result.length + 1

        while (!await _validDateSlug(_conn,`${ slug }-${ appendage }`)) {
            appendage++
        }

        resolve(`${ slug }-${ appendage }`)
    })
})

const _validDateSlug = (_conn, slug) => new Promise((resolve, reject) => {

    _conn.query(`SELECT id FROM articles WHERE slug='${slug}'`, (err, result, fields) => {

        if (err) {
            reject(err)
            return
        }

        if (result.length > 0) {
            resolve(false)
        } else {
            resolve(true)
        }
    })
})

module.exports = conn => {

    return {
        getArticle: (id) => getArticle(conn, id),
        getArticleBySlug: (slug) => getArticleBySlug(conn, slug),
        getArticlesCount: () => getArticlesCount(conn),
        createArticle : () => createArticle(conn),
        getArticlePreview: (id) => getArticlePreview(conn, id),
        getArticlePreviews: (limit, offset) => getArticlePreviews(conn, limit, offset),
        getPublishedArticlesCount: () => getPublishedArticlesCount(conn),
        getPublishedArticlePreviews: (limit, offset) => getPublishedArticlePreviews(conn, limit, offset),
        setArticleCoverURL: (id, coverURL) => setArticleCoverURL(conn, id, coverURL),
        updateArticle: (id, changes) => updateArticle(conn, id, changes),
        deleteArticle: (id) => deleteArticle(conn, id),
        publishArticle: (id) => publishArticle(conn, id),
        unpublishArticle: (id) => unpublishArticle(conn, id),
        ERROR_ARTICLE_NOT_FOUND
    }
}