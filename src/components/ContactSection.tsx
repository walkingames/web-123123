export default function ContactSection() {
  return (
    <section id="contact" className="contact-section" aria-labelledby="contact-heading">
      <div className="contact-section__inner shell">
        <p className="section-kicker">Contact / Collaborate</p>
        <h2 id="contact-heading">Let&apos;s make the<br /><span>next world.</span></h2>
        <div className="contact-section__bottom">
          <p>
            For partnerships, publishing, press, or simply a good conversation
            about games—our door is open.
          </p>
          <a href="mailto:hello@walkingames.com">
            hello@walkingames.com <span aria-hidden="true">{"\u2197\uFE0E"}</span>
          </a>
        </div>
      </div>

      <footer className="site-footer shell">
        <a href="#about" className="wordmark wordmark--footer" aria-label="WalkinGames - Back to top">
          <span className="wordmark__mark" aria-hidden="true">W</span>
          <span>Walkin<span>Games</span></span>
        </a>
        <p>&copy; {new Date().getFullYear()} WalkinGames. All rights reserved.</p>
        <a href="#about">Back to top ↑</a>
      </footer>
    </section>
  );
}