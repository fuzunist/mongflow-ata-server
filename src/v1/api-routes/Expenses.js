const paramValidate = require("../middlewares/paramValidate");
const authenticate = require("../middlewares/authenticate");

const {
  getMonthlyExpenses,
  getItems,
  getClasses,
  createExpense,
  createItem,
  updateExpense,
} = require("../controllers/Expenses");

const express = require("express");
const router = express.Router();

router
  .route("/")
  .get(authenticate, getMonthlyExpenses);
router.route("/class").get(authenticate, getClasses);
router.route("/items").get(authenticate, getItems);

router.route("/").post(authenticate, createExpense);
router.route("/item").post(authenticate, createItem);
router.route("/").patch(authenticate, updateExpense);

module.exports = router;
