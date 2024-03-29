const insert = (data) => {
  return process.pool.query(
    'INSERT INTO "customer" (userid, companyname, email, phone, address, website, products, contacts, taxid, taxoffice, customer_type ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *',
    [
      data.userid,
      data.companyname,
      data.email,
      data.phone,
      data.address,
      data.website,
      data.products,
      data.contacts,
      data.taxid,
      data.taxoffice,
      data.customer_type,
    ]
  );
};

const insertContact = (data) => {
  return process.pool.query(
    `INSERT INTO "dailycontacts" (userid, customerid, companyname, person, contacttype, date, time, result)
       VALUES( $1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
    [
      data.userid,
      data.customerid,
      data.companyname,
      data.person,
      data.contacttype,
      data.date,
      data.time,
      data.result,
    ]
  );
};

const getAll = () => {
  return process.pool.query('SELECT * FROM "customer" ORDER BY customerid ASC');
};

const getDateRangeContacts = (data) => {
  console.log("data", data);
  return process.pool.query(
    'SELECT * FROM "dailycontacts" WHERE date BETWEEN $1 AND $2 ORDER BY date DESC',
    [data.startDate, data.endDate]
  );
};

const getOne = (customerid) => {
  return process.pool.query('SELECT * FROM "customer" WHERE customerid = $1', [
    customerid,
  ]);
};

const getCustomerName = (customerid, client) => {
  const query = `SELECT companyname FROM "customer" WHERE customerid = $1`;
  const values = [customerid];

  if (client) return client.query(query, values);
  return process.pool.query(query, values);
};

const update = (data) => {
  return process.pool.query(
    'UPDATE "customer" SET companyname = $1, email = $2, phone = $3, address = $4, website = $5, products = $6, contacts = $7, taxid = $8, taxoffice = $9, customer_type = $10 WHERE userid = $11 RETURNING *',
    [
      data.companyname,
      data.email,
      data.phone,
      data.address,
      data.website,
      data.products,
      data.contacts,
      data.taxid,
      data.taxoffice,
      data.customer_type,
      data.userid,
    ]
  );
};

const updateContact = (data) => {
  return process.pool.query(
    `UPDATE "dailycontacts" 
       SET customerid=$2, person = $3, contacttype = $4, date = $5, time = $6, result = $7, companyname=$8 WHERE id = $1 RETURNING *`,
    [
      data.id,
      data.customerid,
      data.person,
      data.contacttype,
      data.date,
      data.time,
      data.result,
      data.companyname,
    ]
  );
};

const del = (id) => {
  return process.pool.query('DELETE FROM "customer" WHERE customerid = $1', [
    id,
  ]);
};

const delContact = (id) => {
  return process.pool.query('DELETE FROM "dailycontacts" WHERE id = $1', [id]);
};

module.exports = {
  insert,
  getAll,
  getOne,
  update,
  del,
  insertContact,
  getDateRangeContacts,
  updateContact,
  delContact,
  getCustomerName,
};
