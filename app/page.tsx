import Link from "next/link";
import LogoPLM from "@/components/LogoPLM";

export default function Home() {
  return (
    <div className="grid" style={{ gap: 18 }}>
      <div className="card" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <LogoPLM size={44} wordmark />
        <Link href="/survey" className="btn primary">Start Life Morale Survey</Link>
      </div>

      <div className="card" style={{ background: "linear-gradient(135deg,#E9F9F3,#F0FFFA)" }}>
        <div className="label">What is PLM+?</div>
        <h2 style={{ marginTop: 6 }}>A clear, compassionate snapshot of your life morale</h2>
        <p className="muted" style={{ marginTop: 6 }}>
          24 quick sliders + a simple 168-hour time map. You’ll get a calibrated score and concrete next steps to lift it.
        </p>
        <div style={{ marginTop: 10 }}>
          <Link href="/survey" className="btn">Take the survey →</Link>
        </div>
      </div>
    </div>
  );
}
