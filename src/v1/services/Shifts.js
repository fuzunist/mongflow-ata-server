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
  return process.pool.query('DELETE FROM "shiftfororder" WHERE id = $1', [
    id,
  ]);
};


const insertForProcess = (data) => {
  return process.pool.query(
    'INSERT INTO "shiftforprocess" (id, date, shift_number, used_products, output_product_id, output_quantity, wastage_percentage, consumable_products ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
    [
      data.id,
      data.date,
      data.shift_number,
      data.used_products,
      data.output_product_id,
      data.output_quantity,
      data.wastage_percentage,
      data.consumable_products,
    ]
  );
};



const getAllForProcess = () => {
  return process.pool.query('SELECT * FROM "shiftforprocess" ORDER BY date ASC');
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
  getAll,
  getOne,
  update,
  del,
  insertForProcess,
  getAllForProcess,
  getOneForProcess,
  updateForProcess,
  delForProcess,
};
