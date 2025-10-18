"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import LogoPLM from "@/components/LogoPLM";

type Item = { index: number; score: number; note?: string };
type Result = {
  finalLMI: number;
  rawLMS: number;
  riAdjusted: number;
  topDrainers?: Item[];
  topUplifters?: Item[];
};

// --- Question → Category mapping (24 Qs) ---
const QUESTIONS = [
  "Life direction / sense of trajectory",           // 0
  "Alignment with personal values",                 // 1
  "Sense of purpose / meaning",                     // 2
  "Personal growth / learning",                     // 3
  "Pride in overcoming challenges",                 // 4
  "Emotional connection to close people",           // 5
  "Support from family / friends",                  // 6
  "Romantic / intimate fulfillment",                // 7
  "Contribution / helping others",                  // 8
  "Authentic self-expression",                      // 9
  "Control over time / schedule",                   // 10
  "Work meaning / responsibility quality",          // 11
  "Manageable workload / routine",                  // 12
  "Freedom to choose / autonomy",                   // 13
  "Financial security",                             // 14
  "Physical health & energy",                       // 15
  "Rest & sleep quality",                           // 16
  "Nutrition & self-care",                          // 17
  "Motivation to care for body",                    // 18
  "Comfort / confidence in own skin",               // 19
  "Stress / anxiety management",                    // 20
  "Emotional balance / calm",                       // 21
  "Hopefulness about the future",                   // 22
  "Inner peace / contentment",                      // 23
] as const;

type DomainKey = "direction" | "connection" | "work" | "autonomy" | "money" | "health" | "emotion" | "peace" | "growth" | "self";

const INDEX_TO_DOMAIN: Record<number, DomainKey> = {
  0:"direction", 1:"direction", 2:"direction",
  3:"growth", 4:"growth",
  5:"connection", 6:"connection", 7:"connection",
  8:"self", 9:"self",
  10:"autonomy",
  11:"work", 12:"work",
  13:"autonomy",
  14:"money",
  15:"health", 16:"health", 17:"health", 18:"health", 19:"health",
  20:"emotion", 21:"emotion",
  22:"peace", 23:"peace",
};

// --- Copy blocks for low/high by domain (friendly future-self tone) ---
const TALK: Record<
  DomainKey,
  { title: string; low: string[]; high: string[]; emoji: string }
