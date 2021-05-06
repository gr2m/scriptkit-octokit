import { createOAuthDeviceAuth } from "@octokit/auth-oauth-device";

export type StrategyOptions = {
  /** Client ID for your OAuth app */
  clientId?: string;
  /**
   * list of [OAuth scopes](https://docs.github.com/en/developers/apps/scopes-for-oauth-apps#available-scopes).
   * Defaults to no scopes.
   */
  scopes?: string[];
  /**
   * Custom environment variable name.
   * defaults to `GITHUB_TOKEN_SCOPE1_SCOPE2_etc`
   */
  env?: string | false;
};

const DEFAULT_CLIENT_ID = "34e4eac44e03b0daa82b";
const ENV_TOKEN_PREFIX = "GITHUB_TOKEN";

export function createScriptKitAuth({
  clientId = DEFAULT_CLIENT_ID,
  scopes = [],
  env,
}: StrategyOptions) {
  const auth = createOAuthDeviceAuth({
    clientType: "oauth-app",
    clientId: clientId,
    scopes,
    onVerification(verification) {
      // @ts-ignore copy is a global provide by kit
      copy(verification.user_code);
      // @ts-ignore arg is a global provided by kit
      arg({
        placeholder: `Press <enter> after granting permissions`,
        ignoreBlur: true,
        hint: `
          Open <a href="${verification.verification_uri}">${verification.verification_uri}</a>, paste code from clipboard
        `,
      });
    },
  });

  const result = auth({ type: "oauth" });

  if (env !== false) {
    result.then(({ token }) =>
      // @ts-ignore cli is a global provided by kit
      cli("set-env-var", scopesToEnvName(scopes), token)
    );
  }

  return auth;
}

function scopesToEnvName(scopes: string[]) {
  if (scopes.length === 0) return `${ENV_TOKEN_PREFIX}_NO_SCOPES`;

  return [ENV_TOKEN_PREFIX, ...scopes.sort()].join("_").toUpperCase();
}
