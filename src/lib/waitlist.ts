export const waitlistRoute = "/waitlist";

export const waitlistNotificationEmail = "business@walkingames.com";

export const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";

export const waitlistPerks = [
  {
    index: "01",
    title: "Play first",
    body: "Closed test invites go to the list before any public announcement.",
  },
  {
    index: "02",
    title: "Shape the build",
    body: "Surveys and balance feedback land with the people already invested.",
  },
  {
    index: "03",
    title: "Keep the signal",
    body: "One email when there is real news. Nothing else, ever.",
  },
] as const;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function normaliseEmail(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const email = value.trim().toLowerCase();
  if (email.length > 254 || !EMAIL_PATTERN.test(email)) return null;
  return email;
}

export type WaitlistSignup = {
  email: string;
  via: "google" | "email";
};

export type WaitlistResult = { ok: true } | { ok: false; error: string };