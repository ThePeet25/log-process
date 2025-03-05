require('dotenv').config();
const express = require('express');
const expressSession = require("express-session");
const cookieParser = require("cookie-parser");
const path = require('path');
const authRouter = require('./routes/auth.js');
const sequelize = require('./schema/db.js');
const { passport } = require("./config/auth.js");
const kafkaRouter = require('./routes/kafka.js');
const receiveMessage = require('./services/consumer.js');

const PORT = process.env.PORT
const app = express();

//sesion config
const session = {
    secret: process.env.SESSION_SECRET,
    cookie: {},
    resave: false,
    saveUninitialized: false
};
  
if (app.get("env") === "production") {
// Serve secure cookies, requires HTTPS
session.cookie.secure = true;
}

app.set("views",  path.join(__dirname, '../src/views'));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());
app.use(expressSession(session));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

app.use("/", authRouter);
app.use("/search", kafkaRouter);

app.get("/", (req, res) => {
    res.render('index', {
      title: 'real time log',
      user: req.user,
      isAuthenticated:  req.isAuthenticated(),
      role: req.isAuthenticated() ? req.user._json['https://dev.com/claims/roles'][0] : 0 
    });
});

app.listen(PORT, async () => {
    console.log("app running on port", PORT);
    // await sequelize.sync({ force: true });
    receiveMessage("auth-log");
    await sequelize.sync();

})