> = {
  direction: {
    title: "Direction & Purpose",
    emoji: "🧭",
    low: [
      "Let’s choose one small target for this week — something finishable in 30–40 minutes. Momentum first, clarity next.",
      "Write a 3-line vision for 90 days from now. Mail it to yourself. Future you is already proud.",
      "Book a 20-minute ‘strategy walk’. No phone, just steps and one question: “What would 8/10 look like?”",
    ],
    high: [
      "Protect your direction: schedule one sacred block this week where you move the needle (no notifications).",
      "Capture your wins in two lines each night. You’re building proof you can trust.",
    ],
  },
  connection: {
    title: "Relationships & Belonging",
    emoji: "🤝",
    low: [
      "Send one honest check-in to someone safe: 'No need to fix — just keeping you close.'",
      "Pick a low-effort ritual (tea call, 10-min voice note Sunday). Consistency beats intensity.",
      "Put one boundary in writing this week. Clear is kind — to them and to you.",
    ],
    high: [
      "Name the people who lift you and tell them why. Reinforce the bridges that carry you.",
      "Plan a micro-gathering. Shared laughter is renewable energy.",
    ],
  },
  work: {
    title: "Work & Meaning",
    emoji: "💼",
    low: [
      "Make a ‘2-hour island’: deep work on one meaningful task. No drowning in small fires today.",
      "Close loops. List three nagging tasks and retire them — tiny endings free big energy.",
      "Commute pressure? Pair it with something you love (playlist, audiobook, language app).",
    ],
    high: [
      "Protect the craft. Block one skill-building session this week — future raises begin here.",
      "Teach one thing you know to a teammate. Meaning compounds when shared.",
    ],
  },
  autonomy: {
    title: "Time & Freedom",
    emoji: "⏱️",
    low: [
      "Say no once this week (kindly, clearly). Every no buys a yes for what matters.",
      "Try a 90-minute focus / 15-minute reset rhythm. Your attention deserves structure.",
    ],
    high: [
      "Design your best hours. Put your top-energy tasks in your top-energy window.",
      "Keep a ‘Do Less’ list. Subtraction is a power move.",
    ],
  },
  money: {
    title: "Finances",
    emoji: "💵",
    low: [
      "Name the number. One target (buffer, debt chunk, or save goal) — then one action this week.",
      "Automate a tiny transfer on payday. Momentum > magnitude at the start.",
    ],
    high: [
      "Increase the auto-transfer by 1–2%. You won’t feel it now; you’ll thank you later.",
      "Attach money to meaning. Fund the life you’re actually building.",
    ],
  },
  health: {
    title: "Health & Energy",
    emoji: "💪",
    low: [
      "Pick one: water, 10-minute walk, or bedtime 20 minutes earlier — choose one and win it daily.",
      "Stack habits: after brushing teeth → 10 bodyweight squats. Make it too small to skip.",
      "If the gym feels heavy, start with a ‘drive-to-the-gym’ win. Showing up counts.",
    ],
    high: [
      "Progressive overload life: add a rep, a set, or 2 minutes. Celebrate the tiny upgrade.",
      "Teach your future self: write 3 cues that always get you moving.",
    ],
  },
  emotion: {
    title: "Stress & Emotional Balance",
    emoji: "🌤️",
    low: [
      "Box-breathing 3× today (4-in / 4-hold / 4-out / 4-hold). Reset is a skill.",
      "Name it to tame it: write the feeling + the trigger. You’re not the storm — you’re the sky.",
    ],
    high: [
      "Anchor the calm: 2 minutes of breath before tough conversations. Keep your gains.",
      "Share your regulation trick with someone who needs it. Leadership is regulated nervous systems.",
    ],
  },
  peace: {
    title: "Hope & Peace",
    emoji: "🕊️",
    low: [
      "Postcard to future you: 3 lines, mailed 90 days out. Hope scheduled is hope kept.",
      "Shrink the day: one thing to do, one thing to feel, one thing to enjoy.",
    ],
    high: [
      "Guard your mornings. Start with something that keeps the heart quiet.",
      "Make a ‘joy cache’: photos, quotes, songs that reset you in 60 seconds.",
    ],
  },
  growth: {
    title: "Growth & Pride",
    emoji: "📈",
    low: [
      "Do one ‘difficult but doable’ thing today. Pride needs reps.",
      "Log a ‘challenge → response → lesson’ in 3 lines. That’s resilience training.",
    ],
    high: [
      "Pick a micro-goal for 7 days. Track it visibly. Compounding is the point.",
      "Pass the torch: help someone clear the hurdle you just cleared.",
    ],
  },
  self: {
    title: "Self-expression & Contribution",
    emoji: "✨",
    low: [
      "Make a 10-minute ‘honest page’. No edits, no audience — permission granted.",
      "Do one tiny act of service in secret. Meaning without applause hits different.",
    ],
    high: [
      "Ship something small this week: a note, a sketch, a thought. Express, don’t impress.",
      "Name your lane in one sentence. Simplicity sharpens contribution.",
    ],
  },
};

// derive top domain summaries from items
function domainTally(items: Item[] | undefined) {
  const map = new Map<DomainKey, number>();
  (items || []).forEach(it => {
    const dom = INDEX_TO_DOMAIN[it.index];
    if (!dom) return;
    map.set(dom, (map.get(dom) || 0) + 1);
  });
  // sort by count desc
  return [...map.entries()].sort((a, b) => b[1] - a[1]);
}

