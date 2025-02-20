require('dotenv').config();

module.exports = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.secret,
    baseURL: process.env.BASE_URL,
    clientID: process.env.clientID,
    issuerBaseURL: process.env.issurBaseURL
  };
