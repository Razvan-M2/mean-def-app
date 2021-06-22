const express = require("express");
const router = express.Router();
const logger = require("./middleware/logger");

require("dotenv").config();

const booksAPI = require("./routes/books");
const usersAPI = require("./routes/users");
const keysAPI = require("./routes/relationalKeys");
const disciplinesAPI = require("./routes/disciplines");
const authAPI = require("./routes/auth");

router.use(logger);

router.use(authAPI);
router.use(booksAPI);
router.use(usersAPI);
router.use(keysAPI);
router.use(disciplinesAPI);

module.exports = router;
