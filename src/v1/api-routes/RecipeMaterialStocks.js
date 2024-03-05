const authenticate = require("../middlewares/authenticate");
const paramValidate = require("../middlewares/paramValidate");

const { get, put, updateStocks, create, getLogs, createLog, putLog, updateStocksInProduction, remove, getLogsByDate } = require("../controllers/RecipeMaterialStocks");

const express = require("express");
const router = express.Router();

router.route("/stocks").get(authenticate, get);
router.route("/").post(authenticate, create);
router.route("/:id").put(authenticate, put);
router.route("/stocks/:id").put( updateStocks);
router.route("/stocks/production/:id").put( updateStocksInProduction);

router.route("/logs").get(authenticate, getLogsByDate);
router.route("/logs").post(authenticate, createLog);
router.route("/logs/:id").patch(authenticate, putLog);
router.route("/logs/:id").delete(authenticate, paramValidate("id"), remove);

module.exports = router;