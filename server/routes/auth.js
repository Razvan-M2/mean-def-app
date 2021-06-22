const express = require("express");
const {
    login,
    logout,
    register,
    loggedUserDetails,
} = require("../controllers/auth");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/auth/details", protect, loggedUserDetails);

module.exports = router;
