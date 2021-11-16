# Authorization Code

The [OAuth 2.0 Authorization Code](https://oauth.net/2/grant-types/authorization-code/), also called "3-legged OAuth flow", involves a server. Here how 

Here are the steps involved in the Authorization Code flow:

1. The user a redirected from the app to the OAuth2 provider's consent screen.
2. If the user isn't authenticated on the provider's website, he/she's invited to sign in.
3. A consent screen asks the user if he/she allows the OAuth2 app to access a set of resources (usually specified through the `scope` parameter in the consent screen's URL).
4. The user is redirected to the app. An _authorization code_ is embedded in the redirection URL.
5. The app sends the _code_ to the OAuth2 provider via a POST request, along with the client id & secret.
6. The OAuth2 provider sends back an _access token_, and usually a _refresh token_.

It should be noted that there are various ways to handle step 5. In the context of React, and Single-Page Apps in general, there are basically two options:

1. Redirect to the React app, which sends the authorization code to the server app, which in turn POSTs the code to the OAuth2 provider.
2. Redirect to the server app directly. When it gets the access token, the server app must communicate it to the React app. Here again, there two ways of doing things:

    a. If the server and client app are on the same domain, the popup can directly communicate with its parent window.
    b. If the server and client app are **not** on the same domain, the popup and its parent window can communicate via `window.postMessage()`.

## 1. Redirect to the React app

[app name=authorization-code-redirect-to-frontend]