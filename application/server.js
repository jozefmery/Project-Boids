const express = require("express");
const path = require("path");

const app = express();

app.use(express.static(path.join(__dirname, "client")));

const DEFAULT_PORT = 5000;

const portParam = new RegExp(/^\d+$/).test(process.argv[2]) ? process.argv[2] : undefined;

const port = parseInt(portParam) || DEFAULT_PORT;

app.get("/*", (_, res) => res.sendFile(path.join(__dirname, "client/index.html")));

app.listen(port, () => console.log(`Server started on port: ${port}`));