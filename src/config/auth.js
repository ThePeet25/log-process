const passport = require('passport');
const Auth0Strategy = require("passport-auth0");
const jwt = require("jsonwebtoken");
const jwksClient = require("jwks-rsa");

const client = jwksClient({
    jwksUri: `https://${process.env.AUTH_DOMAIN}/.well-known/jwks.json`
});

const strategy = new Auth0Strategy(
  {
    domain: process.env.AUTH_DOMAIN,
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: process.env.AUTH_CALLBACK
  },
  function(accessToken, refreshToken, extraParams, profile, done) {
    //send acces tokin when log in
    profile.accessToken = accessToken;
    return done(null, profile);
  }
);

passport.use(strategy);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

//for get publickey to verify access token
const publicKey = (header, callback) => {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) {
      return callback(err, null);
    }
    const siginKey = key.publicKey || key.rsaPublicKey;
    console.log(siginKey);
    callback(null, siginKey);
  });
}

//verify and check access token
const verifyAccestoken = (req, res, next) => {
  //get token
  const token = req.cookies.access_token;
  //check token
  if (!token) {
    return res.status(401).json({
      error: "Unauthoriaztion"
    })
  }
  //verify jwt
  jwt.verify(token, publicKey, {
    audience: "https://dev-rw8npba0icf0l7fd.us.auth0.com/api/v2/",
    issuer: `https://${process.env.AUTH_DOMAIN}/`,
    algorithms: ["RS256"]
  }, (err, decoded) => {
    if (err) {
      console.log(err);
      return res.status(401).json({
        error: "Invalid Token"
      })
    }
    req.user = decoded
    next();
  });

}

const checkRoles = (role) => (req, res, next) => {
  const userRoles = req.user["https://dev.com/claims/roles"] || [];
  //check role
  if (userRoles.includes(role)) {
    return next();
  }
  return res.status(403).json({
    message: "Access denied" 
  });
}

module.exports = {passport, verifyAccestoken, checkRoles};