require('dotenv').config();
const express = require('express');
const passport = require("../config/auth.js");
const querystring = require("querystring");


const router = express.Router();

router.get('/login', 
    passport.authenticate("auth0", {
        scope: "openid email profile"
    }),
    (req, res) => {
        res.redirect("/");
});

router.get('/callback', (req, res, next) => {
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
            const returnTo = req.session.returnTo
            delete req.session.returnTo;
            res.redirect(returnTo || "/");
        })
    })(req, res, next);
});

// router.get("/logout", (req, res) => {
//     req.logOut();
  
//     let returnTo = req.protocol + "://" + req.hostname;
//     const port = res.socket.remotePort;;
  
//     if (port !== undefined && port !== 80 && port !== 443) {
//       returnTo =
//         process.env.NODE_ENV === "production"
//           ? `${returnTo}/`
//           : `${returnTo}:${port}/`;
//     }
  
//     const logoutURL = new URL(
//       `https://${process.env.AUTH_DOMAIN}/v2/logout`
//     );
  
//     const searchString = querystring.stringify({
//       client_id: process.env.CLIENT_ID,
//       returnTo: returnTo
//     });
//     logoutURL.search = searchString;
  
//     res.redirect(logoutURL);
//   });

router.get("/logout", (req, res) => {
    req.logout(() => {
      req.session.destroy(() => {
        res.redirect(
          `https://${process.env.AUTH_DOMAIN}/v2/logout?client_id=${process.env.CLIENT_ID}&returnTo=http://localhost:3000/`
        );
      });
    });
  });

  module.exports = router;