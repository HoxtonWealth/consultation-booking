import { styles } from "../styles";

export function StepBar({ step }) {
  return (
    <nav aria-label="Booking progress" style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 28 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ ...styles.stepDot, ...(step >= 1 ? styles.stepDotActive : {}) }} aria-current={step === 1 ? "step" : undefined}>1</div>
        <span style={{ fontSize: 13, fontWeight: 600, color: step >= 1 ? "#0B5D5F" : "#94a3b8" }}>Pick a Time</span>
      </div>
      <div style={{ flex: 1, height: 2, background: step >= 2 ? "#0B5D5F" : "#d1dde0", margin: "0 12px", borderRadius: 1 }} />
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ ...styles.stepDot, ...(step >= 2 ? styles.stepDotActive : {}) }} aria-current={step === 2 ? "step" : undefined}>2</div>
        <span style={{ fontSize: 13, fontWeight: 600, color: step >= 2 ? "#0B5D5F" : "#94a3b8" }}>Your Details</span>
      </div>
    </nav>
  );
}
