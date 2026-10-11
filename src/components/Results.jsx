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

export default function Results({ result, onReset }) {
  const rating = ratingFor(result.score);

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
            Analyze another resume
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
            <h4>Skills present</h4>
            <span className="skill-count" id="presentCount">{result.present.length}</span>
          </div>
          <div className="skill-tags" id="presentSkills">
            {result.present.map((name, i) => (
              <SkillTag key={name} name={name} kind="present" index={i} />
            ))}
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
            <h4>Skills missing</h4>
            <span className="skill-count" id="missingCount">{result.missing.length}</span>
          </div>
          <div className="skill-tags" id="missingSkills">
            {result.missing.map((name, i) => (
              <SkillTag key={name} name={name} kind="missing" index={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
