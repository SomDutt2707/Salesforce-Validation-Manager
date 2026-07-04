const jsforce = require("jsforce");

function createOAuth() {
  return new jsforce.OAuth2({
    loginUrl: process.env.SF_LOGIN_URL,
    clientId: process.env.SF_CLIENT_ID,
    clientSecret: process.env.SF_CLIENT_SECRET,
    redirectUri: process.env.SF_REDIRECT_URI,
  });
}

module.exports = createOAuth;
