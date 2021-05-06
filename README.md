# scriptkit-octokit

> An Octokit constructor with OAuth authentication for [Script Kit](https://www.scriptkit.com/)

[![@latest](https://img.shields.io/npm/v/scriptkit-octokit.svg)](https://www.npmjs.com/package/scriptkit-octokit)
[![Build Status](https://github.com/gr2m/scriptkit-octokit/workflows/Test/badge.svg)](https://github.com/gr2m/scriptkit-octokit/actions?query=workflow%3ATest+branch%3Amain)

## Usage

Minimal usage

```js
const { Octokit } = await npm("scriptkit-octokit");

const octokit = new Octokit();

// calling octokit.auth({ type: "oauth" }) or sending any request will
// start the OAuth Device Flow to create a new token
octokit.auth({ type: "oauth" });
```

With options

```js
const octokit = new Octokit({
  auth: {
    // The ClientID of your own OAuth App.
    // Default's to @gr2m's "Kit Auth" OAuth App
    clientId?: "34e4eac44e03b0daa82b",
    // Set required scopes
    scopes: ["repo", "user", "notifications"],
    // Set a custom environmen variable name,
    // defaults to "GITHUB_TOKEN_SCOPE1_SCOPE2_etc".
    // Set to false to not persist the token
    env: "GITHUB_TOKEN_MY_APP",
  },
});
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md)

## License

[MIT](LICENSE)
