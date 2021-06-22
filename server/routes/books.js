const express = require("express");
const router = express.Router();
const {
    getBooks,
    getBook,
    getGoogleBooks,
    recommendBook,
} = require("../controllers/books");
const { protect } = require("../middleware/auth");
require("dotenv").config();

router.route("/books").get(getBooks);
router.route("/books/:id").get(getBook);
router.route("/google_books").get(protect, getGoogleBooks);
router.route("/recommend_book").post(protect, recommendBook);
module.exports = router;
