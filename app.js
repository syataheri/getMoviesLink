import express from "express";

const app = express("express");

import search from "./controller/search.js";

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res, next) => {
    res.render("index", {
        links: {}
    });
});

app.post("/search", search);

app.listen(3000, () => {
    console.log("server is listening on port 3000");
})