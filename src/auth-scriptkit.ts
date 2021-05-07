import { createOAuthDeviceAuth } from "@octokit/auth-oauth-device";

declare global {
  const copy: Function;
  const arg: Function;
  const cli: Function;
  const env: Record<string, string>;
}

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

const DEFAULT_CLIENT_ID = "149153b71e602700c2f2";
const ENV_TOKEN_PREFIX = "GITHUB_TOKEN";

export function createScriptKitAuth({
  clientId = DEFAULT_CLIENT_ID,
  scopes = [],
  env,
}: StrategyOptions) {
  const deviceAuth = createOAuthDeviceAuth({
    clientType: "oauth-app",
    clientId: clientId,
    scopes,
    onVerification(verification) {
      copy(verification.user_code);
      arg({
        placeholder: `Press <enter> after granting permissions`,
        ignoreBlur: true,
        hint: `
          Open <a href="${verification.verification_uri}">${verification.verification_uri}</a>, paste code from clipboard
        `,
      });
    },
  });

  const envVariableName = env || scopesToEnvName(scopes);

  return Object.assign(
    auth.bind(null, envVariableName, clientId, scopes, deviceAuth),
    {
      hook: hook.bind(null, envVariableName, deviceAuth),
    }
  );
}

async function auth(
  envVariableName: string,
  clientId: string,
  scopes: string[],
  deviceAuth: any
) {
  if (env[envVariableName]) {
    return {
      type: "token",
      tokenType: "oauth",
      clientType: "oauth-app",
      clientId,
      token: env[envVariableName],
      scopes,
    };
  }

  const result = await deviceAuth({ type: "oauth" });

  await cli("set-env-var", envVariableName, result.token);

  return result;
}

function hook(
  envVariableName: string,
  deviceAuth: any,
  request: any,
  route: any,
  parameters?: any
): Promise<any> {
  let endpoint = request.endpoint.merge(route as string, parameters);

  // Do not intercept request to retrieve codes or token
  if (/\/login\/(oauth\/access_token|device\/code)$/.test(endpoint.url)) {
    return request(endpoint);
  }

  if (env[envVariableName]) {
    endpoint.headers.authorization = `token ${env[envVariableName]}`;
    return request(endpoint);
  }

  return deviceAuth
    .hook(request, route, parameters)
    .then(async (response: any) => {
      const result = await deviceAuth({ type: "oauth" });
      await cli("set-env-var", envVariableName, result.token);

      return response;
    });
}

function scopesToEnvName(scopes: string[]) {
  if (scopes.length === 0) return `${ENV_TOKEN_PREFIX}_NO_SCOPES`;

  return [ENV_TOKEN_PREFIX, ...scopes.sort()].join("_").toUpperCase();
}
