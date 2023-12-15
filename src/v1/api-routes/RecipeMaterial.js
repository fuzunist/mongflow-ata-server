const authenticate = require("../middlewares/authenticate");

const { get } = require("../controllers/RecipeMaterials");

const express = require("express");
const router = express.Router();

router.route("/").get(authenticate, get);

module.exports = router;
