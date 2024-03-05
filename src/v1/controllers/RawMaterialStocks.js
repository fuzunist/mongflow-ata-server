const { getCustomerName } = require("../services/Customers");
const { insertCurrency, getName, currency, getCurrency } = require("../services/Products");
const {
  getAll,
  updateEach,
  insert,
  getAllLogs,
  updateEachLog,
  insertLog,
  getStock,
  updateStock,
  insertStock,
  getRangeLogs,
  // getAllAttributeDetails
  delLog,
  delStock,
  getLog,
  undoStockUpdate
} = require("../services/RawMaterialStocks");
const httpStatus = require("http-status/lib");
const { findOne } = require("../services/Users");
const { getAttributeDetails } = require("../services/LastProductStocks");

const create = async (req, res) => {
  const { material, cost, preprocesscost, stock } = req.body;

  try {
    insert({ material, cost, preprocesscost, stock })
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
 try{
  getAll()
  .then(({ rows }) => res.status(httpStatus.OK).send(rows))
  .catch((e) => {
    console.log("rawmat:  ",e);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: e });
  });
  // res.status(httpStatus.OK).send([])
 }catch(err){
 console.log("rawmaterialstocks: ",err)
 }
};

const put = async (req, res) => {
  try {
    if (!req.body) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .send({ error: "Body is empty." });
    }
    const id = req.params.id;
    console.log(id);
    updateEach(parseInt(id), req.body)
      .then(({ rows }) => {
        return res.status(httpStatus.ACCEPTED).send(rows[0]);
      })
      .catch((e) => {
        console.log(e);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: e });
      });
  } catch (err) {
    console.log(err);
  }
};

const createLog = async (req, res) => {
  const client = await process.pool.connect();
  const data = req.body;

  await client.query("BEGIN");
  const { rows: currencyRows, rowCount: currencyRowCount } = await currency(
    client,
    data.currency
  );
  let currency_id;

  if (!currencyRowCount) {
    const { rows: insertCurrencyRows } = await insertCurrency(
      client,
      data.currency
    );
    currency_id = insertCurrencyRows[0].currency_id;
  } else currency_id = currencyRows[0].currency_id;

  data["currency_id"] = currency_id;

  insertLog(data, client)
    .then(async ({ rows: stockLogs }) => {
      const { rows: stock, rowCount: stockRowCount } = await getStock(
        { product_id: data.product_id, attributes: data.attributes },
        client
      );
      const { rows: productRows } = await getName(data.product_id);
      const product_name = productRows[0].product_name;


      let stockResult;
      if (stockRowCount) {
        // burada update stock
        const { rows: stocks } = await updateStock(data, client);
        const attributeDetails = await getAttributeDetails(
          stocks[0].attributes,
          client
        );
        stockResult = { ...stocks[0], attributedetails: attributeDetails,  product_name: product_name, };
        console.log("stok res1", stockResult)

      } else {
        // burada insert stock
        const { rows: stocks } = await insertStock(data, client);
        const attributeDetails = await getAttributeDetails(
          stocks[0].attributes,
          client
        );
        stockResult = { ...stocks[0], attributedetails: attributeDetails,  product_name: product_name, };
   
         console.log("stok res2", stockResult)
      }
      global.socketio.emit("notification", {
        type: "stock",
        stock: {
          ...stockLogs[0],
          product_name: productRows[0].product_name,
          constituent_username: req.user.username,
          last_edited_by_username: req.user.username,
        },
        userid: req.user.userid,
      });

      const { rows: user } = await findOne(req.user.userid);
      const username = user[0].username;
      const customerResult = await getCustomerName(data.customer_id, client);
      const companyname = customerResult.rows[0].companyname;

      const { rows: currency } = await getCurrency(stockLogs[0].currency_id, client);
      const currency_code = currency[0].currency_code;
       console.log("stocklogs",stockLogs[0] )
      const attributedetails = await getAttributeDetails(stockLogs[0].attributes, client);
   
      res.status(httpStatus.CREATED).send({
        logs: {
          ...stockLogs[0],
          companyname,
          attributedetails,
          product_name,
          username,
          currency_code,
        },
        stocks: stockResult,
      });
      await client.query("COMMIT");
    })
    .catch(async (e) => {
      await client.query("ROLLBACK");

      if (e.constraint === "unique_stock_date")
        return res.status(httpStatus.BAD_REQUEST).send({
          error:
            "A registration has already been created for the selected product today.",
        });

      console.log(e);
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({ error: "An error occurred." });
    });
};

const getLogs = (req, res) => {
  getAllLogs()
    .then(({ rows }) => {
      return res.status(httpStatus.OK).send(rows);
    })
    .catch((e) => {
      console.log(e);
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: e });
    });
};

const getLogsByDate = (req, res) => {
  getRangeLogs({ ...req.query })
    .then(({ rows }) => res.status(httpStatus.OK).send(rows))
    .catch((err) =>
     {
 console.log(err)
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({ error: "An error occurred." })}
    );
};

const putLog = async (req, res) => {
  try {
    console.log(req.body);
    if (!req.body) {
      console.log("no body length fo putLog");
      const result = await process.pool.query("SELECT * FROM rawmateriallogs");
      return res.status(httpStatus.OK).send(result.rows);
    }

    const id = req.params.id;
    console.log(id);
    updateEachLog(parseInt(id), req.body)
      .then(({ rows }) => {
        console.log("contr 45line", rows[0]);
        return res.status(httpStatus.ACCEPTED).send(rows[0]);
      })
      .catch((e) => {
        console.log(e);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: e });
      });
  } catch (err) {
    console.log(err);
  }
};

const remove = async (req, res) => {
  const client = await process.pool.connect();
  try {
    await client.query("BEGIN");

    const { rows: log } = await getLog(req.params.id, client);

    if (!log || !log.length) {
      // Handle if no log is found
      return res.status(httpStatus.NOT_FOUND).send({ error: "Log not found" });
    }

    const logData = log[0];

    const delLogResult = await delLog(req.params.id, client);
    if (delLogResult.rowCount === 0) {
      await client.query("ROLLBACK");
      return res
        .status(httpStatus.NOT_MODIFIED)
        .send({ error: "No rows were deleted" });
    }

    const stockUpdateResult = await undoStockUpdate(logData, client);
    if (stockUpdateResult.rowCount === 0) {
      await client.query("ROLLBACK");
      return res
        .status(httpStatus.NOT_MODIFIED)
        .send({ error: "raw Stock update was not successful" });
    } else {
      if (stockUpdateResult.rows[0].quantity === 0) {
        const { rowCount } = await delStock(
          stockUpdateResult.rows[0].id,
          client
        );
        if (!rowCount) {
          await client.query("ROLLBACK");
          return res
            .status(httpStatus.NOT_MODIFIED)
            .send({ error: "raw stock delete was not successful" });
        }
      }
    }

    await client.query("COMMIT");
    return res
      .status(httpStatus.NO_CONTENT)
      .send({ status: httpStatus.OK, message: "Silme işlemi Başarılı!" });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: err.message });
  } finally {
    client.release(); // Release the client back to the pool
  }
};

module.exports = {
  get,
  put,
  create,
  getLogs,
  getLogsByDate,
  putLog,
  createLog,
  remove
};
