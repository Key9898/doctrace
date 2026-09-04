const BREVO_SMTP_URL = "https://api.brevo.com/v3/smtp/email";
const OUTBOUND_TIMEOUT_MS = 10_000;
const SENDER_NAME = "DocTrace";
const ACCOUNT_NOTICE_SUBJECT = "DocTrace cloud account";
const ACCOUNT_NOTICE_TEXT =
  "Your optional DocTrace cloud account is available. This message contains no engagement or evidence data.";

function readBrevoEnv(): { apiKey: string; senderEmail: string } | null {
  const apiKey = process.env.BREVO_API_KEY?.trim() ?? "";
  const senderEmail = process.env.BREVO_SENDER_EMAIL?.trim() ?? "";
  if (!apiKey || !senderEmail) {
    return null;
  }
  return { apiKey, senderEmail };
}

export function isBrevoConfigured(): boolean {
  return readBrevoEnv() !== null;
}

export async function sendAccountNotice(toEmail: string): Promise<void> {
  const env = readBrevoEnv();
  if (!env) {
    throw new Error("brevo_unconfigured");
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, OUTBOUND_TIMEOUT_MS);

  try {
    const response = await fetch(BREVO_SMTP_URL, {
      method: "POST",
      headers: {
        "api-key": env.apiKey,
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({
        sender: { email: env.senderEmail, name: SENDER_NAME },
        to: [{ email: toEmail }],
        subject: ACCOUNT_NOTICE_SUBJECT,
        textContent: ACCOUNT_NOTICE_TEXT,
      }),
      signal: controller.signal,
    });
    if (response.status < 200 || response.status >= 300) {
      throw new Error("brevo_failed");
    }
  } finally {
    clearTimeout(timeoutId);
  }
}
