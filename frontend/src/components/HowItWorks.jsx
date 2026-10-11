export default function HowItWorks() {
  const steps = [
    {
      num: 1,
      title: "Upload your PDF",
      text: "Drop in your resume. We read the text on the server — nothing is stored in your browser.",
    },
    {
      num: 2,
      title: "Paste the job description",
      text: "Add the role you're targeting so we compare the right skills.",
    },
    {
      num: 3,
      title: "Get your match score",
      text: "See your score, what lines up, and exactly which skills to add next.",
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
