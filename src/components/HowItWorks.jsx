export default function HowItWorks() {
  const steps = [
    {
      num: 1,
      title: "Upload your PDF",
      text: "Drag and drop your resume. It never leaves your browser in this demo.",
    },
    {
      num: 2,
      title: "We parse it",
      text: "Our engine reads the text and matches it against in-demand skills.",
    },
    {
      num: 3,
      title: "Get your score",
      text: "See your score, what you've got, and exactly what to add next.",
    },
  ];

  return (
    <section className="how" id="how-it-works">
      <div className="container">
        <h2 className="section-title">How it works</h2>
        <div className="steps">
          {steps.map((s) => (
            <div className="step" key={s.num}>
              <div className="step-num">{s.num}</div>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
