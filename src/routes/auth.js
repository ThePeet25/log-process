require('dotenv').config();
const express = require('express');
const { passport, verifyAccestoken } = require("../config/auth.js");
const axios = require("axios");
const { loginLog } = require("../services/log.js");
const sendMessage = require("../services/producer.js");
const { events } = require('@elastic/elasticsearch');

const router = express.Router();

router.get('/login', 
    passport.authenticate("auth0", {
        scope: "openid email profile",
        audience: "https://dev-rw8npba0icf0l7fd.us.auth0.com/api/v2/"
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
        req.logIn(user, async (err) => {
            if (err) {
                return next(err);
            }
            const token = req.user.accessToken
            res.cookie("access_token", token, {
                maxAge: 300000,
                httpOnly: true,
                secure: true,
                sameSite: "none",
            });
            // console.log(loginLog.log(req.user,"USER_LOGIN"));
            console.log(req.user._json['https://dev.com/claims/roles'][0]);
            await sendMessage("auth-log", loginLog.log(req.user,"USER_LOGIN"));
            const returnTo = req.session.returnTo
            delete req.session.returnTo;
            res.redirect(returnTo || "/");
        });
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

router.get("/logout", async (req, res) => {
    try {
        await sendMessage("auth-log", loginLog.log(req.user,"USER_LOGOUT"));
        res.clearCookie("access_token");
        req.logout( () => {
            req.session.destroy( () => {
                res.redirect(
                `https://${process.env.AUTH_DOMAIN}/v2/logout?client_id=${process.env.CLIENT_ID}&returnTo=http://localhost:3000/`
                );
          });
        });
    } catch(err) {
        console.log('error', err);
        res.redirect('/');
    }
});

router.get("/user-info", verifyAccestoken, async (req, res) => {
    try{
        const response = await axios.get("https://dev-rw8npba0icf0l7fd.us.auth0.com/userinfo", {
            headers: { Authorization: `Bearer ${req.cookies.access_token}`}
        });
        res.json({
            response: response.data
        });
    } catch(err) {
        res.status(500).json({
            error: "fail to get user data"
        })
    }
})

module.exports = router;