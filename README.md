# scriptkit-octokit

> An Octokit constructor with OAuth authentication for Script Kit

[![@latest](https://img.shields.io/npm/v/scriptkit-octokit.svg)](https://www.npmjs.com/package/scriptkit-octokit)
[![Build Status](https://github.com/gr2m/scriptkit-octokit/workflows/Test/badge.svg)](https://github.com/gr2m/scriptkit-octokit/actions?query=workflow%3ATest+branch%3Amain)

## usage

<table>
<tbody valign=top align=left>
<tr><th>

Browsers

</th><td width=100%>

`scriptkit-octokit` is not meant for browser usage.

</td></tr>
<tr><th>

Node

</th><td>

`scriptkit-octokit` is not meant for Node usage.

</td></tr>
</tbody>
</table>

```js
const octokit = new Octokit({
  auth: {
    // optional: set required scopes
    scopes: ["repo", "user", "notifications"],
    // optional: set a custom environmen variable name,
    // defaults to "GITHUB_TOKEN_SCOPE1_SCOPE2_etc".
    // Set to false to not persist the token
    env: "GITHUB_TOKEN_MY_APP",
  },
});

// calling octokit.auth({ type: "oauth" }) or sending any request will
// start the OAuth Device Flow to create a new token
octokit.auth({ type: "oauth" });
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md)

## License

[MIT](LICENSE)
