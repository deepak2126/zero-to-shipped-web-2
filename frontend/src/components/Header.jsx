export default function Header() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <a className="brand" href="#">
          <span className="brand-mark">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M13 2 4.5 13h6L9 22l9.5-11h-6L13 2Z" fill="url(#boltGrad)" />
              <defs>
                <linearGradient id="boltGrad" x1="4" y1="2" x2="20" y2="22" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#818cf8" />
                  <stop offset="1" stopColor="#22d3ee" />
                </linearGradient>
              </defs>
            </svg>
          </span>
          <span className="brand-text">
            0<span className="brand-accent">to</span>Shipped
          </span>
        </a>
        <nav className="site-nav">
          <a href="#how-it-works">How it works</a>
          <a href="#parser" className="btn btn-ghost">
            Try the parser
          </a>
        </nav>
      </div>
    </header>
  );
}
