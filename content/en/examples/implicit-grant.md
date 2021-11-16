# Implicit Grant

> danger:warning: As stated in [oauth.net](https://oauth.net/2/)'s [OAuth 2.0 Implicit Grant](https://oauth.net/2/grant-types/implicit/), _the [OAuth 2.0 Security Best Current Practice](https://tools.ietf.org/html/draft-ietf-oauth-security-topics) document recommends against using the Implicit flow entirely_.

Despite the above warning, the _Implicit Grant_ flow is still supported.

Here are the steps involved in the Implicit Grant flow:

1. The user a redirected from the app to the OAuth2 provider's consent screen.
2. If the user isn't authenticated on the provider's website, he/she's invited to sign in.
3. A consent screen asks the user if he/she allows the OAuth2 app to access a set of resources (usually specified through the `scope` parameter in the consent screen's URL).
4. The user is redirected to the app. A short-lived _access token_ is embedded in the redirection URL.

The example below showcases the simplest way to use the module:

* No backend application is needed
* When called, the `onSuccess` callback receives an object which contains the access token.

**Four mandatory props** are used to build the URL of the consent screen: `authorizationUrl`, `responseType`, `clientId`, and `redirectUri`. An optional `scope` prop can be passed.

The client ID is given by the OAuth2 provider (usually along with a client secret) when you set up an OAuth2 app (where you're asked to fill in the Redirect URI).

[app name=implicit-grant]