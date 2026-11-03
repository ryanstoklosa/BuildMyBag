/**
 * ============================================================================
 * BUILD MY BAG - PERSONAL DISC GOLF FITTING LAB (script.js)
 * ============================================================================
 * KEY FEATURES:
 * 1. Brand Identity ("Build My Bag") with zero catalog-count pills so users
 *    never see raw database numbers.
 * 2. True Two-Page View Switching (`#quiz-page` vs `#results-page`):
 *    - Results are completely hidden until the user clicks "Find My Disc".
 *    - Clicking "Get Another Recommendation" (or the Build My Bag header)
 *      returns to the questionnaire page.
 * 3. Custom SVG Disc Hot-Stamp Illustrations (`generateDiscSvgMarkup(disc)`):
 *    - Generates a crisp, zero-broken-link top-down visual of every disc
 *      complete with rim width scaled to Speed (1–14), GYRO black/colored
 *      overmolds for MVP & Axiom discs, and a hot-stamp center plate.
 * 4. Personal Caddie Notes & Plastic/Weight Prescriptions:
 *    - Recommends specific plastic blends and gram weights tailored to the
 *      player's arm speed tier (Beginner, Intermediate, Advanced).
 * 5. "View All Matching Recommendations" Drawer:
 *    - Shows the #1 Spotlight Fit + 4 Runner-Up Cards upfront, plus an
 *      expandable drawer with every matching mold in that category—each with
 *      its own direct Amazon.com affiliate button.
 * ============================================================================
 */

// Replace with your real Amazon Associates Store ID (e.g., "buildmybag-20")
const AMAZON_ASSOCIATE_TAG = "buildmybag-20";

let discCatalog = [];

