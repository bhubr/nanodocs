import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import OAuth2Login from 'react-simple-oauth2-login';

const ImplicitGrant = () => {
  const [accessToken, setAccessToken] = useState(null);
  return (
    accessToken
    ? <p>Access token: {accessToken}</p>
    : <><OAuth2Login
      authorizationUrl="https://accounts.spotify.com/authorize"
      responseType="token"
      redirectUri={process.env.REACT_APP_REDIRECT_URI}
      clientId={process.env.REACT_APP_CLIENT_ID}
      onSuccess={({ access_token: token }) => setAccessToken(token)}
    /></>
  );
}

ReactDOM.render(
  <ImplicitGrant />,
  document.getElementById('root')
);
