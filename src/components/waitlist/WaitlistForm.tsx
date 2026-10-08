"use client";

import Script from "next/script";
import { useCallback, useRef, useState, useSyncExternalStore } from "react";
import type { FormEvent } from "react";
import { googleClientId, type WaitlistResult } from "@/lib/waitlist";

type GoogleCredentialResponse = { credential?: string };

type GoogleAccountsId = {
  initialize: (config: {
    client_id: string;
    callback: (response: GoogleCredentialResponse) => void;
  }) => void;
  renderButton: (parent: HTMLElement, options: Record<string, string | number>) => void;
};

declare global {
  interface Window {
    google?: { accounts?: { id?: GoogleAccountsId } };
  }
}

const JOINED_KEY = "walkin-waitlist-joined";
const JOINED = "1";
const NOT_JOINED = null;

const joinListeners = new Set<() => void>();

function subscribeToJoined(onChange: () => void) {
  joinListeners.add(onChange);
  window.addEventListener("storage", onChange);
  return () => {
    joinListeners.delete(onChange);
    window.removeEventListener("storage", onChange);
  };
}

function readJoined(): string | null {
  try {
    return window.localStorage.getItem(JOINED_KEY) === JOINED ? JOINED : NOT_JOINED;
  } catch {
    return NOT_JOINED;
  }
}

function setJoined(joined: boolean) {
  try {
    if (joined) window.localStorage.setItem(JOINED_KEY, JOINED);
    else window.localStorage.removeItem(JOINED_KEY);
  } catch {}
  for (const onChange of joinListeners) onChange();
}

export default function WaitlistForm() {
  const joined = useSyncExternalStore(subscribeToJoined, readJoined, () => NOT_JOINED);
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const googleMountRef = useRef<HTMLDivElement>(null);

  const submit = useCallback(async (payload: { email: string; googleIdToken?: string }) => {
    setSubmitting(true);
    setError(null);
    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as WaitlistResult;
      if (!response.ok || !result.ok) {
        setSubmitting(false);
        setError(result.ok ? "Something went wrong. Please try again." : result.error);
        return;
      }
      setEmail("");
      setSubmitting(false);
      setJoined(true);
    } catch {
      setSubmitting(false);
      setError("Connection lost. Please try again.");
    }
  }, []);

  const handleGoogleCredential = useCallback(
    (response: GoogleCredentialResponse) => {
      if (!response.credential) return;
      void submit({ email: "", googleIdToken: response.credential });
    },
    [submit],
  );

  const renderGoogleButton = useCallback(() => {
    const id = window.google?.accounts?.id;
    const mount = googleMountRef.current;
    if (!id || !mount || !googleClientId || mount.childElementCount > 0) return;
    requestAnimationFrame(() => {
      id.initialize({ client_id: googleClientId, callback: handleGoogleCredential });
      id.renderButton(mount, {
        type: "standard",
        theme: "filled_black",
        size: "large",
        shape: "rectangular",
        text: "continue_with",
        width: Math.max(200, Math.min(mount.offsetWidth, 400)),
      });
    });
  }, [handleGoogleCredential]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void submit({ email });
  };

  if (joined) {
    return (
      <div className="waitlist-form waitlist-form--joined" role="status">
        <span className="waitlist-form__check" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="m4 12.5 5.5 5.5L20 7" />
          </svg>
        </span>
        <h2 className="waitlist-form__title">You&apos;re on the list.</h2>
        <p className="waitlist-form__note">
          We&apos;ll write to your inbox when there is something worth opening.
        </p>
        <button type="button" className="waitlist-form__reset" onClick={() => setJoined(false)}>
          Not you? Join with another email
        </button>
      </div>
    );
  }

  return (
    <div className="waitlist-form">
      <div className="waitlist-form__head">
        <span className="section-kicker">Waitlist / 001</span>
        <h2 className="waitlist-form__title">Join the waitlist</h2>
        <p className="waitlist-form__note">
          One click if you already have a Google account, or just type your email.
        </p>
      </div>

      {googleClientId ? (
        <>
          <Script
            src="https://accounts.google.com/gsi/client"
            strategy="afterInteractive"
            onReady={renderGoogleButton}
            onLoad={renderGoogleButton}
          />
          <div className="waitlist-form__google" ref={googleMountRef} />
          <div className="waitlist-form__rule" aria-hidden="true">
            <span>or use your email</span>
          </div>
        </>
      ) : null}

      <form className="waitlist-form__fields" onSubmit={handleSubmit} noValidate>
        <label className="waitlist-form__label" htmlFor="waitlist-email">
          Email address
        </label>
        <div className="waitlist-form__row">
          <input
            id="waitlist-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            autoFocus
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            placeholder="you@example.com"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              if (error) setError(null);
            }}
            required
          />
          <input
            className="waitlist-form__trap"
            name="company"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
          />
          <button type="submit" className="button button--solid" disabled={submitting}>
            <span>{submitting ? "Joining…" : "Join the waitlist"}</span>
            <span className="button__icon" aria-hidden="true">
              <svg viewBox="0 0 20 20" fill="none">
                <path d="m7 5 5 5-5 5" />
              </svg>
            </span>
          </button>
        </div>
        <p className="waitlist-form__status" role="status" aria-live="polite">
          {error ?? "No spam. No reselling. Unsubscribe in one click."}
        </p>
      </form>
    </div>
  );
}