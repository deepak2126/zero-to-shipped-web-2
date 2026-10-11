export default function JdInput({ value, onChange, error }) {
  const max = 20000;

  return (
    <div className="jd-input">
      <div className="jd-head">
        <label className="jd-label" htmlFor="jdText">
          Job description
        </label>
        <span className="jd-count" aria-hidden="true">
          {value.length}/{max}
        </span>
      </div>
      <textarea
        id="jdText"
        className={`jd-textarea${error ? " has-error" : ""}`}
        placeholder="Paste the job description you're targeting — the more detail, the better the match…"
        value={value}
        maxLength={max}
        onChange={(e) => onChange(e.target.value)}
        rows={5}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? "jdError" : undefined}
      />
      {error ? (
        <p id="jdError" className="file-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}
