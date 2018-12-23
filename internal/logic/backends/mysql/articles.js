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

const getArticlesCount = (_conn) => new Promise((resolve, reject) => {

    _conn.query(`SELECT * FROM articles`, (err, result, fields) => {

        if (err) {
            reject(err)
            return
        }

        resolve(result.length)
    })
})

const createArticle = (_conn) => new Promise((resolve, reject) => {

    _conn.query(`INSERT INTO articles (title, created_at) VALUES ('Untitled article', NOW())`, (err, result) => {

        if (err) {
            reject(err)
            return
        }

        resolve(result.insertId)
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

    _conn.query(`SELECT id, title, preview, created_at, updated_at, published_at FROM articles ORDER BY updated_at DESC LIMIT ${limit} OFFSET ${offset}`, (err, result, fields) => {

        if (err) {
            console.log(err)
            reject(err)
            return
        }

        resolve(result.map(row => Object.assign({}, row)))
    })
})

const updateArticleContent = (_conn, changes) => new Promise((resolve, reject) => {

    if (!(Number.isInteger(changes.id) && changes.id >= 0)) {
        reject(_conn.ERROR_INVALID_ID)
        return
    }

    let query = ""

    if (typeof changes.title === "string") {
        query = `,title='${data.title}'`
    }

    if (typeof changes.content === "string") {
        query += `,content='${changes.content}',preview='${changes.content}'`
    }

    _conn.query(`UPDATE articles SET updated_at=NOW()${query} WHERE id=${changes.id}`, (err, result) => {

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

module.exports = conn => {

    return {
        getArticle: (id) => getArticle(conn, id),
        getArticlesCount: () => getArticlesCount(conn),
        createArticle : () => createArticle(conn),
        getArticlePreview: (id) => getArticlePreview(conn, id),
        getArticlePreviews: (limit, offset) => getArticlePreviews(conn, limit, offset),
        updateArticleContent: (changes) => updateArticleContent(conn, changes),
        deleteArticle: (id) => deleteArticle(conn, id),
        publishArticle: (id) => publishArticle(conn, id),
        unpublishArticle: (id) => unpublishArticle(conn, id)
    }
}