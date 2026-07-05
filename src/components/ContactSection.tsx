export default function ContactSection() {
  return (
    <section
      id="contacts"
      className="scroll-offset relative px-4 sm:px-6 py-20 md:py-32"
      aria-labelledby="contact-heading"
    >
      <div className="mx-auto max-w-3xl text-center rounded-2xl bg-card-bg backdrop-blur-md border border-border p-6 sm:p-8 md:p-12">
        <h2
          id="contact-heading"
          className="mb-3 sm:mb-4 text-[10px] sm:text-xs uppercase tracking-[0.3em] text-muted"
        >
          Contact
        </h2>
        <p className="mb-4 sm:mb-6 text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground text-pretty">
          Get in touch
        </p>
        <p className="mx-auto mb-6 sm:mb-8 max-w-xl text-muted leading-relaxed text-xs sm:text-sm text-pretty">
          Have a question, collaboration idea, or just want to say hi?
          We&apos;d love to hear from you.
        </p>
        <a
          href="mailto:hello@walkingames.com"
          className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full border border-border text-foreground text-xs sm:text-sm hover:bg-border transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
        >
          hello@walkingames.com
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a>
      </div>

      <footer className="mt-12 sm:mt-16 text-center text-[10px] sm:text-xs text-muted" role="contentinfo">
        <p>&copy; {new Date().getFullYear()} WalkinGames. All rights reserved.</p>
      </footer>
    </section>
  );
}
