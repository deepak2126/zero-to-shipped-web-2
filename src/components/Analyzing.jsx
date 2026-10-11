import { useEffect, useState } from "react";

const TIMELINE = [
  { delay: 200, progress: 40, step: 0, label: "Extracting text…" },
  { delay: 700, progress: 78, step: 1, label: "Matching skills…" },
  { delay: 1150, progress: 100, step: 2, label: "Calculating score…" },
];

export default function Analyzing({ fileName, onDone }) {
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState(-1);
  const [label, setLabel] = useState("Parsing document…");

  useEffect(() => {
    const timers = [];

    TIMELINE.forEach((point) => {
      timers.push(
        setTimeout(() => {
          setProgress(point.progress);
          setStep(point.step);
          setLabel(point.label);
        }, point.delay)
      );
    });

    // Finish slightly after the last timeline point.
    timers.push(setTimeout(onDone, 1150 + 550));

    return () => timers.forEach(clearTimeout);
  }, [onDone]);

  const stepLabels = ["Extracting text", "Matching skills", "Calculating score"];

  return (
    <div id="analyzingState" className="analyzing">
      <div className="analyzing-file">
        <span className="file-chip">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <path d="M14 2v6h6" />
          </svg>
          <span id="analyzingName">{fileName}</span>
        </span>
      </div>
      <div className="progress-track">
        <div className="progress-bar" id="progressBar" style={{ width: progress + "%" }} />
      </div>
      <p className="analyzing-label" id="analyzingLabel">{label}</p>
      <ul className="step-list" id="stepList">
        {stepLabels.map((text, i) => (
          <li
            key={text}
            className={`${i === step ? "active" : ""} ${i < step ? "done" : ""}`.trim()}
          >
            <span className="step-check"></span> {text}
          </li>
        ))}
      </ul>
    </div>
  );
}
