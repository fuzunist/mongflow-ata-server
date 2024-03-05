const authenticate = require("../middlewares/authenticate");
const paramValidate = require("../middlewares/paramValidate");


const { get, put, getLogsByDate, createLog, putLog, remove  } = require("../controllers/RawMaterialStocks");

const express = require("express");
const router = express.Router();

router.route("/").get(authenticate, get);
router.route("/").post(authenticate, createLog);
router.route("/:id").put(authenticate, put);

router.route("/logs").get(authenticate, getLogsByDate);
router.route("/logs/:id").patch(authenticate, putLog);
router.route("/log/:id").delete(authenticate, paramValidate("id"), remove);

module.exports = router;
