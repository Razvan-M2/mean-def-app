const express = require("express");
const http = require("http");
const path = require("path");
const app = express();
const api = require("./server/api");
const morgan = require("morgan");
const colors = require("colors");
const errorHandler = require("./server/middleware/error");
const favicon = require("serve-favicon");

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));

app.use(morgan("dev"));
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );
    next();
});
app.use(express.json());
app.use("/api", api);

app.use(favicon(__dirname + "\\favicon.ico"));
app.use("/", express.static(path.join(__dirname, "server/public")));

app.all("/*", function (req, res, next) {
    res.sendFile("server/public/index.html", { root: __dirname });
});

app.use(errorHandler);

const port = process.env.PORT || 3000;
const server = http.createServer(app);

// app.set("port", process.env.PORT || 3000);

server.listen(port, () => {
    console.log(`Running on port ${port}`);
});