// Built-in fallback catalog (16 staple molds across all categories, stabilities,
// and skill tiers) so the site works even if opened via file:// without a server.
const FALLBACK_DISCS = [
  {
    id: "disc-01",
    brand: "Innova",
    mold: "Aviar",
    speed: 2,
    glide: 3,
    turn: 0,
    fade: 1,
    category: "Putter",
    stability: "Stable",
    recommendedSkill: "Beginner",
    description: "The most iconic putt & approach disc in the sport, featuring a straight flight and dependable low-speed finish.",
    caddieNote: "Grab a Classic Aviar or Aviar P&A if you want a clean, beadless release that holds whatever putting or approach line you set.",
    plasticGuide: {
      Beginner: "DX or GStar (165–170g) for confident grip in all weather",
      Intermediate: "DX or KC Pro (171–175g) for crisp chain-grabbing release",
      Advanced: "KC Pro or Star (175g) for windy putting and driving approaches"
    },
    visual: { discColor: "#d93829", rimColor: "#9e2318", stampColor: "#f7e3b5", overmold: false },
    amazonUrl: "https://www.amazon.com/s?k=Innova+Aviar+disc+golf&tag=buildmybag-20"
  },
  {
    id: "disc-07",
    brand: "Discraft",
    mold: "Zone",
    speed: 4,
    glide: 3,
    turn: 0,
    fade: 3,
    category: "Putter",
    stability: "Overstable",
    recommendedSkill: "Intermediate",
    description: "The gold-standard overstable approach disc for forehand and backhand flick shots that need a predictable hyzer finish.",
    caddieNote: "Arguably the single best utility approach disc ever molded. Flat top, comfortable shallow rim, and immune to wrist-roll.",
    plasticGuide: {
      Beginner: "Jawbreaker (168–172g) for softer landings and straighter carry",
      Intermediate: "ESP or Z Line (172–174g) for reliable forehand approaches",
      Advanced: "CryZtal FLX or Z Line (173–175g) for maximum skip control"
    },
    visual: { discColor: "#e06d1b", rimColor: "#ad4f0c", stampColor: "#ffffff", overmold: false },
    amazonUrl: "https://www.amazon.com/s?k=Discraft+Zone+disc+golf&tag=buildmybag-20"
  },
  {
    id: "disc-14",
    brand: "Axiom",
    mold: "Proxy",
    speed: 3,
    glide: 3,
    turn: -1,
    fade: 0.5,
    category: "Putter",
    stability: "Understable",
    recommendedSkill: "Beginner",
    description: "Shares the exact core feel of the Envy but offers a straight-to-slightly-understable flight path with zero late dump.",
    caddieNote: "Pairs perfectly alongside an Envy—same hand feel, but pushes dead straight all the way to the ground.",
    plasticGuide: {
      Beginner: "Electron (165–171g) for effortless straight approaches",
      Intermediate: "Neutron or Plasma (171–174g) for woods tunnel tee shots",
      Advanced: "Eclipse Glow or Neutron (174–175g) for high-power straight lines"
    },
    visual: { discColor: "#e06d1b", rimColor: "#c83e2b", stampColor: "#1c1917", overmold: true },
    amazonUrl: "https://www.amazon.com/s?k=Axiom+Proxy+disc+golf&tag=buildmybag-20"
  },
  {
    id: "disc-20",
    brand: "Discraft",
    mold: "Buzzz",
    speed: 5,
    glide: 4,
    turn: -1,
    fade: 1,
    category: "Midrange",
    stability: "Stable",
    recommendedSkill: "Beginner",
    description: "The most popular midrange in the world; holds any hyzer, flat, or anhyzer angle you put it on with unmatched consistency.",
    caddieNote: "If you could only carry one disc for an entire round, the Buzzz is the universal answer.",
    plasticGuide: {
      Beginner: "ESP Lite or Jawbreaker (164–170g) for easy line-shaping",
      Intermediate: "ESP or Big Z (171–175g) for all-purpose accuracy",
      Advanced: "Z Line or Titanium (175–177g) for full-power drives"
    },
    visual: { discColor: "#e06d1b", rimColor: "#ad4f0c", stampColor: "#ffffff", overmold: false },
    amazonUrl: "https://www.amazon.com/s?k=Discraft+Buzzz+disc+golf&tag=buildmybag-20"
  },
  {
    id: "disc-22",
    brand: "Discraft",
    mold: "Meteor",
    speed: 5,
    glide: 5,
    turn: -3,
    fade: 1,
    category: "Midrange",
    stability: "Understable",
    recommendedSkill: "Beginner",
    description: "A comfortable, beadless understable midrange that glides right with ease and corrects early left hooks.",
    caddieNote: "Feels much more modern and smooth in the hand than older beaded midranges while delivering easy right-moving turn.",
    plasticGuide: {
      Beginner: "ESP (165–171g) for effortless hyzer-flips",
      Intermediate: "ESP or Z Line (172–175g) for sweeping wooded turnovers",
      Advanced: "Z Line (175–177g) for touch woods lines"
    },
    visual: { discColor: "#e06d1b", rimColor: "#ad4f0c", stampColor: "#ffffff", overmold: false },
    amazonUrl: "https://www.amazon.com/s?k=Discraft+Meteor+disc+golf&tag=buildmybag-20"
  },
  {
    id: "disc-27",
    brand: "Innova",
    mold: "Roc3",
    speed: 5,
    glide: 4,
    turn: 0,
    fade: 3,
    category: "Midrange",
    stability: "Overstable",
    recommendedSkill: "Intermediate",
    description: "A fast, flat-topped evolution of the classic Roc that excels at controlled placement shots and windy approaches.",
    caddieNote: "A staple workhorse midrange that starts out reliably overstable and seasons into a long, straight flyer over time.",
    plasticGuide: {
      Beginner: "DX (165–170g) so it seasons quickly into a straight flyer",
      Intermediate: "Star (171–175g) for dependable wind control",
      Advanced: "Champion (176–180g) for maximum overstability"
    },
    visual: { discColor: "#d93829", rimColor: "#9e2318", stampColor: "#f7e3b5", overmold: false },
    amazonUrl: "https://www.amazon.com/s?k=Innova+Roc3+disc+golf&tag=buildmybag-20"
  },
  {
    id: "disc-40",
    brand: "Innova",
    mold: "Leopard3",
    speed: 7,
    glide: 5,
    turn: -2,
    fade: 1,
    category: "Fairway Driver",
    stability: "Understable",
    recommendedSkill: "Beginner",
    description: "A slightly faster, flatter evolution of the Leopard that offers extra distance while staying very forgiving.",
    caddieNote: "Upgrades the classic Leopard with extra speed so it stays in your bag even after your arm speed improves.",
    plasticGuide: {
      Beginner: "GStar or Star (160–167g) for effortless S-curve distance",
      Intermediate: "Star or Halo Star (168–172g) for laser hyzer-flips",
      Advanced: "Champion or Halo Star (173–175g) for controlled woods turnovers"
    },
    visual: { discColor: "#d93829", rimColor: "#9e2318", stampColor: "#f7e3b5", overmold: false },
    amazonUrl: "https://www.amazon.com/s?k=Innova+Leopard3+disc+golf&tag=buildmybag-20"
  },
  {
    id: "disc-41",
    brand: "Innova",
    mold: "TeeBird",
    speed: 7,
    glide: 5,
    turn: 0,
    fade: 2,
    category: "Fairway Driver",
    stability: "Stable",
    recommendedSkill: "Intermediate",
    description: "The benchmark for accuracy and consistency in fairway drivers, delivering straight flights with a predictable fade.",
    caddieNote: "For decades, every other control driver on the market has been measured against the TeeBird's pinpoint reliability.",
    plasticGuide: {
      Beginner: "DX or GStar (162–167g) to soften the late fade",
      Intermediate: "Star (168–172g) for classic point-and-shoot accuracy",
      Advanced: "Champion or Halo Star (173–175g) for power placement drives"
    },
    visual: { discColor: "#d93829", rimColor: "#9e2318", stampColor: "#f7e3b5", overmold: false },
    amazonUrl: "https://www.amazon.com/s?k=Innova+TeeBird+disc+golf&tag=buildmybag-20"
  },
  {
    id: "disc-44",
    brand: "Innova",
    mold: "Firebird",
    speed: 9,
    glide: 3,
    turn: 0,
    fade: 4,
    category: "Fairway Driver",
    stability: "Overstable",
    recommendedSkill: "Advanced",
    description: "The gold standard for overstable utility drivers; thrives in heavy headwinds, thumbers, and power forehands.",
    caddieNote: "Every competitive bag needs a 9-speed utility fire-fighter for vicious headwinds and skip shots around corners.",
    plasticGuide: {
      Beginner: "GStar (162–167g) for steep spike hyzers and wind utility",
      Intermediate: "Star or Champion (168–172g) for reliable forehand skips",
      Advanced: "Champion or Halo Star (173–175g) for tour-grade torque resistance"
    },
    visual: { discColor: "#d93829", rimColor: "#9e2318", stampColor: "#f7e3b5", overmold: false },
    amazonUrl: "https://www.amazon.com/s?k=Innova+Firebird+disc+golf&tag=buildmybag-20"
  },
  {
    id: "disc-69",
    brand: "Innova",
    mold: "Mamba",
    speed: 11,
    glide: 6,
    turn: -5,
    fade: 1,
    category: "Distance Driver",
    stability: "Understable",
    recommendedSkill: "Beginner",
    description: "Features more high-speed turn (-5) than almost any other distance driver, unlocking huge S-curves for slower arm speeds.",
    caddieNote: "If high-speed drivers always hyzer out immediately for you, the Mamba will actually flip up and glide.",
    plasticGuide: {
      Beginner: "GStar or Star (158–166g) for effortless max distance",
      Intermediate: "Star or Champion (168–172g) for massive tailwind S-curves",
      Advanced: "Champion or Halo Star (173–175g) for sky rollers and big turnovers"
    },
    visual: { discColor: "#d93829", rimColor: "#9e2318", stampColor: "#f7e3b5", overmold: false },
    amazonUrl: "https://www.amazon.com/s?k=Innova+Mamba+disc+golf&tag=buildmybag-20"
  },
  {
    id: "disc-71",
    brand: "Innova",
    mold: "Wraith",
    speed: 11,
    glide: 5,
    turn: -1,
    fade: 3,
    category: "Distance Driver",
    stability: "Stable",
    recommendedSkill: "Intermediate",
    description: "A legendary 11-speed driver offering maximum distance with noticeably better controllability than a 12-speed.",
    caddieNote: "Most amateur and intermediate players actually throw an 11-speed Wraith further and more accurately than a 12-speed Destroyer.",
    plasticGuide: {
      Beginner: "Pro or GStar (162–167g) for workable S-curve distance",
      Intermediate: "Star (168–172g) — the gold standard workhorse distance driver",
      Advanced: "Star or Halo Star (173–175g) for booming controlled drives"
    },
    visual: { discColor: "#d93829", rimColor: "#9e2318", stampColor: "#f7e3b5", overmold: false },
    amazonUrl: "https://www.amazon.com/s?k=Innova+Wraith+disc+golf&tag=buildmybag-20"
  },
  {
    id: "disc-74",
    brand: "Innova",
    mold: "Destroyer",
    speed: 12,
    glide: 5,
    turn: -1,
    fade: 3,
    category: "Distance Driver",
    stability: "Overstable",
    recommendedSkill: "Advanced",
    description: "The gold standard for high-power distance drivers; excels at massive forehands and crushing backhand drives.",
    caddieNote: "Built for 375+ ft power throwers or forehand players who need a driver that fights back reliably.",
    plasticGuide: {
      Beginner: "GStar (160–165g) for windy utility drives",
      Intermediate: "Pro or Star (167–170g) for reliable forehand distance",
      Advanced: "Star or Halo Star (173–175g) for tour-level power"
    },
    visual: { discColor: "#d93829", rimColor: "#9e2318", stampColor: "#f7e3b5", overmold: false },
    amazonUrl: "https://www.amazon.com/s?k=Innova+Destroyer+disc+golf&tag=buildmybag-20"
  }
];

