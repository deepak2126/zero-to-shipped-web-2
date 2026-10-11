// Shared domain constants for the analysis engine.

// Each skill is { name, weight } — higher weight = more in-demand.
// Kept in sync with the previous frontend mock so scoring feels consistent.
export const SKILL_POOL = [
  { name: "JavaScript", weight: 9 },
  { name: "TypeScript", weight: 9 },
  { name: "React", weight: 10 },
  { name: "Node.js", weight: 8 },
  { name: "Python", weight: 9 },
  { name: "SQL", weight: 8 },
  { name: "Git", weight: 7 },
  { name: "AWS", weight: 9 },
  { name: "Docker", weight: 8 },
  { name: "REST APIs", weight: 7 },
  { name: "CSS", weight: 6 },
  { name: "HTML", weight: 5 },
  { name: "GraphQL", weight: 7 },
  { name: "CI/CD", weight: 7 },
  { name: "Testing", weight: 6 },
  { name: "Agile", weight: 5 },
  { name: "Communication", weight: 6 },
  { name: "Problem Solving", weight: 6 },
  { name: "Leadership", weight: 5 },
  { name: "Kubernetes", weight: 7 },
];

export const MAX_PDF_BYTES = 10 * 1024 * 1024; // 10 MB

// Max characters of pasted job description we accept.
export const MAX_JD_CHARS = 20000;

// Min length of a job description to be considered meaningful.
export const MIN_JD_CHARS = 40;
