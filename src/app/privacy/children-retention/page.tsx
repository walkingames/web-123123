import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { PrivacyTable as Table } from "@/components/PrivacyTable";
import { ogImageAlt, privacyEffectiveDate, siteName } from "@/lib/site";
import "../privacy.css";

const route = "/privacy/children-retention";
const title = "Children’s Data Retention Policy — Walkin and WalkinGames";
const description =
  "What personal information the game Walkin can collect from a child, why, and when it is deleted. Part of the WalkinGames privacy policy.";
const email = "support@walkingames.com";

export const metadata: Metadata = {
  title,
  description,
  // Same as the privacy policy: public, but out of search results.
  robots: { index: false, follow: true },
  alternates: { canonical: route },
  openGraph: {
    title,
    description,
    url: route,
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: ogImageAlt }],
  },
  twitter: { card: "summary_large_image", title, description, images: ["/opengraph-image"] },
};

const SECTIONS = [
  { id: "the-law", title: "What the law asks" },
  { id: "what-and-when", title: "What we collect and when it is deleted" },
  { id: "not-collected", title: "What we do not collect" },
  { id: "deletion", title: "How deletion happens" },
  { id: "purpose-ends", title: "When the purpose ends earlier" },
  { id: "third-parties", title: "Third parties" },
  { id: "records", title: "Records" },
  { id: "review", title: "Review" },
] as const;