/**
 * 1. INITIALIZATION & PAGE NAVIGATION LISTENERS
 */
document.addEventListener("DOMContentLoaded", () => {
  drawSvgGridBackground();
  loadDiscCatalog();

  const form = document.getElementById("disc-quiz-form");
  const toggleAllBtn = document.getElementById("toggle-all-recs-btn");
  const headerHomeTrigger = document.getElementById("header-home-trigger");

  // Submitting "Find My Disc" calculates recommendations and opens the Results Page
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    runRecommendationUpdate();
    showPageView("results", true);
  });

  // Changing throw style updates the helper description on Question 4
  form.addEventListener("change", () => {
    updateDynamicQuestionHints();
  });

  // Wire up "Get Another Recommendation" buttons on the Results Page to return Home
  const returnButtons = document.querySelectorAll('[data-action="return-home"]');
  returnButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      showPageView("quiz", true);
    });
  });

  // Clicking the Build My Bag header logo returns to the Home Page
  if (headerHomeTrigger) {
    headerHomeTrigger.addEventListener("click", () => showPageView("quiz", true));
    headerHomeTrigger.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        showPageView("quiz", true);
      }
    });
  }

  // Toggle "View All Matching Recommendations" drawer
  if (toggleAllBtn) {
    toggleAllBtn.addEventListener("click", () => {
      const drawer = document.getElementById("all-recommendations-drawer");
      const isHidden = drawer.classList.contains("is-hidden");
      if (isHidden) {
        drawer.classList.remove("is-hidden");
        drawer.removeAttribute("hidden");
        toggleAllBtn.innerHTML = "Hide Full Recommendation List &uarr;";
      } else {
        drawer.classList.add("is-hidden");
        drawer.setAttribute("hidden", "");
        toggleAllBtn.innerHTML = "View All Matching Recommendations &darr;";
      }
    });
  }

  // Support browser Back / Forward navigation cleanly
  window.addEventListener("popstate", (event) => {
    if (event.state && event.state.view === "results") {
      runRecommendationUpdate();
      showPageView("results", false);
    } else {
      showPageView("quiz", false);
    }
  });
});

