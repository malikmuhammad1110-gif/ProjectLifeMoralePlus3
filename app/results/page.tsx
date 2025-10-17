"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

/** 24-question mapping → 5 dimensions */
type Dim = "Fulfillment" | "Connection" | "Autonomy" | "Vitality" | "Peace";
const Q2DIM: Dim[] = [
  // 1–5 Fulfillment
  "Fulfillment","Fulfillment","Fulfillment","Fulfillment","Fulfillment",
  // 6–10 Connection
  "Connection","Connection","Connection","Connection","Connection",
  // 11–15 Autonomy
  "Autonomy","Autonomy","Autonomy","Autonomy","Autonomy",
  // 16–20 Vitality
  "Vitality","Vitality","Vitality","Vitality","Vitality",
  // 21–24 Peace
  "Peace","Peace","Peace","Peace",
];

const QUESTIONS = [
  "Life direction / sense of trajectory",
  "Alignment with personal values",
  "Sense of purpose / meaning",
  "Personal growth / learning",
  "Pride in overcoming challenges",
  "Emotional connection to close people",
  "Support from family / friends",
  "Romantic / intimate fulfillment",
  "Contribution / helping others",
  "Authentic self-expression",
  "Control over time / schedule",
  "Work meaning / responsibility quality",
  "Manageable workload / routine",
  "Freedom to choose / autonomy",
  "Financial security",
  "Physical health & energy",
  "Rest & sleep quality",
  "Nutrition & self-care",
  "Motivation to care for body",
  "Comfort / confidence in own skin",
  "Stress / anxiety management",
  "Emotional balance / calm",
  "Hopefulness about the future",
  "Inner peace / contentment",
];

/** Feedback templates per dimension */
const LOW_MSG: Record<Dim,string> = {
  Fulfillment:
    "You may be feeling low direction or meaning. Choose one small weekly goal aligned to your values—something personally meaningful, not just productive.",
  Connection:
    "Disconnection or tension can weigh heavily. Do one intentional reach-out this week—a call, coffee, or gratitude text—to rebuild warmth.",
  Autonomy:
    "If work/finances feel tight, reduce decision fatigue. Simplify routines, prep ahead, and protect one boundary to regain control.",
  Vitality:
    "Energy and rest might need care. Aim for a steady sleep window, short daily walks, and simple nourishing meals to lift your baseline.",
  Peace:
    "Stress can dim everything. Add a 3–5 minute reset ritual (deep breathing, journaling, or quiet pause) between tasks to settle your system.",
};

const HIGH_MSG: Record<Dim,string> = {
  Fulfillment:
    "Your sense of meaning is a major anchor. Keep one weekly practice that grows you—learning, creating, or serving—in the calendar.",
  Connection:
    "Strong bonds are fueling you. Keep showing appreciation and scheduling time together—consistency keeps this protective.",
  Autonomy:
    "Your self-direction is working. Maintain clear boundaries and simple systems so your freedom stays stable, not fragile.",
  Vitality:
    "Your energy habits are paying off. Protect sleep, hydration, sunlight, and light movement—they compound your morale.",
  Peace:
    "Your calm presence steadies everything else. Keep protecting quiet time and mental margins so this stays sustainable.",
};

/** Gauge band + color */
function band(score: number) {
  if (score >= 7.5) return { label: "High", color: "#16a34a" };          // green
  if (score >= 6.0) return { label: "Solid", color: "#0ea5e9" };         // blue
  if (score >= 4.5) return { label: "Needs attention", color: "#f59e0b" };// amber
  return { label: "Low", color: "#ef4444" };                              // red
}

/** Tally helper for dominant dimension from top-3 lists */
function dominantDim(items: {index:number}[] | undefined, fallback: Dim = "Peace"): Dim | null {
  if (!items?.length) return null;
  const counts: Record<Dim, number> = { Fulfillment:0, Connection:0, Autonomy:0, Vitality:0, Peace:0 };
  for (const it of items) {
    const d = Q2DIM[it.index];
    counts[d] = (counts[d] ?? 0) + 1;
  }
  // find max
  let best: Dim = fallback, bestN = -1;
  (Object.keys(counts) as Dim[]).forEach(d => {
    if (counts[d] > bestN) { bestN = counts[d]; best = d; }
  });
  return bestN > 0 ? best : null;
}

export default function ResultsPage() {
  const router = useRouter();
  const [result, setResult] = useState<any | null>(null);

  useEffect(() => {
    const raw = typeof window !== "undefined" ? localStorage.getItem("LMI_RESULT") : null;
    setResult(raw ? JSON.parse(raw) : null);
