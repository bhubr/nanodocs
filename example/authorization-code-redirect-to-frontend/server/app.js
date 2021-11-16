const express = require('express');
const cors = require('cors');
const axios = require('axios');
const qs = require('qs');
require('dotenv').config();

// OAuth2 parameters
const clientId = process.env.OAUTH_CLIENT_ID;
const clientSecret = process.env.OAUTH_CLIENT_SECRET;
const redirectUri = process.env.OAUTH_REDIRECT_URI;
const tokenUrl = 'https://github.com/login/oauth/access_token';

// URL of the client app (for CORS origin)
const clientAppOrigin = process.env.CLIENT_APP_ORIGIN;

// Port to listen to
const port = process.env.PORT || 8000;

// Initialize Express app with JSON body parser
// and CORS middleware
const app = express();
app.use(express.json());
app.use(
  cors({
    // Restrict access to the frontend app's URL
    origin: clientAppOrigin,
  }),
);

const getAccessToken = async (code) => {
  // GitHub wants everything in an url-encoded body
  const payload = qs.stringify({
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    grant_type: 'authorization_code',
  });
  const { data, status } = await axios.post(tokenUrl, payload, {
    headers: {
      'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
    },
  });
  console.log('token request ended with status code', status);
  return qs.parse(data);
};

app.post('/oauth/token', async (req, res) => {
  const { code } = req.body;
  try {
    const data = await getAccessToken(code);
    res.json(data);
  } catch (err) {
    console.error('Error while requesting a token', err.response.data);
    res.status(500).json({
      error: err.message,
    });
  }
});

app.listen(port, (err) => {
  if (err) {
    console.error('Something wrong happened', err);
  } else {
    console.log(`server listening on port ${port}`);
  }
});
