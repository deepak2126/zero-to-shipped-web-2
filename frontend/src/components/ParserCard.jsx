import { useCallback, useEffect, useState } from "react";
import { validateFile, validateJd } from "../parser.js";
import { analyzeResume } from "../api.js";
import UploadZone from "./UploadZone.jsx";
import JdInput from "./JdInput.jsx";
import Analyzing from "./Analyzing.jsx";
import Results from "./Results.jsx";

const PHASES = { UPLOAD: "upload", ANALYZING: "analyzing", RESULTS: "results" };

export default function ParserCard() {
  const [phase, setPhase] = useState(PHASES.UPLOAD);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("resume.pdf");
  const [jd, setJd] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [animDone, setAnimDone] = useState(false);

  // Prevent the browser from opening files dropped outside the zone.
  useEffect(() => {
    const prevent = (e) => e.preventDefault();
    window.addEventListener("dragover", prevent);
    window.addEventListener("drop", prevent);
    return () => {
      window.removeEventListener("dragover", prevent);
      window.removeEventListener("drop", prevent);
    };
  }, []);

  // Move to results only once BOTH the animation finished and the API responded.
  useEffect(() => {
    if (phase === PHASES.ANALYZING && animDone && result) {
      setPhase(PHASES.RESULTS);
    }
  }, [phase, animDone, result]);

  const handleFile = useCallback((picked) => {
    const validationError = validateFile(picked);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");
    setFile(picked);
    setFileName(picked.name);
  }, []);

  const handleAnalyze = useCallback(async () => {
    // Re-validate both inputs right before submitting.
    const fileError = validateFile(file);
    if (fileError) {
      setError(fileError);
      return;
    }
    const jdError = validateJd(jd);
    if (jdError) {
      setError(jdError);
      return;
    }

    setError("");
    setResult(null);
    setAnimDone(false);
    setPhase(PHASES.ANALYZING);

    try {
      const data = await analyzeResume({ file, jobDescription: jd });
      setResult(data);
    } catch (err) {
      setError(err.message || "Analysis failed. Please try again.");
      setPhase(PHASES.UPLOAD);
    }
  }, [file, jd]);

  const handleDone = useCallback(() => setAnimDone(true), []);

  const handleReset = useCallback(() => {
    setPhase(PHASES.UPLOAD);
    setResult(null);
    setError("");
    setFile(null);
    setJd("");
    setAnimDone(false);
  }, []);

  const canSubmit = Boolean(file) && jd.trim().length > 0;

  return (
    <div className="parser" id="parser">
      {phase === PHASES.UPLOAD && (
        <div className="upload-flow">
          <UploadZone
            onFile={handleFile}
            error={error}
            selectedName={file ? file.name : ""}
          />
          <JdInput value={jd} onChange={setJd} error="" />
          <button
            id="analyzeBtn"
            type="button"
            className="btn btn-primary analyze-btn"
            onClick={handleAnalyze}
            disabled={!canSubmit}
          >
            Compare my resume
          </button>
        </div>
      )}
      {phase === PHASES.ANALYZING && (
        <Analyzing fileName={fileName} onDone={handleDone} />
      )}
      {phase === PHASES.RESULTS && result && (
        <Results result={result} onReset={handleReset} />
      )}
    </div>
  );
}

