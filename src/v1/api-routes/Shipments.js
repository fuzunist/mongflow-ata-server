const authenticate = require("../middlewares/authenticate");

const { get, create, remove, put } = require("../controllers/Users");

const express = require("express");
const router = express.Router();

router.route("/all").get(authenticate, get);
router.route("/").post(authenticate, create);
router.route("/").put(authenticate, put);
router.route("/:id").delete(authenticate, remove);

module.exports = router;
