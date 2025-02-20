require('dotenv').config();
const { register, displayUser } = require("../schema/editdb");
const express = require("express");
const authConfig = require('../config/auth');
const session = require('express-session');
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');

const router = express.Router();

router.use(express());
router.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
    })
);

router.use(passport.initialize());
router.use(passport.session());

passport.serializeUser((user, done) => {
    done(null, user);
});
  
passport.deserializeUser((user, done) => {
    done(null, user);
});

passport.use(
    new Auth0Strategy(
      {
        domain: process.env.AUTH_DOMAIN,
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: process.env.AUTH_CALLBACK,
      },
      (accessToken, refreshToken, extraParams, profile, done) => {
        return done(null, profile);
      }
    )
);

// Middleware ตรวจสอบการ Login
const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/login');
};

router.get('/', (req, res) => {
    // res.render('../views/index.ejs', { user: req.user });
    const user = req.user
    if(user) {
        res.send(`
        <h1>Home Page</h1>
        <p>Hello, ${user.displayname}!</p>
        <a href="/profile">Go to Profile</a> | <a href="/logout">Logout</a>   
    `);
    }else {
        res.send(`
        <p>You doesn't login</p>
        <a href="/login">Login</a>
        `);
    }
});

router.get("/login",passport.authenticate("auth0", {
      scope: "openid email profile"
    }),
    (req, res) => {
      res.redirect("/");
    }
);

//redirect to /
// router.get('/callback', passport.authenticate('auth0', {
//     failureRedirect: '/'
//   }), (req, res) => {
//     res.redirect('/profile');
// });

router.get("/callback", (req, res, next) => {
    passport.authenticate("auth0", (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.redirect("/login");
      }
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        const returnTo = req.session.returnTo;
        delete req.session.returnTo;
        res.redirect(returnTo || "/");
      });
    })(req, res, next);
});

router.get("/logout", (req, res) => {
    req.logOut();
    let returnTo = req.protocol + "://" + req.hostname;
    const port = req.connection.localPort;
  
    if (port !== undefined && port !== 80 && port !== 443) {
      returnTo =
        process.env.NODE_ENV === "production"
          ? `${returnTo}/`
          : `${returnTo}:${port}/`;
    }
  
    const logoutURL = new URL(
      `https://${process.env.AUTH0_DOMAIN}/v2/logout`
    );
  
    const searchString = querystring.stringify({
      client_id: process.env.AUTH0_CLIENT_ID,
      returnTo: returnTo
    });
    logoutURL.search = searchString;
    res.redirect(logoutURL);
});
//api for see all user password
router.get("/getall", async (req, res) => {
    const response = await displayUser();
    console.log("get data");
    res.json({
        res: response
    })
});

//api for register
// router.post("/register", async (req, res) => {
//     const UserData = req.body
//     console.log(UserData);
//     try {
//         const response = await register(UserData.username, UserData.email, UserData.password);
//         console.log(response);
//         console.log("register succes");
//         res.json({
//             messsage: "register success"
//         });
//     } catch(err) {
//         console.log(err);
//         res.send("register fail");
//     }
// })

//api for tes auth


module.exports = router;