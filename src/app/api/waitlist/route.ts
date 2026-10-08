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

  return `<div style="background:#090d12;padding:32px;font-family:Helvetica,Arial,sans-serif;color:#f4f4ed">
  <div style="max-width:560px;margin:0 auto;border:1px solid #ffffff29;border-radius:8px;overflow:hidden">
    <div style="background:#ecff00;padding:14px 24px;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#000">
      New waitlist signup
    </div>
    <div style="padding:28px 24px">
      <p style="margin:0 0 10px;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#adb8c5">Walkin / Waitlist</p>
      <h1 style="margin:0 0 24px;font-size:28px;line-height:1.2">${escape(email)}</h1>
      <table style="width:100%;border-collapse:collapse;font-size:13px">
        <tr><td style="padding:10px 0;border-top:1px solid #ffffff29;color:#adb8c5;width:120px">Signed up via</td><td style="padding:10px 0;border-top:1px solid #ffffff29">${via === "google" ? "Google account (one tap)" : "Email form"}</td></tr>
        <tr><td style="padding:10px 0;border-top:1px solid #ffffff29;color:#adb8c5">Received</td><td style="padding:10px 0;border-top:1px solid #ffffff29">${escape(new Date().toISOString())}</td></tr>
        <tr><td style="padding:10px 0;border-top:1px solid #ffffff29;color:#adb8c5">Page</td><td style="padding:10px 0;border-top:1px solid #ffffff29;word-break:break-all">${escape(referer)}</td></tr>
      </table>
    </div>
  </div>
</div>`;
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