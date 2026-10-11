/* ============================================================
   0 to Shipped — Resume Parser (mock)
   Pure analysis logic, framework-agnostic.
   Extracted from the original vanilla-JS build.
   ============================================================ */

// Each skill is { name, weight } — higher weight = more in-demand.
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

export const MAX_BYTES = 10 * 1024 * 1024; // 10 MB

// Deterministic 32-bit hash from a string → stable per file.
function hashString(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

// Seeded PRNG (mulberry32) so results are reproducible for a given seed.
function makeRng(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle(arr, rng) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Simulated analysis: deterministic for a given file.
export function analyze(file) {
  const seed = hashString(file.name + ":" + file.size);
  const rng = makeRng(seed);

  // Decide how many skills are "found" — a realistic spread (~40–80%).
  const total = SKILL_POOL.length;
  const matchRatio = 0.4 + rng() * 0.4;
  const foundCount = Math.max(4, Math.round(total * matchRatio));

  const ordered = shuffle(SKILL_POOL, rng);
  const present = ordered.slice(0, foundCount);
  const missing = ordered.slice(foundCount);

  // Score = weighted share of found skills, scaled toward a 45–97 band.
  const totalWeight = SKILL_POOL.reduce((s, k) => s + k.weight, 0);
  const foundWeight = present.reduce((s, k) => s + k.weight, 0);
  const raw = (foundWeight / totalWeight) * 100;
  const score = Math.round(45 + (raw / 100) * 52);

  return {
    score: Math.min(97, Math.max(40, score)),
    present: present.map((k) => k.name).sort(),
    missing: missing.map((k) => k.name).sort(),
  };
}

// Validate an uploaded file. Returns an error string, or null when valid.
export function validateFile(file) {
  if (!file) return "Please choose a file to upload.";
  const isPdf =
    file.type === "application/pdf" ||
    file.name.toLowerCase().endsWith(".pdf");
  if (!isPdf) return "Please upload a valid PDF file.";
  if (file.size > MAX_BYTES) {
    return "That file is larger than 10 MB. Please try a smaller PDF.";
  }
  return null;
}

export function ratingFor(score) {
  if (score >= 80) return { cls: "rating-strong", label: "Strong match" };
  if (score >= 60) return { cls: "rating-average", label: "Solid, improvable" };
  return { cls: "rating-weak", label: "Needs work" };
}

export function headlineFor(score) {
  if (score >= 80) return "Great resume — you're in demand!";
  if (score >= 60) return "Decent resume with room to grow.";
  return "Let's level up your resume.";
}

export function summaryFor(result) {
  const p = result.present.length;
  const m = result.missing.length;
  return (
    `We found ${p} matching skill${p === 1 ? "" : "s"} and spotted ` +
    `${m} gap${m === 1 ? "" : "s"} to close. ` +
    "Add the missing skills below to boost your score."
  );
}
