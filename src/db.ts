import mariadb from 'mariadb'

function createDBPool(host: string, user: string, password: string, database: string) {
    return mariadb.createPool({
        host: host,
        user: user,
        password: password,
        database: database
    })
}

export default createDBPool