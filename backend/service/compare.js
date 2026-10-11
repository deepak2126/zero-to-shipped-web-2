import { SKILL_POOL } from "./constants.js";
import { escapeRegExp } from "../utils.js";

/* ============================================================
   Comparison engine
   ------------------------------------------------------------
   NOTE: This is a DETERMINISTIC keyword/weight comparison.
   The AI part will be added later. When it is, replace the
   body of `compareResumeToJd` with a call to your model while
   keeping the same input/output contract:

     in : { resumeText: string, jobDescription: string }
     out: {
            score, present[], missing[], jdSkills[],
            matchedKeywords[], summary
          }

   Everything else (routes, controller, DB model, frontend) is
   already wired to this shape, so the AI upgrade is isolated here.
   ============================================================ */

// Does `text` mention `skillName` as a standalone token?
// Uses non-word boundaries so "React" doesn't match inside "Reaction",
// while still allowing "React.js" and "Node.js".
function mentionsSkill(text, skillName) {
  const escaped = escapeRegExp(skillName.toLowerCase());
  // Boundary: start or a char that isn't part of an identifier, then the
  // skill, then a non-identifier char or the end of the string.
  const pattern = new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, "i");
  return pattern.test(text);
}

function findSkills(text) {
  if (!text) return [];
  return SKILL_POOL.filter((skill) => mentionsSkill(text, skill.name));
}

/**
 * Compare a resume against a job description.
 * @param {Object} input
 * @param {string} input.resumeText        Extracted text from the resume PDF.
 * @param {string} input.jobDescription    Raw pasted job description text.
 * @returns {Object} comparison result (see contract above).
 */
export function compareResumeToJd({ resumeText = "", jobDescription = "" }) {
  // Skills the candidate claims to have.
  const resumeSkills = findSkills(resumeText);
  // Skills the job is asking for.
  const jdSkills = findSkills(jobDescription);

  const resumeNames = new Set(resumeSkills.map((s) => s.name));
  const jdNames = jdSkills.map((s) => s.name);

  // If the JD mentions none of our known skills, fall back to the full pool
  // so the candidate still gets a meaningful "present vs missing" view.
  const targetSkills = jdSkills.length ? jdSkills : SKILL_POOL;

  const present = targetSkills.filter((s) => resumeNames.has(s.name));
  const missing = targetSkills.filter((s) => !resumeNames.has(s.name));

  // Score = weighted share of the *target* skills the candidate covers.
  const totalWeight = targetSkills.reduce((sum, s) => sum + s.weight, 0) || 1;
  const foundWeight = present.reduce((sum, s) => sum + s.weight, 0);
  const ratio = foundWeight / totalWeight; // 0..1

  // Map into a 40–97 band so results read like the original mock, but stay honest.
  const rawScore = 40 + ratio * 57;
  const score = Math.max(40, Math.min(97, Math.round(rawScore)));

  const presentNames = present.map((s) => s.name).sort();
  const missingNames = missing.map((s) => s.name).sort();

  const summary =
    `Compared your resume against the job description: ` +
    `${presentNames.length} matching skill${presentNames.length === 1 ? "" : "s"} found and ` +
    `${missingNames.length} gap${missingNames.length === 1 ? "" : "s"} to close.` +
    (jdSkills.length
      ? ""
      : " (The job description didn't mention specific skills from our list, so we scored against the full skill pool.)");

  return {
    score,
    present: presentNames,
    missing: missingNames,
    jdSkills: jdNames.sort(),
    matchedKeywords: presentNames,
    summary,
  };
}
