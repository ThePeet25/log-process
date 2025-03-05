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
            //get access token for acess in database
            const token = req.user.accessToken
            res.cookie("access_token", token, {
                maxAge: 300000,
                httpOnly: true,
                secure: true,
                sameSite: "none",
            });
            await sendMessage("auth-log", loginLog.log(req.user,"USER_LOGIN"));
            const returnTo = req.session.returnTo
            delete req.session.returnTo;
            res.redirect(returnTo || "/");
        });
    })(req, res, next);
});

//middleware before logout
router.get("/logout", async (req, res, next) => {
    if (req.isAuthenticated()) {
        await sendMessage("auth-log", loginLog.log(req.user,"USER_LOGOUT"));
        next();
    } else {
        console.log("Unauthenticated user attempting to logout.");
    }
})

router.get("/logout", async (req, res) => {
    try {
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
        res.render('profile', {
            isAuthenticated:  req.isAuthenticated(),
            data: response.data,
            role: req.isAuthenticated() ? req.user['https://dev.com/claims/roles'][0] : 0
        });
    } catch(err) {
        console.log("error ",err)
        res.status(500).json({
            error: "fail to get user data"
        })
    }
})

module.exports = router;