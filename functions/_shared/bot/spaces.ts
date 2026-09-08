import { AwsClient } from "aws4fetch";
import type { Env } from "./types";

const requireSpacesConfig = (env: Env) => {
  const config = {
    key: env.DO_SPACES_KEY,
    secret: env.DO_SPACES_SECRET,
    bucket: env.DO_SPACES_BUCKET,
    region: env.DO_SPACES_REGION ?? "nyc3",
    endpoint: (env.DO_SPACES_ENDPOINT ?? `${env.DO_SPACES_REGION ?? "nyc3"}.digitaloceanspaces.com`).replace(
      /^https?:\/\//,
      "",
    ),
    publicBaseUrl: env.DO_SPACES_PUBLIC_BASE_URL,
    uploadPrefix: (env.DO_SPACES_UPLOAD_PREFIX ?? "site-assets/telegram-bot").replace(/^\/+|\/+$/g, ""),
  };

  if (!config.key || !config.secret || !config.bucket) {
    throw new Error(
      "DigitalOcean Spaces não configurado. Defina DO_SPACES_KEY, DO_SPACES_SECRET e DO_SPACES_BUCKET.",
    );
  }

  return config;
};

export const buildSpacesKey = (env: Env, filename: string) => {
  const config = requireSpacesConfig(env);
  return `${config.uploadPrefix}/${filename.replace(/^\/+/, "")}`;
};

export const uploadImageToSpaces = async (
  env: Env,
  key: string,
  body: ArrayBuffer,
  contentType: string,
) => {
  const config = requireSpacesConfig(env);
  const client = new AwsClient({
    accessKeyId: config.key,
    secretAccessKey: config.secret,
    service: "s3",
    region: config.region,
  });

  const targetUrl = `https://${config.bucket}.${config.endpoint}/${key}`;
  const response = await client.fetch(targetUrl, {
    method: "PUT",
    headers: {
      "content-type": contentType,
      "x-amz-acl": "public-read",
    },
    body,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Falha ao enviar imagem para o Spaces (${response.status}): ${errorText}`);
  }

  const publicBase = config.publicBaseUrl?.replace(/\/$/, "");
  return publicBase ? `${publicBase}/${key}` : targetUrl;
};
