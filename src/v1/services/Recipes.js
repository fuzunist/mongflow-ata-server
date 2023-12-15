const insert = (data) => {
  return process.pool.query(
    "INSERT INTO recipes(order_id, details, cost, id) VALUES($1, $2, $3, $4) RETURNING *",
    [
      parseInt(data.order_id),
      data.details,
      parseFloat(data.cost),
      data.recipe_id.toString(),
    ]
  );
};

const update = (data) => {
  return process.pool.query(
    "UPDATE recipes SET details = $1, cost = $2 WHERE id = $3 RETURNING *",
    [data.details, parseFloat(data.cost), data.id]
  );
};

const getAll = () => {
  return process.pool.query("SELECT * FROM recipes");
};

const getOne = (client, product_id) => {};

const del = (client, product_id) => {};

const delAllOfOrder= (order_id)=>{
  return process.pool.query(
    "DELETE FROM recipes WHERE order_id = $1 ",
    [order_id]
  );
}

module.exports = {
  insert,
  getAll,
  getOne,
  update,
  del,
  delAllOfOrder
};
