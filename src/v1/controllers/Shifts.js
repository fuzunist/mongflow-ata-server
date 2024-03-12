const httpStatus = require("http-status/lib");
const {
  insert,
  getAll,
  update,
  del,
  insertForProcess,
  getAllForProcess,
  updateForProcess,
  delForProcess,
  insertForOrder,
  getOrderShift,
  getProcessShift,
  getDayShiftsOrder,
  getDayShiftsProcess,
} = require("../services/Shifts");

const {
  getStock,
  updateStock,
  insertStock,
} = require("../services/SecondQualityProductStocks");
const {
  getStock: getStockRecipe,
  updateStock: updateStockRecipe,
  insertStock: insertStockRecipe,
} = require("../services/RecipeMaterialStocks");

const { reduceStock } = require("../services/RawMaterialStocks");
const {
  reduceStock: reduceStockConsumable,
} = require("../services/ConsumableStocks");
const { getName } = require("../services/Products");
const {
  getStock: getStockProduct,
  insertStock: insertStockProduct,
  updateStock: updateStockProduct,
} = require("../services/LastProductStocks");

const createShift = async (req, res) => {
  console.log("params of addShiftToDB ", req.body);

  const client = await process.pool.connect();

  try {
    await client.query("BEGIN");

    const { id, shift, date, orderproductions, materialproductions } = req.body;

    const { rowCount: orderShiftRows } = await getOrderShift({ date, shift });
    const { rowCount: processShiftRows } = await getProcessShift({
      date,
      shift,
    });

    if (orderShiftRows !== 0 || processShiftRows !== 0) {
      return res
        .status(httpStatus.FORBIDDEN)
        .send({ error: "Her vardiya 1 defa eklenebilir." });
    }
    console.log("orderShiftRows", orderShiftRows);
    console.log("processShiftRows", processShiftRows);

    if (orderproductions?.length !== 0) {
      for (let production of orderproductions) {
        await client.query("BEGIN");

        await insertForOrder({ ...production, id, shift, date }, client);

        const { rows: productRows } = await getName(production.product_id);
        const product_name = productRows[0].product_name;

        const { rows: stock, rowCount: stockRowCount } = await getStockProduct(
          {
            product_id: production.product_id,
            attributes: JSON.stringify(production.attributes),
          },
          client
        );

        const stockData = {
          product_id: production.product_id,
          quantity: parseInt(production.quantity),
          price: 0,
          attributes: production.attributes,
        };
        let stockResult;
        if (stockRowCount) {
          const { rows: stocks } = await updateStockProduct(stockData, client);
          stockResult = {
            ...stocks[0],
            product_name: product_name,
          };
        } else {
          const { rows: stocks } = await insertStockProduct(stockData, client);
          stockResult = {
            ...stocks[0],
            product_name: product_name,
          };
        }

        if (production?.secondQualityStocks?.length !== 0) {
          for (let secondqualitystock of production.secondQualityStocks) {
            await client.query("BEGIN");

            const { rows: productRows } = await getName(
              secondqualitystock.product_id
            );
            const product_name = productRows[0].product_name;

            const { rows: stock, rowCount: stockRowCount } = await getStock(
              { product_id: secondqualitystock.product_id },
              client
            );

            const stockData = {
              product_id: secondqualitystock.product_id,
              quantity: secondqualitystock.production,
              price: 0,
            };
            let stockResult;
            if (stockRowCount) {
              const { rows: stocks } = await updateStock(stockData, client);
              stockResult = {
                ...stocks[0],
                product_name: product_name,
              };
            } else {
              const { rows: stocks } = await insertStock(stockData, client);
              stockResult = {
                ...stocks[0],
                product_name: product_name,
              };
            }
          }
        }
      }
    }

    if (materialproductions?.length !== 0) {
      for (let production of materialproductions) {
        await client.query("BEGIN");

        await insertForProcess({ ...production, id, shift, date }, client);
        await reduceStock({
          product_id: parseInt(production.used_product),
          quantity: parseInt(production.usage_quantity),
        });
        const product_id = parseInt(production.output_product);

        const { rows: productRows } = await getName(product_id, client);
        const product_name = productRows[0].product_name;

        const { rows: stock, rowCount: stockRowCount } = await getStockRecipe(
          { product_id },
          client
        );

        calculateStockUnitCost =
          (production.consumableProductsCosts + production.usedProductsCosts) /
          parseInt(production.output_quantity);
        const stockData = {
          product_id: product_id,
          quantity: parseInt(production.output_quantity),
          price: calculateStockUnitCost,
        };
        let stockResult;
        if (stockRowCount) {
          const { rows: stocks } = await updateStockRecipe(stockData, client);
          stockResult = {
            ...stocks[0],
            product_name: product_name,
          };
        } else {
          const { rows: stocks } = await insertStockRecipe(stockData, client);
          stockResult = {
            ...stocks[0],
            product_name: product_name,
          };
        }
      }
    }

    await client.query("COMMIT");
    res.status(httpStatus.CREATED).send("successfully created shift");
  } catch (err) {
    await client.query("ROLLBACK");
    console.log(err);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: err.message });
  }
};

