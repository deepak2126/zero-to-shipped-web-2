/* ============================================================
   0 to Shipped — Resume Parser (mock)
   Pure front-end. No backend. Results are simulated.
   ============================================================ */

(function () {
  "use strict";

  /* ---------- DOM refs ---------- */
  const uploadZone = document.getElementById("uploadState");
  const fileInput = document.getElementById("fileInput");
  const fileError = document.getElementById("fileError");
  const analyzingState = document.getElementById("analyzingState");
  const analyzingName = document.getElementById("analyzingName");
  const progressBar = document.getElementById("progressBar");
  const analyzingLabel = document.getElementById("analyzingLabel");
  const stepList = document.getElementById("stepList");
  const resultsState = document.getElementById("resultsState");
  const scoreRing = document.getElementById("scoreRing");
  const scoreNumber = document.getElementById("scoreNumber");
  const scoreRating = document.getElementById("scoreRating");
  const scoreHeadline = document.getElementById("scoreHeadline");
  const scoreSummary = document.getElementById("scoreSummary");
  const presentSkillsEl = document.getElementById("presentSkills");
  const missingSkillsEl = document.getElementById("missingSkills");
  const presentCount = document.getElementById("presentCount");
  const missingCount = document.getElementById("missingCount");
  const resetBtn = document.getElementById("resetBtn");

  const RING_CIRCUMFERENCE = 2 * Math.PI * 52; // r = 52 → ~326.7
  scoreRing.style.strokeDasharray = RING_CIRCUMFERENCE;
  scoreRing.style.strokeDashoffset = RING_CIRCUMFERENCE;

  const MAX_BYTES = 10 * 1024 * 1024; // 10 MB

  /* ---------- Mock skill universe ---------- */
  // Each skill is { name, weight } — higher weight = more in-demand.
  const SKILL_POOL = [
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

  const ANALYZE_STEPS = [
    { key: "extract", label: "Extracting text…" },
    { key: "skills", label: "Matching skills…" },
    { key: "score", label: "Calculating score…" },
  ];

  /* ---------- Utilities ---------- */

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

  /* ---------- Mock analysis ---------- */
  function analyze(file) {
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

  /* ---------- Rendering ---------- */
  function ratingFor(score) {
    if (score >= 80) return { cls: "rating-strong", label: "Strong match" };
    if (score >= 60) return { cls: "rating-average", label: "Solid, improvable" };
    return { cls: "rating-weak", label: "Needs work" };
  }

  function headlineFor(score) {
    if (score >= 80) return "Great resume — you're in demand!";
    if (score >= 60) return "Decent resume with room to grow.";
    return "Let's level up your resume.";
  }

  function summaryFor(result) {
    const p = result.present.length;
    const m = result.missing.length;
    return (
      "We found " + p + " matching skill" + (p === 1 ? "" : "s") +
      " and spotted " + m + " gap" + (m === 1 ? "" : "s") +
      " to close. Add the missing skills below to boost your score."
    );
  }

  function tagEl(name, kind, index) {
    const el = document.createElement("span");
    el.className = "skill-tag skill-tag--" + kind;
    el.textContent = name;
    el.style.animationDelay = index * 45 + "ms";
    return el;
  }

  function renderResults(result) {
    const rating = ratingFor(result.score);
    scoreRating.textContent = rating.label;
    scoreRating.className = "score-rating " + rating.cls;
    scoreHeadline.textContent = headlineFor(result.score);
    scoreSummary.textContent = summaryFor(result);

    scoreRing.style.stroke =
      result.score >= 80
        ? "var(--success)"
        : result.score >= 60
        ? "var(--primary)"
        : "var(--danger)";

    const offset = RING_CIRCUMFERENCE * (1 - result.score / 100);
    requestAnimationFrame(function () {
      scoreRing.style.strokeDashoffset = offset;
    });

    animateNumber(scoreNumber, result.score, 1000);

    presentSkillsEl.innerHTML = "";
    missingSkillsEl.innerHTML = "";
    result.present.forEach(function (name, i) {
      presentSkillsEl.appendChild(tagEl(name, "present", i));
    });
    result.missing.forEach(function (name, i) {
      missingSkillsEl.appendChild(tagEl(name, "missing", i));
    });
    presentCount.textContent = result.present.length;
    missingCount.textContent = result.missing.length;
  }

  function animateNumber(el, target, duration) {
    const start = performance.now();
    function frame(now) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(target * eased);
      if (t < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  /* ---------- State transitions ---------- */
  function showState(state) {
    uploadZone.hidden = state !== "upload";
    analyzingState.hidden = state !== "analyzing";
    resultsState.hidden = state !== "results";
  }

  function setStep(index) {
    const items = stepList.querySelectorAll("li");
    items.forEach(function (li, i) {
      li.classList.toggle("active", i === index);
      li.classList.toggle("done", i < index);
    });
    if (index >= 0 && index < ANALYZE_STEPS.length) {
      analyzingLabel.textContent = ANALYZE_STEPS[index].label;
    }
  }

  function runAnalysis(file) {
    showState("analyzing");
    analyzingName.textContent = file.name;
    progressBar.style.width = "0%";

    const timeline = [
      { delay: 200, progress: 40, step: 0 },
      { delay: 700, progress: 78, step: 1 },
      { delay: 1150, progress: 100, step: 2 },
    ];

    let elapsed = 0;
    timeline.forEach(function (point) {
      setTimeout(function () {
        progressBar.style.width = point.progress + "%";
        setStep(point.step);
      }, point.delay);
      elapsed = Math.max(elapsed, point.delay);
    });

    setTimeout(function () {
      const result = analyze(file);
      renderResults(result);
      showState("results");
    }, elapsed + 550);
  }

  function handleFile(file) {
    if (!file) return;

    const isPdf =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      fileError.textContent = "Please upload a valid PDF file.";
      fileError.hidden = false;
      return;
    }
    if (file.size > MAX_BYTES) {
      fileError.textContent = "That file is larger than 10 MB. Please try a smaller PDF.";
      fileError.hidden = false;
      return;
    }

    fileError.hidden = true;
    runAnalysis(file);
  }

  function resetToUpload() {
    fileInput.value = "";
    progressBar.style.width = "0%";
    setStep(-1);
    showState("upload");
  }

  /* ---------- Event wiring ---------- */
  uploadZone.addEventListener("click", function () {
    fileInput.click();
  });

  uploadZone.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      fileInput.click();
    }
  });

  fileInput.addEventListener("change", function (e) {
    handleFile(e.target.files && e.target.files[0]);
  });

  ["dragenter", "dragover"].forEach(function (evt) {
    uploadZone.addEventListener(evt, function (e) {
      e.preventDefault();
      e.stopPropagation();
      uploadZone.classList.add("is-dragover");
    });
  });

  ["dragleave", "drop"].forEach(function (evt) {
    uploadZone.addEventListener(evt, function (e) {
      e.preventDefault();
      e.stopPropagation();
      uploadZone.classList.remove("is-dragover");
    });
  });

  uploadZone.addEventListener("drop", function (e) {
    const file =
      e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
    handleFile(file);
  });

  // Prevent the browser from opening files dropped outside the zone.
  ["dragover", "drop"].forEach(function (evt) {
    window.addEventListener(evt, function (e) {
      e.preventDefault();
    });
  });

  resetBtn.addEventListener("click", resetToUpload);

  // Initial state
  showState("upload");
})();
