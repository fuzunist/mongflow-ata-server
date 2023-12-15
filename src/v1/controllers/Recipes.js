const httpStatus = require("http-status/lib");
const { insert, getAll, del, update, getOne } = require("../services/Recipes");

const create = async (req, res) => {
  const { order_id, details, cost, recipe_id } = req.body;
  console.log(order_id, details, cost,recipe_id);
  try {
    insert({ order_id, details, cost, recipe_id })
      .then(({ rows }) => res.status(httpStatus.CREATED).send(rows[0]))
      .catch((e) => {
        console.log(e);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: e });
      });
  } catch (e) {
    console.log(e);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send({ error: "An error occurred." });
  }
};

const get = (req, res) => {
  getAll()
    .then(({ rows }) => res.status(httpStatus.OK).send(rows))
    .catch((e) =>
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: e })
    );
};

const put = async (req, res) => {
  const id=req.params?.id;
  const { details, cost} = req.body;
  try {
    update({  details, cost, id })
      .then(({ rows }) => res.status(httpStatus.OK).send(rows[0]))
      .catch((e) => {
        console.log(e);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: e });
      });
  } catch (e) {
    console.log(e);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send({ error: "An error occurred." });
  }
};

const remove = async (req, res) => {};

module.exports = {
  create,
  get,
  put,
  remove,
};
