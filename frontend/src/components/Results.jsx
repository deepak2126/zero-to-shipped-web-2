import { ratingFor, headlineFor, summaryFor } from "../parser.js";
import ScoreRing from "./ScoreRing.jsx";

function SkillTag({ name, kind, index }) {
  return (
    <span
      className={`skill-tag skill-tag--${kind}`}
      style={{ animationDelay: index * 45 + "ms" }}
    >
      {name}
    </span>
  );
}

function EmptyNote({ children }) {
  return <p className="skill-empty">{children}</p>;
}

export default function Results({ result, onReset }) {
  const rating = ratingFor(result.score);
  const present = result.present || [];
  const missing = result.missing || [];

  return (
    <div id="resultsState" className="results">
      <div className="results-top">
        <ScoreRing score={result.score} />
        <div className="score-meta">
          <span className={`score-rating ${rating.cls}`} id="scoreRating">
            {rating.label}
          </span>
          <h3 className="score-headline" id="scoreHeadline">
            {headlineFor(result.score)}
          </h3>
          <p className="score-summary" id="scoreSummary">
            {summaryFor(result)}
          </p>
          <button id="resetBtn" className="btn btn-secondary" onClick={onReset}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
                 strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
              <path d="M3 3v5h5" />
            </svg>
            Compare another resume
          </button>
        </div>
      </div>

      <div className="skills-grid">
        <div className="skill-card skill-card--present">
          <div className="skill-head">
            <span className="skill-badge skill-badge--present">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"
                   strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </span>
            <h4>Skills you match</h4>
            <span className="skill-count" id="presentCount">{present.length}</span>
          </div>
          <div className="skill-tags" id="presentSkills">
            {present.length ? (
              present.map((name, i) => (
                <SkillTag key={name} name={name} kind="present" index={i} />
              ))
            ) : (
              <EmptyNote>No overlapping skills were detected yet.</EmptyNote>
            )}
          </div>
        </div>

        <div className="skill-card skill-card--missing">
          <div className="skill-head">
            <span className="skill-badge skill-badge--missing">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"
                   strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </span>
            <h4>Skills to add</h4>
            <span className="skill-count" id="missingCount">{missing.length}</span>
          </div>
          <div className="skill-tags" id="missingSkills">
            {missing.length ? (
              missing.map((name, i) => (
                <SkillTag key={name} name={name} kind="missing" index={i} />
              ))
            ) : (
              <EmptyNote>Nothing missing — great match! 🎉</EmptyNote>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
