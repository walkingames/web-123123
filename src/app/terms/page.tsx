import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { ogImageAlt, termsEffectiveDate } from "@/lib/site";
import "../privacy/privacy.css";

const route = "/terms";
const title = "Terms of Service — Walkin and WalkinGames";
const description =
  "The rules for playing Walkin: your account and save, in-game currencies and purchases, ads, fair play, and your rights as a consumer.";
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
  { id: "who-we-are", title: "Who we are" },
  { id: "agreement", title: "These terms" },
  { id: "age", title: "Age and parents" },
  { id: "licence", title: "Your licence to play" },
  { id: "account", title: "Your account and save" },
  { id: "virtual-items", title: "Currencies and virtual items" },
  { id: "purchases", title: "Purchases and refunds" },
  { id: "ads", title: "Ads" },
  { id: "fair-play", title: "Fair play" },
  { id: "changes-to-game", title: "Updates and availability" },
  { id: "liability", title: "Our liability" },
  { id: "ending", title: "Ending this agreement" },
  { id: "law", title: "Law and disputes" },
  { id: "changes", title: "Changes to these terms" },
  { id: "contact", title: "Contact" },
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
const Ext = ({ href, children }: { href: string; children: ReactNode }) => (
  <a href={href} target="_blank" rel="noopener noreferrer">
    {children}
  </a>
);

