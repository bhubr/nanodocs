import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import OAuth2Login from 'react-simple-oauth2-login';

const authUrl = 'https://accounts.spotify.com/authorize';
const {
  REACT_APP_REDIRECT_URI: redirectUri,
  REACT_APP_CLIENT_ID: clientId
} = process.env;

const ImplicitGrant = () => {
  const [token, setToken] = useState(null);
  const onSuccess = ({ access_token: at }) => setToken(at);
  return (
    token
    ? <p>Access token: {token}</p>
    : <OAuth2Login
      responseType="token"
      authorizationUrl={authUrl}
      redirectUri={redirectUri}
      clientId={clientId}
      onSuccess={onSuccess}
    />
  );
}

ReactDOM.render(
  <ImplicitGrant />,
  document.getElementById('root')
);
