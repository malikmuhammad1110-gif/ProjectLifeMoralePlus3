// lib/scoring.ts
// Full Life Morale model: 24-Q calibration (10→8.75), 168h time map, RI, ELI ceiling, optional Cross-Lift.

export type Answer = { score?: number; note?: string };
export type TimeCategory =
  | "Sleep" | "Work" | "Commute" | "Relationships" | "Leisure"
  | "Health" | "Chores" | "Growth" | "Other";
export type TimeRow = { category: TimeCategory; hours: number; ri: number };

export type DimensionKey = "Fulfillment" | "Connection" | "Autonomy" | "Vitality" | "Peace";

export type Input = {
  answers: Answer[];      // 24 items, 1–10
  timeMap: TimeRow[];     // 9 categories, hours per week
  ELI: number;            // 1–10 (1 baseline)
  config?: Partial<Config>;
};

export type Output = {
  calibrated: { current: (number|undefined)[] };
  sectionAverages: { current: Record<DimensionKey, number | null> };
  rawLMS: number;            // time-weighted quality
  riAdjusted: number;        // after residual influence factor
  finalLMI: number;          // after ELI (ceiling)
  rawLMS_scn: number;        // kept for compatibility (same as rawLMS now)
  riAdjusted_scn: number;    // kept for compatibility (same as riAdjusted)
  finalLMI_scn: number;      // kept for compatibility (same as finalLMI)
  topDrainers: { index: number; score: number; note?: string }[];
  topUplifters: { index: number; score: number; note?: string }[];
};

export type Config = {
  calibration: { k: number; max: number };           // 10 → max (default 8.75)
  ri: { globalMultiplier: number };                  // effect scale (±)
  crossLift: { enabled: boolean; alpha: number };    // spillover lifting Work
};

const DEFAULT_CONFIG: Config = {
  calibration: { k: 1.936428228, max: 8.75 },
  ri: { globalMultiplier: 1 },
  crossLift: { enabled: false, alpha: 20 },
};

const DIM_MAP: Record<DimensionKey, number[]> = {
  Fulfillment: [0, 1, 2, 3, 4],
  Connection:  [5, 6, 7, 8, 9],
  Autonomy:    [10,11,12,13,14],
  Vitality:    [15,16,17,18,19],
  Peace:       [20,21,22,23],
};

function clamp(v: number, lo: number, hi: number){ return Math.max(lo, Math.min(hi, v)); }

// RI 1–10 → internal −0.30 … +0.30 (neutral 5)
function riToInternal(ri?: number) {
  if (ri == null) return 0;
  if (ri < 5)  return (ri - 5) * 0.075;   // 1 → -0.30
  if (ri === 5) return 0;
  return (ri - 5) * 0.06;                 // 10 → +0.30
}

// Calibrate 1–10 to realistic ceiling (10 → max, default 8.75)
function calibrate(s?: number, k = DEFAULT_CONFIG.calibration.k, max = DEFAULT_CONFIG.calibration.max) {
  if (s == null) return undefined;
  const x = clamp(s, 1, 10);
  const num = 1 - Math.exp(-k * (x/10));
  const den = 1 - Math.exp(-k);
  return max * (num/den);
}

function avg(nums: (number | undefined)[]) {
  const v = nums.filter((n): n is number => typeof n === "number" && !Number.isNaN(n));
  if (!v.length) return null;
  return v.reduce((a, b) => a + b, 0) / v.length;
}

function qualityFromSections(
  d: Record<DimensionKey, number | null>,
  base: number | null
) {
  // Map sections → domain qualities (fallback to base)
  return {
    Work:           d.Autonomy ?? base ?? 0,
    Commute:        d.Peace ?? base ?? 0,
    Health:         d.Vitality ?? base ?? 0,
    Relationships:  d.Connection ?? base ?? 0,
    Leisure:        d.Fulfillment ?? base ?? 0,
    Other:          base ?? 0,
  };
}

