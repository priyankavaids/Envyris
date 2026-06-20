export interface SendResendEmailOptions {
  to: string | string[];
  subject: string;
  text: string;
  html?: string;
}

export async function sendResendEmail(options: SendResendEmailOptions) {
  const response = await fetch('/api/resend-email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(options),
  });

  if (!response.ok) {
    const body = await response.text();
    const message = `Resend proxy error: ${response.status} ${response.statusText} - ${body}`;
    if (response.status === 403 && body.includes('domain is not verified')) {
      throw new Error(
        `${message}. Please verify your sending domain in the Resend dashboard under Domains, then set VITE_RESEND_FROM_EMAIL to a verified address.`
      );
    }
    throw new Error(message);
  }

  return response.json();
}
