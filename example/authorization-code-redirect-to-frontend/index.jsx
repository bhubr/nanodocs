import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import OAuth2Login from 'react-simple-oauth2-login';

const authUrl = 'https://github.com/login/oauth/authorize';
const redirectUri = process.env.REACT_APP_REDIRECT_URI;
const clientId = process.env.REACT_APP_CLIENT_ID;
const serverUrl = process.env.REACT_APP_SERVER_URL;

const githubApiUrl = 'https://api.github.com';

const postCodeToServer = (code) => axios.post(
  `${serverUrl}/oauth/token`,
    { code },
)
  .then(res => res.data);

const getConnectedUser = (accessToken) => axios.get(
  `${githubApiUrl}/user`,
  {
    headers: {
      authorization: `Bearer ${accessToken}`
    }
  }
)
  .then(res => res.data);

const AuthorizationCodeRedirToFront = () => {
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) {
      getConnectedUser(token)
        .then(setUser)
        .catch(setError);
    }
  }, [token]);
  
  const onSuccess = ({ code }) => postCodeToServer(code)
    .then(({ access_token: at }) => setToken(at))
    // If an error occurs when sending code to server,
    // we want to display it
    .catch(error => setError(error));
  
  if (error) {
    return <p style={{
      padding: '1em',
      border: '2px solid red'
    }}>{error.message}</p>
  }
  if (!token) {
    return (
      <OAuth2Login
        responseType="code"
        authorizationUrl={authUrl}
        redirectUri={redirectUri}
        clientId={clientId}
        onSuccess={onSuccess}
      />
    );
  }
  return (
    <div>
      <p>Access token: {token}</p>
      {
        user && (
          <div>
            <p>login: <strong>{user.login}</strong></p>
            <img src={user.avatar_url} alt={`${user.login}'s avatar`} />
          </div>
        )
      }
    </div>
  );
}

ReactDOM.render(
  <AuthorizationCodeRedirToFront />,
  document.getElementById('root')
);
