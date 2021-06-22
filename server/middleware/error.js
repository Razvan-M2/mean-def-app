const errorHandler = (err, req, res, next) => {
    console.log(err.message.red.underline);

    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message,
    });
};

module.exports = errorHandler;
