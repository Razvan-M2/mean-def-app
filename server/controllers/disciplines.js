const asyncHandler = require("../middleware/async");
const neodeInstance = require("../models/Neode");
const ErrorResponse = require("../util/ErrorResponse");

exports.getDisciplines = asyncHandler(async (req, res, next) => {
    const disciplines = await neodeInstance.all("Discipline");

    if (!disciplines) {
        return next(new ErrorResponse("Could not find Disciplines"), 404);
    }

    const mappedDisciplines = disciplines.map((obj) => {
        return obj.properties().name;
    });

    res.status(200).json({
        success: true,
        disciplines: mappedDisciplines,
        count: mappedDisciplines.length,
    });
});
