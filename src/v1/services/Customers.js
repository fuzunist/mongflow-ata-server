const insert = (data) => {
    return process.pool.query(
        'INSERT INTO "customer" (userid, customername, companyname, email, phone, address) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [data.userid, data.customername, data.companyname, data.email, data.phone, data.address]
    )
}

const getAll = () => {
    return process.pool.query('SELECT * FROM "customer" ORDER BY customerid ASC')
}

const getOne = (customerid) => {
    return process.pool.query('SELECT * FROM "customer" WHERE customerid = $1', [customerid])
}

const update = (data) => {
    return process.pool.query(
        'UPDATE "customer" SET customername = $1, companyname = $2, email = $3, phone = $4, address = $5 WHERE customerid = $6 RETURNING *',
        [data.customername, data.companyname, data.email, data.phone, data.address, data.customerid]
    )
}

const del = (id) => {
    return process.pool.query('DELETE FROM "customer" WHERE customerid = $1', [id])
}

module.exports = {
    insert,
    getAll,
    getOne,
    update,
    del
}
