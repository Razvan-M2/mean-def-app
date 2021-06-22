const express = require("express");
const router = express.Router();
const { getDisciplines } = require("../controllers/disciplines.js");

router.route("/disciplines").get(getDisciplines);

module.exports = router;
