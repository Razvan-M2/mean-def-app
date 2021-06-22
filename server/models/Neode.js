const Neode = require("neode");
const instance = Neode.fromEnv();

instance.model("Keyword", {
    name: {
        type: "string",
        required: true,
    },
});

instance.model("Book", {
    title: {
        type: "string",
        required: true,
    },
    authors: {
        type: "string",
        required: true,
    },
    endorsements: {
        type: "integer",
        required: true,
        default: 0,
    },
    description: {
        type: "string",
        required: true,
    },
    pageCount: {
        type: "integer",
        required: true,
    },
    thumbnail: {
        type: "string",
        required: true,
    },
    language: {
        type: "string",
        required: true,
    },
    isbn_13: {
        type: "string",
        required: true,
    },
    isbn_10: {
        type: "string",
        required: true,
    },
    publishedDate: {
        type: "date",
        requried: true,
    },
    publisher: {
        type: "string",
        required: true,
    },
    keywords: {
        type: "relationship",
        relationship: "keyword",
        direction: "OUT",
        target: "Keyword",
        cascade: "detach",
    },
});

instance.model("Discipline", {
    name: {
        type: "string",
        required: true,
    },
});

instance.model("User", {
    firstName: {
        type: "string",
        required: true,
    },
    lastName: {
        type: "string",
        required: true,
    },
    email: {
        type: "string",
        required: true,
    },
    password: {
        type: "string",
        required: true,
    },
    role: {
        type: "string",
        allow: ["admin", "user"],
        default: "user",
        required: true,
    },
    liked: {
        type: "relationship",
        relationship: "liked",
        direction: "OUT",
        target: "Book",
        cascade: "detach",
    },
});

instance.schema.install();

module.exports = instance;
