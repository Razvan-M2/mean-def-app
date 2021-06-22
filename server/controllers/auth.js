const asyncHandler = require("../middleware/async");
const neodeInstance = require("../models/Neode");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const ErrorResponse = require("../util/ErrorResponse");

const generateToken = (user, tokenExpire) => {
    return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: tokenExpire,
    });
};

const validateFields = (userData) => {
    // if(!userData)
    // if(typeof(userData.firstName) === "undefined"){
    //     return next(new ErrorResponse("User Fields Missing!", 422));
    // }
    // if(typeof(userData.lastName) === "undefined"){
    //     return next(new ErrorResponse("User Fields Missing!", 422));
    // }
    // if(typeof(userData.email) === "undefined"){
    //     return next(new ErrorResponse("User Fields Missing!", 422));
    // }
    // if(typeof(userData.password) === "undefined"){
    //     return next(new ErrorResponse("User Fields Missing!", 422));
    // }
    return  typeof(userData)==="undefined" ||
            typeof(userData.firstName) === "undefined" ||
            typeof(userData.lastName) === "undefined" ||
            typeof(userData.email) === "undefined" ||
            typeof(userData.password) === "undefined";
}

exports.login = asyncHandler(async (req, res, next) => {
    const tokenExpire = process.env.JWT_EXPIRE;
    const { email, password } = req.body;

    const result = await neodeInstance.first("User", {
        email,
    });

    if (!result) {
        return next(new ErrorResponse("User not found!", 404));
    }
    const user = await result.toJson();

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
        const token = generateToken(user, tokenExpire * 1000);

        res.status(200).json({
            success: true,
            token,
            tokenExpire,
        });
    } else {
        return next(new ErrorResponse("Password Incorrect!", 403));
    }
});

exports.loggedUserDetails = asyncHandler(async (req, res, next) => {
    const id = req.idUser;

    const data = await neodeInstance.findById("User", id);

    if (!data) {
        return next(new ErrorResponse("Error fetching user data!", 404));
    }

    let user = { ...(await data.properties()) };
    delete user.password;

    res.status(200).json({
        success: true,
        data: user,
    });
});

exports.logout = asyncHandler(async (req, res, next) => {
    res.json({ success: true, message: "This is logout" });
});

exports.register = asyncHandler(async (req, res, next) => {
    const { firstName, lastName, email, password } = req.body;

    if(validateFields({...req.body})){
        return next(new ErrorResponse("User Fields Missing!", 422));
    };

    const result = await neodeInstance.first("User", {
        email,
    });

    if (result) {
        return next(new ErrorResponse("User exists!", 409));
    }

    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(password, salt);

    const resultSave = neodeInstance.create("User", {
        firstName,
        lastName,
        email,
        password: hashedpassword,
    });
    if (!resultSave) {
        return next(new ErrorResponse("Error creating user!", 422));
    }
    res.status(200).json({ success: true, message: "User created!" });
});
