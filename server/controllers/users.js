const express = require("express");
const Neode = require("neode");
const router = express.Router();
const neo4j = require("neo4j-driver");
const asyncHandler = require("../middleware/async");
const neodeInstance = require("../models/Neode");
const ErrorResponse = require("../util/ErrorResponse");

exports.getUsers = asyncHandler(async (req, res, next) => {
    const users = await neodeInstance.cypher("MATCH (n:User) RETURN n");

    if (!users) {
        return next(new ErrorResponse("Error fetching all users!", 404));
    }

    return res.status(200).json({
        success: true,
        users: users.records,
    });
});

exports.getUser = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const user = await neodeInstance.cypher(
        `MATCH (a:User) WHERE id(a) = ${id} OPTIONAL MATCH (a)-[r:endorses]->(b:Book) RETURN a, r, b`
    );

    if (!user) {
        return next(new ErrorResponse("Error fetching user data!", 404));
    }

    res.status(200).json({
        success: true,
        data: user.records,
    });
});

exports.likeBook = asyncHandler(async (req, res, next) => {
    const { idBook } = req.params;
    const idUser = req.idUser;

    const checkExists = await neodeInstance.readCypher(
        `Match(u:User)-[r:liked]->(b:Book) where id(u) = ${idUser} and id(b) = ${idBook} return r`
    );

    if (checkExists.records.length > 0) {
        return next(new ErrorResponse("Relationship already exists", 409));
    }

    const user = await neodeInstance.findById("User", idUser);

    if (!user) {
        return next(new ErrorResponse("Error fetching user!", 404));
    }
    const book = await neodeInstance.findById("Book", idBook);

    if (!book) {
        return next(new ErrorResponse("Error fetching book!", 404));
    }

    const relateResult = await user.relateTo(book, "liked");

    if (!relateResult) {
        return next(
            new ErrorResponse(
                "Error creating relationship or it already exists!",
                500
            )
        );
    }

    await neodeInstance.writeCypher(
        `MATCH(b:Book) where ID(b)=${idBook} SET b.endorsements = b.endorsements+1 return b as Book`
    );

    res.status(200).json({
        success: true,
    });
});

exports.unlikeBook = asyncHandler(async (req, res, next) => {
    const { idBook } = req.params;

    const idUser = req.idUser;

    const checkExists = await neodeInstance.readCypher(
        `Match(u:User)-[r:liked]->(b:Book) where id(u) = ${idUser} and id(b) = ${idBook} return r`
    );

    if (!checkExists) {
        return next(new ErrorResponse("Relationship doesn't exist", 409));
    }

    const user = await neodeInstance.findById("User", idUser);

    if (!user) {
        return next(new ErrorResponse("Error fetching user!", 404));
    }

    const book = await neodeInstance.findById("Book", idBook);

    if (!book) {
        return next(new ErrorResponse("Error fetching book!", 404));
    }

    const detachResult = await user.detachFrom(book);

    if (!detachResult) {
        return next(
            new ErrorResponse(
                "Error deleting relationship or it doesn't exist!",
                500
            )
        );
    }

    await neodeInstance.writeCypher(
        `MATCH(b:Book) where ID(b)=${idBook} SET b.endorsements = b.endorsements-1 return b as Book`
    );

    res.status(200).json({
        success: true,
    });
});

exports.getRecommendedBooks = asyncHandler(async (req, res, next) => {
    const idUser = req.idUser;
    console.log(idUser);

    const result = await neodeInstance.readCypher(
        "Match(u:User)-[r1:liked]->(b:Book)-[r2:keyword]->(k:Keyword)<-[r3:keyword]-(b2:Book) where id(u) = $idUser and not (u)-[:liked]->(b2) with b as Liked_Book, collect(k.name) as Linked_Keywords, b2 as Suggested_Book call { with Linked_Keywords return size(Linked_Keywords) as NrOfLinks order by NrOfLinks DESC limit 1 } call { with Suggested_Book  return collect(Suggested_Book) as Suggested_Books } return Liked_Book, collect(Suggested_Book) as Suggestions LIMIT 5",
        { idUser: idUser }
    );
    const data = [];
    result.records.forEach((item) => {
        const extractedItem = item.toObject();

        const likedBook = extractedItem.Liked_Book;
        const topSuggestion = extractedItem.Suggestions[0];

        const book = {
            id: neo4j.integer.toNumber(likedBook.identity),
            ...likedBook.properties,
            liked: true,
            is_google_book: false,
        };

        const recommendation = {
            id: neo4j.integer.toNumber(topSuggestion.identity),
            ...topSuggestion.properties,
            liked: false,
            is_google_book: false,
        };

        book.endorsements = neo4j.integer.toNumber(book.endorsements);
        book.pageCount = neo4j.integer.toNumber(book.pageCount);

        recommendation.endorsements = neo4j.integer.toNumber(
            recommendation.endorsements
        );
        recommendation.pageCount = neo4j.integer.toNumber(
            recommendation.pageCount
        );

        data.push({
            book,
            recommendation,
        });
    });
    res.status(200).json({
        success: true,
        data,
    });
});
