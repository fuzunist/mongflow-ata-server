const authenticate = require("../middlewares/authenticate");

const { get, put } = require("../controllers/RecipeMaterials");

const express = require("express");
const router = express.Router();

router.route("/").get(authenticate, get);
router.route("/:all").put(authenticate, put);

module.exports = router;
