import { useCallback, useEffect, useState } from "react";
import { analyze, validateFile } from "../parser.js";
import UploadZone from "./UploadZone.jsx";
import Analyzing from "./Analyzing.jsx";
import Results from "./Results.jsx";

const PHASES = { UPLOAD: "upload", ANALYZING: "analyzing", RESULTS: "results" };

export default function ParserCard() {
  const [phase, setPhase] = useState(PHASES.UPLOAD);
  const [fileName, setFileName] = useState("resume.pdf");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

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

  const handleFile = useCallback((file) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");
    setFileName(file.name);
    setResult(analyze(file));
    setPhase(PHASES.ANALYZING);
  }, []);

  const handleDone = useCallback(() => {
    setPhase(PHASES.RESULTS);
  }, []);

  const handleReset = useCallback(() => {
    setPhase(PHASES.UPLOAD);
    setResult(null);
    setError("");
  }, []);

  return (
    <div className="parser" id="parser">
      {phase === PHASES.UPLOAD && <UploadZone onFile={handleFile} error={error} />}
      {phase === PHASES.ANALYZING && <Analyzing fileName={fileName} onDone={handleDone} />}
      {phase === PHASES.RESULTS && result && (
        <Results result={result} onReset={handleReset} />
      )}
    </div>
  );
}
