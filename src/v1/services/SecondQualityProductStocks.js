
const getAll = () => {
    return process.pool.query(
      `SELECT 
      s.id, s.product_id, s.price, s.quantity, p.product_name, p."hasAttributes",
      CASE
          WHEN p."hasAttributes" = true THEN 
              COALESCE(
                  (
                      SELECT jsonb_object_agg(attr.attribute_name, val.value)
                      FROM LATERAL (
                          SELECT key::int AS attr_id, value::int AS val_id
                          FROM jsonb_each_text(s.attributes::jsonb)
                      ) AS attr_val
                      LEFT JOIN attribute AS attr ON attr.attribute_id = attr_val.attr_id
                      LEFT JOIN value AS val ON val.value_id = attr_val.val_id
                  ), '{}'::jsonb
              )
          ELSE 
          null
      END AS attributeDetails
  FROM 
  secondqualityproductstocks s
  LEFT JOIN product AS p ON p.product_id = s.product_id
  GROUP BY 
      s.id, s.product_id, s.price, s.quantity, p.product_name, p."hasAttributes"
  ORDER BY 
      s.id ASC;`
    );
  };
  
  const updateEach = async (id, data) => {
    const columns = Object.keys(data).join(", "); // Get column names dynamically
    const setValues = Object.keys(data)
      .map((key, index) => `${key} = $${index + 1}`)
      .join(", "); // Create SET values
  
    const query = `UPDATE secondqualityproductstocks SET ${setValues} WHERE id = $${
      Object.keys(data).length + 1
    } RETURNING *`;
    const values = [...Object.values(data), id];
  
    return process.pool.query(query, values);
  };
  
  const insertLog = (data, client) => {
    const query = `
          INSERT INTO secondqualityproductlogs (
              date, userid, product_id, attributes, price, 
              quantity, waybill, payment_type, payment_date, 
              customer_id, customer_city, customer_county, 
              currency_id, exchange_rate, vat_rate,
              vat_witholding_rate, vat_declaration,
              vat_witholding, price_with_vat, details,
              usd_rate
          ) 
          VALUES (
              $1, $2, $3, $4, $5,
              $6, $7, $8, $9, $10, 
              $11, $12, $13, $14, $15,
              $16, $17, $18, $19, $20,
              $21
          ) 
          RETURNING *`;
  
    const values = [
      data.date,
      data.userid,
      data.product_id,
      data.attributes,
      data.price,
      data.quantity,
      data.waybill,
      data.payment_type,
      data.payment_date,
      data.customer_id,
      data.customer_city,
      data.customer_county,
      data.currency_id,
      data.exchange_rate,
      data.vat_rate,
      data.vat_witholding_rate,
      data.vat_declaration,
      data.vat_witholding,
      data.price_with_vat,
      data.details,
      data.usd_rate
    ];
  
    if (client) return client.query(query, values);
    return process.pool.query(query, values);
  };
  
  
  const getAllLogs = () => {
    return process.pool.query("SELECT * FROM secondqualityproductlogs ORDER BY date ASC");
  };
  
  

  const getRangeLogs = (data) => {
    return process.pool.query(
        `SELECT secondqualityproductlogs.*, customer.companyname, product.product_name, currency.currency_code, "User".username, attr_details.attributeDetails
         FROM secondqualityproductlogs
         INNER JOIN customer ON secondqualityproductlogs.customer_id = customer.customerid
         INNER JOIN product ON secondqualityproductlogs.product_id = product.product_id
         INNER JOIN currency ON secondqualityproductlogs.currency_id = currency.currency_id
         INNER JOIN "User" ON secondqualityproductlogs.userid = "User".userid
         LEFT JOIN (
             SELECT secondqualityproductlogs.product_id, 
                    jsonb_object_agg(attr.attribute_name, val.value) as attributeDetails
             FROM secondqualityproductlogs
             CROSS JOIN LATERAL (
                SELECT key::int AS attr_id, value::int AS val_id
                FROM jsonb_each_text(secondqualityproductlogs.attributes::jsonb)
             ) AS attr_val
             LEFT JOIN attribute AS attr ON attr.attribute_id = attr_val.attr_id
             LEFT JOIN value AS val ON val.value_id = attr_val.val_id
             WHERE secondqualityproductlogs.date BETWEEN $1 AND $2
             GROUP BY secondqualityproductlogs.product_id
         ) AS attr_details ON secondqualityproductlogs.product_id = attr_details.product_id
         WHERE secondqualityproductlogs.date BETWEEN $1 AND $2
         ORDER BY secondqualityproductlogs.date ASC`,
        [data.startDate, data.endDate]
    );
  }
  

  const updateEachLog = async (id, data) => {
    const columns = Object.keys(data).join(", "); // Get column names dynamically
    const setValues = Object.keys(data)
      .map((key, index) => `${key} = $${index + 1}`)
      .join(", "); // Create SET values
  
    const query = `UPDATE secondqualityproductlogs SET ${setValues} WHERE id = $${
      Object.keys(data).length + 1
    } RETURNING *`;
    const values = [...Object.values(data), id];
  
    return process.pool.query(query, values);
  };
  
  const getStock = (data, client) => {
    const query =
      "SELECT id FROM secondqualityproductstocks WHERE product_id = $1 ";
    const values = [data.product_id];
  
    if (client) return client.query(query, values);
    return process.pool.query(query, values);
  };
  
  const insertStock = (data, client) => {
    const query =
      "INSERT INTO secondqualityproductstocks (product_id, price, quantity ) VALUES( $1, $2, $3) RETURNING *";
    const values = [data.product_id, data.price, data.quantity];
  
    if (client) return client.query(query, values);
    return process.pool.query(query, values);
  };
  
  const updateStock = (data, client) => {
    const query = `
    UPDATE secondqualityproductstocks 
    SET 
        price = ROUND(((price * quantity + $3::numeric * $2::numeric) / (quantity + $3::numeric))::numeric, 4),
        quantity = quantity + $3
    WHERE 
        product_id = $1
    RETURNING *`;
  
    const values = [data.product_id, data.price, data.quantity];
  
    if (client) return client.query(query, values);
    return process.pool.query(query, values);
  };
  
  module.exports = {
    getAll,
    updateEach,
    insertLog,
    updateEachLog,
    getAllLogs,
    getRangeLogs,
    updateStock,
    insertStock,
    getStock,

  };
  