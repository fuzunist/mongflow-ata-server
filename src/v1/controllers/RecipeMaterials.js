const { getAll } = require("../services/RecipeMaterials");
const httpStatus = require("http-status/lib");


const get = (req, res) => {
  getAll()
    .then(({ rows }) => res.status(httpStatus.OK).send(rows))
    .catch((e) => {
      console.log(e);
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: e });
    });
};
module.exports = { get };
