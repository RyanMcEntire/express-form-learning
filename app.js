const express = require("express");
const app = express();
const usersRouter = require("./routes/usersRouter");
const flash = require("connect-flash");
var cookieParser = require("cookie-parser");
var session = require("express-session");

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser("cookie thing"));
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(flash());

app.use("/", usersRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Express app listening on port ${PORT}!`));
