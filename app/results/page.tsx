<div
  className="card"
  style={{
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    flexWrap: "wrap",
    alignItems: "center",
  }}
>
  <button
    className="btn ghost"
    onClick={() => {
      if (index === 0) {
        window.location.href = "/results";
      } else {
        setIndex((i) => Math.max(0, i - 1));
      }
    }}
  >
    {index === 0 ? "Back to Results" : "Back"}
  </button>

  <div style={{ display: "flex", gap: 8 }}>
    {SLIDES.map((_, i) => (
      <button
        key={i}
        onClick={() => setIndex(i)}
        aria-label={`Go to slide ${i + 1}`}
        style={{
          width: i === index ? 28 : 10,
          height: 10,
          borderRadius: 999,
          border: "none",
          background:
            i === index ? "var(--primaryA)" : "var(--border)",
          cursor: "pointer",
          transition: ".2s ease",
        }}
      />
    ))}
  </div>

  {index < SLIDES.length - 1 ? (
    <button
      className="btn primary"
      onClick={() =>
        setIndex((i) => Math.min(SLIDES.length - 1, i + 1))
      }
    >
      Next Slide
    </button>
  ) : (
    <button
      className="btn primary"
      onClick={() => (window.location.href = "/survey")}
    >
      Retake PLM+
    </button>
  )}
</div>