export default function TermsPage() {
  return (
    <div className="privacy-page">
      <header className="privacy-nav shell">
        <Link href="/" className="wordmark" aria-label="WalkinGames home">
          <span className="wordmark__mark" aria-hidden="true">W</span>
          <span>WalkinGames</span>
        </Link>
        <span className="privacy-nav__label">Legal / Terms</span>
        <Link href="/" className="text-link">
          Back to WalkinGames <span aria-hidden="true">↗</span>
        </Link>
      </header>

      <main id="main">
        <section className="privacy-hero shell" aria-labelledby="terms-title">
          <div className="privacy-hero__eyebrow">
            <p className="section-kicker">Walkin / Terms of service</p>
            <span>Effective {termsEffectiveDate}</span>
          </div>
          <h1 id="terms-title">
            Terms of
            <br />
            <span>service.</span>
          </h1>
          <p className="privacy-hero__lead">
            The rules for playing Walkin: your account, what you can buy in it, ads, fair play, and the
            rights you keep as a consumer.
          </p>
          <dl className="privacy-meta">
            <div>
              <dt>Effective date</dt>
              <dd>{termsEffectiveDate}</dd>
            </div>
            <div>
              <dt>Applies to</dt>
              <dd>The game Walkin on Android and iOS</dd>
            </div>
            <div>
              <dt>Provided by</dt>
              <dd>Emrehan Dalaman and Yusuf Okuducu, together as Walkin Games</dd>
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
                  Walkin is made by Emrehan Dalaman and Yusuf Okuducu, working together as{" "}
                  <strong>Walkin Games</strong> (“we”, “us”). Our address is 54292 Trier, Germany, and you
                  can reach us at <Mail />.
                </p>
              </Section>

              <Section n={2}>
                <p>
                  These terms are the agreement between you and us when you download or play Walkin. By
                  playing, you accept them. If you do not accept them, please do not play, and uninstall
                  the game.
                </p>
                <p>
                  How we handle your data is explained in our{" "}
                  <Link href="/privacy">privacy policy</Link>, which is not part of these terms. The store
                  you downloaded the game from (Google Play or the App Store) has its own terms, which
                  also apply to your download and your payments.
                </p>
                <p>
                  Nothing in these terms takes away rights that the consumer law of your country gives
                  you and that cannot be waived by agreement.
                </p>
              </Section>

              <Section n={3}>
                <p>
                  Walkin can be played at any age. If you are below the age at which you can agree to a
                  contract on your own where you live, a parent or guardian must accept these terms for
                  you and is responsible for your use of the game.
                </p>
                <p>
                  Purchases go through Google Play or the App Store, where parents can require approval
                  for every purchase (for example with Google Family Link or Apple’s Ask to Buy). We
                  recommend turning that on for a child’s device.
                </p>
              </Section>

              <Section n={4}>
                <p>
                  We give you a personal, non-exclusive, non-transferable, revocable licence to install
                  and play Walkin on devices you own or control, for your own non-commercial
                  entertainment. The game, its code, art, music, characters and everything else in it
                  belong to us or our licensors; you get a right to play it, not ownership of it.
                </p>
                <p>You may not, and may not help anyone else to:</p>
                <ul>
                  <li>copy, sell, rent or redistribute the game or any part of it;</li>
                  <li>
                    decompile, reverse engineer or modify the game, except where the law expressly allows
                    it;
                  </li>
                  <li>use the game or its content for commercial purposes without our written consent.</li>
                </ul>
                <p>
                  You are welcome to stream, record and share videos of yourself playing Walkin, including
                  on monetised channels.
                </p>
              </Section>

              <Section n={5}>
                <p>
                  The game signs you in automatically with an anonymous player account so your progress
                  can be saved. On Android, your save can also be copied to Google Play Games Saved Games
                  so it follows you to a new device. You are responsible for the devices and store
                  accounts you play on.
                </p>
                <p>
                  If you delete the game’s data, reset your device or ask us to delete your data, your
                  progress, currencies and items may be lost for good. Purchases of permanent items
                  (packs, Remove Ads, career passes) can be restored from the store with{" "}
                  <strong>Restore purchases</strong>; currencies and consumable items cannot.
                </p>
              </Section>

              <Section n={6}>
                <p>
                  Walkin has in-game currencies and items, such as gems, coins, keys, guitars, revive
                  pizzas, characters, weapon skins and crates. You can earn some of them by playing and
                  buy some of them with real money.
                </p>
                <ul>
                  <li>
                    They are a licence to use content inside the game. They are not money, have no value
                    outside the game, and cannot be exchanged for money, sold, traded or transferred to
                    another player.
                  </li>
                  <li>
                    Crates give a random reward. The odds for each rarity are shown in the game on the
                    crate’s ODDS button before you open it.
                  </li>
                  <li>
                    We may change how currencies and items work, what they cost in the game and what they
                    unlock, for example to balance the game. Where a change takes away something you paid
                    real money for, we will give you a fair replacement or a refund.
                  </li>
                </ul>
              </Section>

              <Section n={7}>
                <p>
                  Real-money purchases are made through Google Play or the App Store and are processed by
                  them. Prices are shown in the game in your local currency before you buy. Once the store
                  confirms a payment, the game delivers the content right away.
                </p>
                <p>
                  <strong>Refunds.</strong> Refunds are handled by the store you paid through, under its
                  refund policy:{" "}
                  <Ext href="https://support.google.com/googleplay/answer/2479637">Google Play</Ext> or{" "}
                  <Ext href="https://support.apple.com/118223">the App Store</Ext>. If a purchase did not
                  arrive or something went wrong with it, write to us at <Mail /> with your order number and
                  we will fix it.
                </p>
                <p>
                  <strong>Your consumer rights.</strong> If you are a consumer in the EU, the EEA or the
                  UK, you keep all the rights the law gives you, including your rights if digital content
                  is faulty or not delivered. Where the law gives you a right to withdraw from a purchase
                  of digital content, that right ends once delivery has started with your express consent
                  and your acknowledgement that you lose it.
                </p>
                <p>
                  A refunded or charged-back purchase may be removed from your game, together with what it
                  delivered.
                </p>
              </Section>

              <Section n={8}>
                <p>
                  Walkin is free to play and shows ads. Some ads are optional: you choose to watch them for
                  a reward. If an optional ad does not finish or fails to load, the reward may not be
                  given. Buying <strong>Remove Ads</strong>, or any other real-money purchase, turns off
                  the full-screen ads that play between runs; optional reward ads stay available. Ads are
                  provided by advertising partners named in our{" "}
                  <Link href="/privacy">privacy policy</Link>, and we are not responsible for the products
                  they advertise.
                </p>
              </Section>

              <Section n={9}>
                <p>Keep the game fair for everyone. You may not:</p>
                <ul>
                  <li>
                    cheat, use hacks, bots, modified versions of the game or any tool that gives you an
                    unfair advantage;
                  </li>
                  <li>exploit bugs instead of reporting them to us;</li>
                  <li>
                    obtain currencies or items through unauthorised means, such as unofficial sellers or
                    fraudulent payments;
                  </li>
                  <li>interfere with the game, its servers or other players.</li>
                </ul>
                <p>
                  If you break these rules, we may remove what was gained through it, reset scores, or
                  suspend or close your account, depending on how serious it is. If you think we got it
                  wrong, write to us at <Mail /> and we will look at it again.
                </p>
              </Section>

              <Section n={10}>
                <p>
                  We update Walkin regularly and may add, change or remove content and features. Some
                  updates may be required to keep playing. The game may sometimes be unavailable, for
                  example for maintenance or because a service we rely on is down.
                </p>
                <p>
                  If we ever stop offering Walkin, we will announce it in the game or on walkingames.com at
                  least 60 days before online features stop.
                </p>
              </Section>

              <Section n={11}>
                <p>
                  We are fully liable for damage caused intentionally or by gross negligence, for injury
                  to life, body or health, and under product liability law.
                </p>
                <p>
                  For slight negligence we are liable only if we breach an obligation that is essential to
                  this agreement and that you can rely on, and then only for the damage that was typical
                  and foreseeable when you accepted these terms. Otherwise we are not liable for slight
                  negligence.
                </p>
                <p>
                  These limits do not reduce your statutory rights for faulty or missing digital content.
                </p>
              </Section>

              <Section n={12}>
                <p>
                  You can end this agreement at any time by uninstalling the game; you can also ask us to
                  delete your data as described in the <Link href="/privacy#deleting">privacy policy</Link>
                  . We may end it or suspend your access if you seriously or repeatedly break these terms,
                  and we will tell you why where we can.
                </p>
              </Section>

              <Section n={13}>
                <p>
                  These terms are governed by German law. If you are a consumer, this does not take away
                  the protection of the mandatory consumer law of the country where you live, and you can
                  bring a claim in the courts there.
                </p>
                <p>
                  Before going to court, please write to us at <Mail /> — most problems are solved quickly
                  that way. We are not obliged and not willing to take part in dispute resolution before a
                  consumer arbitration board.
                </p>
              </Section>

              <Section n={14}>
                <p>
                  We may update these terms, for example when the game or the law changes. The date at the
                  top shows the current version. If a change matters to you, we will tell you in the game
                  before it takes effect, and you can stop playing if you do not agree.
                </p>
              </Section>

              <Section n={15}>
                <p>
                  Walkin Games, Emrehan Dalaman, 54292 Trier, Germany. Email: <Mail />.
                </p>
              </Section>
            </article>
          </div>
        </div>
      </main>
    </div>
  );
}
