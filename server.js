const express = require("express");
const connectedToDB = require("./config/db");
const path = require("path");

//Server Basic config
const app = express();
//Setup bodyparser
app.use(express.json({ extended: false }));

//Connect to Database
connectedToDB();

//Define Backend api
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/posts", require("./routes/api/posts"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/users", require("./routes/api/users"));

//server static assets in production
if (process.env.NODE_ENV == "production") {
    //set static folder
    app.use(express.static("client/build"));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
    });
}
//Server Port Config
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Running Server On Port ${PORT}`));
