import twilio from "twilio";

function getClient() {
  return twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );
}

export async function sendSMS({
  to,
  body,
}: {
  to: string;
  body: string;
}) {
  return getClient().messages.create({
    body,
    from: process.env.TWILIO_PHONE_NUMBER,
    to,
  });
}

export async function sendMorningPrompt({
  to,
  prompt,
  appUrl,
}: {
  to: string;
  prompt: string;
  appUrl: string;
}) {
  const body = `${prompt}\n\nTap to open your coach: ${appUrl}/chat`;
  return sendSMS({ to, body });
}
