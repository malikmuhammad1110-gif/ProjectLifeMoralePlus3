"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ResultsPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem("LMI_RESULT");
      if (!raw) return;
      setData(JSON.parse(raw));
    } catch (e: any) {
      setErr(e?.message || "Failed to parse localStorage.");
    }
  }, []);

  function loadDemo() {
    const demo = {
      finalLMI: 6.9,
      rawLMS: 7.1,
      riAdjusted: 7.1,
      topDrainers: [{ index: 19, score: 1 }, { index: 15, score: 2 }, { index: 16, score: 2 }],
      topUplifters: [{ index: 0, score: 10 }, { index: 1, score: 9 }, { index: 2, score: 9 }],
    };
    localStorage.setItem("LMI_RESULT", JSON.stringify(demo));
    setData(demo);
  }

  return (
    <div style={{ maxWidth: 820, margin: "32px auto", padding: 16, fontFamily: "ui-sans-serif, system-ui" }}>
      <h1>Results (minimal)</h1>

      {!data && !err && (
        <div style={{ padding: 12, border: "1px solid #e5e7eb", borderRadius: 10, background: "#fff" }}>
          <p>No results found in your browser yet.</p>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => router.push("/survey")} style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #d1d5db" }}>
              Go to survey
            </button>
            <button onClick={loadDemo} style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #d1d5db", background: "#f1f5f9" }}>
              Load demo result
            </button>
          </div>
        </div>
      )}

      {err && (
        <pre style={{ marginTop: 16, color: "#b91c1c", whiteSpace: "pre-wrap" }}>
          Error: {err}
        </pre>
      )}

      {data && (
        <>
          <div
            style={{
              marginTop: 16,
              padding: 12,
              border: "1px solid #e5e7eb",
              borderRadius: 10,
              background: "linear-gradient(135deg,#eaf2ff,#effdf9)",
            }}
          >
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <span><b>Raw LMS:</b> {Number(data.rawLMS).toFixed(2)}</span>
              <span><b>RI-adjusted:</b> {Number(data.riAdjusted).toFixed(2)}</span>
              <span><b>Final LMI:</b> {Number(data.finalLMI).toFixed(2)} / 8.75</span>
            </div>
            <p style={{ marginTop: 6, color: "#334155" }}>
              With small changes here and there, this score can improve.
            </p>
          </div>

          <h2 style={{ marginTop: 24 }}>Raw stored object</h2>
          <pre
            style={{
              overflowX: "auto",
              padding: 12,
              border: "1px solid #e5e7eb",
              borderRadius: 10,
              background: "#fff",
            }}
          >
            {JSON.stringify(data, null, 2)}
          </pre>
        </>
      )}
    </div>
  );
}
