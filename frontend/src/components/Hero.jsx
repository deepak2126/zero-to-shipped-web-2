export default function Hero({ children }) {
  return (
    <section className="hero">
      <div className="container">
        <div className="pill">
          <span className="pill-dot"></span>
          Resume × Job Description match · no sign-up required
        </div>
        <h1 className="hero-title">
          See how your resume <span className="gradient-text">matches the job</span> in seconds.
        </h1>
        <p className="hero-subtitle">
          Drop in your resume PDF, paste the job description, and instantly see a
          match score, the skills you already have, and the ones holding you back.
        </p>
        {children}
      </div>
    </section>
  );
}
