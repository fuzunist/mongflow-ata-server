const { getAll, updateEach } = require("../services/RecipeMaterials");
const httpStatus = require("http-status/lib");

const get = (req, res) => {
  getAll()
    .then(({ rows }) => res.status(httpStatus.OK).send(rows))
    .catch((e) => {
      console.log(e);
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: e });
    });
};

const put = async (req, res) => {
  console.log("hellooo14");
  console.log("body: ", req.body);
  try {
    if (!req.body.length) {
      const result = await process.pool.query(
        "SELECT id, cost FROM recipematerials"
      );
      return res.status(httpStatus.OK).send(result.rows);
    }
    updateEach(req.body).then(async (response) => {
      if (response?.rowCount >= 1) {
        console.log("rowcount", response.rowCount >= 1);
        const result = await process.pool.query(
          "SELECT id, cost FROM recipematerials"
        );
        return res.status(httpStatus.OK).send(result.rows);
      } else {
        return res
          .status(httpStatus.BAD_REQUEST)
          .send({ error: "Recipe Materials cannot be updated" });
      }
    });
  } catch (err) {
    console.log(err);
  }
};
module.exports = { get, put };
