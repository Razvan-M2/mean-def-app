const express = require("express");
const router = express.Router();
const {
    getUsers,
    getUser,
    likeBook,
    unlikeBook,
    getRecommendedBooks,
} = require("../controllers/users");
const { protect } = require("../middleware/auth");

router.route("/users").get(getUsers);
// router.route("/users/:id").get(getUser);
router.route("/users/likebook/:idBook").post(protect, likeBook);
router.route("/users/unlikebook/:idBook").post(protect, unlikeBook);
router.route("/users/books-recommended").get(protect, getRecommendedBooks);

module.exports = router;
