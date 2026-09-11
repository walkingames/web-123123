"use client";

export default function Error({ unstable_retry }: { unstable_retry: () => void }) {
  return (
    <main className="error-page shell">
      <p className="section-kicker">WalkinGames</p>
      <h1>A brief pause.</h1>
      <p>Something interrupted this page. Please try again.</p>
      <button className="button button--solid" onClick={() => unstable_retry()}>Try again</button>
      <a className="text-link" href="mailto:hello@walkingames.com">Contact the studio</a>
    </main>
  );
}