/**
 * Switches between the Home/Questionnaire Page ("quiz") and the Results Page ("results").
 */
function showPageView(viewName, pushToHistory) {
  const quizPage = document.getElementById("quiz-page");
  const resultsPage = document.getElementById("results-page");
  const subtitle = document.getElementById("page-subtitle");
  const drawer = document.getElementById("all-recommendations-drawer");
  const toggleAllBtn = document.getElementById("toggle-all-recs-btn");

  if (viewName === "results") {
    quizPage.classList.add("is-hidden");
    quizPage.setAttribute("hidden", "");

    resultsPage.classList.remove("is-hidden");
    resultsPage.removeAttribute("hidden");

    // Reset the "View All" drawer to collapsed when opening fresh results
    if (drawer && toggleAllBtn) {
      drawer.classList.add("is-hidden");
      drawer.setAttribute("hidden", "");
      toggleAllBtn.innerHTML = "View All Matching Recommendations &darr;";
    }

    subtitle.innerHTML =
      "Your custom bag fitting is ready—inspect your #1 recommended mold, plastic &amp; weight prescription, and simulated flight trajectory below.";

    if (pushToHistory) {
      history.pushState({ view: "results" }, "", "#recommendations");
    }
  } else {
    resultsPage.classList.add("is-hidden");
    resultsPage.setAttribute("hidden", "");

    quizPage.classList.remove("is-hidden");
    quizPage.removeAttribute("hidden");

    subtitle.innerHTML =
      "Dial in the exact mold missing from your bag. Tell us how you throw and what your discs are doing mid-flight—we'll match your flight ratings, recommend the right plastic &amp; weight, and plot the flight path.";

    if (pushToHistory) {
      history.pushState({ view: "quiz" }, "", window.location.pathname);
    }
  }

  window.scrollTo({ top: 0, behavior: "instant" });
}

/**
 * Fetches `./discs.json` silently without displaying any database count on screen.
 */
async function loadDiscCatalog() {
  try {
    const response = await fetch("./discs.json");
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    discCatalog = await response.json();
  } catch (err) {
    console.warn("Using built-in disc catalog:", err);
    discCatalog = FALLBACK_DISCS;
  }

  updateDynamicQuestionHints();
}

/**
 * 2. THROW-STYLE HINT UPDATES
 */
