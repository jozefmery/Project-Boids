const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const items = require("./routes/api/items");

const app = express();

app.use(bodyParser.json());

const db = require("./config/keys").mongoURI;

// connect to db
mongoose.connect(db)
    .then(() => console.log("Database connected"))
    .catch(err => console.log("Failed to connect to db: " + err)); 

// use route
app.use("/api/items", items);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port: ${port}`));