function Section({ n, children }: { n: number; children: ReactNode }) {
  const { id, title: sectionTitle } = SECTIONS[n - 1];
  return (
    <section id={id} className="privacy-section" aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`}>
        <span className="privacy-num">{String(n).padStart(2, "0")}</span>
        <span>{sectionTitle}</span>
      </h2>
      {children}
    </section>
  );
}

const Mail = ({ to = email }: { to?: string }) => <a href={`mailto:${to}`}>{to}</a>;

export default function ChildrenRetentionPage() {
  return (
    <div className="privacy-page">
      <header className="privacy-nav shell">
        <Link href="/" className="wordmark" aria-label="WalkinGames home">
          <span className="wordmark__mark" aria-hidden="true">W</span>
          <span>WalkinGames</span>
        </Link>
        <span className="privacy-nav__label">Legal / Children’s data</span>
        <Link href="/privacy" className="text-link">
          Back to privacy policy <span aria-hidden="true">↗</span>
        </Link>
      </header>

      <main id="main">
        <section className="privacy-hero shell" aria-labelledby="retention-title">
          <div className="privacy-hero__eyebrow">
            <p className="section-kicker">Walkin / Children’s data retention</p>
            <span>Adopted {privacyEffectiveDate}</span>
          </div>
          <h1 id="retention-title" className="privacy-hero__title--long">
            Children’s
            <br />
            <span>data.</span>
          </h1>
          <p className="privacy-hero__lead">
            What personal information the game can collect from a child, why, and when it is deleted.
            This policy is part of our{" "}
            <Link href="/privacy#children">privacy policy</Link>.
          </p>
          <dl className="privacy-meta">
            <div>
              <dt>Operators</dt>
              <dd>Emrehan Dalaman and Yusuf Okuducu, together as Walkin Games</dd>
            </div>
            <div>
              <dt>Responds to all parent inquiries</dt>
              <dd>
                Emrehan Dalaman, 54292 Trier, Germany,{" "}
                <a href="tel:+4915510871276">+49 15510871276</a>, <Mail />
              </dd>
            </div>
            <div>
              <dt>Applies to</dt>
              <dd>The game Walkin on Android and iOS, and walkingames.com</dd>
            </div>
            <div>
              <dt>Owner and next review</dt>
              <dd>Emrehan Dalaman and Yusuf Okuducu, within 12 months of adoption</dd>
            </div>
            <div>
              <dt>Questions</dt>
              <dd>
                <Mail />
              </dd>
            </div>
          </dl>
        </section>

        <div className="privacy-sheet">
          <div className="shell privacy-layout">
            <nav className="privacy-toc" aria-label="Contents">
              <p className="section-kicker">Contents</p>
              <ol>
                {SECTIONS.map((section, index) => (
                  <li key={section.id}>
                    <a href={`#${section.id}`}>
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      {section.title}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            <article className="privacy-doc">
              <Section n={1}>
                <p>
                  The US Children’s Online Privacy Protection Rule (16 CFR § 312.10) says we may keep
                  personal information collected online from a child only as long as is reasonably
                  necessary for the specific purpose we collected it for. We must delete it securely after
                  that, may never keep it indefinitely, and must have a written retention policy that
                  states the purposes, the business need and a deletion timeframe. “Personal information”
                  includes persistent identifiers such as an IP address or a device identifier.
                </p>
                <p>
                  <strong>Who counts as a child here.</strong> The rule’s line is under 13. Walkin gives
                  the same protection, its <strong>child path</strong>, to everyone below their country’s
                  age of digital consent (13 in the US, up to 16 in the EU), and to anyone before the age
                  screen is answered. This policy covers the whole child path.
                </p>
                <p>
                  <strong>What the game does on the child path.</strong> It collects no name, no contact
                  details, no analytics and no advertising ID. The only personal information that leaves
                  the device for us or our ad and crash-reporting partners is a small set of persistent
                  identifiers used for the game’s <strong>internal operations</strong>: contextual ads, ad
                  frequency capping, fraud prevention and crash reporting. The rule allows this without
                  parental consent as long as nothing else is collected and the identifiers are used for
                  nothing else.
                </p>
              </Section>

              <Section n={2}>
                <Table
                  label="Personal information collected on the child path, why, and when it is deleted"
                  head={["Information", "Collected by", "Purpose and business need", "Deleted"]}
                  rows={[
                    [
                      "IP address, an installation-scoped ID, device and app details (make, model, operating system, language, app version), ad events (requested, shown, tapped, closed, reward)",
                      "ironSource Ads and Unity Ads (Unity Technologies), through LevelPlay mediation",
                      "Serve contextual ads, cap how often an ad is shown, and prevent ad fraud. Ads pay for a free game; caps and fraud checks protect the player and the advertiser.",
                      "By Unity within 12 months at most, Unity’s stated maximum for children’s advertising data.",
                    ],
                    [
                      "The same kinds of data",
                      "Google AdMob, on requests marked child-directed and under the age of consent, with G-rated ads",
                      "Same as above.",
                      "By Google under its retention practice: part of the IP address is removed from advertising logs after 9 months and cookie information after 18 months. Google does not publish a separate deletion period for child-directed requests.",
                    ],
                    [
                      "Installation ID, crash or error report (stack, recent log lines), device details, game version",
                      "Unity Diagnostics (Unity Technologies, our processor)",
                      "Maintain and analyse how the game works, to find and fix crashes.",
                      "90 days, automatically, by Unity.",
                    ],
                    [
                      "An email address and the message, if a child emails us",
                      "Us",
                      "Respond once to the child’s specific request.",
                      "Within 7 days of our reply. It is never used to contact the child again.",
                    ],
                    [
                      "A parent’s email and our reply, when a parent exercises their rights",
                      "Us",
                      "Answer the parent and prove we answered. This is the parent’s information, not the child’s; it is listed so nothing is forgotten.",
                      "12 months after the request is closed.",
                    ],
                  ]}
                />
              </Section>

              <Section n={3}>
                <ul>
                  <li>
                    <strong>No analytics.</strong> The analytics code is not started on the child path.
                  </li>
                  <li>
                    <strong>No advertising ID</strong> (AAID or IDFA). The ad code is told not to read it,
                    and only ad networks in Google Play’s Families Self-Certified Ads SDK program start.
                  </li>
                  <li>
                    <strong>No name, contact details, photo, voice, precise location or free text.</strong>{" "}
                    The game has no fields to type into, no chat, and no camera, microphone or location
                    permission.
                  </li>
                  <li>
                    <strong>No birth date.</strong> The age screen keeps only the age band, on the device.
                  </li>
                  <li>
                    <strong>Nothing to Unity beyond section 2.</strong> We do not use Unity Authentication
                    or Unity Cloud Save, on any age band.
                  </li>
                  <li>
                    <strong>Google Play Games Saved Games.</strong> On Android the game signs in to Google
                    Play Games after the age screen, on every age band, and stores a copy of the save in
                    the player’s own Google account. It goes to Google only, under the account holder’s
                    agreement with Google; we do not receive it and cannot read it. Google decides whether
                    a supervised child may use Play Games, and a refusal leaves the save on the phone in
                    place. Nothing about the Play Games identity reaches analytics or ads. The copy stays
                    until <em>Delete my data</em> or until it is deleted in the Google account, and it
                    survives uninstalling the game.
                  </li>
                  <li>
                    <strong>Data that stays on the device.</strong> The save, the age band, the 7-day
                    technical log and scheduled notifications are not collected online and are outside
                    this policy. They are deleted when the game is uninstalled; the technical log deletes
                    itself after 7 days.
                  </li>
                  <li>
                    <strong>Purchases.</strong> Payment and the order record are handled by Google Play or
                    the App Store under the account holder’s store account, usually a parent’s. We do not
                    export order data for analytics.
                  </li>
                </ul>
              </Section>

              <Section n={4}>
                <Table
                  label="How each kind of data is deleted"
                  head={["Route", "How"]}
                  rows={[
                    [
                      "Automatic expiry",
                      "The vendor’s period in section 2 runs out, and there is nothing for us to do. We confirm once a year that those periods still match the vendors’ published terms.",
                    ],
                    [
                      "The Play Games copy of the save",
                      <>
                        <em key="delete">Delete my data</em> in Settings deletes the Saved Game and stops
                        that install writing another. If the account cannot be reached, the game retries at
                        later launches. It can also be deleted in the Google account. We never hold this
                        copy.
                      </>,
                    ],
                    [
                      "A parent asks us to delete or to stop collection",
                      <>
                        Email <Mail key="mail" />. We reply within 7 days with what we hold and that the
                        advertising data sits with the ad networks, forward the request to Unity (
                        <Mail key="unity" to="DPO@unity3d.com" />) and Google, and close it within 30 days.
                        The game does not show an installation ID, so we can usually delete one child’s
                        crash reports only if the parent can give us that ID; otherwise they expire within
                        90 days. Uninstalling the game stops all further collection.
                      </>,
                    ],
                    [
                      "A child’s email",
                      "We answer, then delete the thread from the mailbox and from Trash within 7 days.",
                    ],
                  ]}
                />
                <p>
                  Deletion inside our own systems uses the provider’s delete function. We never copy
                  children’s data to laptops, spreadsheets or chat tools, so there is nothing local to
                  wipe.
                </p>
              </Section>

              <Section n={5}>
                <p>
                  If we stop using a service, we ask the provider to delete what it holds for our app where
                  its terms allow, and update section 2 the same day.
                </p>
              </Section>

              <Section n={6}>
                <p>
                  Before any third party collects children’s personal information on our behalf, we check
                  that it can keep it confidential and secure, and we keep its written assurances (contract
                  terms, data processing terms, child-directed commitments).
                </p>
              </Section>

              <Section n={7}>
                <p>
                  We keep a short private log of each parent request: the date, what was done and when it
                  was closed, with no child’s identifiers. Each entry is kept for 3 years.
                </p>
              </Section>

              <Section n={8}>
                <p>
                  We review this policy at least every 12 months, and in the same week as any of: a new SDK
                  or service, a new kind of data, a change to the age screen or the child path, a vendor
                  changing its retention terms, or a security incident.
                </p>
                <p>Adopted on {privacyEffectiveDate} by Emrehan Dalaman and Yusuf Okuducu.</p>
              </Section>
            </article>
          </div>
        </div>
      </main>

      <div className="privacy-sheet privacy-sheet--footer">
        <footer className="shell site-footer">
          <Link href="/">WalkinGames</Link>
          <p>Children’s data retention / {siteName}</p>
          <div className="site-footer__links">
            <a href="#main">Back to top ↑</a>
          </div>
        </footer>
      </div>
    </div>
  );
}