function updateDynamicQuestionHints() {
  const throwStyle = getRadioValue("throwStyle");
  const descLeft = document.getElementById("desc-left");
  const descRight = document.getElementById("desc-right");
  const tagLeft = document.getElementById("tag-left");
  const tagRight = document.getElementById("tag-right");

  if (throwStyle === "RHBH") {
    tagLeft.textContent = "FIGHTING EARLY FADE";
    descLeft.textContent = "Stalls out and dumps hard to the left side of the fairway too early.";
    tagRight.textContent = "FIGHTING TURNOVER";
    descRight.textContent = "Flips over to the right side and never fights back to center.";
  } else {
    tagLeft.textContent = "FIGHTING TURNOVER";
    descLeft.textContent = "Flips and burns over to the left side and never comes back (too understable for your forehand/lefty spin).";
    tagRight.textContent = "FIGHTING EARLY FADE";
    descRight.textContent = "Dumps hard to the right too early before getting full distance.";
  }
}

/**
 * 3. CUSTOM SVG HOT-STAMP DISC ILLUSTRATION GENERATOR
 * Creates a crisp top-down disc graphic scaled to the disc's rim width (Speed)
 * and brand styling (including GYRO black/colored rims for MVP & Axiom).
 */
function generateDiscSvgMarkup(disc) {
  const v = disc.visual || {
    discColor: "#c83e2b",
    rimColor: "#9e2318",
    stampColor: "#f7e3b5",
    overmold: false
  };

  // Scale inner flight plate radius based on Speed (higher speed = wider outer rim)
  const plateRadius = Math.max(29, Math.round(41 - disc.speed * 0.75));
  const outerRimStroke = v.overmold ? "#1c1917" : v.rimColor;
  const overmoldRingWidth = v.overmold ? 5 : 2;
  const turnText = disc.turn > 0 ? `+${disc.turn}` : disc.turn;

  return `
    <svg viewBox="0 0 100 100" role="img" aria-label="${disc.brand} ${disc.mold} disc illustration">
      <!-- Outer Disc Wing / Rim -->
      <circle cx="50" cy="50" r="46" fill="${v.rimColor}" stroke="${outerRimStroke}" stroke-width="${overmoldRingWidth}" />
      <!-- Flight Plate -->
      <circle cx="50" cy="50" r="${plateRadius}" fill="${v.discColor}" stroke="rgba(255,255,255,0.22)" stroke-width="1" />
      <!-- Hot-Stamp Foil Rings -->
      <circle cx="50" cy="50" r="24" fill="none" stroke="${v.stampColor}" stroke-width="1.2" stroke-dasharray="3 2" opacity="0.85" />
      <circle cx="50" cy="50" r="20" fill="none" stroke="${v.stampColor}" stroke-width="0.75" opacity="0.6" />
      <!-- Hot-Stamp Brand & Mold Typography -->
      <text x="50" y="42" text-anchor="middle" fill="${v.stampColor}" font-size="6.2" font-weight="800" letter-spacing="0.8">${disc.brand.toUpperCase()}</text>
      <text x="50" y="52" text-anchor="middle" fill="${v.stampColor}" font-size="8.2" font-weight="900">${disc.mold.toUpperCase()}</text>
      <text x="50" y="61" text-anchor="middle" fill="${v.stampColor}" font-size="5.8" font-family="monospace" font-weight="700" opacity="0.9">${disc.speed}|${disc.glide}|${turnText}|${disc.fade}</text>
    </svg>
  `;
}

/**
 * 4. CORE RECOMMENDATION ENGINE
 */
