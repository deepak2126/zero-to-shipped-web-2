export default function Hero({ children }) {
  return (
    <section className="hero">
      <div className="container">
        <div className="pill">
          <span className="pill-dot"></span>
          Mock parser · no sign-up required
        </div>
        <h1 className="hero-title">
          Know your resume's <span className="gradient-text">real score</span> in seconds.
        </h1>
        <p className="hero-subtitle">
          Drop in your resume PDF and instantly see a score out of 100, the skills
          you already have, and the ones holding you back. Fast, private, and
          completely free to try.
        </p>
        {children}
      </div>
    </section>
  );
}
