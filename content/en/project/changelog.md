# ChangeLog

* v0.5.3 (published November 12th, 2021)

    * Fix `peerDependencies`, so as to support React 16-17. Thanks to [arudrakalyan](https://github.com/arudrakalyan)

* v0.5.1 (published August 25th, 2021)

    * Allow to pass extra params in the query string, via the `extraParams` prop. Thanks to [jshthornton](https://github.com/jshthornton)

* v0.5.0 (published June 18th, 2021)

    * Increase default popup's height. Thanks to [tennox](https://github.com/tennox)
    * Provide optional `popupWidth` and `popupHeight` props to override the defaults. Thanks to [Coow](https://github.com/Coow)

* v0.4.0 (published June 18th, 2021)

    * **Support cross-origin auth flow**: previous versions worked only if the redirect URI was derived from the frontend app's URL; now you can have a redirect URI poiting to your backend app. Thanks (again) to [rsnyman](https://github.com/rsnyman).
    * Update dev dependencies: ESLint, Enzyme
    * Restore unit tests to working state
    * End-to-end testing of Authorization Code flow (using a Node-based OAuth2 server)
* v0.3.0 (Changes made in May, 2021 - published June 18th, 2021) - thanks to [rsnyman](https://github.com/rsnyman) for both additions:

    * Add `render` prop to customize the login button's appearance
    * Add MIT license
* v0.2.0 (October 25th, 2020):

    * Add support for Implicit Grant flow
    * Improve error handling
    * Provide better example app (with a sample server-side app)
    * Try and provide a decent Readme
* v0.1.x (January to September 2020th):

    * Spin the project off from React GitHub Login
    * Make it support various OAuth2 providers, only for Authorization Code flow
