// /lib/prompts.ts

// ------- Types -------
export type Item = { index: number; score: number; note?: string };
export type Result = {
  finalLMI: number;
  rawLMS: number;
  riAdjusted: number;
  topDrainers?: Item[];
  topUplifters?: Item[];
};

export type DomainKey =
  | "direction"
  | "connection"
  | "work"
  | "autonomy"
  | "money"
  | "health"
  | "emotion"
  | "peace"
  | "growth"
  | "self";

// ------- Questions (24) -------
export const QUESTIONS = [
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

// ------- Map question index → domain -------
export const INDEX_TO_DOMAIN: Record<number, DomainKey> = {
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

// Utility
const pick = <T,>(arr: T[], n: number): T[] => {
  const a = [...arr];
  const out: T[] = [];
  while (a.length && out.length < n) {
    const i = Math.floor(Math.random() * a.length);
    out.push(a.splice(i, 1)[0]);
  }
  return out;
};

// ------- Prompt Library (low & high actions + quotes) -------
// Tone: “future-self” talking to present self (friendly, direct, practical).
export const PROMPTS: Record<
  DomainKey,
  { title: string; emoji: string; low: string[]; high: string[]; quotes: string[] }
> = {
  direction: {
    title: "Direction & Purpose",
    emoji: "🧭",
    low: [
      "Let’s choose one small target for this week — something finishable in 30 minutes. Momentum first, clarity next.",
      "Write a 3-line vision for 90 days from now and mail it to yourself. Future you is already proud.",
      "Take a 20-minute ‘strategy walk’. No phone. One question: “What would an 8/10 week look like?”",
      "List 3 things you don’t want anymore. Remove one friction today — subtraction creates direction.",
      "Block one hour to plan the next five. A page of clarity beats a week of confusion.",
      "Make a ‘not-now’ list. Park good ideas so focus can breathe.",
    ],
    high: [
      "Protect your direction: schedule one sacred block this week where you move the needle (no notifications).",
      "Capture your wins nightly in two lines — build proof you can trust.",
      "Teach your path in a paragraph. If you can teach it, you can scale it.",
      "Say no once this week — guardrails keep you on the road.",
      "Refresh your 90-day target. Precision upgrades momentum.",
      "Invite an accountability check-in on Fridays. Progress loves witnesses.",
    ],
    quotes: [
      "Small doors lead to big rooms. Pick one and walk through.",
      "Clarity is kind. First to yourself, then to your calendar.",
      "Your feet don’t need the whole map — just the next step.",
      "Direction is an energy source. Plug in daily.",
    ],
  },

  connection: {
    title: "Relationships & Belonging",
    emoji: "🤝",
    low: [
      "Send one honest check-in to someone safe: “No need to fix — just keeping you close.”",
      "Pick a low-effort ritual: tea call or 10-min voice note Sundays. Consistency beats intensity.",
      "Write one boundary in plain words. Clear is kind — to them and to us.",
      "Plan a micro-hang. Laughter is renewable energy.",
      "If it’s heavy, name it before the talk: 'I’m tender today, can we go slow?'",
      "Protect your peace: mute one thread that drains you.",
    ],
    high: [
      "Tell one lifter exactly why they matter. Reinforce the bridges that carry you.",
      "Plan a shared goal (walk, book, class). Humans bond on missions.",
      "Switch from reply to reflect: mirror their feeling once before solving.",
      "Leave a note where they’ll find it later. Delayed kindness multiplies.",
      "Celebrate a tiny milestone together — ritualize the good.",
      "Teach your favorite repair phrase. ‘Can we try that again?’",
    ],
    quotes: [
      "Your people are power outlets. Plug in on purpose.",
      "Belonging grows where truth can breathe.",
      "Connection is built, not found — brick by honest brick.",
      "Boundaries make space for better love.",
    ],
  },

  work: {
    title: "Work & Meaning",
    emoji: "💼",
    low: [
      "Create a 2-hour island: deep work on one meaningful task. No small fires today.",
      "Close 3 open loops. Endings free large energy.",
      "If commute drains you, pair it with a playlist, audiobook, or language mini-lesson.",
      "Define success for today in one sentence. Hit that; let the rest be bonus.",
      "Ask for clarity on one fuzzy task — fog wastes fuel.",
      "Time-box email to 2 windows. Your brain deserves long stretches.",
    ],
    high: [
      "Protect the craft: one skill block this week — future raises begin here.",
      "Write a ‘teach-back’ note after a win. Learning locks in when taught.",
      "Automate one repeatable task. Systems give you time.",
      "Mentor one rung down. Meaning scales when shared.",
      "Park a stretch goal on your calendar — then break it into two tiny first steps.",
      "Show your work. Visibility invites opportunity.",
    ],
    quotes: [
      "Meaning hides inside focus, not noise.",
      "Do the work only you can do — and protect it.",
      "Routine is where excellence learns to breathe.",
      "Progress loves a schedule.",
    ],
  },

  autonomy: {
    title: "Time & Freedom",
    emoji: "⏱️",
    low: [
      "Say no once this week (kindly, clearly). Every no buys a yes for what matters.",
      "Run 90-minute focus / 15-minute reset. Attention likes rhythm.",
      "Plan tomorrow tonight in 3 bullets. Future you will sigh with relief.",
      "Delete one low-value app tile from your home screen.",
      "Batch errands into a single window. Scatter steals peace.",
      "Use ‘Do Not Disturb’ for your best 60 minutes.",
    ],
    high: [
      "Put your best task in your best hours. Energy matching is a cheat code.",
      "Keep a ‘Do Less’ list. Subtraction is a power move.",
      "Protect one empty block. Space is creative oxygen.",
      "Create a default week: repeating beats reduce decision fatigue.",
      "Group similar tasks. Switching costs are silent taxes.",
      "Make your calendar reflect your values — color by category.",
    ],
    quotes: [
      "Freedom is a calendar with integrity.",
      "Guardrails don’t limit you — they launch you.",
      "If everything is urgent, nothing is important.",
      "Own your hours or they will own you.",
    ],
  },

  money: {
    title: "Finances",
    emoji: "💵",
    low: [
      "Name one number (buffer, debt, or save target) and take one action toward it this week.",
      "Automate a tiny transfer on payday. Momentum > magnitude at the start.",
      "Audit subscriptions for 10 minutes — cancel one you don’t love.",
      "Cook once more this week than usual. Small swaps compound.",
      "If it’s stressful, make it visible: a one-page money map lowers fear.",
      "Ask one trusted person how they budget. Borrow what works.",
    ],
    high: [
      "Increase auto-transfer by 1–2%. You won’t feel it now; you’ll thank you later.",
      "Attach money to meaning. Fund the life you’re actually building.",
      "Calendarize a monthly 20-minute money date — review, adjust, appreciate.",
      "Invest in skill — the highest ROI is you.",
      "Keep your emergency fund sacred. Safety fuels risk-taking.",
      "Celebrate frugal wins. Pride keeps habits sticky.",
    ],
    quotes: [
      "Money is a tool; purpose is the project.",
      "Clarity beats anxiety every time.",
      "Small automatic moves create big manual freedom.",
      "Spend like you remember your future.",
    ],
  },

  health: {
    title: "Health & Energy",
    emoji: "💪",
    low: [
      "Pick one: water, 10-minute walk, or bedtime 20 minutes earlier — win it daily.",
      "Stack habits: after brushing teeth → 10 squats. Make it too small to skip.",
      "If the gym feels heavy, start with a ‘drive-to-the-gym’ win. Showing up counts.",
      "Set a phone ‘wind-down’ alarm. Sleep begins an hour before bed.",
      "Prep a snack that future-you will actually eat (protein + fruit).",
      "Stretch 3 minutes after showers. You’ll thank your back.",
    ],
    high: [
      "Progressive-overload life: add a rep, set, or 2 minutes. Celebrate the tiny upgrade.",
      "Write 3 cues that always get you moving — automate motivation.",
      "Keep your rest day sacred. Growth happens in recovery.",
      "Log the feeling after workouts. Your own data is the best coach.",
      "Invite a friend — accountability is a performance enhancer.",
      "Train the floor you never drop below.",
    ],
    quotes: [
      "Energy is a currency — invest daily.",
      "Strong body, quieter mind.",
      "Health compounds like interest.",
      "Recovery is training, too.",
    ],
  },

  emotion: {
    title: "Stress & Emotional Balance",
    emoji: "🌤️",
    low: [
      "Box-breathing 3× today (4-in / 4-hold / 4-out / 4-hold). Reset is a skill.",
      "Name it to tame it: feeling + trigger in one line. You’re not the storm — you’re the sky.",
      "Micro-reset: cold water on wrists, 30 seconds. Body first, mind follows.",
      "Put a hard thing on paper → break into 2 tiny actions.",
      "Walk while you vent — motion metabolizes emotion.",
      "Reduce caffeine after noon this week. Calm has helpers.",
    ],
    high: [
      "Anchor calm on purpose: 2 minutes of breath before tense calls.",
      "Teach your regulation trick to someone who needs it. Peace spreads.",
      "Protect buffer time between meetings. Transitions matter.",
      "Keep your sleep window steady — it’s your emotional thermostat.",
      "Track your ‘storm triggers’ for one week; prepare umbrellas.",
      "Celebrate a calm win out loud — reinforcement works.",
    ],
    quotes: [
      "You can be the sky; let the weather pass.",
      "Regulation is leadership — starting with you.",
      "Name the feeling; keep the steering wheel.",
      "Stillness is strength in motion.",
    ],
  },

  peace: {
    title: "Hope & Peace",
    emoji: "🕊️",
    low: [
      "Postcard to future you: 3 lines, mailed 90 days out. Hope scheduled is hope kept.",
      "Shrink the day: one thing to do, one thing to feel, one thing to enjoy.",
      "Step outside for 5 quiet minutes. Let the world remind you it’s bigger than this moment.",
      "Collect one ‘proof of progress’ daily — a photo, a sentence, a step.",
      "Limit doom-scrolling with a 10-minute timer. Then go breathe something real.",
      "Ask for a borrowed lens: ‘What do you see in me that I can’t today?’",
    ],
    high: [
      "Guard your mornings. Begin with something that keeps the heart quiet.",
      "Make a ‘joy cache’: photos, quotes, songs that reset you in 60 seconds.",
      "Share your calm — invite someone into a quiet walk.",
      "Keep gratitude simple and specific. One line is enough.",
      "Sabbath a slice of your week. Sacred rest, no apology.",
      "Journal the sentence “I am safe enough to…” — finish it nightly.",
    ],
    quotes: [
      "Peace isn’t a place you find — it’s a practice you keep.",
      "Hope is built from tiny proofs repeated.",
      "Let quiet win the opening round of your day.",
      "You can carry light even when it’s dark.",
    ],
  },

  growth: {
    title: "Growth & Pride",
    emoji: "📈",
    low: [
      "Do one ‘difficult but doable’ thing today. Pride needs reps.",
      "Log a ‘challenge → response → lesson’ in 3 lines. That’s resilience training.",
      "Start embarrassingly small — consistency is the flex.",
      "Film a 30-second ‘after’ note when you complete it. Evidence beats doubt.",
      "Ask for one micro-feedback. Adjust 1% and try again.",
      "Keep a visible streak — momentum likes to see itself.",
    ],
    high: [
      "Pick a 7-day micro-goal. Track it where you’ll see it.",
      "Teach what you just learned — learning doubles when shared.",
      "Add a 1% difficulty bump — make your future floor higher.",
      "Note what almost derailed you and how you stayed in it — blueprint saved.",
      "Invite a friend into the streak; build a tiny league.",
      "Stack pride: end your day by writing one line you’re proud of.",
    ],
    quotes: [
      "Greatness is small things done with devotion.",
      "Your best self is a system, not a sprint.",
      "Reps write identity.",
      "Pride grows where effort shows.",
    ],
  },

  self: {
    title: "Self-expression & Contribution",
    emoji: "✨",
    low: [
      "Write a 10-minute ‘honest page’. No edits, no audience — permission granted.",
      "Do one tiny act of service in secret. Meaning without applause hits different.",
      "Ship something small this week: a note, a sketch, a thought.",
      "Wear or carry one thing that feels like you. Signal to yourself matters.",
      "Share one true sentence today. Truth attracts your people.",
      "Say the kind thing you’re thinking. Don’t hoard the good.",
    ],
    high: [
      "Make your lane one sentence. Simplicity sharpens contribution.",
      "Create a weekly ‘ship it’ ritual — publish something tiny.",
      "Collaborate with one person. Your voice, harmonized.",
      "Curate your inputs — guard what shapes your output.",
      "Leave a breadcrumb trail for others to follow.",
      "Turn compliments into checklists — do more of what lands.",
    ],
    quotes: [
      "Be fully you; the world needs that signal.",
      "Creation is self-respect in motion.",
      "Your voice is a lantern — carry it where it’s dark.",
      "Give what you wish you had found.",
    ],
  },
};

// General quotes by score band
const QUOTES_GENERAL = {
  low: [
    "We’ll win this in inches. Start with one.",
    "Even 0.1% better is still better — and that compounds.",
    "You don’t need a new life, just a new step.",
  ],
  mid: [
    "Protect what’s working and nudge one thing. Balance is built.",
    "Small upgrades become new normals.",
    "You’re closer than it feels — keep the rhythm.",
  ],
  high: [
    "Guard your gains and raise your floor.",
    "Teach someone one thing that helped you — meaning multiplies.",
    "Consistency is a kindness to your future self.",
  ],
};

// ------- Build personalized next steps & quotes -------
export function buildNextSteps(result: Result) {
  // Tally domains for drainers/uplifters
  const tally = (items?: Item[]) => {
    const map = new Map<DomainKey, number>();
    (items || []).forEach((it) => {
      const dom = INDEX_TO_DOMAIN[it.index];
      if (!dom) return;
      map.set(dom, (map.get(dom) || 0) + 1);
    });
    return [...map.entries()].sort((a, b) => b[1] - a[1]); // desc
  };

  const lowDomains = tally(result.topDrainers).slice(0, 2).map(([k]) => k) as DomainKey[];
  const highDomains = tally(result.topUplifters).slice(0, 2).map(([k]) => k) as DomainKey[];

  // Build cards
  const lowCards = lowDomains.map((key) => ({
    key,
    title: `${PROMPTS[key].emoji} ${PROMPTS[key].title} — tiny lifts`,
    actions: pick(PROMPTS[key].low, 3),
  }));

  const highCards = highDomains.map((key) => ({
    key,
    title: `${PROMPTS[key].emoji} ${PROMPTS[key].title} — keep fueling`,
    actions: pick(PROMPTS[key].high, 2),
  }));

  // Personalized quotes: from domains + general by band
  const domainQuotes = [
    ...lowDomains.flatMap((k) => pick(PROMPTS[k].quotes, 1)),
    ...highDomains.flatMap((k) => pick(PROMPTS[k].quotes, 1)),
  ];
  const band =
    result.finalLMI >= 7.5 ? "high" : result.finalLMI >= 5.5 ? "mid" : "low";
  const generalQuote = pick(QUOTES_GENERAL[band as keyof typeof QUOTES_GENERAL], 1);

  const quotes = [...domainQuotes, ...generalQuote];

  return { lowCards, highCards, quotes };
}
