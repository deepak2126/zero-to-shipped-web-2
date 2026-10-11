import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import ParserCard from "./components/ParserCard.jsx";
import HowItWorks from "./components/HowItWorks.jsx";
import Footer from "./components/Footer.jsx";

export default function App() {
  return (
    <>
      {/* Decorative background */}
      <div className="bg-grid" aria-hidden="true"></div>
      <div className="bg-glow" aria-hidden="true"></div>

      <Header />

      <main>
        <Hero>
          <ParserCard />
        </Hero>
        <HowItWorks />
      </main>

      <Footer />
    </>
  );
}
