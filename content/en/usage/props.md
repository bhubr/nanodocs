# Props

| Prop name          | Type       | Description                                                                                                   |
| ------------------ | ---------- | ------------------------------------------------------------------------------------------------------------- |
| `authorizationUrl` | `string`   | Base URL of the provider's authorization screen                                                               |
| `responseType`     | `string`   | Type of OAuth2 flow. Two possible values: `code` (Authorization Code flow) or `token` (Implicit Grant flow)   |
| `clientId`         | `string`   | Client ID for OAuth application (given by OAuth2 provider)                                                    |
| `redirectUri`      | `string`   | Registered redirect URI for OAuth application (specified by yourself when registering your OAuth2 app)        |
| `scope`            | `string`   | Scope for OAuth2 application. Example: `user:email` (GitHub)                                                  |
| `popupWidth`       | `number`   | Width for the popup window upon clicking the button in px                                                     |
| `popupHeight`      | `number`   | Height for the popup window upon clicking the button in px                                                    |
| `className`        | `string`   | CSS class for the login button                                                                                |
| `buttonText`       | `string`   | Text content for the login button (default: `Login`)                                                          |
| `isCrossOrigin`    | `boolean`  | Is this a cross-origin request? If you're implementing an Authorization Code workflow, **and** redirect to a server app on a different URL than the client app, you'll need to set this to true |
| `extraParams`      | `object`   | Extra query parameters to pass to the OAuth2 login screen. Some providers allow additional parameters. See [issue #39 on the repo](https://github.com/bhubr/react-simple-oauth2-login/issues/39) for details. If you want to add `prompt=consent` to the query string, you need to pass `extraParams={{ prompt: 'consent' }}` as a prop |
| `render`           | `function` | A custom rendering function. An object containing properties for rendering will be passed in as an argument, e.g. `{buttonText: "...", children: [...], className: "...", onClick: func}` |
| `onRequest`        | `function` | Callback for every request                                                                                    |
| `onSuccess`        | `function` | Callback for successful "login". An object will be passed as an argument to the callback, e.g. `{ "code": "..." }` (Auth Code flow) or `{ "access_token": "..." }` |
| `onFailure`        | `function` | Callback for errors raised during login                                                                       |