export default function NextStepsPage() {
  const router = useRouter();
  const [result, setResult] = useState<Result | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("LMI_RESULT");
      if (raw) setResult(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, []);

  const drainersTop = useMemo(() => domainTally(result?.topDrainers), [result]);
  const upliftersTop = useMemo(() => domainTally(result?.topUplifters), [result]);

  // pick up to 2 domains for each side
  const lowDomains = (drainersTop.slice(0, 2).map(([k]) => k)) as DomainKey[];
  const highDomains = (upliftersTop.slice(0, 2).map(([k]) => k)) as DomainKey[];

  return (
    <div className="main grid" style={{ gap: 18 }}>
      <div className="header">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <LogoPLM size={40} />
          <h1 style={{ margin: 0 }}>Next Steps for You</h1>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button className="btn" onClick={() => router.push("/results")}>Back to results</button>
          <button className="btn ghost" onClick={() => router.push("/")}>Home</button>
        </div>
      </div>

      {!result && (
        <div className="card">
          <div className="label">No data</div>
          <p className="muted">Run the survey first so I can tailor this page to you.</p>
          <button className="btn primary" onClick={() => router.push("/survey")}>Start survey</button>
        </div>
      )}

      {result && (
        <>
          <div className="card" style={{ background: "var(--panelTint)" }}>
            <div className="label">Your baseline</div>
            <div className="kpi" style={{ marginTop: 6 }}>
              <div className="pill"><b>LMI:</b> {result.finalLMI?.toFixed?.(2)}</div>
              <div className="pill"><b>RI-adj:</b> {result.riAdjusted?.toFixed?.(2)}</div>
              <div className="pill"><b>Raw LMS:</b> {result.rawLMS?.toFixed?.(2)}</div>
            </div>
            <p className="muted" style={{ marginTop: 6 }}>
              We’ll protect what lifts you and nudge what drains you — one small win at a time.
            </p>
          </div>

          {/* Lowlights */}
          <div className="card">
            <div className="label">Lower-scoring themes</div>
            {!lowDomains.length ? (
              <p className="muted">No strong drainers detected. Beautiful — keep momentum.</p>
            ) : (
              <div style={{ display: "grid", gap: 12 }}>
                {lowDomains.map((key) => {
                  const pack = TALK[key];
                  return (
                    <div key={`low-${key}`} className="card" style={{ background: "#fff" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                        <span style={{ fontSize: 20 }}>{pack.emoji}</span>
                        <b className="label-strong">{pack.title} — tiny lifts</b>
                      </div>
                      <ul style={{ margin: "6px 0 0 18px" }}>
                        {pack.low.slice(0, 3).map((t, i) => <li key={i}>{t}</li>)}
                      </ul>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Highlights */}
          <div className="card">
            <div className="label">Higher-scoring strengths</div>
            {!highDomains.length ? (
              <p className="muted">No clear strengths stood out — that’s okay. We’ll build some.</p>
            ) : (
              <div style={{ display: "grid", gap: 12 }}>
                {highDomains.map((key) => {
                  const pack = TALK[key];
                  return (
                    <div key={`high-${key}`} className="card" style={{ background: "#fff" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                        <span style={{ fontSize: 20 }}>{pack.emoji}</span>
                        <b className="label-strong">{pack.title} — keep fueling</b>
                      </div>
                      <ul style={{ margin: "6px 0 0 18px" }}>
                        {pack.high.slice(0, 2).map((t, i) => <li key={i}>{t}</li>)}
                      </ul>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Closing nudge */}
          <div className="card">
            <div className="label">This week</div>
            <ul style={{ margin: "8px 0" }}>
              <li>Pick <b>one</b> tiny action from the low theme that resonated.</li>
              <li>Book it in your calendar. A win on the calendar becomes a win in your day.</li>
              <li>Protect <b>one</b> strength with a recurring time block.</li>
            </ul>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 8 }}>
              <button className="btn" onClick={() => router.push("/results")}>Back to results</button>
              <button className="btn primary" onClick={() => router.push("/survey")}>Retake survey</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
