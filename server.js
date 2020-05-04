const express = require("express");
const path = require("path");

const app = express();

app.use(express.static(path.join(__dirname, "client")));

const port = process.env.PORT || 5000;

app.get("/*", (_, res) => res.sendFile(path.join(__dirname, "client/index.html")));

app.listen(port, () => console.log(`Server started on port: ${port}`));