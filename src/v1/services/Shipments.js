const findOne = (id) => {
    return process.pool.query('SELECT * FROM shipments WHERE id = $1', [id])
}

const getAll = () => {
    return process.pool.query('SELECT * FROM shipments ORDER BY id ASC')
}

const insert = (data) => {
    return process.pool.query(
        `INSERT INTO shipments 
        (waybill_date, waybill_number, products, pickup_location, delivery_location, delivery_date, 
        net_price, vat_rate, vat_withholding_rate, price_with_vat, description) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
        RETURNING *`, [
        data.waybill_date,
        data.waybill_number,
        data.products,
        data.pickup_location,
        data.delivery_location,
        data.delivery_date,
        data.net_price,
        data.vat_rate,
        data.vat_withholding_rate,
        data.price_with_vat,
        data.description
    ]);
}



const update = (data) => {
    return process.pool.query(
        `UPDATE shipments 
        SET 
            waybill_date = $2, 
            waybill_number = $3, 
            products = $4, 
            pickup_location = $5, 
            delivery_location = $6, 
            delivery_date = $7, 
            net_price = $8, 
            vat_rate = $9, 
            vat_withholding_rate = $10, 
            price_with_vat = $11, 
            description = $12
        WHERE 
            id = $1 
        RETURNING *`, [
        data.id,
        data.waybill_date,
        data.waybill_number,
        data.products,
        data.pickup_location,
        data.delivery_location,
        data.delivery_date,
        data.net_price,
        data.vat_rate,
        data.vat_withholding_rate,
        data.price_with_vat,
        data.description
    ]);
}


const del = (id) => {
    return process.pool.query('DELETE FROM shipments WHERE id = $1', [id])
}


module.exports = {
    getAll,
    insert,
    update,
    del,
    findOne

}
