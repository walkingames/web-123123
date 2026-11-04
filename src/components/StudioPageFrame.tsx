import Link from "next/link";
import type { ReactNode } from "react";
import "./studio-page.css";

export default function StudioPageFrame({ children }: { children: ReactNode }) {
  return (
    <div className="studio-page">
      <header className="studio-page__nav shell">
        <Link href="/" className="wordmark" aria-label="WalkinGames home">
          <span className="wordmark__mark" aria-hidden="true">W</span>
          <span>WalkinGames</span>
        </Link>
        <nav aria-label="Studio pages">
          <Link href="/games/walkin">Walkin</Link>
          <Link href="/games/duskfall-requiem">Duskfall Requiem</Link>
          <Link href="/about">About</Link>
        </nav>
        <Link href="/" className="text-link">Home <span aria-hidden="true">↗</span></Link>
      </header>
      {children}
      <footer className="studio-page__footer shell">
        <Link href="/" className="wordmark" aria-label="WalkinGames home">
          <span className="wordmark__mark" aria-hidden="true">W</span>
          <span>WalkinGames</span>
        </Link>
        <nav aria-label="Footer navigation">
          <Link href="/games/walkin">Walkin</Link>
          <Link href="/games/duskfall-requiem">Duskfall Requiem</Link>
          <Link href="/about">About</Link>
          <Link href="/privacy">Privacy</Link>
        </nav>
        <p>Independent games by WalkinGames.</p>
      </footer>
    </div>
  );
}
