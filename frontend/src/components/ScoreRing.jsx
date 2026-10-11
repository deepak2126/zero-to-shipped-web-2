import { useEffect, useState } from "react";

const RING_CIRCUMFERENCE = 2 * Math.PI * 52; // r = 52 → ~326.7

function useAnimatedNumber(target, duration = 1000) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let frame;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(target * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);

  return value;
}

export default function ScoreRing({ score }) {
  const displayScore = useAnimatedNumber(score);
  const [offset, setOffset] = useState(RING_CIRCUMFERENCE);

  const stroke =
    score >= 80 ? "var(--success)" : score >= 60 ? "var(--primary)" : "var(--danger)";

  useEffect(() => {
    // Defer to next frame so the CSS transition animates from full offset.
    const frame = requestAnimationFrame(() => {
      setOffset(RING_CIRCUMFERENCE * (1 - score / 100));
    });
    return () => cancelAnimationFrame(frame);
  }, [score]);

  return (
    <div className="score-wrap">
      <svg className="score-ring" viewBox="0 0 120 120" aria-hidden="true">
        <circle className="ring-bg" cx="60" cy="60" r="52" />
        <circle
          className="ring-fill"
          id="scoreRing"
          cx="60"
          cy="60"
          r="52"
          style={{
            strokeDasharray: RING_CIRCUMFERENCE,
            strokeDashoffset: offset,
            stroke,
          }}
        />
      </svg>
      <div className="score-value">
        <span id="scoreNumber">{displayScore}</span>
        <span className="score-max">/100</span>
      </div>
    </div>
  );
}