function runRecommendationUpdate() {
  const skill = getRadioValue("skill");
  const category = getRadioValue("category");
  const throwStyle = getRadioValue("throwStyle");
  const missTendency = getRadioValue("missTendency");

  // Update the summary pill at the top of the Results Page
  const summaryPill = document.getElementById("profile-summary-pill");
  const styleLabel = throwStyle === "RHBH" ? "RHBH" : "Forehand / Lefty";
  if (summaryPill) {
    summaryPill.textContent = `Fitting Profile: ${skill} \u2022 ${category} \u2022 ${styleLabel}`;
  }

  const diagnosis = diagnoseStabilityNeed(throwStyle, missTendency, skill);

  // Filter discs by chosen Category (Distance Driver, Fairway Driver, Midrange, Putter)
  let candidates = discCatalog.filter((d) => d.category === category);
  if (candidates.length === 0) {
    candidates = [...discCatalog];
  }

  // Score every candidate disc in that category
  const scoredCandidates = candidates.map((disc) => {
    let score = 0;

    // A) Stability Match (Highest Priority: +45 points)
    if (disc.stability === diagnosis.neededStability) {
      score += 45;
    } else if (disc.stability === "Stable") {
      score += 18;
    }

    // B) Skill-Tier Match & Speed Rating Guardrails
    if (disc.recommendedSkill === skill) {
      score += 30;
    } else if (
      (skill === "Intermediate" && disc.recommendedSkill === "Beginner") ||
      (skill === "Advanced" && disc.recommendedSkill === "Intermediate")
    ) {
      score += 15;
    }

    if (skill === "Beginner") {
      if (disc.speed <= 9) score += 20;
      if (disc.speed >= 12) score -= 25;
      score += disc.glide * 2 + Math.abs(Math.min(0, disc.turn)) * 3;
    } else if (skill === "Intermediate") {
      if (disc.speed <= 12) score += 15;
      if (disc.speed >= 13) score -= 10;
    } else if (skill === "Advanced") {
      if (disc.speed >= 9 || category === "Putter" || category === "Midrange") {
        score += 15;
      }
    }

    // C) Fine-tune flight numbers based on needed stability
    if (diagnosis.neededStability === "Understable") {
      score += Math.abs(Math.min(0, disc.turn)) * 4 - disc.fade * 3;
    } else if (diagnosis.neededStability === "Overstable") {
      score += disc.fade * 5 - Math.abs(Math.min(0, disc.turn)) * 4;
    } else {
      const netOffset = Math.abs(disc.turn + disc.fade);
      score += Math.max(0, 12 - netOffset * 5);
    }

    return { disc, score };
  });

  scoredCandidates.sort((a, b) => b.score - a.score);

  const allRankedDiscs = scoredCandidates.map((item) => item.disc);
  const topFour = allRankedDiscs.slice(0, 4);
  const remainingDiscs = allRankedDiscs.slice(4);
  const winner = topFour[0];

  if (winner) {
    document.getElementById("rec-badge").textContent = "#1 BAG FIT";
    renderSpotlightDisc(winner, diagnosis, throwStyle, skill);
    renderDiscCardsGrid("alternatives-grid", topFour, diagnosis, throwStyle, skill, 0);
    renderDiscCardsGrid("all-recommendations-grid", remainingDiscs, diagnosis, throwStyle, skill, 4);
  }
}

/**
 * Maps Throw Style + Miss Tendency -> Target Stability ("Understable", "Stable", "Overstable")
 */
function diagnoseStabilityNeed(throwStyle, missTendency, skill) {
  if (missTendency === "wants_neutral") {
    return {
      neededStability: "Stable",
      reasonText: `Because your release angle is flat and you want dead-straight control at ${skill.toLowerCase()} arm speed, this neutral mold balances subtle high-speed turn with a gentle, predictable finish.`
    };
  }

  if (throwStyle === "RHBH") {
    if (missTendency === "hooks_left") {
      return {
        neededStability: "Understable",
        reasonText: `Because your RHBH throws are stalling out and hooking left early, this Understable mold uses negative High-Speed Turn to drift right early and extend your glide before a gentle finish.`
      };
    } else {
      return {
        neededStability: "Overstable",
        reasonText: `Because your RHBH throws are flipping over to the right, this Overstable mold brings high torque resistance (0 Turn and strong Fade) so you can throw full power and trust it to finish left.`
      };
    }
  }

  if (missTendency === "hooks_right") {
    return {
      neededStability: "Understable",
      reasonText: `With a Forehand / Lefty Backhand release, dumping right early means the disc is too overstable for your launch speed. This Understable mold flips to flat and glides straight before fading.`
    };
  } else {
    return {
      neededStability: "Overstable",
      reasonText: `With a Forehand / Lefty Backhand release, burning over to the left comes from off-axis torque overpowering the rim. This Overstable mold resists turning left and delivers a dependable finish.`
    };
  }
}

/**
 * 5. RENDERING THE SPOTLIGHT RECOMMENDATION, DISC STAMP, & PLASTIC PRESCRIPTION
 */
