const httpStatus = require("http-status/lib");

const {
  _getExpenses,
  _getClasses,
  _getItems,
  _createItem,
  _createExpense,
  _updateExpense,
} = require("../services/Expenses");
const getExpenses = async (req, res) => {
  const date = req.query.date;
  _getExpenses(date)
    .then(({ rows }) => {
      if (rows.length === 0) {
        return res
          .status(httpStatus.NO_CONTENT)
          .send({ error: "No Expenses Found" });
      }
      return res.status(httpStatus.OK).send(rows);
    })
    .catch((e) => {
      console.log(e);
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({ error: "An error occurred." });
    });
};

const getClasses = async (req, res) => {
  _getClasses()
    .then(({ rows }) => res.status(httpStatus.OK).send(rows))
    .catch((e) => {
      console.log(e);
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({ error: "An error occurred." });
    });
};

const getItems = async (req, res) => {
  _getItems()
    .then(({ rows }) => res.status(httpStatus.OK).send(rows))
    .catch((e) => {
      console.log(e);
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({ error: "An error occurred." });
    });
};

const createItem = async (req, res) => {
  _createItem({ ...req.body })
    .then(({ rows }) => res.status(httpStatus.OK).send(rows[0]))
    .catch((e) => {
      console.log(e);
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({ error: "An error occurred." });
    });
};

const createExpense = async (req, res) => {
  _createExpense({ ...req.body })
    .then(({ rows }) => res.status(httpStatus.OK).send(rows[0]))
    .catch((e) => {
      console.log(e);
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({ error: "An error occurred." });
    });
};

const updateExpense = async (req, res) => {
  _updateExpense(req.body)
    .then(({ rows }) => {
      console.log("rows", rows);
      return res.status(httpStatus.OK).send(rows[0]);
    })
    .catch((e) => {
      console.log(e);
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({ error: "An error occurred." });
    });
};

module.exports = {
  getClasses,
  getExpenses,
  getItems,
  createItem,
  createExpense,
  updateExpense,
};
