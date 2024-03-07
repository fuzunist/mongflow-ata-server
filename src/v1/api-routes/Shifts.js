const validate = require("../middlewares/validate");
const authenticate = require("../middlewares/authenticate");
const paramValidate = require("../middlewares/paramValidate");
const schemas = require("../validations/Shifts");

const {
  get,
  create,
  put,
  remove,
  getForProcess,
  createForProcess,
  putForProcess,
  removeForProcess,
} = require("../controllers/Shifts");

const express = require("express");
const router = express.Router();

//shift for order routes

router.route("/").get(authenticate, get);
router
  .route("/")
  .post(authenticate, validate(schemas.createValidation), create);
router
  .route("/:id")
  .put(
    authenticate,
    paramValidate("id"),
    validate(schemas.createValidation),
    put
  );
router.route("/:id").delete(authenticate, paramValidate("id"), remove);

//shift for process routes

router.route("/process").get(authenticate, getForProcess);
router
  .route("/process")
  .post(authenticate, validate(schemas.createValidationForProcess), createForProcess);
router
  .route("/process/:id")
  .put(
    authenticate,
    paramValidate("id"),
    validate(schemas.createValidationForProcess),
    putForProcess
  );
router.route("/process/:id").delete(authenticate, paramValidate("id"), removeForProcess);


module.exports = router;