function renderSpotlightDisc(disc, diagnosis, throwStyle, skill) {
  document.getElementById("rec-stability-badge").textContent = disc.stability;
  document.getElementById("rec-brand-kicker").textContent = disc.brand.toUpperCase();
  document.getElementById("rec-title").textContent = `${disc.brand} ${disc.mold}`;
  document.getElementById("rec-category-line").textContent =
    `${disc.category} \u2022 Matched for ${skill} Arm Speed`;

  // Render Top-Down SVG Disc Stamp Graphic
  const artContainer = document.getElementById("spotlight-disc-art");
  if (artContainer) {
    artContainer.innerHTML = generateDiscSvgMarkup(disc);
  }

  // Populate 4-Number Flight Rating Boxes
  document.getElementById("fn-speed").textContent = disc.speed;
  document.getElementById("fn-glide").textContent = disc.glide;
  document.getElementById("fn-turn").textContent = disc.turn > 0 ? `+${disc.turn}` : disc.turn;
  document.getElementById("fn-fade").textContent = disc.fade;

  // Populate Diagnostic Explanation & Caddie Field Note
  document.getElementById("rec-reason").textContent = diagnosis.reasonText;
  document.getElementById("rec-caddie-note").textContent =
    `"${disc.caddieNote || disc.description}"`;

  // Populate Plastic & Weight Prescription tailored to the user's Skill Tier
  const plasticEl = document.getElementById("rec-plastic-guide");
  if (plasticEl) {
    const defaultGuide =
      skill === "Beginner"
        ? "Base or Mid-grade flexible plastic in 160–167g for easier turn and extra glide"
        : skill === "Intermediate"
        ? "Premium grip plastic in 168–172g for seasoned workhorse control"
        : "Max-weight premium plastic in 173–175g for full torque resistance";
    plasticEl.textContent =
      disc.plasticGuide && disc.plasticGuide[skill] ? disc.plasticGuide[skill] : defaultGuide;
  }

  // Build compliant Amazon Associates URL & clear Amazon.com button label
  const amazonBtn = document.getElementById("rec-amazon-link");
  const amazonLabel = document.getElementById("rec-amazon-label");
  amazonBtn.href = buildCompliantAmazonUrl(disc);
  amazonLabel.textContent = `Shop ${disc.brand} ${disc.mold} on Amazon.com`;

  // Draw the SVG flight trajectory curve
  renderFlightChart(disc, throwStyle, skill);
}

/**
 * Ensures the Amazon link is properly formatted with a single `tag` parameter
 * and uses full https://www.amazon.com URL structure (no link cloaking).
 */
function buildCompliantAmazonUrl(disc) {
  if (disc.amazonUrl && disc.amazonUrl.startsWith("https://www.amazon.com/")) {
    return disc.amazonUrl.replace("buildmybag-20", AMAZON_ASSOCIATE_TAG);
  }
  const query = encodeURIComponent(`${disc.brand} ${disc.mold} disc golf`);
  return `https://www.amazon.com/s?k=${query}&tag=${encodeURIComponent(AMAZON_ASSOCIATE_TAG)}`;
}

/**
 * Renders disc cards into either the top 4 runner-up grid or the "View All" drawer.
 * Includes mini disc stamp art, non-wrapping flight numbers, caddie note, and direct Amazon link.
 */
function renderDiscCardsGrid(containerId, discs, diagnosis, throwStyle, skill, indexOffset) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = "";

  discs.forEach((disc, idx) => {
    const rankNumber = indexOffset + idx + 1;
    const turnFormatted = disc.turn > 0 ? `+${disc.turn}` : disc.turn;
    const amazonHref = buildCompliantAmazonUrl(disc);

    const card = document.createElement("div");
    card.className = `alt-item ${rankNumber === 1 ? "active-alt" : ""}`;
    card.innerHTML = `
      <div class="alt-card-top">
        <div class="alt-Identity">
          <div class="alt-mini-disc" aria-hidden="true">${generateDiscSvgMarkup(disc)}</div>
          <div class="alt-info">
            <span class="alt-name">#${rankNumber} ${disc.brand} ${disc.mold}</span>
            <span class="option-desc">${disc.stability} ${disc.category}</span>
          </div>
        </div>
        <span class="alt-numbers" title="Speed | Glide | Turn | Fade">${disc.speed} / ${disc.glide} / ${turnFormatted} / ${disc.fade}</span>
      </div>
      <p class="alt-caddie-snippet">${disc.caddieNote || disc.description}</p>
      <div class="alt-card-footer">
        <span class="alt-preview-hint">&uarr; Click card to load flight path</span>
        <a
          href="${amazonHref}"
          target="_blank"
          rel="nofollow sponsored noopener noreferrer"
          class="alt-amazon-mini"
        >Shop on Amazon.com &rarr;</a>
      </div>
    `;

    // Prevent clicking the direct Amazon button from just scrolling up without opening Amazon
    const miniLink = card.querySelector(".alt-amazon-mini");
    if (miniLink) {
      miniLink.addEventListener("click", (e) => {
        e.stopPropagation();
      });
    }

    card.addEventListener("click", () => {
      document.querySelectorAll(".alt-item").forEach((el) => el.classList.remove("active-alt"));
      card.classList.add("active-alt");
      document.getElementById("rec-badge").textContent =
        rankNumber === 1 ? "#1 BAG FIT" : `MATCH #${rankNumber}`;
      renderSpotlightDisc(disc, diagnosis, throwStyle, skill);
      document.querySelector(".results-grid").scrollIntoView({ behavior: "smooth" });
    });

    container.appendChild(card);
  });
}

