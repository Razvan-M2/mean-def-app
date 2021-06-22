//  @desc   Logs requests to console and to file
const fs = require("fs").promises;
const colors = require("colors");

const logger = async (req, res, next) => {
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

    const logLine = `IP: ${ip}, Request: ${req.method} ${
        req.originalUrl
    } , Date: ${new Date(Date.now()).toUTCString()}\n`;

    console.log(`\nNew Request -> ${logLine}`.yellow);

    const result = await fs.writeFile("search.log", logLine, { flag: "a" });

    if (result) {
        return next(new Error("Error logging to file"));
    }
    //  Needed in order to call the
    //  next piece of middleware in the cicle
    next();
};

module.exports = logger;
