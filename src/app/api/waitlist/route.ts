import {
  googleClientId,
  normaliseEmail,
  waitlistNotificationEmail,
  type WaitlistResult,
} from "@/lib/waitlist";

export const runtime = "nodejs";

const RESEND_ENDPOINT = "https://api.resend.com/emails";
const GOOGLE_TOKENINFO_ENDPOINT = "https://oauth2.googleapis.com/tokeninfo";

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_SWEEP_AT = 2000;

const rateBuckets = new Map<string, number[]>();

function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return (forwarded?.split(",")[0] ?? request.headers.get("x-real-ip") ?? "unknown").trim();
}

function sweep(now: number) {
  for (const [key, stamps] of rateBuckets) {
    const recent = stamps.filter((at) => now - at < RATE_LIMIT_WINDOW_MS);
    if (recent.length === 0) rateBuckets.delete(key);
    else rateBuckets.set(key, recent);
  }
}

function isRateLimited(key: string): boolean {
  const now = Date.now();
  if (rateBuckets.size > RATE_LIMIT_SWEEP_AT) sweep(now);
  const recent = (rateBuckets.get(key) ?? []).filter((at) => now - at < RATE_LIMIT_WINDOW_MS);
  if (recent.length >= RATE_LIMIT_MAX) {
    rateBuckets.set(key, recent);
    return true;
  }
  recent.push(now);
  rateBuckets.set(key, recent);
  return false;
}

async function resolveGoogleEmail(idToken: string): Promise<string | null> {
  if (!googleClientId) return null;
  const response = await fetch(
    `${GOOGLE_TOKENINFO_ENDPOINT}?id_token=${encodeURIComponent(idToken)}`,
    { cache: "no-store" },
  );
  if (!response.ok) return null;

  const claims = (await response.json()) as {
    aud?: string;
    email?: string;
    email_verified?: string | boolean;
  };
  const verified = claims.email_verified === true || claims.email_verified === "true";
  if (!verified || claims.aud !== googleClientId) return null;
  return normaliseEmail(claims.email);
}

function notificationHtml(email: string, via: "google" | "email", referer: string): string {
  const escape = (value: string) =>
    value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

  const display = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  }).format(new Date());

  const row = (label: string, value: string) =>
    `<tr>
      <td style="padding:12px 0;border-top:1px solid #ffffff29;color:#adb8c5;font:11px/1.5 ui-monospace,'SF Mono',Menlo,Consolas,monospace;letter-spacing:.1em;text-transform:uppercase;width:132px;vertical-align:top">${label}</td>
      <td style="padding:12px 0;border-top:1px solid #ffffff29;color:#f4f4ed;font-size:14px;line-height:1.5;word-break:break-word">${value}</td>
    </tr>`;

  return `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Waitlist signup</title></head>
<body bgcolor="#090d12" style="margin:0;padding:0;background:#090d12;color:#f4f4ed;-webkit-text-size-adjust:100%">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#090d12" style="background:#090d12;color:#f4f4ed">
<tr><td align="center" style="padding:32px 16px">
  <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;background:#090d12;color:#f4f4ed;border:1px solid #ffffff29;border-radius:8px;overflow:hidden">

    <tr><td bgcolor="#ecff00" style="background:#ecff00;padding:13px 24px;font:11px/1.4 ui-monospace,'SF Mono',Menlo,Consolas,monospace;letter-spacing:.14em;text-transform:uppercase;color:#000">
      New waitlist signup
    </td></tr>

    <tr><td style="padding:30px 24px 0">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
        <td style="vertical-align:top">
          <p style="margin:0 0 14px;color:#ecff00;font:10px/1.5 ui-monospace,'SF Mono',Menlo,Consolas,monospace;letter-spacing:.12em;text-transform:uppercase">Walkin / Waitlist</p>
          <h1 style="margin:0;font:400 30px/1.1 Impact,Haettenschweiler,'Arial Narrow Bold',sans-serif;letter-spacing:-.01em;color:#f4f4ed;text-transform:uppercase;word-break:break-word">${escape(email)}</h1>
        </td>
        <td align="right" width="96" style="width:96px;vertical-align:top">
          <img src="https://walkingames.com/images/walkin-icon.png" width="72" alt="Walkin" style="display:block;width:72px;height:auto;border-radius:10px;border:1px solid #ffffff29">
        </td>
      </tr></table>
    </td></tr>

    <tr><td style="padding:26px 24px 0">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        ${row("Signed up via", via === "google" ? "Google account (one tap)" : "Email form")}
        ${row("Received", `${escape(display)} UTC`)}
        ${row("Page", escape(referer))}
      </table>
    </td></tr>

    <tr><td style="padding:26px 24px 0">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid #ffffff29">
        <tr><td style="padding:18px 0 0;color:#adb8c5;font:10px/1.7 ui-monospace,'SF Mono',Menlo,Consolas,monospace;letter-spacing:.06em">
          Hit reply on this email to reach ${escape(email)} directly.<br>
          <span style="color:#ffffff66">walkingames.com/waitlist</span>
        </td></tr>
      </table>
    </td></tr>

  </table>
</td></tr></table>
</body></html>`;
}

async function deliver(email: string, via: "google" | "email", referer: string) {
  const response = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.WAITLIST_FROM_EMAIL ?? "Walkin Waitlist <onboarding@resend.dev>",
      to: [waitlistNotificationEmail],
      reply_to: email,
      subject: `Waitlist signup — ${email}`,
      html: notificationHtml(email, via, referer),
    }),
  });
  return response;
}

function fail(error: string, status: number) {
  return Response.json({ ok: false, error } satisfies WaitlistResult, { status });
}

export async function POST(request: Request) {
  let payload: Record<string, unknown>;
  try {
    payload = (await request.json()) as Record<string, unknown>;
  } catch {
    return fail("Invalid request.", 400);
  }

  if (typeof payload.company === "string" && payload.company.length > 0) {
    return Response.json({ ok: true } satisfies WaitlistResult);
  }

  const email = normaliseEmail(payload.email);
  if (!email) return fail("Enter a valid email address.", 400);

  // Counted after validation so a mistyped address does not burn the visitor's quota.
  if (isRateLimited(clientKey(request))) {
    return fail("Too many attempts. Try again later.", 429);
  }

  const idToken = typeof payload.googleIdToken === "string" ? payload.googleIdToken : "";
  let via: "google" | "email" = "email";

  if (idToken) {
    const googleEmail = await resolveGoogleEmail(idToken);
    if (!googleEmail) return fail("Google sign-in could not be verified. Use the email field instead.", 400);
    via = "google";
  }

  if (!process.env.RESEND_API_KEY) {
    console.error("[waitlist] RESEND_API_KEY is missing; signup not delivered.", { email });
    return fail("The waitlist is not available right now. Please try again shortly.", 503);
  }

  const referer = request.headers.get("referer") ?? "unknown";

  try {
    const response = await deliver(email, via, referer);
    if (!response.ok) {
      console.error("[waitlist] Resend rejected the message.", response.status, await response.text());
      return fail("We could not save that. Please try again.", 502);
    }
  } catch (error) {
    console.error("[waitlist] Resend request failed.", error);
    return fail("We could not save that. Please try again.", 502);
  }

  return Response.json({ ok: true } satisfies WaitlistResult);
}