export function scoreLMI(input: Input): Output {
  const cfg: Config = {
    calibration: input.config?.calibration ?? DEFAULT_CONFIG.calibration,
    ri:          input.config?.ri ?? DEFAULT_CONFIG.ri,
    crossLift:   input.config?.crossLift ?? DEFAULT_CONFIG.crossLift,
  };

  // 1) Calibrate 24 answers (current only)
  const current = input.answers.map(a => calibrate(a.score, cfg.calibration.k, cfg.calibration.max));

  // 2) Section averages (5 dimensions)
  const sectionCurrent: Record<DimensionKey, number | null> = {
    Fulfillment: avg(DIM_MAP.Fulfillment.map(i => current[i])),
    Connection:  avg(DIM_MAP.Connection.map(i => current[i])),
    Autonomy:    avg(DIM_MAP.Autonomy.map(i => current[i])),
    Vitality:    avg(DIM_MAP.Vitality.map(i => current[i])),
    Peace:       avg(DIM_MAP.Peace.map(i => current[i])),
  };

  const baseAvgAll    = avg(current);

  // 3) Time map & defaults
  const find = (c: TimeCategory) =>
    input.timeMap.find(r => r.category === c) ??
    { category: c, hours: c === "Sleep" ? 49 : 0, ri: 5 };

  const by = {
    Sleep:          find("Sleep"),
    Work:           find("Work"),
    Commute:        find("Commute"),
    Relationships:  find("Relationships"),
    Leisure:        find("Leisure"),
    Health:         find("Health"),
    Chores:         find("Chores"),
    Growth:         find("Growth"),
    Other:          find("Other"),
  };

  const awakeHours = Math.max(0, 168 - by.Sleep.hours);
  const allocatedAwake = by.Work.hours + by.Commute.hours + by.Health.hours + by.Relationships.hours + by.Leisure.hours;
  const otherAwake = Math.max(0, awakeHours - allocatedAwake); // auto-fills "Other" if under-allocated

  // 4) Domain qualities
  const dimQ   = qualityFromSections(sectionCurrent,  baseAvgAll);

  // Optional Cross-Lift: relationships/health/leisure can lift Work quality
  let workQ = dimQ.Work;
  if (cfg.crossLift.enabled) {
    const relFrac  = awakeHours ? by.Relationships.hours / awakeHours : 0;
    const hlthFrac = awakeHours ? by.Health.hours / awakeHours : 0;
    const leisFrac = awakeHours ? by.Leisure.hours / awakeHours : 0;

    const relRI  = Math.max(0, riToInternal(by.Relationships.ri));
    const hlthRI = Math.max(0, riToInternal(by.Health.ri));
    const leisRI = Math.max(0, riToInternal(by.Leisure.ri));

    const uplift = cfg.crossLift.alpha * (relFrac*relRI + hlthFrac*hlthRI + leisFrac*leisRI) * ((10 - workQ) / 10);
    workQ = clamp(workQ + uplift, 1, 10);
  }

  const commuteQ = dimQ.Commute;
  const healthQ  = dimQ.Health;
  const relQ     = dimQ.Relationships;
  const leisQ    = dimQ.Leisure;
  const otherQ   = dimQ.Other;

  // 5) Sleep depends on average awake quality
  const awakeWeighted =
    (by.Work.hours      * workQ)    +
    (by.Commute.hours   * commuteQ) +
    (by.Health.hours    * healthQ)  +
    (by.Relationships.hours * relQ) +
    (by.Leisure.hours   * leisQ)    +
    (otherAwake         * otherQ);

  const awakeAvg = awakeHours ? (awakeWeighted / awakeHours) : 0;
  const sleepQ   = (10 + awakeAvg) / 2; // sleep quality lifted by better days

  // 6) Raw LMS: full 168h blend
  const rawLMS =
    (awakeWeighted + by.Sleep.hours * sleepQ) / 168;

  // 7) Residual Influence (RI) — net effect across week
  const netRI =
    (by.Work.hours/168)          * riToInternal(by.Work.ri) +
    (by.Commute.hours/168)       * riToInternal(by.Commute.ri) +
    (by.Health.hours/168)        * riToInternal(by.Health.ri) +
    (by.Relationships.hours/168) * riToInternal(by.Relationships.ri) +
    (by.Leisure.hours/168)       * riToInternal(by.Leisure.ri) +
    (otherAwake/168)             * riToInternal(by.Other.ri);

  const riAdjusted = rawLMS * (1 + cfg.ri.globalMultiplier * netRI);

  // 8) ELI ceiling
  const LMC = 10 - 0.2 * (input.ELI ?? 1); // higher ELI lowers the ceiling slightly
  const finalLMI = riAdjusted * (LMC / 10);

  // Top 3 drainers / uplifters from raw user scores
  const baseScores = input.answers.map(a => a.score ?? NaN);
  const idxs = baseScores.map((s, i) => ({ i, s })).filter(x => !Number.isNaN(x.s));
  const drains = [...idxs].sort((a, b) => a.s - b.s).slice(0, 3).map(x => ({ index: x.i, score: x.s, note: input.answers[x.i].note }));
  const lifts  = [...idxs].sort((a, b) => b.s - a.s).slice(0, 3).map(x => ({ index: x.i, score: x.s, note: input.answers[x.i].note }));

  return {
    calibrated: { current },
    sectionAverages: { current: sectionCurrent },
    rawLMS, riAdjusted, finalLMI,
    rawLMS_scn: rawLMS, riAdjusted_scn: riAdjusted, finalLMI_scn: finalLMI, // compatibility
    topDrainers: drains, topUplifters: lifts,
  };
}
