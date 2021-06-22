const asyncHandler = require("./async");
const neodeInstance = require("../models/Neode");
const ErrorResponse = require("../util/ErrorResponse");
const jwt = require("jsonwebtoken");

exports.protect = asyncHandler(async (req, res, next) => {
    console.log("You are inside auth");
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decodedToken);
        req.idUser = decodedToken.id;
        req.logged = true;
        next();
    } catch (error) {
        return next(new ErrorResponse("You are not authenticated!", 401));
    }
});

exports.authorize = asyncHandler(async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        const result = await neodeInstance.findById("User", decodedToken.id);

        if (result.get("role") !== "admin") {
            console.log("User is not authorized to access route!");
            throw error();
        }

        next();
    } catch (error) {
        return next(new ErrorResponse("You are not authorized!", 401));
    }
});