/**
 * 6. FLAT DRAFTING-STYLE SVG FLIGHT PATH VISUALIZER
 */
function drawSvgGridBackground() {
  const gridLayer = document.getElementById("svg-grid-layer");
  const distances = [
    { y: 340, label: "100 ft" },
    { y: 260, label: "200 ft" },
    { y: 180, label: "300 ft" },
    { y: 100, label: "400 ft" }
  ];

  let svgMarkup = "";
  distances.forEach((row) => {
    svgMarkup += `
      <line x1="30" y1="${row.y}" x2="330" y2="${row.y}" stroke="#e2dcd0" stroke-width="1" />
      <text x="36" y="${row.y - 6}" fill="#786f65" font-size="11" font-family="sans-serif">${row.label}</text>
    `;
  });

  svgMarkup += `
    <text x="36" y="30" fill="#786f65" font-size="10" font-weight="bold">LEFT SIDE</text>
    <text x="268" y="30" fill="#786f65" font-size="10" font-weight="bold">RIGHT SIDE</text>
  `;
  gridLayer.innerHTML = svgMarkup;
}

function renderFlightChart(disc, throwStyle, skill) {
  const pathMain = document.getElementById("svg-flight-path");
  const waypointsLayer = document.getElementById("svg-waypoints-layer");
  const subtitle = document.getElementById("chart-subtitle");

  const mirror = throwStyle === "RHBH" ? 1 : -1;

  subtitle.textContent =
    throwStyle === "RHBH"
      ? `${disc.brand} ${disc.mold} (${disc.speed} | ${disc.glide} | ${disc.turn} | ${disc.fade}) \u2022 RHBH Flight`
      : `${disc.brand} ${disc.mold} (${disc.speed} | ${disc.glide} | ${disc.turn} | ${disc.fade}) \u2022 Forehand / Lefty Flight`;

  const startX = 180;
  const startY = 420;

  const skillPowerFactor = skill === "Beginner" ? 0.78 : skill === "Intermediate" ? 0.9 : 1.0;
  const totalFlightLength = (145 + disc.speed * 13 + disc.glide * 9) * skillPowerFactor;
  const endY = Math.max(52, Math.round(startY - totalFlightLength));

  const turnPull = -disc.turn * 26 * mirror;
  const netLandingShift = (-disc.turn * 14 - disc.fade * 22) * mirror;
  const endX = Math.max(45, Math.min(315, Math.round(startX + netLandingShift)));

  const cp1X = Math.max(30, Math.min(330, Math.round(startX + turnPull * 1.35)));
  const cp1Y = Math.round(startY - totalFlightLength * 0.45);

  const cp2X = Math.max(30, Math.min(330, Math.round(startX + turnPull * 0.95)));
  const cp2Y = Math.round(startY - totalFlightLength * 0.82);

  const dString = `M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${endY}`;
  pathMain.setAttribute("d", dString);

  const apexX = Math.round(0.125 * startX + 0.375 * cp1X + 0.375 * cp2X + 0.125 * endX);
  const apexY = Math.round(0.125 * startY + 0.375 * cp1Y + 0.375 * cp2Y + 0.125 * endY);

  waypointsLayer.innerHTML = `
    <!-- Tee Pad Marker -->
    <rect x="${startX - 14}" y="${startY - 4}" width="28" height="8" rx="2" fill="#1c1917" />
    <text x="${startX}" y="${startY + 18}" text-anchor="middle" fill="#57534e" font-size="11" font-weight="bold">TEE PAD</text>

    <!-- High-Speed Turn Apex Dot -->
    <circle cx="${apexX}" cy="${apexY}" r="5" fill="#e06d1b" stroke="#ffffff" stroke-width="2" />
    <text x="${apexX + (mirror === 1 ? 10 : -10)}" y="${apexY + 4}" text-anchor="${mirror === 1 ? "start" : "end"}" fill="#b85009" font-size="10" font-weight="bold">Turn (${disc.turn})</text>

    <!-- Final Landing Disc Marker -->
    <circle cx="${endX}" cy="${endY}" r="8" fill="#c83e2b" stroke="#ffffff" stroke-width="2" />
    <text x="${endX}" y="${endY - 14}" text-anchor="middle" fill="#1c1917" font-size="11" font-weight="bold">${disc.mold} (Fade ${disc.fade})</text>
  `;
}

/**
 * Helper to read the currently selected radio value by group name
 */
function getRadioValue(name) {
  const checked = document.querySelector(`input[name="${name}"]:checked`);
  return checked ? checked.value : "";
}
