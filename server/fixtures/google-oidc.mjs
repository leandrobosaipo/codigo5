import { generateKeyPairSync, sign } from "node:crypto";

const { privateKey, publicKey } = generateKeyPairSync("rsa", { modulusLength: 2048 });
const jwk = { ...publicKey.export({ format: "jwk" }), kid: "fixture", alg: "RS256" };
const encode = value => Buffer.from(JSON.stringify(value)).toString("base64url");
const originalFetch = globalThis.fetch;
globalThis.fetch = async (url, init) => {
  if (String(url) === "https://www.googleapis.com/oauth2/v3/certs") return Response.json({ keys: [jwk] });
  if (String(url) === "https://oauth2.googleapis.com/token") {
    const [nonce, account] = init.body.get("code").split(":");
    const now = Math.floor(Date.now() / 1000);
    const claims = { nonce, sub: "test-sub", email: account === "wrong" ? "other@codigo5.com.br" : "leandro@codigo5.com.br",
      email_verified: account !== "unverified", iss: "https://accounts.google.com", aud: account === "badaud" ? "wrong" : "fixture-client",
      iat: now, exp: now + 300 };
    const payload = encode({ alg: "RS256", kid: "fixture" }) + "." + encode(claims);
    return Response.json({ id_token: payload + "." + sign("RSA-SHA256", Buffer.from(payload), privateKey).toString("base64url") });
  }
  return originalFetch(url, init);
};
