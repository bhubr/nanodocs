## Examples


### Example app

Check out the examples in the `example` directory. You'll need OAuth2 apps configured on whatever provider.

#### Client app

Setup:

* `cd example/client`
* `npm install`
* Copy `settings.sample.js` as `settings-code.js` and/or `settings-implicit.js`, depending on which flow you intend to test.
* `npm start` (uses Parcel)

The `client` app provides examples for both flows. If you look at the two components, what really distinguishes how they use the component is:

* The value of `responseType` prop,
* The `fetch` call to send the code to the server in the Authorization Code example.

#### Server app

The `server` app is only given as an example to test the **Authorization Code flow**. It currently supports getting access tokens from GitHub or Spotify. In a real-world app, you'll probably want to use [Passport](http://www.passportjs.org/).

**Right after** you run `npm install`, you need to copy `.env.sample` as `.env`, and modify the values according to your needs.

* `OAUTH_TOKEN_URL` is the URL where you should POST the code obtained from the authorization screen,
* `OAUTH_CLIENT_ID` is the OAuth2 Client ID,
* `OAUTH_CLIENT_SECRET` is the OAuth2 Client Secret,
* `OAUTH_REDIRECT_URI` is the OAuth2 Redirect URI (thanks Captain Obvious).

The Client ID and Redirect URI should match that of the client app.

Then you can run `npm start`.

### Cross Origin / Same-origin Policy

> See the documentation on [Same-origin policy](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy)

If you are using the Authorization Code flow, and your redirect URL is on a server with a different
domain to your frontend, you will need to do the following:

1. Set the `isCrossOrigin` property to `true`
2. Set up your authorization url on your server to return a standard response similar to the one
   below:

```html
<html>
<head></head>
<body>
  <script>
    window.addEventListener("message", function (event) {
      if (event.data.message === "requestResult") {
        event.source.postMessage({"message": "deliverResult", result: {...} }, "*");
      }
    });
  </script>
</body>
</html>
```

Your server needs to populate the `result` key with an object to deliver back to the frontend.

