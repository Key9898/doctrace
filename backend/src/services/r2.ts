import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

function readR2Env(): {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
} | null {
  const accountId = process.env.R2_ACCOUNT_ID?.trim() ?? "";
  const accessKeyId = process.env.R2_ACCESS_KEY_ID?.trim() ?? "";
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY?.trim() ?? "";
  const bucket = process.env.R2_BUCKET?.trim() ?? "";
  if (!accountId || !accessKeyId || !secretAccessKey || !bucket) {
    return null;
  }
  return { accountId, accessKeyId, secretAccessKey, bucket };
}

export function isR2Configured(): boolean {
  return readR2Env() !== null;
}

let cachedClient: S3Client | null = null;
let cachedBucket: string | null = null;

function getClient(): { client: S3Client; bucket: string } | null {
  const env = readR2Env();
  if (!env) {
    cachedClient = null;
    cachedBucket = null;
    return null;
  }
  if (!cachedClient || cachedBucket !== env.bucket) {
    cachedClient = new S3Client({
      region: "auto",
      endpoint: `https://${env.accountId}.r2.cloudflarestorage.com`,
      forcePathStyle: true,
      credentials: {
        accessKeyId: env.accessKeyId,
        secretAccessKey: env.secretAccessKey,
      },
    });
    cachedBucket = env.bucket;
  }
  return { client: cachedClient, bucket: env.bucket };
}

export async function putEvidenceObject(
  key: string,
  bytes: Buffer,
  mimeType: string,
): Promise<void> {
  const configured = getClient();
  if (!configured) {
    throw new Error("r2_unconfigured");
  }
  await configured.client.send(
    new PutObjectCommand({
      Bucket: configured.bucket,
      Key: key,
      Body: bytes,
      ContentType: mimeType || "application/octet-stream",
    }),
  );
}
