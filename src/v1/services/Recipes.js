const insert = (data) => {
  console.log(data);
  return process.pool.query(
    `INSERT INTO recipes(order_id, details, cost, id, total_bunker, wastage_percentage, unit_bunker_cost, total_bunker_cost, product_id, attributes) 
     VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
     RETURNING *`,
    [
      data.order_id,
      data.details,
      data.cost,
      data.recipe_id.toString(),
      data.total_bunker,
      data.wastage_percentage,
      data.unit_bunker_cost,
      data.total_bunker_cost,
      data.product_id,
      data.attributes
    ]
  );
};
const insertProductionRecipe = (data) => {
  console.log(data);
  return process.pool.query(
    `INSERT INTO productionrecipes(id,order_id, details, cost, total_bunker, total_kg, wastage_percentage, unit_bunker_cost, total_bunker_cost, date, product_id, attributes) 
     VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) 
     RETURNING *`,
    [
      data.id,
      parseInt(data.order_id),
      data.details,
      parseFloat(data.cost),
      parseInt(data.total_bunker),
      parseFloat(data.total_kg),
      parseInt(data.wastage_percentage),
      data.unit_bunker_cost,
      data.total_bunker_cost,
      data.date,
      data.product_id,
      data.attributes
    ]
  );
};
const update = ({
  details,
  cost,
  total_bunker,
  wastage_percentage,
  unit_bunker_cost,
  total_bunker_cost,
  id,
}) => {
  return process.pool.query(
    `UPDATE recipes 
     SET details = $1, 
         cost = $2, 
         total_bunker = $3, 
         wastage_percentage = $4, 
         unit_bunker_cost = $5,
         total_bunker_cost = $6 
     WHERE id = $7 
     RETURNING *`,
    [
      details,
      cost,
      total_bunker,
      wastage_percentage,
      unit_bunker_cost,
      total_bunker_cost,
      id,
    ]
  );
};

const getAll = () => {
  return process.pool.query("SELECT * FROM recipes");
};

const getAllProductionRecipes = () => {
  return process.pool.query("SELECT * FROM productionrecipes");
};

const getOne = (client, product_id) => {};

const del = (client, product_id) => {};

const delAllOfOrder = (order_id) => {
  return process.pool.query("DELETE FROM recipes WHERE order_id = $1 ", [
    order_id,
  ]);
};

const insertSpecialRecipe = (data) => {
  return process.pool.query(
    `INSERT INTO specialrecipes( details, name) 
     VALUES($1, $2) 
     RETURNING *`,
    [data.details, data.name]
  );
};

const getAllSpecialRecipes = () => {
  return process.pool.query("SELECT * FROM specialrecipes");
};

const delSpecialRecipe = (id) => {
  return process.pool.query("DELETE FROM specialrecipes WHERE id = $1 ", [id]);
};

module.exports = {
  insert,
  insertProductionRecipe,
  getAll,
  getOne,
  update,
  del,
  delAllOfOrder,
  insertSpecialRecipe,
  getAllSpecialRecipes,
  delSpecialRecipe,
  getAllProductionRecipes,
};
