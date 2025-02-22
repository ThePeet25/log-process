require('dotenv').config({ path: "../../.env" });
const express = require('express');
const path = require("path");
const expressSession = require("express-session");
const passport = require('passport');
const Auth0Strategy = require("passport-auth0");
const authRouter = require("../routes/auth");
const { port } = require('./db');

const app = express();
const PORT = process.env.PORT;

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

app.set("views", "../views");
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.use(expressSession(session));

console.log(process.env.AUTH_DOMAIN);
const strategy = new Auth0Strategy(
  {
    domain: process.env.AUTH_DOMAIN,
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: process.env.AUTH_CALLBACK
  },
  function(accessToken, refreshToken, extraParams, profile, done) {
    return done(null, profile);
  }
);

passport.use(strategy);
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});


app.use("/", authRouter);
app.get("/", (req, res) => {
  res.render('index', {
    title: 'Auth0 Webapp sample Nodejs',
    isAuthenticated:  req.isAuthenticated()
  });
})

app.listen(PORT , () => {
  console.log("app running on port", PORT) ;
})