const httpStatus = require("http-status/lib");
const { insert, del, update, getAll } = require("../services/Users");

const create = async (req, res) => {
  insert(req.body)
    .then(({ rows }) => res.status(httpStatus.CREATED).send(rows[0]))
    .catch((e) => {
      console.log(e);
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: e });
    });
};

const put = (req, res) => {
  update({ ...req.body })
    .then(({ rows }) => res.status(httpStatus.CREATED).send(rows[0]))
    .catch((e) =>
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: e })
    );
};

const remove = (req, res) => {
  del(req.params.id)
    .then(({ rowCount }) => {
      if (!rowCount)
        return res
          .status(httpStatus.NOT_FOUND)
          .send({ message: "There is no such record." });
      res.status(httpStatus.OK).send({ message: "User deleted successfully." });
    })
    .catch(() =>
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({ error: "An error occurred." })
    );
};

const get = (req, res) => {
  getAll()
    .then(({ rows }) => res.status(httpStatus.OK).send(rows))
    .catch((e) =>
     {
         console.log(e)
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: e })}
    );
};

module.exports = {
  get,
  create,
  put,
  remove,
};