const create = async (req, res) => {
  insert(req.body)
    .then(({ rows }) => res.status(httpStatus.CREATED).send(rows[0]))
    .catch((e) =>
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: e.message })
    );
};

const get = (req, res) => {
  getAll()
    .then(({ rows }) => res.status(httpStatus.OK).send(rows))
    .catch(() =>
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({ error: "An error occurred." })
    );
};

const put = (req, res) => {
  update({ shiftid: req.params.id, ...req.body })
    .then(({ rows }) => res.status(httpStatus.OK).send(rows[0]))
    .catch(() =>
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({ error: "An error occurred." })
    );
};

const remove = (req, res) => {
  del(req.params.id)
    .then(({ rowCount }) => {
      if (!rowCount)
        return res
          .status(httpStatus.NOT_FOUND)
          .send({ message: "There is no such record." });
      res
        .status(httpStatus.OK)
        .send({ message: "Shift deleted successfully." });
    })
    .catch(() =>
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({ error: "An error occurred." })
    );
};

const createForProcess = async (req, res) => {
  console.log(
    "In the server side Received payload for createForProcess:",
    req.body
  ); // Add this line to log the payload
  insertForProcess(req.body)
    .then(({ rows }) => res.status(httpStatus.CREATED).send(rows[0]))
    .catch((e) =>
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: e.message })
    );
};

const getForProcess = (req, res) => {
  getAllForProcess()
    .then(({ rows }) => res.status(httpStatus.OK).send(rows))
    .catch(() =>
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({ error: "An error occurred." })
    );
};
const getDayShiftsForOrder = (req, res) => {
  const date = req.query?.date;
  if (!date) {
    console.log("no date found in getDayShiftsForOrder");
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send({ error: "Tarih bulunamadı." });
  }
  getDayShiftsOrder({ date })
    .then(({ rows }) => {
      console.log("rows off getDayShiftsForOrder", rows);
      return res.status(httpStatus.OK).send(rows);
    })
    .catch((err) => {
      console.log(err);
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: err.message });
    });
};
const getDayShiftsForProcess = (req, res) => {
  const date = req.query?.date;
  if (!date) {
    console.log("no date found in getDayShiftsForOrder");
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send({ error: "Tarih bulunamadı." });
  }

  getDayShiftsProcess({ date })
    .then(({ rows }) => {
      console.log("rows off getDayShiftsProcess", rows);
      return res.status(httpStatus.OK).send(rows);
    })
    .catch((err) => {
      console.log(err);
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: err.message });
    });
};

const putForProcess = (req, res) => {
  updateForProcess({ shiftid: req.params.id, ...req.body })
    .then(({ rows }) => res.status(httpStatus.OK).send(rows[0]))
    .catch(() =>
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({ error: "An error occurred." })
    );
};

const removeForProcess = (req, res) => {
  delForProcess(req.params.id)
    .then(({ rowCount }) => {
      if (!rowCount)
        return res
          .status(httpStatus.NOT_FOUND)
          .send({ message: "There is no such record." });
      res
        .status(httpStatus.OK)
        .send({ message: "Shift deleted successfully." });
    })
    .catch(() =>
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({ error: "An error occurred." })
    );
};

module.exports = {
  create,
  get,
  put,
  remove,
  createForProcess,
  getForProcess,
  putForProcess,
  removeForProcess,
  createShift,
  getDayShiftsForOrder,
  getDayShiftsForProcess,
};
