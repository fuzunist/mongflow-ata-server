const insertForOrder = (data, client) => {
  console.log("insertfororder data", data);

  const query =
    'INSERT INTO "shiftfororder" (uuid, date, shift_number, production_recipe_id, quantity, wastage_percentage, second_quality_stocks, consumable_products, consumable_cost ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *';
  const values = [
    data.id,
    data.date,
    parseInt(data.shift),
    data.production_recipe_id,
    parseInt(data.quantity),
    parseFloat(data.wastage),
    JSON.stringify(data.secondQualityStocks),
    JSON.stringify(data.consumableProducts),
    parseFloat(data.consumableProductsCosts),
  ];

  if (client) return client.query(query, values);
  return process.pool.query(query, values);
};

const getDateRangeOrderShiftss = (data) => {
  console.log("data", data);
  return process.pool.query(
    'SELECT * FROM "shiftfororder" WHERE shift_number=$3 AND date BETWEEN $1 AND $2 ORDER BY date DESC',
    [data.startDate, data.endDate, data.shift]
  );
};

const getDayShiftsOrder = (data) => {
  console.log("data", data);
  // return process.pool.query(`SELECT * FROM "shiftfororder";`);
  return process.pool.query(
    `SELECT 
        sf.*, 
        json_agg(pr.*) AS production_recipes
     FROM 
        "shiftfororder" sf 
     JOIN 
        "productionrecipes" pr ON sf.production_recipe_id = pr.id 
     WHERE 
        DATE(sf.date) = $1
     GROUP BY 
        sf.id`,
    [data.date] 
  );
  
};
const getDayShiftsProcess = (data) => {
  console.log("data", data);
  return process.pool.query(
    `SELECT 
        sfp.*, 
        p.product_name AS output_product_name
     FROM 
        "shiftforprocess" sfp
     JOIN 
        "product" p ON p.product_id = sfp.output_product_id
     WHERE 
        DATE(sfp.date) = $1
     GROUP BY 
        sfp.id, p.product_name `,
    [data.date] 
  );
};


const insert = (data) => {
  return process.pool.query(
    'INSERT INTO "shiftfororder" (id, date, shift_number, production_recipe_id, quantity, wastage_percentage, second_quality_stocks, consumable_products ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
    [
      data.id,
      data.date,
      data.shift_number,
      data.production_recipe_id,
      data.quantity,
      data.wastage_percentage,
      data.second_quality_stocks,
      data.consumable_products,
    ]
  );
};

const getAll = () => {
  return process.pool.query('SELECT * FROM "shiftfororder" ORDER BY date ASC');
};

const getOne = (shiftid) => {
  return process.pool.query('SELECT * FROM "shiftfororder" WHERE id = $1', [
    shiftid,
  ]);
};
const getOrderShift = (data) => {
  return process.pool.query('SELECT id FROM "shiftfororder" WHERE date = $1 AND shift_number=$2', [
    data.date,
    data.shift
  ]);
};
const getProcessShift = (data) => {
  return process.pool.query(
    'SELECT id FROM "shiftforprocess" WHERE date = $1 AND shift_number=$2',
    [data.date, data.shift]
  );
};

const update = (data) => {
  return process.pool.query(
    'UPDATE "shiftfororder" SET date = $1, shift_number = $2, production_recipe_id = $3, quantity = $4, wastage_percentage = $5, second_quality_stocks = $6, consumable_products = $7 WHERE id = $8 RETURNING *',
    [
      data.date,
      data.shift_number,
      data.production_recipe_id,
      data.quantity,
      data.wastage_percentage,
      data.second_quality_stocks,
      data.consumable_products,
      data.id,
    ]
  );
};

const del = (id) => {
  return process.pool.query('DELETE FROM "shiftfororder" WHERE id = $1', [id]);
};

const insertForProcess = (data) => {
  return process.pool.query(
    'INSERT INTO "shiftforprocess" (uuid, date, shift_number, used_products, output_product_id, output_quantity, wastage_percentage, consumable_products, consumable_cost, used_product_cost ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
    [
      data.id,
      data.date,
      parseInt(data.shift),
      JSON.stringify(data.usedProducts),
      parseInt(data.output_product),
      parseInt(data.output_quantity),
      parseFloat(data.wastage),
      JSON.stringify(data.consumableProducts),
      parseFloat(data.consumableProductsCosts),
      parseFloat(data.usedProductsCosts),
    ]
  );
};

const getAllForProcess = () => {
  return process.pool.query(
    'SELECT * FROM "shiftforprocess" ORDER BY date ASC'
  );
};

const getOneForProcess = (shiftid) => {
  return process.pool.query('SELECT * FROM "shiftforprocess" WHERE id = $1', [
    shiftid,
  ]);
};

const updateForProcess = (data) => {
  return process.pool.query(
    'UPDATE "shiftforprocess" SET date = $1, shift_number = $2, used_products = $3, output_product_id = $4, output_quantity = $5, wastage_percentage = $6, consumable_products = $7 WHERE id = $8 RETURNING *',
    [
      data.date,
      data.shift_number,
      data.used_products,
      data.output_product_id,
      data.output_quantity,
      data.wastage_percentage,
      data.consumable_products,
      data.id,
    ]
  );
};

const delForProcess = (id) => {
  return process.pool.query('DELETE FROM "shiftforprocess" WHERE id = $1', [
    id,
  ]);
};

module.exports = {
  insert,
  insertForOrder,
  getAll,
  getOne,
  update,
  del,
  insertForProcess,
  getAllForProcess,
  getOneForProcess,
  updateForProcess,
  delForProcess,
  getOrderShift,
  getProcessShift,
  getDayShiftsOrder,
  getDayShiftsProcess
};
