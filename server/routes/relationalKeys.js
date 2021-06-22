const express = require("express");
const router = express.Router();
const {
    getKeys,
    postKey,
    updateKey,
    deleteKey,
} = require("../controllers/relationalKeys");

const { protect, authorize } = require("../middleware/auth");
require("dotenv").config();

router.route("/keys").get(authorize, getKeys);
router.route("/keys").post(authorize, postKey);
router.route("/keys/:name").put(authorize, updateKey);
router.route("/keys/:name").delete(authorize, deleteKey);

module.exports = router;
