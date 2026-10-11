import { useRef } from "react";

export default function UploadZone({ onFile, error }) {
  const inputRef = useRef(null);

  const openPicker = () => inputRef.current && inputRef.current.click();

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openPicker();
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add("is-dragover");
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove("is-dragover");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove("is-dragover");
    const file = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
    onFile(file);
  };

  const handleChange = (e) => {
    const file = e.target.files && e.target.files[0];
    onFile(file);
  };

  return (
    <div
      id="uploadState"
      className="upload-zone"
      role="button"
      tabIndex={0}
      onClick={openPicker}
      onKeyDown={handleKeyDown}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      aria-label="Upload your resume PDF. Click to browse or drag and drop."
    >
      <input
        ref={inputRef}
        type="file"
        id="fileInput"
        accept="application/pdf,.pdf"
        hidden
        onChange={handleChange}
      />
      <div className="upload-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"
             strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 16V4m0 0L8 8m4-4 4 4" />
          <path d="M20 16.5A3.5 3.5 0 0 0 18 10h-1A6 6 0 1 0 6 15" />
        </svg>
      </div>
      <h3 className="upload-title">Drop your resume here</h3>
      <p className="upload-hint">
        or <span className="link">browse files</span> — PDF only, up to 10&nbsp;MB
      </p>
      {error ? (
        <p id="fileError" className="file-error">{error}</p>
      ) : (
        <p id="fileError" className="file-error" hidden>Please upload a valid PDF file.</p>
      )}
    </div>
  );
}
