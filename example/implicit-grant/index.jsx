import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import OAuth2Login from 'react-simple-oauth2-login';

const authUrl = 'https://accounts.spotify.com/authorize';
const redirectUri = process.env.REACT_APP_REDIRECT_URI;
const clientId = process.env.REACT_APP_CLIENT_ID;

const ImplicitGrant = () => {
  const [token, setToken] = useState(null);
  const onSuccess = ({ access_token: at }) => setToken(at);
  return (
    token
    ? <p>Access token: {token}</p>
    : (
      <OAuth2Login
        responseType="token"
        authorizationUrl={authUrl}
        redirectUri={redirectUri}
        clientId={clientId}
        onSuccess={onSuccess}
      />
    )
  );
}

ReactDOM.render(
  <ImplicitGrant />,
  document.getElementById('root')
);
