const asyncHandler = require("../middleware/async");
const neodeInstance = require("../models/Neode");
const axios = require("axios").default;
const neo4j = require("neo4j-driver");
const ErrorResponse = require("../util/ErrorResponse");
const jwt = require("jsonwebtoken");
const fs = require("fs").promises;

const generateCypherString = (
    search,
    limit,
    startIndex,
    sortField,
    discipline,
    useLimit,
    userOptions
) => {
    const splitSearch = search.split(" ");
    const disciplineStringSegment =
        discipline.length > 0 ? `{discipline:'${discipline}'}` : ``;
    let cypherString = `MATCH (n:Book ${disciplineStringSegment})-[:keyword]->(k)
                        WHERE n.title CONTAINS '${splitSearch[0]}' OR k.name CONTAINS '${splitSearch[0]}'`;
    splitSearch.shift();

    splitSearch.forEach((keyword) => {
        cypherString += ` OR n.title CONTAINS '${keyword}' OR k.name CONTAINS '${keyword}'`;
    });

    if (useLimit) {
        if (userOptions.getLiked) {
            cypherString += ` call{ with n match(u:User) where id(u) = ${userOptions.idUser} return exists((n)<-[:liked]-(u)) as is_liked} return n as Book, collect(k.name) as keywords, is_liked as liked ORDER BY n.${sortField} SKIP ${startIndex} LIMIT ${limit}`;
        } else {
            cypherString += `return n as Book, collect(k.name) as keywords, false as liked ORDER BY n.${sortField} SKIP ${startIndex} LIMIT ${limit}`;
        }
    } else {
        cypherString += ` return distinct n.title as Books`;
    }
    return cypherString;
};

exports.getBooks = asyncHandler(async (req, res, next) => {
    const userOptions = {
        idUser: 0,
        getLiked: false,
    };
    if (req.headers.authorization) {
        const token = req.headers.authorization.split(" ")[1];
        if (token !== "undefined") {
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
            userOptions.getLiked = true;
            userOptions.idUser = decodedToken.id;
        }
    }
    const search = req.query.search || "";
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = parseInt(req.query.startIndex) || 0;
    const sortField = req.query.sortField || "Year";
    const discipline = req.query.discipline || "";
    console.log(
        generateCypherString(
            search,
            limit,
            startIndex,
            sortField,
            discipline,
            true,
            userOptions
        )
    );
    const data = await neodeInstance.readCypher(
        generateCypherString(
            search,
            limit,
            startIndex,
            sortField,
            discipline,
            true,
            userOptions
        )
    );
    // const length = (await neodeInstance.all("Book")).length;
    const length = (
        await neodeInstance.readCypher(
            generateCypherString(
                search,
                limit,
                startIndex,
                sortField,
                discipline,
                false,
                userOptions
            )
        )
    ).records.length;

    if (!data || !length) {
        // return next(new ErrorResponse("Error fetching all books.", 404));
        res.status(200).json({
            success: true,
            data: [],
            length: 0,
        });
    }

    const formatedData = data.records.map((item, index) => {
        let obj = item.toObject();
        obj.Book.properties.authors = obj.Book.properties.authors.split("\\\\");
        obj.Book.properties.endorsements = neo4j.integer.toNumber(
            obj.Book.properties.endorsements
        );
        return {
            id: neo4j.integer.toNumber(obj.Book.identity),
            ...obj.Book.properties,
            keywords: obj.keywords,
            liked: obj.liked,
            is_google_book: false,
        };
    });
    res.status(200).json({
        success: true,
        data: formatedData,
        length,
    });
});

exports.getBook = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const data = await neodeInstance.findById("Book", id);

    console.log(data.properties());

    res.status(200).json({
        success: true,
        data: data.properties(),
    });
});

exports.getGoogleBooks = asyncHandler(async (req, res, next) => {
    const search = req.query.search;
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const order = req.query.sortField;

    const googlebooksUrlQuery = `https://www.googleapis.com/books/v1/volumes?q=${search}+subject:Computers&startIndex=${startIndex}&maxResults=${limit}&key=${process.env.API_KEY}`;

    const response = await axios.get(googlebooksUrlQuery);

    const formattedItems = response.data.items.map((item, index) => {
        let volumeInfo = { ...item.volumeInfo };
        return {
            id: item.id,
            title: volumeInfo.title ? volumeInfo.title : "",
            authors: volumeInfo.authors ? volumeInfo.authors : "",
            description: volumeInfo.description ? volumeInfo.description : "",
            publishedDate: volumeInfo.publishedDate
                ? volumeInfo.publishedDate
                : "",
            isbn_10: volumeInfo.industryIdentifiers
                ? volumeInfo.industryIdentifiers[0]
                    ? volumeInfo.industryIdentifiers[0].identifier
                    : ""
                : "",
            isbn_13: volumeInfo.industryIdentifiers
                ? volumeInfo.industryIdentifiers[1]
                    ? volumeInfo.industryIdentifiers[1].identifier
                    : ""
                : "",
            thumbnail: volumeInfo.imageLinks.thumbnail
                ? volumeInfo.imageLinks.thumbnail
                : "",
            publisher: volumeInfo.publisher ? volumeInfo.publisher : "",
            language: volumeInfo.language ? volumeInfo.language : "",
            pageCount: volumeInfo.pageCount ? volumeInfo.pageCount : "",
            endorsements: 0,
            keywords: volumeInfo.categories ? volumeInfo.categories : [],
            is_google_book: true,
        };
    });

    res.status(200).json({
        success: true,
        data: { data: formattedItems, length: response.data.totalItems },
    });
});

exports.recommendBook = asyncHandler(async (req, res, next) => {
    const fileStream = fs.readFile("../../recommended.json");

    res.status(200).json({
        status: success,
    });
});
