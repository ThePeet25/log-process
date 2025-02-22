require('dotenv').config();
const express = require('express');
const expressSession = require("express-session");
const path = require('path');
const authRouter = require('./routes/auth.js');
const sequelize = require('./schema/db.js');
const sendMessage = require('./services/producer.js');
const passport = require("./config/auth.js");

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
// app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());
app.use(expressSession(session));
app.use(passport.initialize());
app.use(passport.session());

app.use("/", authRouter);

app.get("/", (req, res) => {
    res.render('index', {
      title: 'Auth0 Webapp sample Nodejs',
      isAuthenticated:  req.isAuthenticated()
    });
});

app.post('/send', async(req, res) => {
    const data = req.body
    try {
        await sendMessage(data.topic, data.message);
        console.log("success send");
        res.send("success");
    } catch(err) {
        console.log('err', err);
        res.send('cant send')
    }
})

// app.get('/receive/:topic', async(req, res) => {
//     const topic = req.params
//     try {
//         const response = await receiveMessage(topic);
//         console.log(response);
//         res.json(response);
//     } catch(err) {
//         console.log('err', err);
//         res.send("cant get message")
//     }
// })

app.listen(PORT, async () => {
    console.log("app running on port", PORT);
    // await sequelize.sync({ force: true });
    await sequelize.sync();
})