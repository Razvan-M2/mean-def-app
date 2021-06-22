const asyncHandler = require("../middleware/async");
const neodeInstance = require("../models/Neode");
const ErrorResponse = require("../util/ErrorResponse");

exports.getKeys = asyncHandler(async (req, res, next) => {
    const keys = await (await neodeInstance.all("Keyword")).toJson();

    if (!keys) {
        return next(new Error("Error fetching all keys!"));
    }
    const formatedKeys = keys.map((element) => {
        return { name: element.name };
    });

    res.status(200).json({
        success: true,
        keys: formatedKeys,
        number: formatedKeys.length,
    });
});

exports.postKey = asyncHandler(async (req, res, next) => {
    const { name } = req.body;

    const result = await neodeInstance.model("Keyword").create({ Name: name });

    if (!result) {
        return next(new ErrorResponse("Error saving key!", 500));
    }

    res.status(200).json({
        success: true,
    });
});

exports.updateKey = asyncHandler(async (req, res, next) => {
    const { name } = req.params;
    const { data } = req.body;

    const existentNode = await neodeInstance.first("Keyword", "name", data);

    if (existentNode) {
        return next(new ErrorResponse("Key aleady exists!", 409));
    }

    const node = await neodeInstance.first("Keyword", "name", name);

    if (!node) {
        return next(new ErrorResponse("Error Finding Key!", 404));
    }

    const result = await node.update({ Name: data });

    if (!result) {
        return next(new ErrorResponse("Error Updating Key!", 500));
    }

    res.status(200).json({
        success: true,
    });
});

exports.deleteKey = asyncHandler(async (req, res, next) => {
    const { name } = req.params;

    const node = await neodeInstance.first("Keyword", "name", name);

    if (!node) {
        return next(new ErrorResponse("Error finding the key!", 404));
    }

    const result = await node.delete();

    if (!result) {
        return next(new ErrorResponse("Error deleting key!", 404));
    }

    res.status(200).json({
        success: true,
    });
});
